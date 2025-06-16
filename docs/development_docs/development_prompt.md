# 🚀 French Learning Platform - Phase 1 Development

## **IMMEDIATE NEXT STEPS**

### **1. Repository Setup**
Create a new GitHub repository with the following structure:

```bash
# Initialize the project
mkdir french-learning-platform
cd french-learning-platform
git init
npm init -y

# Create directory structure
mkdir -p client/src/{components,pages,services,types,utils}
mkdir -p server/src/{controllers,middleware,models,routes,services}
mkdir -p database/{migrations,seeds}
mkdir -p content/topics
mkdir docs scripts
```

### **2. Technology Stack Installation**

**Backend Setup:**
```bash
cd server
npm init -y
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install sqlite3 knex
npm install @types/express @types/cors @types/bcryptjs @types/jsonwebtoken typescript ts-node nodemon -D
```

**Frontend Setup:**
```bash
cd client
npx create-react-app . --template typescript
npm install axios react-router-dom @types/react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### **3. Environment Configuration**

Create `.env` files:

**server/.env:**
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
DATABASE_URL=./database/french_learning.db

# AI APIs (add later in Phase 3)
CLAUDE_API_KEY=your-claude-key
OPENAI_API_KEY=your-openai-key

# Admin Settings
ADMIN_EMAIL=admin@yourplatform.com
```

**client/.env:**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=French Learning Platform
```

### **4. Core Files to Create First**

#### **A. Database Schema (database/schema.sql)**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    preferences JSON
);

CREATE TABLE topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic_id INTEGER,
    type TEXT NOT NULL,
    question_data JSON NOT NULL,
    correct_answer JSON NOT NULL,
    options JSON,
    difficulty_level TEXT,
    tags JSON,
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(id)
);

CREATE TABLE user_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    user_answer JSON NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken_seconds INTEGER,
    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (content_id) REFERENCES content(id)
);
```

#### **B. Server Entry Point (server/src/app.ts)**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Route imports (create these files)
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import contentRoutes from './routes/content.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
```

#### **C. Authentication Controller (server/src/controllers/auth.controller.ts)**
```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail, createUser } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      role: 'user'
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
```

### **5. Priority Development Order**

**Week 1:**
1. ✅ Set up project structure and dependencies
2. ✅ Create database schema and connection
3. ✅ Implement authentication (register/login)
4. ✅ Create basic React app with routing
5. ✅ Build login/register components

**Week 2:**
1. ✅ Create quiz component with multiple choice
2. ✅ Implement content storage and retrieval
3. ✅ Add user progress tracking
4. ✅ Create basic user dashboard
5. ✅ Test end-to-end user flow

### **6. Sample Content to Start With**

Create `content/topics/subjunctive/certainty-vs-doubt.json`:
```json
[
  {
    "id": "subj_001",
    "type": "multiple_choice",
    "topic": "subjunctive",
    "difficulty": "B1",
    "tags": ["certainty_vs_doubt"],
    "question": {
      "text": "Il me semble qu'elle _____ raison. (avoir)",
      "explanation": "Testing certainty expressions"
    },
    "options": ["a", "ait", "aura"],
    "correct_answer": 0,
    "feedback": {
      "correct": "Correct! 'Il me semble que' expresses opinion as fact → indicative",
      "incorrect": "'Il me semble que' shows the speaker's strong impression → indicative 'a'"
    }
  }
]
```

---

## **🎯 SUCCESS CRITERIA FOR PHASE 1**

By the end of Week 2, you should have:
- ✅ User registration and login working
- ✅ Users can take a simple quiz with multiple choice questions
- ✅ User responses are stored in the database
- ✅ Basic progress tracking (score, completion)
- ✅ Simple user dashboard showing progress
- ✅ Admin can manually add content via JSON files

## **READY TO START CODING?**

Use this prompt to begin development:

> "I'm ready to start building the French Learning Platform. Please help me create the initial project setup with the file structure, package.json configurations, and the first authentication system. Start with the backend authentication controller and the basic database models for users and content. Let's build this step by step following the Phase 1 requirements."
