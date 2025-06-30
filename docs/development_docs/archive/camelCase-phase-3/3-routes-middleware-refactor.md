# Task CC3.3: Update Routes and Middleware

- **Goal**: Ensure all Express routes and middleware expect camelCase fields in requests and responses.
- **Steps**:
  1. Search `server/src/routes/` and `server/src/middleware/` for snake_case parameter names or body properties.
  2. Update validation logic and parameter extraction to use camelCase names.
  3. Verify that response objects sent to the client contain camelCase keys only.
  4. Remove transitional mappings from snake_case to camelCase if present.
- **Deliverable**: Routes and middleware that pass camelCase data end-to-end.
