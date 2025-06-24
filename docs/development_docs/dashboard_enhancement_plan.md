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

## 2. Clickable Progress Cards

*   **Current Issue:** Progress cards (e.g., "Assigned Content" in "My Progress") are static.
*   **Desired Change:** Make these cards clickable to navigate the user to relevant content or sections.
*   **Proposed Solution:**
    1.  **"Assigned Content" Card (in "My Progress"):**
        *   Should link to a view displaying all *incomplete* assigned content items. This could be the main "Assigned Content" section on the dashboard (if it's made comprehensive) or a dedicated page.
    2.  **"Progress by Topic" Items:**
        *   Each topic progress bar could link to a page displaying content for that topic, prioritizing incomplete items.
    3.  **Implementation:**
        *   Wrap the relevant card components in `Link` components from `react-router-dom`.
        *   Define appropriate routes (e.g., `/assignments`, `/topics/:topicId/learn`).
        *   Pass necessary parameters (e.g., topic ID, filter for incomplete).
*   **Affected Files:**
    *   `client/src/components/Dashboard.tsx`
    *   `client/src/components/ProgressAnalytics.tsx` (if it renders these cards)
    *   `client/src/App.tsx` (for route definitions)
    *   Potentially new components for dedicated views (e.g., `AllAssignmentsPage.tsx`).

## 3. 'Assigned Content' Card Improvements

### 3.a. Show More Items & Filter Completed

*   **Current Issue:** Shows only the first two items; includes completed items. Overall progress shows "1/3 (33%)" suggesting 3 items are assigned, one of which is complete. The list below shows 2 items.
*   **Desired Change:**
    *   Display all *incomplete* assigned items.
    *   If the list is long, provide a "View All" link or pagination.
*   **Proposed Solution:**
    1.  **Backend:** The API endpoint for assigned content (`/api/users/me/assignments` or similar) should ideally allow filtering by status (e.g., `status=pending`) or return status information for each item.
    2.  **Frontend Service (`client/src/services/userService.ts`):** Fetch all assigned items or specifically incomplete ones.
    3.  **Frontend Component (`client/src/components/AssignedContentList.tsx` or `Dashboard.tsx`):**
        *   Filter out items with a 'completed' status.
        *   Render the list of incomplete items.
        *   If more than, say, 5 items, show the first 5 and a "View all [N] assignments" link that expands the list or navigates to a dedicated page.
*   **Affected Files:**
    *   `server/src/controllers/user.controller.ts` (or `assignment.controller.ts`)
    *   `client/src/services/userService.ts`
    *   `client/src/components/AssignedContentList.tsx` (or `Dashboard.tsx`)
    *   `client/src/types/Assignment.ts` (ensure it has a status field)

### 3.b. User-Friendly Layout (Names & Icons)

*   **Current Issue:** Uses underscores in names (e.g., `greeting_evening`); shows content type as text (e.g., `multiple-choice`).
*   **Desired Change:**
    *   Format names to be human-readable (e.g., "Greeting Evening").
    *   Use icons for content types.
*   **Proposed Solution:**
    1.  **Name Formatting:**
        *   Create a utility function (e.g., `formatDisplayName(text: string)`) that converts `snake_case` or `kebab-case` to "Title Case" (e.g., "Greeting Evening").
    2.  **Icons for Content Types:**
        *   Install an icon library (e.g., `react-icons`).
        *   Create a mapping from content type strings (e.g., "multiple-choice", "sentence-correction") to specific icon components.
        *   Example mapping:
            *   `multiple-choice`: `<FaListOl />` (Numbered list)
            *   `sentence-correction`: `<FaEdit />` (Edit icon)
            *   `fill-in-the-blank`: `<FaKeyboard />` (Keyboard icon for input)
            *   `true-false`: `<FaCheckSquare />` / `<FaWindowClose />` (Check/cross)
        *   Update the rendering logic to display the icon next to or in place of the content type text.
*   **Affected Files:**
    *   `client/src/components/AssignedContentList.tsx` (or `Dashboard.tsx`)
    *   A new utility file for `formatDisplayName` (e.g., `client/src/utils/textFormatters.ts`)
    *   A new mapping file or constant for icons (e.g., `client/src/utils/iconMap.tsx`)

## 4. 'Explore Topics' Styling

*   **Current Issue:** Plain list of topic names.
*   **Desired Change:** Styled list/cards with descriptions for each topic.
*   **Proposed Solution:**
    1.  **Backend:** Ensure the API endpoint for topics (`/api/topics`) returns a brief description for each topic.
    2.  **Frontend (`client/src/types/Topic.ts`):** Add a `description` field to the `Topic` type.
    3.  **Frontend Component (`Dashboard.tsx` or a new `ExploreTopics.tsx`):**
        *   Render each topic as a card or a well-styled list item.
        *   Each card should display:
            *   Topic Title (formatted nicely)
            *   Topic Description
            *   An optional icon (if a generic icon per topic can be sourced or if topics can have associated icons).
            *   A "Start Exploring" or "View Content" button/link that navigates to the topic's content page.
*   **Affected Files:**
    *   `server/src/controllers/content.controller.ts` (and `Topic` model)
    *   `client/src/types/Topic.ts`
    *   `client/src/services/contentService.ts`
    *   `client/src/components/Dashboard.tsx` (or a new `ExploreTopics.tsx`)
    *   CSS for styling the topic cards/list.

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
    *   CSS will be crucial for achieving a clean, card-based layout. Consider a UI library like Material-UI or Chakra UI if not already heavily invested in custom CSS, or use a CSS framework like Tailwind CSS.

This detailed plan will guide the implementation once approved.
