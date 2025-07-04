# Project Setup

This document provides instructions for setting up the development environment for the French Learning Platform.

## Prerequisites

- [Node.js](https://nodejs.org/) (v20.11.1 or higher)
- [npm](https://www.npmjs.com/) (v10.2.4 or higher)
- [Python](https://www.python.org/) (for `semgrep`)
- [pip](https://pip.pypa.io/en/stable/installation/) (for `semgrep`)

## Installation

The project is a monorepo with a `client` and a `server` workspace.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/niklas-joh/french-learning-platform.git
    cd french-learning-platform
    ```

2.  **Install root dependencies:**

    ```bash
    npm install
    ```

3.  **Install client dependencies:**

    ```bash
    cd client
    npm install
    cd ..
    ```

4.  **Install server dependencies:**

    ```bash
    cd server
    npm install
    cd ..
    ```

5.  **Install Semgrep:**

    ```bash
    pip3 install semgrep
    ```

## Database Setup

The project uses Knex.js for database migrations and seeding.

1.  **Create the database:**

    The development database is a SQLite file located at `dev.sqlite3`. This file will be created automatically when you run the migrations.

2.  **Run migrations:**

    ```bash
    npm run migrate
    ```

3.  **Seed the database:**

    ```bash
    npm run db:seed
    ```

## Running the Application

-   **Start the server:**

    ```bash
    npm --prefix server run dev
    ```

-   **Start the client:**

    ```bash
    npm --prefix client run dev
    ```

The client will be available at `http://localhost:5173` and the server at `http://localhost:3000`.
