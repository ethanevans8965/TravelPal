# TravelPal 🌎✈️

TravelPal is a mobile application built with Expo and React Native designed to be your ultimate travel companion. It helps you seamlessly manage trip logistics, track expenses, capture memories in a journal, and keep everything organized in one place. Our goal is to create an integrated experience where all features work together harmoniously.

## Features

Our development focuses on creating a cohesive experience:

- 🗺️ **Integrated Trip Management**:

  - Create, edit, and delete trips with detailed information (name, dates, style, status).
  - Associate trips with specific **Locations** (including name, country, coordinates, timezone).
  - Plan budgets (total/daily, emergency fund, pre-trip costs) linked to expenses.
  - View trips on a timeline incorporating expenses and journal entries.

- 💰 **Contextual Expense Tracking**:

  - Log expenses linked directly to a **Trip** and optionally a **Location**.
  - Categorize spending and track against the trip's budget.
  - Handle multiple currencies with conversion based on location or base settings.
  - Attach receipt photos and tags for better organization.
  - Analyze spending patterns per trip or location.

- 📝 **Location-Aware Travel Journal**:

  - Create journal entries linked to a **Trip** and tagged with a **Location**.
  - Capture thoughts, experiences, and attach photos.
  - Optionally link journal entries to related **Expenses**.
  - Organize entries with tags and view them chronologically or by location.

- ⚙️ **Centralized Settings**:
  - Manage base currency and other global preferences.

## Phased Rework Plan

We are currently reworking the application to enhance integration and features, following these phases:

1.  **Phase 1: Enhanced Data Model & State Management (Complete)**

    - Introduced a `Location` interface.
    - Established clear relationships between `Trip`, `Expense`, `JournalEntry`, and `Location` entities.
    - Updated the `AppContext` (`app/context.tsx`) to manage the enhanced state and provide CRUD operations and utility functions.
    - Implemented basic data persistence strategy (in-memory for now, potential for storage later).

2.  **Phase 2: Feature Development with Integration Points**

    - **Trip Management**: Develop flows for creating/editing trips that incorporate location selection and budget setup linked to expense categories.
    - **Expense Tracking**: Update expense logging to link with trips/locations and integrate with budget categories.
    - **Journal System**: Enhance journal entries with trip/location context and photo management.

3.  **Phase 3: Feature Integration**

    - Implement cross-feature navigation and views (e.g., trip dashboards showing related expenses/entries).
    - Develop shared components and utilities for consistency.
    - Implement global search and filtering capabilities.

4.  **Phase 4: Enhanced User Experience**
    - Introduce data visualization (charts, maps).
    - Implement offline support.
    - Add data import/export functionality.
    - Explore potential social/sharing features.

## Tech Stack

**Frontend:**

- React Native (v0.79.2)
- Expo (v53)
- TypeScript
- React Navigation
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- Expo Vector Icons
- Expo Blur
- Expo Haptics
- React Native WebView

**Backend & State Management:**

- Supabase (Database, Authentication, Storage)
- Zustand (Client-side state management)
- React Native Async Storage (Local persistence)

**Development Tools:**

- ESLint (Code linting)
- Prettier (Code formatting)
- Husky (Git hooks)
- lint-staged (Pre-commit linting/formatting)

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Yarn or npm
- Expo CLI
- Supabase CLI (for backend management)
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/TravelPal.git
   cd TravelPal
   ```

2. Install dependencies

   ```bash
   yarn install
   ```

3. Set up environment variables

   ```bash
   # Create .env file in project root with:
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```bash
   yarn start
   ```

### Running the App

You can run the app in several ways:

- Press 'i' for iOS simulator
- Press 'a' for Android emulator
- Scan the QR code with Expo Go on your device

### Available Scripts

Development:

- `yarn start` - Start the Expo development server
- `yarn android` - Start on Android
- `yarn ios` - Start on iOS
- `yarn web` - Start in web browser

Code Quality:

- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues automatically
- `yarn format` - Format code with Prettier
- `yarn test` - Run tests

Package Management:

- `yarn install` - Install dependencies
- `yarn reset-project` - Reset the project

## Project Structure

```
TravelPal/
├── app/                  # Main application code using Expo Router
│   ├── _layout.tsx       # Root layout with app-wide navigation setup
│   ├── (tabs)/           # Tab-based screens
│   │   ├── _layout.tsx   # Tab navigation configuration
│   │   ├── index.tsx     # Main dashboard (Trip list/overview)
│   │   ├── expenses.tsx  # Expense tracking screen
│   │   ├── journal.tsx   # Journal entry screen (Added/Updated)
│   │   └── settings.tsx  # App settings and preferences
│   ├── trip/             # Trip creation/management screens
│   │   ├── ...           # (Screens for trip details, editing, etc.)
│   ├── components/       # Reusable UI components
│   ├── utils/            # Utility functions (e.g., country data, date utils)
│   ├── context.tsx       # App-wide state management (Enhanced)
│   └── types.ts          # TypeScript definitions (Enhanced with Location, updated relations)
├── src/                  # Source code
│   ├── lib/              # Library code
│   │   └── supabaseClient.ts  # Supabase client configuration
│   └── theme/            # Theme configuration
│       └── colors.ts     # Centralized color palette
├── assets/               # Static assets (images, fonts, data)
│   ├── data/
│   │   └── all_countries.json
│   ├── ...
├── scripts/              # Helper scripts
├── .env                  # Environment variables (not committed)
├── .gitignore
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── .husky/               # Git hooks
├── app.config.ts         # Expo configuration with environment variables
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Data Model Overview

The core data entities are defined in `app/types.ts`:

- `Location`: Represents a geographical place (name, country, coordinates, timezone).
- `Trip`: Contains overall trip details, linked to a `Location` destination.
- `Expense`: Represents a single expense, linked to a `Trip` and optionally a `Location`.
- `JournalEntry`: Represents a journal entry, linked to a `Trip` and optionally a `Location`.

Relationships are managed via IDs (e.g., `tripId`, `locationId`) within the `Expense` and `JournalEntry` interfaces.

## State Management

TravelPal uses React Context (`app/context.tsx`) for state management, providing centralized state and functions for:

- Managing `Trip`, `Expense`, `JournalEntry`, and `Location` data (CRUD operations).
- Handling global settings like `baseCurrency` and `dailyBudget`.
- Utility functions to retrieve related data (e.g., `getTripExpenses(tripId)`).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Guidelines

- Use TypeScript for all new code
- Follow the existing project structure
- Maintain consistent code style
- Write tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
