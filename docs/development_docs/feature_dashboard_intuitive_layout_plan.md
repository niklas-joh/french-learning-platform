# Feature Plan: Dashboard Intuitive Layout

This document outlines the plan to refactor the user dashboard for a more intuitive page structure, as initially conceptualized in `dashboard_enhancement_plan.md` (Section 5).

## 1. Objectives

*   Redesign the overall dashboard layout into logical sections: "Start Learning Now," "My Assignments," "Learning Journeys," "Explore Topics," and "My Progress Overview."
*   Improve user flow and make key actions more accessible.
*   Utilize Material-UI for a clean, card-based layout.

## 2. Proposed New Dashboard Structure

```
[Header: Welcome, [Name]! | User Avatar/Settings Icon ]

---------------------------------------------------------------------
| Section 1: Start Learning Now                             |
---------------------------------------------------------------------
| [Card: Continue Last Activity (if applicable)]            |
| [Card: Next Assigned Item: [Item Name] - [Icon] - Start ->] |
---------------------------------------------------------------------

---------------------------------------------------------------------
| Section 2: My Assignments                                 |
---------------------------------------------------------------------
| - [Icon] [Formatted Item Name 1] (Progress Bar/Status) [Start ->] |
| - [Icon] [Formatted Item Name 2] (Progress Bar/Status) [Start ->] |
| - [Icon] [Formatted Item Name 3] (Progress Bar/Status) [Start ->] |
| [Link: View All ([N] remaining) Assignments ->]             |
---------------------------------------------------------------------

---------------------------------------------------------------------
| Section 3: Learning Journeys (If feature is active)       |
---------------------------------------------------------------------
| [Content for Learning Journeys - "Coming Soon!" for now]    |
---------------------------------------------------------------------

---------------------------------------------------------------------
| Section 4: Explore Topics                                 |
---------------------------------------------------------------------
| [Topic Card 1: Title, Desc, Icon, Explore ->]             |
| [Topic Card 2: Title, Desc, Icon, Explore ->]             |
| [Topic Card 3: Title, Desc, Icon, Explore ->]             |
| [Link: View All Topics ->]                                |
---------------------------------------------------------------------

---------------------------------------------------------------------
| Section 5: My Progress Overview                           |
---------------------------------------------------------------------
| Overall Completion: [Percentage]%                         |
| Topics Mastered: [N]                                      |
|                                                           |
| Progress by Topic:                                        |
|   - [Topic 1 Name]: [Progress Bar] [X/Y (Z%)]             |
|   - [Topic 2 Name]: [Progress Bar] [X/Y (Z%)]             |
|   [Link: View Detailed Progress Report ->]                |
---------------------------------------------------------------------
```

## 3. Implementation Plan

### Phase 1: Restructure Core Dashboard Files

1.  **Modify `client/src/pages/DashboardPage.tsx`**:
    *   Remove direct rendering of `UserPreferencesForm`. The `UserPreferencesForm` will no longer be directly rendered here; its functionality will be invoked via the `HeaderSection`.
    *   The new header (Welcome message, User Avatar/Settings Icon) will be managed within the refactored `client/src/components/Dashboard.tsx`.
2.  **Refactor `client/src/components/Dashboard.tsx`**:
    *   Transform its `return` statement to implement the new section-based layout.
    *   Retain existing data fetching logic (`useEffect`) for user, topics, and assignments.
    *   The "Welcome, [Name]!" message will be part of the new `HeaderSection.tsx`.

### Phase 2: Create New Section Components

Create the following new components within `client/src/components/dashboard_sections/`:

1.  **`HeaderSection.tsx`**:
    *   **Content:** "Welcome, [Name]!" and a User Avatar/Settings Icon (e.g., a gear icon).
    *   **Functionality:** The Settings Icon will, upon click, open a Modal dialog containing the `UserPreferencesForm`. This keeps user settings accessible without navigating away from the dashboard context initially. For future expansion, this could navigate to a dedicated comprehensive user profile/settings page.
    *   **Props:** `user: User | null`.
2.  **`StartLearningNowSection.tsx`**:
    *   **Content:**
        *   Card: "Continue Last Activity" (static placeholder initially).
        *   Card: "Next Assigned Item: [Item Name] - [Icon] - Start ->"
    *   **Props:** `assignments: UserContentAssignmentWithContent[]`.
    *   **Logic:** Determine the "next" assignment.
3.  **`MyAssignmentsSection.tsx`**:
    *   **Content:** Renders `AssignedContentList` component.
    *   **Props:** `assignments: UserContentAssignmentWithContent[]`.
4.  **`LearningJourneysSection.tsx`**:
    *   **Content:** Placeholder text "Coming Soon!".
5.  **`ExploreTopicsSectionWrapper.tsx`**:
    *   **Content:** Wraps the existing `ExploreTopics.tsx` component.
    *   **Props:** `topics: Topic[]`.
6.  **`MyProgressOverviewSectionWrapper.tsx`**:
    *   **Content:** Wraps the existing `ProgressAnalytics.tsx` component.
    *   **Props:** (Potentially none if `ProgressAnalytics` fetches its own data, or pass through as needed).

### Phase 3: Styling and Integration

1.  **Styling**:
    *   Utilize Material-UI components (`Paper`, `Card`, `Grid`, `Box`, `Typography`, `Link`, `IconButton`, `Avatar`, etc.) for structure and styling.
    *   Ensure responsiveness.
2.  **Integration**:
    *   Import and render new section components within the refactored `Dashboard.tsx`.
    *   Pass necessary props to each section.

## 4. File Structure Changes

*   **New Directory:** `client/src/components/dashboard_sections/`
*   **New Files:**
    *   `client/src/components/dashboard_sections/HeaderSection.tsx`
    *   `client/src/components/dashboard_sections/StartLearningNowSection.tsx`
    *   `client/src/components/dashboard_sections/MyAssignmentsSection.tsx`
    *   `client/src/components/dashboard_sections/LearningJourneysSection.tsx`
    *   `client/src/components/dashboard_sections/ExploreTopicsSectionWrapper.tsx`
    *   `client/src/components/dashboard_sections/MyProgressOverviewSectionWrapper.tsx`
*   **Modified Files:**
    *   `client/src/pages/DashboardPage.tsx`
    *   `client/src/components/Dashboard.tsx`

## 5. Key Considerations

*   **"Continue Last Activity"**: Will be a static placeholder in the first iteration.
*   **"Next Assigned Item"**: Requires logic to identify the next incomplete assignment.
*   **User Avatar/Settings Icon**: Settings icon will be a placeholder. Avatar can display user initials.
*   **Reusability**: Existing `ExploreTopics.tsx` and `ProgressAnalytics.tsx` will be wrapped to fit the new sectional layout.

This plan will be implemented on a new feature branch (e.g., `feature/dashboard-intuitive-layout`) after the current `feature/dashboard-revamp` branch is finalized and merged.
