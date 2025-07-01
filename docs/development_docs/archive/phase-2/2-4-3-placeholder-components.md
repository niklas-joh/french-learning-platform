# Task 2.4.3: Frontend - Create Placeholder Content Components

## Objective
Create the initial, placeholder versions of the specific lesson content components. These components will serve as the targets for the dynamic loading implemented in the previous task.

## Key Activities
1.  **Create Directory**: Create the new directory `client/src/components/learning/content/`.
2.  **Create Placeholder Components**: Inside the new directory, create the following files:
    -   `VocabularyLesson.tsx`
    -   `GrammarLesson.tsx`
    -   `ConversationLesson.tsx`
3.  **Implement Basic Structure**: Each component should:
    -   Import the appropriate props type from `LessonContentTypes.ts`.
    -   Accept the `contentData` prop.
    -   Render a basic view that includes a title (e.g., "Vocabulary Lesson") and a pre-formatted JSON string of the `contentData` it receives. This is purely for validation purposes.

## Acceptance Criteria
- The `client/src/components/learning/content/` directory exists.
- The `VocabularyLesson.tsx`, `GrammarLesson.tsx`, and `ConversationLesson.tsx` files exist within it.
- Each component correctly renders the basic placeholder UI.
- The project compiles successfully.
- When used in `LessonPage`, these components correctly display the data passed to them.

---

## Implementation Details

### Dependent Files
- `client/src/components/learning/content/VocabularyLesson.tsx` (will be created)
- `client/src/components/learning/content/GrammarLesson.tsx` (will be created)
- `client/src/components/learning/content/ConversationLesson.tsx` (will be created)
- `client/src/types/LessonContentTypes.ts` (will be imported)

### Example Code
The components will be simple placeholders for now, focused on validating the dynamic loading mechanism.

```typescript
// client/src/components/learning/content/VocabularyLesson.tsx
import React from 'react';
import { VocabularyContent } from '../../../types/LessonContentTypes';

interface VocabularyLessonProps {
  contentData: VocabularyContent;
}

const VocabularyLesson: React.FC<VocabularyLessonProps> = ({ contentData }) => {
  return (
    <div>
      <h2>Vocabulary</h2>
      {/* We will build the real UI later. For now, just show the data. */}
      <pre>{JSON.stringify(contentData, null, 2)}</pre>
    </div>
  );
};

export default VocabularyLesson;
```
*(The other components, `GrammarLesson.tsx` and `ConversationLesson.tsx`, will follow the exact same pattern).*

### Review Points & Solutions
- **Potential Flaw**: Building out the full, complex UI for each lesson type in one go would be a very large and difficult task.
- **Solution**: This task intentionally creates only placeholder components. The primary goal is to get the dynamic loading infrastructure working correctly. The detailed UI for each lesson type will be handled in separate, future tasks, making the work manageable.

- **Potential Flaw**: The components might end up with duplicated layout code (e.g., for titles, instruction text).
- **Solution**: This is a valid concern for the future. A `// TODO:` comment will be added to `LessonPage.tsx` to remind us to create a shared `<LessonLayout>` component if significant code duplication is observed once the real components are built. This defers the abstraction until it's actually needed, following the "You Aren't Gonna Need It" (YAGNI) principle for now.
