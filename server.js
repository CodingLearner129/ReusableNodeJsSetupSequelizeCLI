import cluster from 'node:cluster';
import http from 'node:http';
import os from 'node:os';
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import app from './app.js';
dotenvExpand.expand(dotenv.config('./../.env'));
import configJs from './src/config/config.js';

// available CPU cores
// const numCPUs = os.cpus().length;
const numCPUs = os.availableParallelism();
const { host, port } = configJs.CONFIG;

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
        // console.log(`create fork ${i}`);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    // Workers can share any TCP connection
    // In this case, it is an HTTP server
    const server = http.createServer(app);
    const listenServer = server.listen(port, host, () => {
        console.log(`Worker ${process.pid} started. Listening on http://${host}:${port}`);
    });
}
