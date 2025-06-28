# French Learning Platform

A web application for learning French.

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [npm](https://www.npmjs.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd french-learning-platform
    ```

2.  **Install dependencies for all workspaces:**
    This project uses npm workspaces. Install all dependencies from the root directory.
    ```sh
    npm install
    ```

3.  **Set up the database:**
    This command will run all necessary database migrations and seed the database with initial content.
    The seed includes a few example topics, exercises and assignments and creates default user accounts.
    ```sh
    npm run db:setup
    ```
    The preloaded accounts are:

    | Email | Password | Role |
    |-------|----------|------|
    | `admin@example.com` | `admin` | admin |
    | `user@example.com` | `user` | user |

    To reset the database to its original state at any time, you can run:
    ```.sh
    npm run db:rebuild
    ```

4.  **Set up environment variables:**
    Copy the `.env.example` file in the `server` directory to a new file named `.env` and fill in the required values.
    ```sh
    cp server/.env.example server/.env
    ```

5.  **Run the development servers:**
    This will start both the backend server and the frontend client with hot-reloading.
    ```sh
    npm run dev
    ```
    *   The backend will be available at `http://localhost:3001` (or as configured in your `.env`).
    *   The frontend will be available at `http://localhost:5173` (or another port specified by Vite).

## Troubleshooting

### "Migration directory is corrupt" Error

If you encounter an error message like `Error: The migration directory is corrupt, the following files are missing...` when running `npm run db:setup` or `npm run migrate`, it means the database's internal migration history is out of sync with the files in the `database/migrations` directory.

This commonly happens if you have an old database file and have since updated the project's migration files.

**Solution:** The easiest way to fix this is to completely reset and rebuild your database with the following command:

```sh
npm run db:rebuild
```

This will delete the old database file (and its corrupted history) and create a fresh one with the correct migrations and seed data.
