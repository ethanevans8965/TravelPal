# Budget Planning Feature Specification

## Overview

This document outlines the specifications for the Budget Planning feature of the TravelPal application. The goal is to allow users to plan their trip budgets based on different known inputs and travel styles, utilizing pre-defined country cost data while allowing full customization. **The entry point for trip creation, including budget planning, is now initiated via the Floating Action Button (FAB) on the main screen, leading to a selection of budget planning methods.**

## Core Data

*   `assets/data/all_countries.json`: Contains suggested daily costs for Accommodation, Transportation, Food, Entertainment, and Alcohol based on Budget, Mid-Range, and Luxury travel styles for various countries.

## Budget Planning Scenarios

### Scenario 1 (Refined): Traveler knows Total Budget and Total Trip Length

1.  **User Input:**
    *   `Trip Name` (String): User-defined name for the trip (e.g., "Tokyo Adventure", "Rome Weekend").
    *   `Country` (Selection): User selects the destination country from a list derived from the core data.
    *   `Total Trip Length` (Integer): Number of days for the trip.
    *   `Total Budget` (Number): The overall monetary amount the user intends to spend *during* the trip (excluding pre-trip expenses).
    *   `Overall Travel Style` (Selection - Required): User must select one of: Budget, Mid-Range, Luxury. This sets the default suggested costs.
    *   `Pre-Trip Expenses` (List - Optional): A list where users can input expenses already paid or committed before the trip (e.g., flights, travel insurance). Each item should have a description (String) and a cost (Number). These are recorded for informational purposes but are kept separate from the main trip budget calculation.

2.  **App Process:**
    *   **Fetch Data:** Retrieve the suggested daily costs from `all_countries.json` for the selected `Country` based on the chosen `Overall Travel Style` for the standard categories (Accommodation, Transportation, Food, Entertainment, Alcohol).
    *   **Display Suggestions:** Present the suggested costs per category to the user. Implement a toggle mechanism allowing the user to switch the view between **daily** suggested costs and **total trip** suggested costs (calculated as daily cost * `Total Trip Length`).
    *   **Display Total Budget:** Clearly show the user's entered `Total Budget`.
    *   **Allow Customization:**
        *   **Category Style Override:** Allow users to select a different travel style (Budget, Mid-Range, Luxury) for *individual* categories, overriding the `Overall Travel Style`. When overridden, the suggested cost for that specific category should update based on the newly selected style.
        *   **Value Override:** Allow users to directly edit the monetary value allocated to each category. This editing should respect the current toggle view (daily or total). If the user edits the daily value, the total updates, and vice-versa.
    *   **Live Feedback:** As the user makes adjustments (overriding styles or values), the application must continuously update and display:
        *   The current sum of all allocated category budgets. This sum should also be viewable as both a daily total and a total trip sum, respecting the toggle state.
        *   The difference between the user's `Total Budget` and the current sum of allocated category budgets. This should be clearly labelled (e.g., "Remaining: $XXX" or "Over budget by: $YYY"). The system does *not* enforce that the allocated sum must equal the `Total Budget`.

3.  **Output (Saving the Budget Plan):**
    *   Persist the finalized budget plan associated with the user's account. The stored data should include:
        *   `Trip Name`
        *   `Country`
        *   `Total Trip Length`
        *   User's `Total Budget`
        *   The finalized allocation amount (stored as the total trip amount) for each category (Accommodation, Transportation, Food, Entertainment, Alcohol).
        *   The list of `Pre-Trip Expenses` (description and cost for each).

---

### Scenario 2 (Refined): Traveler knows Total Budget but Trip Length is Unknown

1.  **User Input:**
    *   `Trip Name` (String): User-defined name for the trip (e.g., "Tokyo Adventure", "Rome Weekend").
    *   `Country` (Selection): User selects the destination country from a list derived from the core data.
    *   `Total Budget` (Number): The overall monetary amount the user intends to spend *during* the trip (excluding pre-trip expenses).
    *   `Overall Travel Style` (Selection - Required): User must select one of: Budget, Mid-Range, Luxury. This sets the default suggested costs.
    *   `Pre-Trip Expenses` (List - Optional): A list where users can input expenses already paid or committed before the trip (e.g., flights, travel insurance). Each item should have a description (String) and a cost (Number). These are recorded for informational purposes but are kept separate from the main trip budget calculation.

