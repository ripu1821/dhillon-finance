/**
 * Swagger Configuration
 */
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Dhillon Finance Management System",
      version: "1.0.0",
      description: "API documentation for Dhillon Finance Management System",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}/api/v1`,
        description: "Local API URL",
      },
      {
        url: `${process.env.SERVER_URL}/api/v1`,
        description: "Production API URL",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Dashboard", description: "Dashboard Management" },
      { name: "Users", description: "User Management" },
      { name: "Roles", description: "Role Management" },
      { name: "Permissions", description: "Permission APIs" },
      { name: "Activities", description: "Activity Management" },
      { name: "Customers", description: "Activity Management" },
      {
        name: "ActivityPermissions",
        description: "Activity Permission Management",
      },
      { name: "File", description: "File Management" },
      { name: "Loans", description: "Loan Management" },
      { name: "Transactions", description: "Transaction Management" },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );
};

export default setupSwagger;
