# Project Structure

This document provides an overview of the project's directory structure.

## Root Directory

-   `client/`: Contains the React frontend application.
-   `server/`: Contains the Node.js backend application.
-   `docs/`: Contains the project documentation.
-   `database/`: Contains database migrations and seeds.
-   `content/`: Contains static content for the application.
-   `scripts/`: Contains various scripts for database management and other tasks.
-   `package.json`: Defines the project's dependencies and scripts.

## Client Directory (`client/`)

-   `src/`: The main source code for the React application.
    -   `components/`: Reusable React components.
    -   `context/`: React context providers.
    -   `hooks/`: Custom React hooks.
    -   `pages/`: Top-level page components.
    -   `services/`: Services for interacting with the backend API.
    -   `styles/`: Global styles and design tokens.
    -   `types/`: TypeScript type definitions.
    -   `utils/`: Utility functions.

## Server Directory (`server/`)

-   `src/`: The main source code for the Node.js application.
    -   `config/`: Configuration files for the database, AI services, etc.
    -   `controllers/`: Express route handlers.
    -   `middleware/`: Express middleware.
    -   `models/`: Objection.js database models.
    -   `routes/`: Express route definitions.
    -   `services/`: Business logic and services.
    -   `workers/`: Background job workers.
    -   `types/`: TypeScript type definitions.
    -   `utils/`: Utility functions.

## Documentation Directory (`docs/`)

-   `docs/`: Contains the markdown files for the Docusaurus documentation site.
-   `api/`: OpenAPI specifications for the API.
-   `development_docs/`: Documents related to the development process, architecture, and future plans.
