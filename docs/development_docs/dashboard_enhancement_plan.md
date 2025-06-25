# Dashboard Enhancement Plan

This document outlines the proposed improvements for the user dashboard based on user feedback.

## 1. Personalized Welcome Message (✅ Completed)

*   **Current Issue:** Displays "Welcome, user@example.com!"
*   **Desired Change:** Display "Welcome, [User's First Name]!" or "Welcome, [User's Full Name]!"
*   **Outcome:**
    1.  **Backend:** Verified that the `/api/users/me` endpoint returns `first_name` and `last_name`. No changes were needed.
    2.  **Frontend (`client/src/types/User.ts`):** Verified that the `User` type already included `firstName` and `lastName`.
    3.  **Frontend (`client/src/services/userService.ts`):** Added a `getCurrentUser` function to fetch the user profile and map the snake_case response to the camelCase `User` type.
    4.  **Frontend (`client/src/components/Dashboard.tsx`):** Updated the component to use the new service function and display the user's full name, with a fallback to their email.
*   **Affected Files:**
    *   `client/src/services/userService.ts`
    *   `client/src/components/Dashboard.tsx`

## 2. Clickable Progress Cards (✅ Completed)

*   **Current Issue:** Progress cards (e.g., "Assigned Content" in "My Progress") were static.
*   **Desired Change:** Make these cards clickable to navigate the user to relevant content or sections.
*   **Outcome:**
    1.  **New Pages Created:**
        *   `client/src/pages/AllAssignmentsPage.tsx`: A new page to display all content assigned to the user. It fetches and renders assignments using the `AssignedContentList` component.
        *   `client/src/pages/TopicContentPage.tsx`: A new page to display all content related to a specific topic. It fetches the topic details and a list of its content, linking each item to the individual quiz page.
    2.  **Routing:**
        *   Added routes in `client/src/App.tsx` for `/assignments` and `/topics/:topicId/learn` to render the new pages.
    3.  **Dashboard Links:**
        *   The "Assigned Content" section in `client/src/components/Dashboard.tsx` is now wrapped in a `Link` pointing to `/assignments`.
        *   Each topic in the "Progress by Topic" section in `client/src/components/ProgressAnalytics.tsx` is now wrapped in a `Link` pointing to `/topics/:topicId/learn`.
    4.  **Services:**
        *   Added a `getTopicById` function to `client/src/services/contentService.ts` to support the `TopicContentPage`.
*   **Affected Files:**
    *   `client/src/components/Dashboard.tsx`
    *   `client/src/components/ProgressAnalytics.tsx`
    *   `client/src/App.tsx`
    *   `client/src/services/contentService.ts`
    *   `client/src/pages/AllAssignmentsPage.tsx` (new)
    *   `client/src/pages/TopicContentPage.tsx` (new)

## 3. 'Assigned Content' Card Improvements

### 3.a. Show More Items & Filter Completed (✅ Completed)

*   **Current Issue:** Ad-hoc completions were incorrectly affecting the "Assigned Content" progress bar.
*   **Desired Change:**
    *   The "Assigned Content" progress bar should *only* reflect progress on explicitly assigned items.
    *   Display all *incomplete* assigned items.
    *   If the list is long, provide a "View All" link or pagination.
*   **Outcome:**
    1.  **Backend Data Model Refactor:** The data model has been fundamentally refactored to separate explicit assignments from ad-hoc completions.
        *   A new `user_content_completions` table now logs all completion events.
        *   The `user_content_assignments` table is now exclusively for explicit assignments.
    2.  **Backend Logic Update:** The `getUserProgress` and `recordContentItemProgress` controllers were updated to use the new two-table system, ensuring correct progress calculation.
    3.  **Frontend Implementation:** The `client/src/components/AssignedContentList.tsx` component has been updated. It now filters to show incomplete items by default (when used with `showIncompleteOnly` prop on the dashboard) and includes a "View All" link to `/assignments` if a `limit` is applied and more items exist. The `client/src/pages/AllAssignmentsPage.tsx` displays all assignments (complete and incomplete) when navigated to.
*   **Affected Files:**
    *   `server/src/controllers/user.controller.ts`
    *   `server/src/models/UserContentAssignment.ts`
    *   `server/src/models/UserContentCompletion.ts` (new)
    *   Multiple new database migration files.
    *   `client/src/components/AssignedContentList.tsx`
    *   `client/src/components/Dashboard.tsx`
    *   `client/src/pages/AllAssignmentsPage.tsx`

