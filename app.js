import express from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { router as routerV1 } from "./src/routes/v1/index.js";
import swaggerFile from './swagger_output.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware used to parse incoming request bodies with JSON payloads.
app.use(express.json());
// Middleware used to parse incoming request bodies with URL-encoded payloads.
app.use(express.urlencoded({ extended: true }));

// serving static files
app.use(express.static(path.join(__dirname, './src/public')));

// set view engine 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));
app.use(expressLayouts);
app.set('layout', path.join(__dirname, './src/views/layouts/layout'));

// Development logging
app.use(morgan('dev'));

app.use('/', routerV1);

// // Swagger configuration options
// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'Your API Title',
//             version: '1.0.0',
//             description: 'Description of your API',
//         },
//     },
//     apis: ['./src/routes/*.js'], // Path to the API routes folder
// };

// // Initialize Swagger
// const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;