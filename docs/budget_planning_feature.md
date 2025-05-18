# Budget Planning Feature Specification

## Overview

This document outlines the specifications for the Budget Planning feature of the TravelPal application. The goal is to allow users to plan their trip budgets based on different known inputs and travel styles, utilizing pre-defined country cost data while allowing full customization.

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

## Implementation Plan

This section outlines a step-by-step approach for implementing the Budget Planning feature.

1.  **Foundation - Data Handling:**
    *   **Goal:** Access and understand the cost data from `assets/data/all_countries.json`.
    *   **Action:** Implement code to read and parse the JSON file. Represent this data in a structured way within the application (e.g., dictionaries or simple data classes for countries and their cost categories).
    *   **Verification:** Ensure correct retrieval of daily costs for any given country, travel style, and category.

2.  **Data Models - Representing a Budget:**
    *   **Goal:** Define how a budget plan will be structured in memory.
    *   **Action:** Create data structures (e.g., classes, data classes) for:
        *   `BudgetPlan`: To hold trip name, country, dates/length, total budget (if applicable), list of category allocations, and list of pre-trip expenses.
        *   `CategoryAllocation`: To hold category name and the allocated monetary amount (noting whether it's daily or total based on the scenario/context).
        *   `PreTripExpense`: To hold description and cost.
    *   **Verification:** Ability to instantiate these models and populate them with sample data relevant to each scenario.

3.  **Core Logic - Scenario 1 (Budget & Length Known):**
    *   **Goal:** Implement the calculations for the most straightforward scenario.
    *   **Action:** Develop functions that take user inputs (Country, Style, Length, Budget) and the parsed cost data to:
        *   Calculate initial suggested *total* costs per category.
        *   Recalculate suggestions if a category's style is overridden.
        *   Calculate the total allocated budget based on user's *custom* inputs/overrides.
        *   Calculate the difference between the user's `Total Budget` and their currently allocated total.
    *   **Verification:** Test these functions with diverse inputs to ensure calculation accuracy.

4.  **Basic Interface - Scenario 1:**
    *   **Goal:** Provide a way for the user to interact with the Scenario 1 logic.
    *   **Action:** Build a minimal user interface (e.g., command-line, basic web form, simple GUI) to:
        *   Accept all inputs for Scenario 1.
        *   Display suggested category allocations (including the daily/total toggle).
        *   Allow users to edit allocations per category.
        *   Show the running total of allocations and the remaining/over budget amount, updating dynamically.
        *   Provide a method for inputting pre-trip expenses.
    *   **Verification:** Manually input data, change allocations, and confirm that feedback updates correctly.

5.  **Persistence - Saving & Loading Scenario 1:**
    *   **Goal:** Store and retrieve created budget plans.
    *   **Action:** Implement logic to:
        *   Take a completed `BudgetPlan` object.
        *   Save it to a persistent store (e.g., a JSON file named after the trip, a database row).
        *   Load a previously saved plan back into a `BudgetPlan` object.
    *   **Verification:** Save a plan, (conceptually) close and reopen the application, and load the plan, verifying data integrity.

6.  **Adapt Logic & UI - Scenario 2 (Budget Known, Length Unknown):**
    *   **Goal:** Implement dynamic trip length calculation.
    *   **Action:**
        *   Modify/add core logic to calculate estimated trip length from `Total Budget` and *daily* allocations.
        *   Adapt UI: Remove trip length input; add display for dynamically calculated "Estimated Trip Length." Ensure editing daily category values updates this estimate.
        *   Adjust persistence to save/load daily allocations and estimated length.
    *   **Verification:** Test Scenario 2 flow, ensuring estimated length updates correctly with budget changes.

7.  **Adapt Logic & UI - Scenario 3 (Length Known, Budget Unknown):**
    *   **Goal:** Implement dynamic total budget calculation.
    *   **Action:**
        *   Modify/add core logic to calculate suggested total budget from `Trip Date Range` (and derived length) and daily allocations.
        *   Adapt UI: Use date range input; calculate and display trip length; display dynamically calculated "Suggested Total Budget." Ensure editing daily/total category values updates this suggested budget.
        *   Adjust persistence for Scenario 3 inputs/outputs.
    *   **Verification:** Test Scenario 3 flow, ensuring suggested budget updates correctly.

8.  **Refinements:**
    *   **Goal:** Enhance robustness and usability.
    *   **Action:** Implement input validation, error handling (e.g., for missing country data), improve UI layout, integrate a calendar widget for date selection, etc.
    *   **Verification:** Test with invalid inputs and edge cases to ensure stability.

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