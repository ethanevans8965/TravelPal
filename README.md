# TravelPal 🌎✈️

TravelPal is a mobile application built with Expo and React Native that helps travelers manage their trip budgets, track expenses, and maintain a travel journal. The app provides a seamless experience for planning trips, managing budgets, and documenting travel memories.

## Features

- 📊 Trip Planning
  - Create new trips with destination and travel style
  - Set trip duration and number of travelers
  - Choose between total budget or daily budget planning
  - Country-specific budget recommendations

- 📊 Budget Management
  - Set total trip budgets
  - Configure daily spending limits
  - Interactive category budget allocation
  - Emergency fund planning (5-25% of budget)
  - Pre-trip expense tracking

- 💰 Expense Tracking
  - Record and categorize expenses
  - Track spending against budget
  - Multiple currency support
  - Pre-trip expense management
  - Visual expense breakdown by category

- 📝 Travel Journal
  - Create and store travel memories
  - Add locations and dates
  - Track mood and experiences
  - Photo integration (coming soon)

## Tech Stack

- React Native (v0.76.7)
- Expo (v52)
- TypeScript
- React Navigation
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- Expo Vector Icons
- Expo Blur
- Expo Haptics
- React Native WebView

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
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
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

### Running the App

You can run the app in several ways:
- Press 'i' for iOS simulator
- Press 'a' for Android emulator
- Scan the QR code with Expo Go on your device

### Available Scripts

Development:
- `npx expo start` - Start the Expo development server
- `npx expo start --android` - Start on Android
- `npx expo start --ios` - Start on iOS
- `npx expo start --web` - Start in web browser

Package Management:
- `npm install` - Install dependencies
- `npm run test` - Run tests
- `npm run lint` - Run linting
- `npm run reset-project` - Reset the project

## Project Structure

```
TravelPal/
├── app/                  # Main application code using Expo Router
│   ├── _layout.tsx       # Root layout with app-wide navigation setup
│   ├── (tabs)/           # Tab-based screens
│   │   ├── _layout.tsx   # Tab navigation configuration
│   │   ├── index.tsx     # Budget overview with trip list and creation
│   │   ├── expenses.tsx  # Expense tracking with transaction history
│   │   └── settings.tsx  # App settings and preferences
│   ├── trip/             # Trip creation flow screens
│   │   ├── _layout.tsx   # Stack navigation for trip creation flow
│   │   ├── select-method.tsx    # Choose between total or daily budget planning
│   │   ├── basic-info.tsx       # Enter destination, dates, and travel style
│   │   ├── daily-budget.tsx     # Configure daily spending and travelers
│   │   ├── total-budget.tsx     # Set total trip budget and emergency fund
│   │   ├── category-allocation.tsx  # Allocate budget across categories
│   │   └── review.tsx           # Final trip review and confirmation
│   ├── components/       # Reusable components
│   │   ├── DatePickerField.tsx  # Custom date picker with validation
│   │   ├── CountryPicker.tsx    # Country selection with search
│   │   └── RecommendedSlider.tsx # Custom slider with recommended value indicator
│   ├── utils/            # Utility functions
│   │   ├── countryData.ts # Country-specific budget calculations
│   │   └── dateUtils.ts   # Date formatting and calculation utilities
│   ├── context.tsx       # App-wide state management
│   └── types.ts          # TypeScript definitions
├── assets/               # Static assets
│   ├── data/             # JSON and other data files
│   │   └── all_countries.json  # Country information database
│   ├── images/           # Image assets
│   └── fonts/            # Custom fonts
└── scripts/              # Helper scripts
```

## Trip Creation Flow

The app features a step-by-step trip creation process:

1. **Select Method** (`select-method.tsx`)
   - Choose between total budget or daily budget planning
   - Visual cards with icons for each method
   - Clear descriptions of when to use each approach
   - Smooth navigation to next step

2. **Basic Info** (`basic-info.tsx`)
   - Enter trip destination and country with search
   - Date range selection with validation
   - Travel style selection (Budget, Mid-range, Luxury)
   - Country-specific recommendations
   - Form validation before proceeding

3. **Budget Setup**
   - **Daily Budget** (`daily-budget.tsx`)
     - Set number of travelers
     - Configure daily spending limits
     - Emergency fund planning (5-25%)
     - Pre-trip expense tracking
     - Real-time budget calculations
   
   - **Total Budget** (`total-budget.tsx`)
     - Set overall trip budget
     - Configure emergency fund percentage
     - Track pre-trip expenses
     - Calculate daily spending limits

4. **Category Allocation** (`category-allocation.tsx`)
   - Interactive budget distribution
   - Default allocations based on travel style
   - Real-time percentage adjustments
   - Category-specific recommendations
   - Visual feedback on allocation changes
   - Automatic rebalancing of other categories

5. **Review** (`review.tsx`)
   - Comprehensive trip summary
   - Detailed budget breakdown
   - Emergency fund calculations
   - Category allocation overview
   - Final confirmation with data persistence

## Tab Navigation

1. **Budget Overview** (`index.tsx`)
   - List of all trips
   - Quick access to trip creation
   - Budget status indicators
   - Placeholder trips for new users

2. **Expenses** (`expenses.tsx`)
   - Transaction history
   - Category-based expense tracking
   - Visual expense breakdown
   - Sample transactions for new users

3. **Settings** (`settings.tsx`)
   - App preferences
   - Currency settings
   - User preferences
   - App configuration

## Code Organization

### Component Refactoring
The app has been refactored to follow best practices:
- Reusable components are extracted to the `components/` directory
- Complex UI elements like `RecommendedSlider` are modularized
- Common utilities like date formatting are centralized in utility files

### Utilities
- `dateUtils.ts`: Contains centralized date formatting and calculation functions
- `countryData.ts`: Processes country data and provides budget recommendations

### Static Assets
- All static data is organized in the `assets/data/` directory
- Images and fonts are properly categorized in respective directories

## State Management

TravelPal uses React Context for state management, providing:
- Trip management
- Expense tracking
- Journal entries
- User preferences
- Currency settings

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