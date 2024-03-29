import swaggerAutogen from 'swagger-autogen';

const swaggerAutogenInstance = swaggerAutogen();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/v1/index.js'];

swaggerAutogenInstance(outputFile, endpointsFiles);
