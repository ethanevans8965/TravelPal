# TravelPal 🌎✈️

TravelPal is a mobile application built with Expo and React Native designed to be your ultimate travel companion. It helps you seamlessly manage trip logistics, track expenses, capture memories in a journal, and keep everything organized in one place. Our goal is to create an integrated experience where all features work together harmoniously.

## Current Status

**Phase 1 Complete**: Enhanced Data Model & State Management
**Phase 2 In Progress**: Zustand Migration & Core Features

### ✅ Completed Features

- **Hybrid State Management**: Successfully implemented Zustand for core data stores with React Context for UI state
- **Currency Converter**: Live currency conversion with caching and offline support
- **Trip Store**: Complete CRUD operations with persistence and utility functions
- **Expense Store**: Full expense management with trip/location linking
- **Data Persistence**: AsyncStorage integration with automatic sync
- **Modern UI Components**: Currency converter with swap functionality and loading states

### 🚧 In Development

- **Floating Plus FAB**: Trip creation workflow via floating action button
- **Journal Store**: Location-aware journal entries with photo attachments
- **Location Store**: Geographical location management
- **Feature Integration**: Cross-feature navigation and unified dashboards

## Features

Our development focuses on creating a cohesive experience:

- 🗺️ **Integrated Trip Management**:

  - Create, edit, and delete trips with detailed information (name, dates, style, status)
  - Associate trips with specific **Locations** (including name, country, coordinates, timezone)
  - Plan budgets (total/daily, emergency fund, pre-trip costs) linked to expenses
  - View trips on a timeline incorporating expenses and journal entries
  - **Status**: Trip Store implemented with Zustand ✅

- 💰 **Contextual Expense Tracking**:

  - Log expenses linked directly to a **Trip** and optionally a **Location**
  - Categorize spending and track against the trip's budget
  - Handle multiple currencies with conversion based on location or base settings
  - Attach receipt photos and tags for better organization
  - Analyze spending patterns per trip or location
  - **Status**: Expense Store implemented with Zustand ✅

- 💱 **Currency Conversion**:

  - Live exchange rate updates with 24-hour caching
  - Offline fallback with graceful error handling
  - Modern UI with currency swap functionality
  - **Status**: Fully implemented ✅

- 📝 **Location-Aware Travel Journal**:

  - Create journal entries linked to a **Trip** and tagged with a **Location**
  - Capture thoughts, experiences, and attach photos
  - Optionally link journal entries to related **Expenses**
  - Organize entries with tags and view them chronologically or by location
  - **Status**: Planned for next phase 🚧

- ⚙️ **Centralized Settings**:
  - Manage base currency and other global preferences
  - **Status**: Planned for React Context implementation 🚧

## State Management Architecture

TravelPal uses a **hybrid state management approach**:

### Zustand Stores (Core Data)

- **Trip Store** (`app/stores/tripStore.ts`): Trip CRUD, utility functions, persistence
- **Expense Store** (`app/stores/expenseStore.ts`): Expense management with trip/location linking
- **Journal Store** (planned): Journal entries with photo attachments
- **Location Store** (planned): Geographical location management

### React Context (UI/App State)

- Theme preferences
- Navigation state
- User interface settings
- Global app preferences

### Key Benefits

- **Performance**: Zustand for complex data operations
- **Simplicity**: React Context for simple UI state
- **Persistence**: Automatic AsyncStorage integration
- **Offline Support**: Local-first with sync capabilities

## Tech Stack

**Frontend:**

- React Native (v0.79.2)
- Expo (v53)
- TypeScript
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- Expo Vector Icons
- Expo Blur
- Expo Haptics

**State Management:**

- **Zustand** (v5.0.5) - Core data stores with persistence
- **React Context** - UI/app state management
- **AsyncStorage** - Local data persistence

**Backend & APIs:**

- **Supabase** (v2.49.8) - Database, Authentication, Storage (configured but not yet integrated)
- **Currency API** - Live exchange rates with caching
- **Expo Crypto** - UUID generation for entities

**Development Tools:**

