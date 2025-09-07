import express from 'express';
import { swaggerConfig } from './config/swagger.js';

const app = express();

// ... other middleware and configurations ...

// Swagger documentation route
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);

// ... your routes and other configurations ... 