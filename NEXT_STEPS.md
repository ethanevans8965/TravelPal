# Next Steps for TravelPal Development

This document outlines the immediate tasks and priorities for the current development phase (Phase 2: Feature Development with Integration Points).

## Current Focus: Phase 2 - Building Integrated Core Features

### 1. Enhanced Trip Management Module

*   **Task**: Implement the initial step of the trip creation flow: selecting a budget method.
    *   **Details**: Ensure the `app/trip/select-method.tsx` screen correctly presents the four budget scenarios (Total & Length Known, Budget Only, Length Only, No Budget) as options.
    *   **Integration**: This screen is now the direct navigation target from the 'New Trip' button in the FAB menu.
*   **Task**: Develop branching logic and subsequent screens/components for each budget scenario.
    *   **Details**: Based on the selected method in `select-method.tsx`, navigate the user to the appropriate screens to collect the necessary trip details (e.g., trip name, dates, destination, budget specifics per scenario, pre-trip expenses).
    *   **Integration**: Design these screens to collect data required by the updated data models and budget calculation logic.
*   **Task**: Implement the logic for creating a new trip entity based on collected data, connecting to `AppContext`.
*   **Task**: Design and implement the UI for viewing a list of trips (e.g., on the main `index.tsx` screen).
    *   **Details**: Each list item should display key trip information (name, destination, dates, and potentially a summary of the budget status if a budget exists).
*   **Task**: Design and implement the UI for viewing a single trip's details.
    *   **Details**: This screen will later serve as a dashboard for the trip, showing associated expenses, journal entries, and the budget overview (if applicable).
*   **Task**: Implement `updateTrip` and `deleteTrip` functionalities with corresponding UI elements (e.g., edit and delete buttons) for the new trip structure.

### 2. Contextual Expense Tracking Module

*   **Task**: Design and implement the UI for adding a new expense.
    *   **Details**: Fields for amount, category, description, date, currency.
    *   **Integration**: Ensure the expense is linked to a `tripId`. Add UI for selecting the parent trip.
    *   **Integration**: Optionally link to a `locationId` if the expense is location-specific within the trip.
*   **Task**: Implement `addExpense` logic in the UI, connecting to `AppContext`.
*   **Task**: Update the expense display list (e.g., on `expenses.tsx`) to show expenses linked to a selected or active trip.
*   **Task**: Implement `updateExpense` and `deleteExpense` functionalities.

### 3. Location-Aware Travel Journal Module

*   **Task**: Design and implement the UI for creating a new journal entry.
    *   **Details**: Fields for title, content, date, mood.
    *   **Integration**: Ensure the entry is linked to a `tripId`.
    *   **Integration**: Allow tagging the entry with a `locationId`.
*   **Task**: Implement `addJournalEntry` logic in the UI, connecting to `AppContext`.
*   **Task**: Design UI for displaying journal entries, filterable by trip and/or location.
*   **Task**: Implement `updateJournalEntry` and `deleteJournalEntry` functionalities.

### 4. Location Management (Supporting Feature)

*   **Task**: Design a simple UI for selecting an existing `Location` or creating a new one.
    *   **Details**: This will be used by Trip Management (for destination) and potentially by Expense/Journal modules.
    *   Fields: name, country, timezone. (Coordinates can be auto-fetched or manually entered later).
*   **Task**: Implement `addLocation` and `updateLocation` logic as needed by the feature modules.

## General Tasks for Phase 2

*   **Component Library**: Identify and create reusable UI components (e.g., custom input fields, date pickers, location pickers, budget input fields per scenario) to be stored in `app/components/`.
*   **Styling**: Ensure consistent styling across new screens and components.
*   **Testing**: Plan for unit/integration tests for new logic and components, particularly for the branching logic and scenario-specific calculations.
*   **Documentation**: Keep `README.md`, `ROADMAP.md`, and `NEXT_STEPS.md` updated as development progresses. **Ensure the budget planning documentation (`docs/budget_planning_feature.md`) is fully aligned with the implemented scenarios and flows.** 