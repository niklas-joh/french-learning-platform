# Task 2.4.4: Docs - Update High-Level Architecture Diagrams

## Objective
Ensure that the high-level system architecture documentation accurately reflects the new, more sophisticated dynamic content rendering mechanism.

## Key Activities
1.  **Analyze Current Diagram**: Review the existing `system_architecture.mermaid` file.
2.  **Identify Inaccuracies**: Note that the current diagram oversimplifies the `LessonPage`, showing it as a single entity.
3.  **Update Diagram**: Modify the Mermaid syntax to:
    -   Show that `LessonPage` acts as a dynamic loader.
    -   Illustrate that it uses `React.Suspense` to manage loading states.
    -   Explicitly show the new content-specific components (`VocabularyLesson.tsx`, `GrammarLesson.tsx`, etc.) as the components being loaded by `LessonPage`.

## Acceptance Criteria
- The `docs/development_docs/architecture/system_architecture.mermaid` file is updated.
- The new diagram correctly visualizes the relationship between `LessonPage`, `React.Suspense`, and the various lesson content components.
- The documentation is now aligned with the implemented code architecture.

---

## Implementation Details

### Dependent Files
- `docs/development_docs/architecture/system_architecture.mermaid` (will be modified)

### Example Code
The following Mermaid syntax will be added to the "UI Components" subgraph within the main diagram to accurately represent the new architecture.

```mermaid
subgraph "UI Components"
    MainLayout["MainLayout (Mobile Frame)"]
    BottomNav["BottomTabNavigation"]
    LearningPath["LearningPath.tsx"]
    LearningUnit["LearningUnit.tsx"]
    LessonNode["LessonNode.tsx"]
    
    subgraph "Dynamic Lesson Content"
        direction TB
        LessonPage["LessonPage.tsx (Controller)"]
        Suspense["React.Suspense (Loading Boundary)"]
        VocabularyLesson["VocabularyLesson.tsx"]
        GrammarLesson["GrammarLesson.tsx"]
        ConversationLesson["ConversationLesson.tsx"]
    end

    LessonNode -- "Navigates to" --> LessonPage
    LessonPage --> Suspense
    Suspense --> VocabularyLesson
    Suspense --> GrammarLesson
    Suspense --> ConversationLesson
end
```

### Review Points & Solutions
- **Potential Flaw**: Leaving the architecture diagrams out of date can mislead future developers and make onboarding more difficult.
- **Solution**: This task is dedicated specifically to updating the documentation. By treating documentation as a first-class citizen in the development process, we ensure the project remains understandable and maintainable. This is a crucial step that is often overlooked.
