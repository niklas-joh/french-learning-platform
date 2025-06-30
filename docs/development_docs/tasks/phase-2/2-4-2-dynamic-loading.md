# Task 2.4.2: Frontend - Implement Dynamic Component Loading in `LessonPage`

## Objective
Refactor the `LessonPage` component to dynamically load and render the correct lesson content component based on the lesson's type, while efficiently reusing existing client-side state.

## Key Activities
1.  **Create Component Map**: Create a new file `client/src/components/learning/content/index.ts` that exports a `lessonComponentMap`. This map will associate lesson type strings (e.g., "vocabulary") with their corresponding lazy-loaded React components.
2.  **Refactor `LessonPage.tsx`**:
    -   Retrieve the `lessonId` from the URL.
    -   Use the existing `useLearningPath()` hook to find the full lesson object from the already-fetched state, avoiding a redundant API call.
    -   Use the `lesson.type` to look up the correct component in the `lessonComponentMap`.
    -   Render the component within a `React.Suspense` boundary to handle the loading state gracefully.
    -   Implement a fallback for unknown lesson types.

## Acceptance Criteria
- The `lessonComponentMap` is created and correctly maps types to lazy-loaded components.
- `LessonPage` no longer contains static placeholder content.
- `LessonPage` correctly identifies the lesson from the URL and finds its data in the `useLearningPath` state.
- A loading indicator is shown while the specific lesson component is being fetched.
- A user-friendly error message is shown if the lesson type is not supported.

---

## Implementation Details

### Dependent Files
- `client/src/pages/LessonPage.tsx` (will be modified)
- `client/src/components/learning/content/index.ts` (will be created)
- `client/src/hooks/useLearningPath.ts` (will be consumed)
- `react-router-dom` (for `useParams`)

### Example Code
**1. Component Map (`content/index.ts`):**
```typescript
// client/src/components/learning/content/index.ts
import React from 'react';

// Mapping from lesson type string to the lazy-loaded component
export const lessonComponentMap: { [key: string]: React.LazyExoticComponent<React.FC<any>> } = {
  vocabulary: React.lazy(() => import('./VocabularyLesson')),
  grammar: React.lazy(() => import('./GrammarLesson')),
  conversation: React.lazy(() => import('./ConversationLesson')),
  // New lesson types can be added here with no other code changes
};
```

**2. `LessonPage.tsx` Refactor:**
```typescript
// client/src/pages/LessonPage.tsx
import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useLearningPath } from '../hooks/useLearningPath';
import { lessonComponentMap } from '../components/learning/content';
import { Lesson } from '../types/LearningPath'; // Assuming this type exists

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { findLessonById } = useLearningPath(); // Function to get lesson from existing state
  
  const lesson: Lesson | undefined = findLessonById(parseInt(lessonId || '0'));

  if (!lesson) {
    return <div>Lesson not found.</div>;
  }

  const LessonContentComponent = lessonComponentMap[lesson.type];

  return (
    <div>
      <h1>{lesson.title}</h1>
      <Suspense fallback={<div>Loading lesson content...</div>}>
        {LessonContentComponent ? (
          <LessonContentComponent contentData={lesson.content_data} />
        ) : (
          <div>Error: Unsupported lesson type "{lesson.type}".</div>
        )}
      </Suspense>
      {/* Buttons for start/complete logic will remain here */}
    </div>
  );
};

export default LessonPage;
```

### Review Points & Solutions
- **Potential Flaw**: Making a new API call on this page for a single lesson is inefficient.
- **Solution**: The implementation will explicitly reuse the state already fetched by the `useLearningPath` hook on the parent page. A new helper function, `findLessonById`, will be added to the hook to make this clean and easy.

- **Potential Flaw**: A hardcoded `if/else` or `switch` statement in `LessonPage` to select the component would be rigid and hard to maintain.
- **Solution**: The `lessonComponentMap` approach is used. This decouples the page from the components, allowing new lesson types to be added just by updating the map, adhering to the Open/Closed Principle.

- **Potential Flaw**: A poor user experience if the component takes a moment to load or if the lesson type is invalid.
- **Solution**: `React.Suspense` is used to provide a standardized loading fallback. A specific, user-friendly error message is rendered for unknown lesson types.