2.  **App Process:**
    *   **Fetch Data:** Retrieve the suggested daily costs from `all_countries.json` for the selected `Country` based on the chosen `Overall Travel Style` for the standard categories (Accommodation, Transportation, Food, Entertainment, Alcohol).
    *   **Display Suggestions:** Present the suggested **daily** costs per category to the user. (We might not need the total/daily toggle here initially, as the focus is on daily costs to calculate length).
    *   **Display Total Budget:** Clearly show the user's entered `Total Budget`.
    *   **Calculate Initial Estimated Trip Length:** Sum the suggested daily costs for all categories based on the `Overall Travel Style`. Divide the `Total Budget` by this sum to get the initial estimated trip length in days. Display this prominently (e.g., "Estimated Trip Length: X days").
    *   **Allow Customization:**
        *   **Category Style Override:** Allow users to select a different travel style (Budget, Mid-Range, Luxury) for *individual* categories, overriding the `Overall Travel Style`. When overridden, the suggested cost for that specific category should update based on the newly selected style.
        *   **Value Override:** Allow users to directly edit the monetary value allocated to each category (in daily terms). As they adjust these values, the app should:
            *   Recalculate the total allocated daily budget (sum of all category daily values).
            *   Recalculate the estimated trip length (`Total Budget` / total allocated daily budget).
            *   Update the displayed estimated trip length dynamically.
    *   **Live Feedback:** As the user makes adjustments (overriding styles or values), the application must continuously update and display:
        *   The current sum of all allocated category budgets (in daily terms).
        *   The dynamically updated estimated trip length based on the current allocations.

3.  **Output (Saving the Budget Plan):**
    *   Persist the finalized budget plan associated with the user's account. The stored data should include:
        *   `Trip Name`
        *   `Country`
        *   `Total Budget`
        *   The finalized allocation amount for each category (stored as the **daily** amount).
        *   The calculated `Estimated Trip Length` (in days).
        *   The list of `Pre-Trip Expenses` (description and cost for each).

---

### Scenario 3 (Refined): Traveler knows Total Trip Length (Date Range) but Budget is Unknown

1.  **User Input:**
    *   `Trip Name` (String): User-defined name for the trip (e.g., "Tokyo Adventure", "Rome Weekend").
    *   `Country` (Selection): User selects the destination country from a list derived from the core data.
    *   `Trip Date Range` (Date Range - Required): User selects a start date and an end date for the trip. The app will calculate the `Total Trip Length` (in days) based on this range.
    *   `Overall Travel Style` (Selection - Required): User must select one of: Budget, Mid-Range, Luxury. This sets the default suggested costs.
    *   `Pre-Trip Expenses` (List - Optional): A list where users can input expenses already paid or committed before the trip (e.g., flights, travel insurance). Each item should have a description (String) and a cost (Number). These are recorded for informational purposes but are kept separate from the main trip budget calculation.

2.  **App Process:**
    *   **Calculate Total Trip Length:** Determine the number of days between the selected `Trip Date Range` start and end dates.
    *   **Fetch Data:** Retrieve the suggested daily costs from `all_countries.json` for the selected `Country` based on the chosen `Overall Travel Style` for the standard categories (Accommodation, Transportation, Food, Entertainment, Alcohol).
    *   **Display Suggestions:** Present the suggested **daily** costs per category to the user. Implement a toggle mechanism allowing the user to switch the view between **daily** suggested costs and **total trip** suggested costs (calculated as daily cost * `Total Trip Length`).
    *   **Calculate Initial Suggested Total Budget:** Sum the suggested daily costs for all categories based on the `Overall Travel Style`. Multiply this sum by the `Total Trip Length` to get the initial suggested total budget. Display this prominently (e.g., "Suggested Total Budget: $XXX").
    *   **Allow Customization:**
        *   **Category Style Override:** Allow users to select a different travel style (Budget, Mid-Range, Luxury) for *individual* categories, overriding the `Overall Travel Style`. When overridden, the suggested cost for that specific category should update based on the newly selected style.
        *   **Value Override:** Allow users to directly edit the monetary value allocated to each category. This editing should respect the current toggle view (daily or total). If the user edits the daily value, the total updates, and vice-versa.
    *   **Live Feedback:** As the user makes adjustments (overriding styles or values), the application must continuously update and display:
        *   The current sum of all allocated category budgets (in both daily and total views, respecting the toggle).
        *   The dynamically updated suggested total budget based on the current allocations.

3.  **Output (Saving the Budget Plan):**
    *   Persist the finalized budget plan associated with the user's account. The stored data should include:
        *   `Trip Name`
        *   `Country`
        *   `Trip Date Range` (Start Date, End Date)
        *   `Total Trip Length` (calculated in days)
        *   The finalized allocation amount for each category (stored as the **daily** amount).
        *   The calculated `Suggested Total Budget`.
        *   The list of `Pre-Trip Expenses` (description and cost for each).

---

### Scenario 4: No Budget

This scenario allows users to create a trip without specifying any budget details. Budget tracking for this trip will be based solely on logged expenses, without comparison to a plan.

