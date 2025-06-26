# Feature: Multiple Content Types

This document outlines the plan to implement multiple content types for quizzes.

## 1. Refactor the Main `Quiz.tsx` Component

The existing `Quiz.tsx` component will be transformed into a "dispatcher" component. Its main responsibility will be to determine the type of content and render the appropriate sub-component for it.

```mermaid
graph TD
    A[Quiz Component] --> B{Switch on content.type};
    B -->|'multiple-choice'| C[Render MultipleChoiceQuiz];
    B -->|'fill-in-the-blank'| D[Render FillInTheBlankQuiz];
    B -->|'true-false'| E[Render TrueFalseQuiz];
    B -->|'default'| F[Render "Unsupported Type" message];
```

## 2. Create Specialized Quiz Sub-Components

New, specialized components will be created for each content type to ensure clean and maintainable code.

-   **`client/src/components/quiz_types/MultipleChoiceQuiz.tsx`**: The existing logic from `Quiz.tsx` will be moved here.
-   **`client/src/components/quiz_types/FillInTheBlankQuiz.tsx`**: A new component for fill-in-the-blank questions.
-   **`client/src/components/quiz_types/TrueFalseQuiz.tsx`**: A new component for true/false questions.

## 3. Improve Type Safety with Specific Interfaces

Specific TypeScript interfaces for each content type's data structure will be defined in `client/src/types/Content.ts` to replace the `any` type in `questionData`.

**Example Interfaces:**

```typescript
// For 'multiple-choice'
export interface MultipleChoiceData {
  text: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

// For 'fill-in-the-blank'
export interface FillInTheBlankData {
  text: string; // e.g., "The cat sat on the ___."
  correctAnswer: string; // e.g., "mat"
  explanation: string;
}

// For 'true-false'
export interface TrueFalseData {
  statement: string;
  correctAnswer: boolean;
  explanation: string;
}

// Update the main Content interface
export interface Content {
  id: number;
  name: string;
  topicId: number;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'true-false';
  contentTypeId: number;
  questionData: MultipleChoiceData | FillInTheBlankData | TrueFalseData;
  active: boolean;
  createdAt?: string;
}
```

## 4. Update Parent Components

The component that uses `<Quiz>` (likely `DashboardPage.tsx` or `AssignedContentList.tsx`) will be updated to fetch the content and pass the full `Content` object to the refactored `Quiz` component.
