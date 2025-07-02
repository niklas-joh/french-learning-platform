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

## 4. Architectural Patterns

-   **Service Layer**: Business logic should be encapsulated within service classes to separate concerns from the controller and data access layers.
-   **Dependency Injection**: Services and other dependencies should be provided through factory functions (e.g., `aiServiceFactory`) to promote loose coupling and testability.

---

*This document is a living document and should be updated as new principles and conventions are established.*
