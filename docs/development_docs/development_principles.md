# Development Principles

This document outlines the core principles and conventions to be followed during the development of this project. Adhering to these guidelines ensures consistency, readability, and maintainability of the codebase.

## 1. Naming Conventions

To maintain a consistent and predictable codebase, we will adhere to the following naming conventions across the project.

### a. General Code (JavaScript/TypeScript)

-   **`camelCase`**: All variables, functions, and object properties in the application code (both frontend and backend) should use `camelCase`.

    ```typescript
    // Correct
    const learningPath = 'French Grammar';
    function getUserProfile(userId) {
      // ...
    }

    // Incorrect
    const learning_path = 'French Grammar';
    function get_user_profile(user_id) {
      // ...
    }
    ```

### b. Database Schema

-   **`camelCase`**: All table and column names in the database should use `camelCase`. This convention ensures that the database schema is consistent with the application code, reducing the need for manual mapping or transformation layers.

    ```typescript
    // Correct
    await knex.schema.createTable('userProgress', (table) => {
      table.increments('id').primary();
      table.integer('userId').unsigned().notNullable();
      table.string('currentLevel').notNullable();
      table.integer('totalXp').notNullable();
    });
    ```

-   **Table Names**: Table names should be plural and describe the entities they store (e.g., `users`, `lessons`, `learningPaths`).

### c. API Responses

-   **`camelCase`**: All keys in JSON objects returned by the API should use `camelCase`.

    ```json
    // Correct
    {
      "userId": 1,
      "userName": "JohnDoe",
      "isActive": true
    }

    // Incorrect
    {
      "user_id": 1,
      "user_name": "JohnDoe",
      "is_active": true
    }
    ```

## 2. Code Style

-   **ESLint & Prettier**: The project is configured with ESLint and Prettier to enforce a consistent code style. Please ensure your editor is configured to use these tools to automatically format your code on save.

## 3. Commit Messages

-   **Conventional Commits**: All commit messages should follow the [Conventional Commits specification](https://www.conventionalcommits.org/). This helps in creating a more readable and structured commit history.

    ```
    feat(api): add endpoint for user progress
    fix(database): correct data type for lesson duration
    docs(readme): update setup instructions
    ```

## 4. Module System Configuration

This project uses **ES Modules (ESM)** as the standard module system across all TypeScript/JavaScript code. This ensures modern, standardized module handling and better tree-shaking capabilities.

### a. TypeScript Configuration

-   **`tsconfig.json`**: Must be configured for ESM output:
    ```json
    {
      "compilerOptions": {
        "module": "ESNext",
        "target": "ES2020",
        "moduleResolution": "node",
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true
      },
      "ts-node": {
        "esm": true
      }
    }
    ```

### b. Package Configuration

-   **`package.json`**: Must include `"type": "module"` to enable ESM:
    ```json
    {
      "type": "module"
    }
    ```

### c. Import/Export Patterns

-   **File Extensions**: Always use `.js` extensions in import statements (TypeScript compiles `.ts` to `.js`):
    ```typescript
    // Correct
    import { userService } from './services/userService.js';
    import express from 'express';
    
    // Incorrect
    import { userService } from './services/userService';
    import { userService } from './services/userService.ts';
    ```

-   **Named Exports**: Prefer named exports over default exports for better tree-shaking and IDE support:
    ```typescript
    // Correct
    export const userController = {
      // implementation
    };
    
    // Acceptable for single-purpose modules
    export default class UserService {
      // implementation
    }
    ```

### d. Runtime Configuration

-   **tsx (Recommended)**: Use `tsx` for better ESM support and performance:
    ```json
    {
      "scripts": {
        "dev": "nodemon --exec tsx src/app.ts",
        "start": "tsx src/app.ts",
        "db:migrate": "tsx ../node_modules/.bin/knex migrate:latest --knexfile src/knexfile.ts"
      }
    }
    ```

-   **Alternative - ts-node with loader**: If using ts-node, use the newer loader syntax:
    ```json
    {
      "scripts": {
        "dev": "nodemon --exec \"node --loader ts-node/esm\" src/app.ts",
        "start": "node --loader ts-node/esm src/app.ts"
      }
    }
    ```

### e. ESM-Specific Code Patterns

-   **Replacing `__dirname` and `__filename`**: In ES modules, these CommonJS globals are not available. Use the following pattern:
    ```typescript
    // CommonJS (incorrect in ESM)
    const projectRoot = path.resolve(__dirname, '..', '..');
    
    // ESM (correct)
    import { fileURLToPath } from 'url';
    import path from 'path';
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.resolve(__dirname, '..', '..');
    ```

### f. Common ESM Migration Issues

-   **`ERR_UNKNOWN_FILE_EXTENSION` for `.ts` files**: Ensure `"type": "module"` is set in package.json and use `tsx` or proper ts-node loader configuration.
    
-   **Import statement extensions**: Always use `.js` extensions even when importing `.ts` files (TypeScript compilation target).
    
-   **Dynamic imports**: Use `await import()` syntax for conditional module loading.
    
-   **JSON imports**: Use `import` with assertion syntax:
    ```typescript
    import config from './config.json' assert { type: 'json' };
    ```

## 5. Architectural Patterns

-   **Service Layer**: Business logic should be encapsulated within service classes to separate concerns from the controller and data access layers.
-   **Dependency Injection**: Services and other dependencies should be provided through factory functions (e.g., `aiServiceFactory`) to promote loose coupling and testability.

---

*This document is a living document and should be updated as new principles and conventions are established.*
