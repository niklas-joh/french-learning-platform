# Task CC4.2: Refactor Context and Hooks

- **Goal**: Align React context providers and custom hooks with camelCase naming.
- **Steps**:
  1. Search `client/src/context/` and `client/src/hooks/` for underscores in variable or property names.
  2. Rename state variables, context values, and hook return fields to camelCase.
  3. Update imports or consumers of these hooks so they match the new names.
  4. Remove temporary case-conversion logic that maps snake_case API data.
- **Deliverable**: Context modules and hooks that expose camelCase data throughout the application.
