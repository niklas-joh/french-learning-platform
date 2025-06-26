# Feature Plan: Dashboard Intuitive Layout

This document outlines the plan to refactor the user dashboard for a more intuitive page structure, as initially conceptualized in `dashboard_enhancement_plan.md` (Section 5).

## 1. Objectives

*   Redesign the overall dashboard layout into logical sections: "Start Learning Now," "My Assignments," "Learning Journeys," "Explore Topics," and "My Progress Overview."
*   Improve user flow and make key actions more accessible.
*   Utilize Material-UI for a clean, card-based layout.

## 2. Proposed New Dashboard Structure

**Note:** The "Header: Welcome, [Name]! | User Avatar/Settings Icon" functionality has been moved to the global `AppBar` in `client/src/App.tsx`. The dashboard content will start directly with "Section 1: Start Learning Now".

```
{/* Dashboard content starts here, global header is in App.tsx */}
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
    *   (No longer relevant for UserPreferencesForm as it's handled by App.tsx's global header)
    *   Ensure `DashboardPage.tsx` simply renders `Dashboard.tsx` for its content.
2.  **Refactor `client/src/components/Dashboard.tsx`**:
    *   Transform its `return` statement to implement the new section-based layout (excluding the previously planned dashboard-specific `HeaderSection`).
    *   Retain existing data fetching logic (`useEffect`) for user, topics, and assignments.
3.  **Modify `client/src/App.tsx` (New Step for Header Functionality)**:
    *   Integrate "Welcome, [Name]!" message, a clickable User Avatar, and a Modal dialog for `UserPreferencesForm` into the main application `AppBar`.

### Phase 2: Create New Dashboard Section Components

Create the following new components (typically within `client/src/components/dashboard_sections/`, which will be created when the first true section component is built):

{/* Item 1 for HeaderSection.tsx is removed as its functionality is now in App.tsx */}

1.  **`StartLearningNowSection.tsx`** (Effectively the first section component):
    *   **Status:** `Implemented (Initial Version - 2025-06-26)`
    *   **Content:**
        *   Card: "Continue Last Activity" (static placeholder initially).
        *   Card: "Next Assigned Item: [Item Name] - [Icon] - Start ->"
    *   **Props:** `assignments: UserContentAssignmentWithContent[]`.
    *   **Logic:** Determine the "next" assignment.
3.  **`MyAssignmentsSection.tsx`**:
    *   **Status:** `Implemented (2025-06-26)`
    *   **Content:** Renders `AssignedContentList` component, configured to show a limited number of incomplete assignments.
    *   **Props:** `assignments: UserContentAssignmentWithContent[]`.
4.  **`LearningJourneysSection.tsx`**:
    *   **Status:** `Implemented (Placeholder - 2025-06-26)`
    *   **Content:** Placeholder text "Coming Soon!" within an MUI `Paper` component.
5.  **`ExploreTopicsSectionWrapper.tsx`**:
    *   **Status:** `Implemented (2025-06-26)`
    *   **Content:** Wraps the existing `ExploreTopics.tsx` component, providing a section title and standard styling.
    *   **Props:** `topics: Topic[]`.
6.  **`MyProgressOverviewSectionWrapper.tsx`**:
    *   **Status:** `Implemented (2025-06-26)`
    *   **Content:** Wraps the existing `ProgressAnalytics.tsx` component, providing standard section styling. `ProgressAnalytics` fetches its own data.
    *   **Props:** None.

### Phase 3: Styling and Integration
*   **Status:** `Largely Complete (2025-06-26). Title styling and key considerations addressed. Ongoing responsiveness validation pending.`

1.  **Styling**:
    *   Utilize Material-UI components (`Paper`, `Card`, `Grid`, `Box`, `Typography`, `Link`, `IconButton`, `Avatar`, etc.) for structure and styling.
    *   **Section Title Consistency (Completed 2025-06-26):** Ensured all dashboard section titles (`StartLearningNowSection`, `MyAssignmentsSection`, `LearningJourneysSection`, `ExploreTopicsSectionWrapper`, `MyProgressOverviewSectionWrapper`) consistently use `Typography variant="h5" component="h2"` for improved visual hierarchy.
    *   Ensure responsiveness.
2.  **Integration**:
    *   Import and render new section components within the refactored `Dashboard.tsx`.
    *   Pass necessary props to each section.

## 4. File Structure Changes

*   **New Directory (to be created for actual dashboard sections):** `client/src/components/dashboard_sections/` (e.g., when `StartLearningNowSection.tsx` is created).
*   **New Files (for dashboard sections):**
    *   `client/src/components/dashboard_sections/StartLearningNowSection.tsx`
    *   `client/src/components/dashboard_sections/MyAssignmentsSection.tsx`
    *   `client/src/components/dashboard_sections/LearningJourneysSection.tsx`
    *   `client/src/components/dashboard_sections/ExploreTopicsSectionWrapper.tsx`
    *   `client/src/components/dashboard_sections/MyProgressOverviewSectionWrapper.tsx`
*   **Modified Files:**
    *   `client/src/App.tsx` (for global header, welcome message, avatar, settings modal)
    *   `client/src/pages/DashboardPage.tsx` (minor, if any, changes)
    *   `client/src/components/Dashboard.tsx` (to remove dashboard-specific header and integrate new sections)
*   **Deleted Files/Directories (due to moving header to App.tsx):**
    *   `client/src/components/dashboard_sections/HeaderSection.tsx` (if previously created under old plan)
    *   `client/src/components/dashboard_sections/` (if it only contained `HeaderSection.tsx`)


## 5. Key Considerations

*   **"Continue Last Activity"**: Will be a static placeholder in the first iteration.
*   **"Next Assigned Item"**: Requires logic to identify the next incomplete assignment.
*   **User Avatar/Settings (Preferences Modal)**: Now handled globally in `App.tsx`. Avatar displays user initials and opens preferences modal on click.
*   **Reusability**: Existing `ExploreTopics.tsx` and `ProgressAnalytics.tsx` will be wrapped to fit the new sectional layout.

This plan will be implemented on a new feature branch (e.g., `feature/dashboard-intuitive-layout`) after the current `feature/dashboard-revamp` branch is finalized and merged.
