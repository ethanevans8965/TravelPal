# TravelPal 🌎✈️

TravelPal is a mobile application built with Expo and React Native designed to be your ultimate travel companion. It helps you seamlessly manage trip logistics, track expenses, capture memories in a journal, and keep everything organized in one place. Our goal is to create an integrated experience where all features work together harmoniously.

## Current Status

**Phase 1 Complete**: Enhanced Data Model & State Management
**Phase 2 Complete**: New UI/UX Architecture & Navigation
**Phase 3 In Progress**: Feature Integration & Enhancement

### ✅ Completed Features

- **Modern 3-Tab Navigation**: Redesigned app structure with Home, Trips, and Finances tabs
- **Dashboard Home Screen**: Comprehensive overview with currency converter, trip snapshot, budget overview, recent expenses, and quick actions
- **Trips Management**: Full trip CRUD with detailed views, trip cards, and seamless navigation
- **Finances Hub**: Consolidated financial management with sub-navigation for Budgets, Expenses, and Reports
- **Global FAB**: Unified floating action button for Add Expense, Add Trip, and Add Budget Item
- **Trip Details**: Dynamic routing with comprehensive trip information display
- **Hybrid State Management**: Zustand for core data stores with React Context for UI state
- **Currency Converter**: Live currency conversion with caching and offline support
- **Data Persistence**: AsyncStorage integration with automatic sync

### 🚧 In Development

- **Budget Management**: Enhanced budget planning and tracking features
- **Expense Integration**: Global expense list with filtering and categorization
- **Financial Reports**: Analytics and spending insights
- **Real Data Integration**: Connecting dashboard widgets to live trip and expense data

## Features

TravelPal provides a comprehensive travel management experience through a modern, intuitive interface:

### 🏠 **Dashboard Home**

- **Currency Converter**: Live exchange rates with swap functionality and offline support ✅
- **Trip Snapshot**: Current/upcoming trip overview with dates and status ✅
- **Budget Overview**: Visual progress tracking with spending insights ✅
- **Recent Expenses**: Quick view of latest transactions with categories ✅
- **Quick Actions**: Fast access to Add Expense and Plan New Trip ✅

### 🗺️ **Trips Management**

- **Trip List**: Organized view of all trips with status indicators ✅
- **Trip Creation**: Streamlined workflow via FAB or dedicated button ✅
- **Trip Details**: Comprehensive view with dates, budget, categories, and status ✅
- **Trip Cards**: Interactive cards with destination, dates, and budget info ✅
- **Navigation**: Seamless routing between trip list and detailed views ✅

### 💰 **Finances Hub**

- **Unified Interface**: Consolidated financial management with sub-navigation ✅
- **Budget Planning**: Overall budget management and trip-specific planning 🚧
- **All Expenses**: Global expense list with filtering and categorization 🚧
- **Financial Reports**: Analytics, spending patterns, and budget performance 🚧
- **Multi-Currency**: Handle expenses in different currencies with live conversion ✅

### 🎯 **Global Actions**

- **Floating Action Button**: Universal access to Add Expense, Add Trip, Add Budget Item ✅
- **Cross-Feature Navigation**: Seamless movement between all app sections ✅
- **Contextual Actions**: Smart suggestions based on current trip and location 🚧

### 📝 **Travel Journal** (Planned)

- Location-aware journal entries with photo attachments
- Link entries to trips and expenses for complete travel stories
- Tag-based organization and chronological viewing

### ⚙️ **Settings & Preferences** (Planned)

- Base currency and regional preferences
- Notification settings and data sync options

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
│   ├── _layout.tsx       # Root layout with navigation and FAB setup ✅
│   ├── index.tsx         # Dashboard home screen with widgets ✅
│   ├── trips.tsx         # Trips list with navigation to details ✅
│   ├── finances.tsx      # Finances hub with sub-navigation ✅
│   ├── trip/             # Trip-related screens
│   │   ├── [id].tsx      # Dynamic trip detail screen ✅
│   │   ├── create/       # Trip creation workflow ✅
│   │   └── _layout.tsx   # Trip section layout ✅
│   ├── components/       # Reusable UI components
│   │   ├── CurrencyConverter.tsx    # Live currency conversion ✅
│   │   ├── NavigationBar.tsx        # 3-tab navigation with FAB ✅
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
│   └── context.tsx       # React Context for UI state ✅
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

### ✅ Phase 2: New UI/UX Architecture & Navigation (Complete)

- **Modern 3-Tab Navigation**: Home, Trips, Finances with seamless routing ✅
- **Dashboard Home**: Comprehensive overview with currency converter and widgets ✅
- **Trips Management**: Full CRUD with trip cards and detailed views ✅
- **Finances Hub**: Consolidated interface with sub-navigation structure ✅
- **Global FAB**: Universal floating action button for core actions ✅
- **Trip Details**: Dynamic routing with comprehensive information display ✅

### 🚧 Phase 3: Feature Integration & Enhancement (In Progress)

- **✅ Budget Overview**: Comprehensive budget management with real-time calculations, progress indicators, and trip-specific budget cards
- **✅ Dynamic Dashboard**: Connected dashboard widgets to live trip and expense data with sample data integration
- **🚧 All Expenses Tab**: Global expense list with filtering, search, and management capabilities (Next)
- **📋 Financial Reports**: Analytics and visualizations for spending patterns and budget performance (Planned)
- **📋 Enhanced Expense Management**: Advanced expense editing, bulk operations, and export features (Planned)

### 📋 Phase 4: Advanced Features (Planned)

- **Travel Journal**: Location-aware journal entries with photo attachments
- **Data Visualization**: Charts, maps, and interactive analytics
- **Offline Enhancement**: Improved offline support and data sync
- **Import/Export**: Data portability and backup functionality
- **Social Features**: Trip sharing and collaborative planning

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
