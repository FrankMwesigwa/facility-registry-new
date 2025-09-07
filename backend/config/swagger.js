import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NHFR API Documentation',
      version: '1.0.0',
      description: 'API documentation for the National Health Facility Registry',
      contact: {
        name: 'NHFR Support',
        email: 'support@nhfr.health.go.ug'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.nhfr.health.go.ug/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  // Path to the API docs
  apis: [
    './docs/*.docs.js',
    './routes/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

export const swaggerConfig = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'NHFR API Documentation',
    customfavIcon: '/favicon.ico',
    customCssUrl: [
      'https://fonts.googleapis.com/css?family=Open+Sans:400,700|Source+Code+Pro:300,600|Titillium+Web:400,600,700'
    ]
  })
}; 