- ESLint (Code linting)
- Prettier (Code formatting)
- Husky (Git hooks)
- lint-staged (Pre-commit linting/formatting)
- TypeScript (v5.3.3)

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- Yarn or npm
- Expo CLI
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

3. Start the development server
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
- `yarn test` - Run tests

## Project Structure

```
TravelPal/
├── app/                  # Main application code using Expo Router
│   ├── _layout.tsx       # Root layout with app-wide navigation setup
│   ├── index.tsx         # Home screen with currency converter
│   ├── (tabs)/           # Tab-based screens (legacy, being phased out)
│   ├── components/       # Reusable UI components
│   │   ├── CurrencyConverter.tsx    # Live currency conversion ✅
│   │   ├── NavigationBar.tsx        # Custom navigation bar ✅
│   │   ├── ExpenseStoreTest.tsx     # Expense store testing ✅
│   │   ├── CountryPicker.tsx        # Country selection ✅
│   │   └── DatePickerField.tsx      # Date input component ✅
│   ├── stores/           # Zustand state management ✅
│   │   ├── tripStore.ts             # Trip management store ✅
│   │   └── expenseStore.ts          # Expense tracking store ✅
│   ├── utils/            # Utility functions ✅
│   │   ├── currency.ts              # Currency conversion with caching ✅
│   │   ├── countryData.ts           # Country and budget data ✅
│   │   └── dateUtils.ts             # Date manipulation utilities ✅
│   ├── types.ts          # TypeScript definitions ✅
│   └── context.tsx       # Legacy React Context (being phased out)
├── assets/               # Static assets
│   └── all_countries.json           # Country data ✅
├── docs/                 # Documentation
│   ├── features.md                  # Feature specifications
│   ├── budget_planning_feature.md   # Budget planning details
│   ├── expense_tracking_feature.md  # Expense tracking specs
│   └── ui_ux_design_principles.md   # Design guidelines
├── .env                  # Environment variables (not committed)
├── .gitignore
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── .husky/               # Git hooks
├── app.config.ts         # Expo configuration
├── package.json
├── tsconfig.json
├── README.md
├── ROADMAP.md
└── NEXT_STEPS.md
```

## Data Model Overview

The core data entities are defined in `app/types.ts`:

- **Location**: Represents a geographical place (name, country, coordinates, timezone)
- **Trip**: Contains overall trip details, linked to a Location destination
- **Expense**: Represents a single expense, linked to a Trip and optionally a Location
- **JournalEntry**: Represents a journal entry, linked to a Trip and optionally a Location

### Current Implementation Status

✅ **Trip Store**: Complete with CRUD operations, utility functions, and persistence
✅ **Expense Store**: Full implementation with trip/location linking
🚧 **Journal Store**: Planned for next development phase
🚧 **Location Store**: Planned for next development phase

## Development Phases

### ✅ Phase 1: Enhanced Data Model & State Management (Complete)

- Introduced Location interface and entity relationships
- Implemented hybrid state management (Zustand + React Context)
- Set up development environment with code quality tools
- Created comprehensive TypeScript definitions

### 🚧 Phase 2: Core Feature Implementation (In Progress)

- **Trip Management**: Zustand store with persistence ✅
- **Expense Tracking**: Full CRUD with trip/location linking ✅
- **Currency Conversion**: Live rates with caching and offline support ✅
- **Journal System**: Planned next
- **Location Management**: Planned next

### 📋 Phase 3: Feature Integration (Planned)

- Cross-feature navigation and views
- Unified dashboards showing related data
- Global search and filtering capabilities
- Floating Plus FAB implementation

### 📋 Phase 4: Enhanced User Experience (Planned)

- Data visualization (charts, maps)
- Offline support enhancement
- Data import/export functionality
- Social/sharing features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Guidelines

- Use TypeScript for all new code
- Follow the hybrid state management pattern (Zustand for data, Context for UI)
- Maintain consistent code style with ESLint and Prettier
- Write tests for new features
- Update documentation as needed
- Use the established project structure

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
