# Task 2.4.1: Frontend - Create Foundation for Dynamic Content Components

## Objective
Establish the foundational TypeScript types and project structure required to support dynamically rendered lesson content. This is a non-visual, structural task that enables future development.

## Key Activities
1.  **Update Master Plan**: Add the new subtasks (2.4.1 - 2.4.4) to the main `app_overhaul_plan.md` to ensure progress is tracked accurately.
2.  **Create Type Definitions**: Create a new file at `client/src/types/LessonContentTypes.ts`.
3.  **Define Interfaces**: Populate the new file with specific TypeScript interfaces for each lesson content type (`VocabularyContent`, `GrammarContent`, `ConversationContent`). This enforces type safety and provides clear data contracts for the components.

## Acceptance Criteria
- The `app_overhaul_plan.md` is updated with the new task breakdown.
- The file `client/src/types/LessonContentTypes.ts` exists and contains the correct type definitions.
- The project's code compiles successfully with the new types.
- No visual changes are expected from this task.

---

## Implementation Details

### Dependent Files
- `docs/development_docs/app_overhaul_plan.md`
- `client/src/types/LessonContentTypes.ts` (This file will be created)

### Example Code
The core of this task is the creation of the `LessonContentTypes.ts` file with the following structure:
```typescript
// client/src/types/LessonContentTypes.ts

// For vocabulary lessons
export interface VocabularyItem {
  word: string;
  translation: string;
  example_sentence: string;
}
export interface VocabularyContent {
  items: VocabularyItem[];
}

// For grammar lessons
export interface GrammarContent {
  rule: string;
  explanation: string;
  examples: string[];
}

// For conversation lessons
export interface ConversationLine {
  speaker: string;
  line: string;
}
export interface ConversationContent {
  title: string;
  dialogue: ConversationLine[];
}
```

### Review Points & Solutions
- **Potential Flaw**: Using a generic `any` type for lesson content would defeat the purpose of TypeScript and lead to runtime errors.
- **Solution**: This task directly addresses this by creating specific, strict interfaces for each content type. This ensures type safety from the very beginning.

- **Potential Flaw**: The data structures in the backend's `content_data` JSON blob could diverge from these frontend types.
- **Solution**: This is a larger architectural concern. A task has been added to `future_implementation_considerations.md` to address this by implementing runtime validation with a library like Zod, creating a single source of truth for data shapes.
