# Task 3.1.B.4: Database Schema for AI Content

## **Task Information**
- **Task ID**: 3.1.B.4
- **Parent Task**: 3.1.B (Dynamic Content Generation)
- **Estimated Time**: 1 hour
- **Priority**: ⚡ High
- **Dependencies**: Task 3.1.B.3 (Implement Content Generation Logic)
- **Status**: ⏳ Not Started

## **Objective**
Create the necessary database tables to store, manage, and track the AI-generated content. This task ensures that the dynamic content can be persisted, versioned, and associated with users.

## **Success Criteria**
- [ ] A `generated_content` table is created to store the main content.
- [ ] A `content_validation_history` table is created to log validation results.
- [ ] A `content_generation_jobs` table is created to track asynchronous jobs.
- [ ] All new tables are integrated with the existing database schema and models.
- [ ] Knex migration and seed files are created for the new tables.

## **Implementation Details**

### **1. `generated_content` Table**
This table will be the primary repository for all AI-generated content.
- `id`: Primary Key (UUID)
- `user_id`: Foreign Key to `users` table
- `type`: String (e.g., 'lesson', 'vocabulary_drill')
- `content`: JSONB to store the `StructuredContent` object
- `metadata`: JSONB to store the `ContentMetadata` object
- `estimated_completion_time`: Integer (in minutes)
- `learning_objectives`: JSONB (array of strings)
- `created_at`, `updated_at`: Timestamps

### **2. `content_validation_history` Table**
This table will log every validation attempt, providing valuable data for improving prompts and models.
- `id`: Primary Key
- `content_id`: Foreign Key to `generated_content` table
- `validation_result`: JSONB to store the `ContentValidation` object
- `attempt_number`: Integer
- `created_at`: Timestamp

### **3. `content_generation_jobs` Table**
This table is essential for the asynchronous workflow.
- `id`: Primary Key (Job ID, likely a string/UUID)
- `user_id`: Foreign Key to `users` table
- `status`: String ('queued', 'processing', 'completed', 'failed')
- `request_payload`: JSONB to store the `ContentRequest`
- `result_content_id`: Foreign Key to `generated_content` (nullable)
- `error_message`: Text (if status is 'failed')
- `created_at`, `updated_at`: Timestamps

### **4. Knex Migration**
- A new Knex migration file will be created to add these three tables to the database.
- The migration will include appropriate indexes for foreign keys and frequently queried columns.

### **5. Knex Seed (Optional)**
- A seed file can be created to populate the tables with example data for development and testing purposes.

## **Files to Create/Modify**
- `database/migrations/YYYYMMDDHHMMSS_create_ai_content_tables.ts` (New file)
- `database/seeds/07_ai_content.ts` (Optional new file)
- `server/src/models/` (New model files for the new tables)

## **Next Steps**
This task concludes the main scaffolding for the Dynamic Content Generation service. The next steps would involve implementing the logic within these new structures.