1.  **User Input:**
    *   `Trip Name` (String): User-defined name for the trip.
    *   `Country` (Selection): User selects the destination country.
    *   `Trip Date Range` (Date Range - Optional): User can select a start and end date for the trip.

2.  **App Process:**
    *   Simply create the trip entity with the provided basic information.
    *   Navigate the user directly to the trip details view or a relevant expense logging screen for this trip.

3.  **Output (Saving the Trip):**
    *   Persist the trip details associated with the user's account.
        *   `Trip Name`
        *   `Country`
        *   `Trip Date Range` (Start Date, End Date - if provided)

---

## Implementation Plan

This section outlines a step-by-step approach for implementing the Budget Planning feature. **Note that the initial step now involves the user selecting one of the four scenarios (including No Budget) from the `select-method.tsx` screen.**

1.  **Starting Point: Select Budget Method (`select-method.tsx`)**
    *   **Goal:** Present the user with the four budget planning scenarios (including No Budget) as options.
    *   **Action:** Ensure the `select-method.tsx` screen is correctly implemented to display the options and capture the user's choice.
    *   **Verification:** User can see and select one of the four options.

2.  **Branching Logic & Data Collection based on Scenario:**
    *   **Goal:** Navigate the user to the appropriate subsequent screen(s) based on their selected budget method and collect the necessary input for that scenario.
    *   **Action:** Create new screens or adapt existing ones (e.g., a single screen with conditional fields or separate screens for different input requirements) to gather the specific data needed for Scenario 1, 2, 3, or 4.
    *   **Verification:** The app correctly navigates based on selection, and all required inputs for the chosen scenario can be collected.

3.  **Foundation - Data Handling (Refined):**
    *   **Goal:** Access and understand the cost data from `assets/data/all_countries.json` for scenarios 1, 2, and 3.
    *   **Action:** Implement code to read and parse the JSON file and make it accessible to the screens that require it for suggestions and calculations.
    *   **Verification:** Correct retrieval of daily costs for any given country and travel style.

4.  **Data Models - Representing a Budget (Refined):**
    *   **Goal:** Define how a budget plan will be structured in memory, accounting for the different data collected in each scenario.
    *   **Action:** Ensure the data structures (`BudgetPlan`, `CategoryAllocation`, `PreTripExpense`) can accommodate the data from all relevant scenarios (including the absence of budget data for Scenario 4).
    *   **Verification:** Ability to instantiate these models and populate them with sample data for each scenario.

5.  **Core Logic - Scenario Calculations:**
    *   **Goal:** Implement the calculation logic for Scenarios 1, 2, and 3.
    *   **Action:** Develop functions to handle the suggested costs, overrides, total calculations, and estimated length/budget calculations as detailed in the scenario descriptions.
    *   **Verification:** Test calculation accuracy for Scenarios 1, 2, and 3.

6.  **User Interface - Implementing Scenario Flows:**
    *   **Goal:** Build the UI for the input and feedback steps within each scenario's flow.
    *   **Action:** Design and implement the screens where users input budget specifics, view suggestions, make customizations, and see live updates.
    *   **Verification:** Users can complete the input process for each scenario and see correct feedback.

7.  **Persistence - Saving & Loading:**
    *   **Goal:** Store and retrieve created trips and budget plans.
    *   **Action:** Implement logic to save the finalized `Trip` entity, including the associated `BudgetPlan` data (or lack thereof for Scenario 4), and to load previously saved trips/budgets.
    *   **Verification:** Saving and loading data maintains integrity across all scenarios.

8.  **Refinements:**
    *   **Goal:** Enhance robustness and usability.
    *   **Action:** Implement input validation, error handling (e.g., for missing country data), improve UI layout, integrate a calendar widget for date selection, etc.
    *   **Verification:** Test with invalid inputs and edge cases to ensure stability.
    *   **Mobile responsiveness**
    *   **Offline functionality**

## Next Steps

After completing the Budget Planning feature specification and implementation plan, the following steps are recommended:

1. **Expense Tracking Feature Planning:**
   * Define the core requirements for tracking actual expenses during the trip
   * Plan how expenses will relate to the budget categories
   * Design the data structure for expense records
   * Plan the user interface for expense input and tracking

2. **Budget Planning Implementation:**
   * Begin with Step 1 of the Implementation Plan (Data Handling)
   * Progress through each step sequentially
   * Test each component thoroughly before moving to the next step

3. **Future Considerations (to be addressed later):**
   * Currency conversion and handling
   * Multi-country trip support
   * Data visualization and reporting
   * User authentication and data privacy
   * Mobile responsiveness
   * Offline functionality

--- 