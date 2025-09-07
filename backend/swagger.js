import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger Definition
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "National Health Facility Registry API Documentation",
        version: "1.0.0",
        description: "API for managing Uganda's National Health Facility Registry",
    },
    servers: [
        {
            url: "http://localhost:9090/api",
            description: "Local Development Server",
        },
        {
            url: "https://nhfr.health.go.ug/api",
            description: "Production Server",
        },
    ],
};

// Swagger Options
const options = {
    swaggerDefinition,
    apis: ["./routes/facilities.js", "./docs/facility.docs.js"],
};

// Swagger Specs
const swaggerSpec = swaggerJSDoc(options);

// Swagger Middleware
const setupSwagger = (app) => {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