### 3.b. User-Friendly Layout (Names & Icons) (✅ Completed)

*   **Current Issue:** The assigned content list was displaying the content's internal `name` or `type` instead of its user-friendly `title`.
*   **Desired Change:**
    *   Format names to be human-readable (e.g., "Greeting Evening").
    *   Use icons for content types.
*   **Outcome:**
    1.  **Backend Fix:** The `UserContentAssignmentModel` was updated to select `content.title` from the database.
    2.  **Frontend Fix:** The `AssignedContentList.tsx` component was updated to render the `name` property (which is populated with the title) of the content object.
    3.  **Frontend Implementation:** The `client/src/components/AssignedContentList.tsx` now uses a utility function (`formatDisplayName` from `client/src/utils/textFormatters.ts`) for name formatting and another utility (`getIconForType` from `client/src/utils/iconMap.tsx`) to display icons for content types.
*   **Proposed Solution:**
    1.  **Name Formatting:**
        *   A utility function (`formatDisplayName(text: string)`) in `client/src/utils/textFormatters.ts` converts `snake_case` or `kebab-case` to "Title Case".
    2.  **Icons for Content Types:**
        *   An icon library (`react-icons`) is used.
        *   A mapping in `client/src/utils/iconMap.tsx` from content type strings to specific icon components is utilized.
        *   The rendering logic in `AssignedContentList.tsx` displays the icon.
*   **Affected Files:**
    *   `client/src/components/AssignedContentList.tsx`
    *   `client/src/utils/textFormatters.ts`
    *   `client/src/utils/iconMap.tsx`
    *   `client/package.json` (for `react-icons` dependency)

## 4. 'Explore Topics' Styling (✅ Completed)

*   **Current Issue:** Plain list of topic names.
*   **Desired Change:** Styled list/cards with descriptions for each topic.
*   **Outcome:** The "Explore Topics" section on the dashboard now displays topics as styled cards. Each card shows the topic title, description, and a link to the topic's learning page.
    1.  **Backend:** Verified `/api/topics` endpoint returns topic descriptions.
    2.  **Frontend Types/Services:** Updated `Topic.ts` type and `contentService.ts` to handle descriptions.
    3.  **New Components:** Created `ExploreTopics.tsx` to manage fetching and display, and `TopicCard.tsx` for individual topic rendering. (Assuming these were created as per the original plan for this feature).
    4.  **Integration:** `ExploreTopics.tsx` integrated into `Dashboard.tsx` (or the relevant dashboard page component).
    5.  **Styling:** Applied CSS for card layout, responsiveness, and visual appeal.
*   **Affected Files (Assumed based on typical implementation):**
    *   `server/src/controllers/content.controller.ts` (verified)
    *   `client/src/types/Topic.ts`
    *   `client/src/services/contentService.ts`
    *   `client/src/components/Dashboard.tsx` (or `client/src/pages/DashboardPage.tsx`)
    *   `client/src/components/ExploreTopics.tsx` (new or existing)
    *   `client/src/components/TopicCard.tsx` (new or existing)
    *   Relevant CSS files (e.g., `ExploreTopics.module.css`, `TopicCard.module.css`).

## 5. Intuitive Page Structure Suggestion

*   **Current Issue:** User feels the page mixes learning, progress, and user preferences, seeking a more intuitive layout.
*   **Proposed New Dashboard Structure:**

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

*   **Rationale for New Structure:**
    *   **Action-Oriented Top:** "Start Learning Now" provides immediate entry points.
    *   **Clear Focus on Assignments:** "My Assignments" is prominent and actionable.
    *   **Discovery Section:** "Explore Topics" allows users to browse freely.
    *   **Consolidated Progress:** "My Progress Overview" groups all progress-related information.
    *   **User Preferences/Settings:** Accessed via a settings icon in the header, keeping the main dashboard focused on learning and progress.
*   **Implementation Notes:**
    *   This would involve significant refactoring of `client/src/components/Dashboard.tsx`.
    *   May require creating new sub-components for each section (e.g., `QuickActionsSection.tsx`, `MyAssignmentsSection.tsx`).
    *   CSS will be crucial for achieving a clean, card-based layout. Use the UI library Material-UI.

This detailed plan will guide the implementation once approved.
