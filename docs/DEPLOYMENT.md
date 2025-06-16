# Deploying the French Learning Platform

This document describes a basic deployment workflow for the application.

## 1. Build the application

Run the build script from the project root. This compiles the TypeScript backend and builds the React frontend.

```bash
npm run build
```

The compiled server code will be placed in `server/dist` and the frontend static files in `client/dist`.

## 2. Choose a hosting option

### Deploying to SiteGround

1. Ensure your SiteGround plan supports Node.js applications.
2. Upload the project files (or clone the Git repo) to your SiteGround account.
3. Install dependencies in both `server` and `client` directories using `npm install`.
4. Run the build step as shown above.
5. Configure a Node.js application in SiteGround pointing to `server/dist/app.js`.
6. Serve the built frontend (`client/dist`) using SiteGround's static file hosting or via the Node.js server (e.g. by serving the directory with Express).

SiteGround allows you to pull updates via Git. You can connect the repository and set up auto-deploy so each push updates the files on the server. After pulling changes, rerun `npm run build` and restart the Node.js application.

### Alternative: Render.com

For simpler automated deployments you can also deploy the backend to [Render](https://render.com/). Connect your GitHub repository and specify:

- Build command: `npm run build`
- Start command: `node server/dist/app.js`

Render will automatically build and restart your service on each push. The frontend can be deployed as a separate static site using the `client/dist` directory.

## 3. Environment configuration

Copy `.env.example` files to `.env` in the respective directories and adjust the values for production.

- `server/.env`
- `client/.env`

Make sure to set a strong `JWT_SECRET` and configure `DATABASE_URL` appropriately.

## 4. Database setup

The project uses SQLite by default. For production, you may want to use a more robust database (e.g. PostgreSQL). Update `knexfile.ts` and environment variables accordingly. If you continue using SQLite, ensure the database file is writable by the Node.js process and back it up regularly.

## 5. Running in production

After building and setting environment variables, start the server using:

```bash
npm start
```

This runs `node server/dist/app.js`. Ensure this process is kept alive with a process manager like PM2 or using your host's built‑in Node.js management tools.

