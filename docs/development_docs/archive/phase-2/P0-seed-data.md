# Prerequisite Task P0: Seed Initial Learning Units and Lessons

-   **Objective**: Populate the database with initial learning units and lessons for development and testing of the "French for Beginners" learning path.
-   **Key Actions**:
    1.  Create/Update a seed file (e.g., `database/seeds/06_learning_content.ts` or add to `001_language_learning_schema.sql` if appropriate for initial setup).
    2.  Insert sample data for `learning_units` linked to the existing "French for Beginners" path.
    3.  Insert sample data for `lessons` linked to these new units.
    ```sql
    -- Example SQL for seeding (actual implementation might use Knex in a .ts seed file):
    -- Assuming learning_paths ID 1 is 'French for Beginners'
    -- INSERT INTO learning_units (learning_path_id, title, description, level, order_index) VALUES
    -- (1, 'Unit 1: Greetings', 'Learn basic French greetings', 'A1', 1),
    -- (1, 'Unit 2: Introductions', 'Introduce yourself and others', 'A1', 2);

    -- Assuming Unit 1 ID is 1, Unit 2 ID is 2 after insertion (IDs will be auto-generated)
    -- INSERT INTO lessons (learning_unit_id, title, type, estimated_time, order_index, content_data) VALUES
    -- ( (SELECT id from learning_units WHERE title = 'Unit 1: Greetings'), 'Lesson 1.1: Common Greetings', 'vocabulary', 10, 1, '{"details": "Bonjour, Salut, Ça va?"}'),
    -- ( (SELECT id from learning_units WHERE title = 'Unit 1: Greetings'), 'Lesson 1.2: Saying Goodbye', 'vocabulary', 5, 2, '{"details": "Au revoir, À bientôt"}'),
    -- ( (SELECT id from learning_units WHERE title = 'Unit 2: Introductions'), 'Lesson 2.1: My Name Is...', 'conversation', 15, 1, '{"scenario": "Je m''appelle..."}');
    ```
-   **Impacted Files**: New/Updated seed file in `database/seeds/`.
