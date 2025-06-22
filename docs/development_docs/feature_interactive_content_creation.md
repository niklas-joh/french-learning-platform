# Feature Plan: Interactive Content Creation & Management

This document outlines the plan to enhance the admin content management interface, moving from a JSON-based input to a more interactive and user-friendly system.

## 1. Add "Name" Field to Content

**Objective:** Add a `name` field to each content item to provide a human-readable identifier.

### Backend Tasks
- [✅] **Database:** Create a new Knex migration to add a `name` column (string, not null) to the `content` table.
- [✅] **API:**
    - Update the `createContent` and `updateContent` controller and model functions to handle the new `name` field.
    - Add validation to ensure the `name` field is present and valid.
- [✅] **Types:** Update the `ContentSchema` and related types in `server/src/models/Content.ts` to include the `name` field.

### Frontend Tasks
- [✅] **UI:** Add a "Name" text field to the `ContentForm.tsx` component.
- [✅] **Service:** Update the `createContentItem` and `updateContentItem` functions in `adminService.ts` to send the `name` field.
- [✅] **Display:** Update `ContentManager.tsx` to display the new "Name" column.
- [✅] **Types:** Update the `Content` type in `client/src/types/Content.ts`.

## 2. Reorder Admin Panel Columns

**Objective:** Change the column order in the `ContentManager` table for better readability.

### Frontend Tasks
- [✅] **UI:** In `ContentManager.tsx`, reorder the `<TableCell>` elements in the `<TableHead>` and the corresponding data cells in the `<TableBody>` to be: `ID`, `Name`, `Topic`, `Type`.

## 3. Dynamic "Type" Field with Dropdown

**Objective:** Convert the "Type" field from a free-text input to a dropdown menu populated from a predefined list, with a mechanism to manage the available types.

### Backend Tasks
- [✅] **Database:** Create a new `content_types` table (`id`, `name`, `description`).
- [✅] **API:**
    - Create new CRUD API endpoints for managing content types (e.g., `/api/admin/content-types`).
    - Secure these endpoints for admin-only access.
- [✅] **Content API:** Update the content endpoints to reference the `content_types` table.

### Frontend Tasks
- [✅] **UI:**
    - In `ContentForm.tsx`, replace the "Content Type" text field with a `<Select>` dropdown component.
    - Fetch the list of available content types and populate the dropdown.
- [✅] **New Admin Section:** Create a new `ContentTypeManager.tsx` component to allow admins to add, edit, and delete content types.
- [✅] **Services:** Add new functions to `adminService.ts` to manage content types.

## 4. Interactive Content Population

**Objective:** Replace the JSON text area with a dynamic form that changes based on the selected content "Type".

### Frontend Tasks
- [✅] **`ContentForm.tsx` Logic:**
    - Add a state variable to track the selected content type.
    - Conditionally render different form fields based on the selected type.
- [✅] **Sub-components:**
    - Create a separate form component for each content type (e.g., `MultipleChoiceForm.tsx`, `FillInTheBlankForm.tsx`).
- [✅] **Sub-component Implementation:**
    - These components will be responsible for managing their specific fields (e.g., question, options, answer).
- [✅] **Data Handling:**
    - When the main `ContentForm` is submitted, it will gather the data from the currently active sub-component and format it into the required `questionData` JSON structure before sending it to the backend.

This approach breaks down the complex task into manageable, feature-oriented steps, ensuring a clear path forward.
