# Task 2.1: Database Schema Updates

The database schema is managed by Knex.js migration files located in `database/migrations/`. These migrations define the creation and alteration of tables. Key tables for this phase include `user_progress`, `learning_paths`, `learning_units`, `lessons`, `achievements`, and `user_achievements`. Refer to the migration files (e.g., `20250625000000_create_core_learning_tables.ts`) for the precise SQL definitions. The illustrative SQL below shows the general structure of these tables.

```sql
-- Illustrative SQL for new tables (actual definitions are in Knex migrations):

-- User progress and gamification
CREATE TABLE user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    current_level TEXT NOT NULL DEFAULT 'A1',
    current_xp INTEGER NOT NULL DEFAULT 0,
    total_xp INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    lessons_completed INTEGER NOT NULL DEFAULT 0,
    words_learned INTEGER NOT NULL DEFAULT 0,
    time_spent_minutes INTEGER NOT NULL DEFAULT 0,
    accuracy_rate REAL NOT NULL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Learning paths and structure
CREATE TABLE learning_paths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT NOT NULL DEFAULT 'french',
    name TEXT NOT NULL,
    description TEXT,
    total_lessons INTEGER NOT NULL DEFAULT 0,
    estimated_duration INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learning_path_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id)
);

CREATE TABLE lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    learning_unit_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    estimated_time INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    content_data TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_unit_id) REFERENCES learning_units(id)
);

-- Achievements system
CREATE TABLE achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    criteria_data TEXT NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'common',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (achievement_id) REFERENCES achievements(id),
    UNIQUE(user_id, achievement_id)
);

-- Insert initial learning path data
INSERT INTO learning_paths (language, name, description, total_lessons, estimated_duration) 
VALUES ('french', 'French for Beginners', 'Complete French course from A1 to B2 level', 50, 100);

-- Insert sample achievements
INSERT INTO achievements (id, name, description, icon, category, criteria_data, rarity) VALUES
('first_lesson', 'First Steps', 'Complete your first lesson', '🎯', 'lessons', '{"type": "lessons_completed", "value": 1}', 'common'),
('streak_7', 'Week Warrior', 'Maintain a 7-day learning streak', '🔥', 'streak', '{"type": "streak", "value": 7}', 'rare'),
('perfect_quiz', 'Perfectionist', 'Score 100% on any quiz', '⭐', 'accuracy', '{"type": "accuracy_threshold", "value": 100}', 'epic');
