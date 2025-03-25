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
│   ├── (tabs)/           # Tab-based screens
│   │   ├── index.tsx     # Budget overview
│   │   └── expenses.tsx  # Expense tracking
│   ├── trip/             # Trip creation flow screens
│   │   ├── _layout.tsx   # Stack navigation for trip creation
│   │   ├── select-method.tsx
│   │   ├── basic-info.tsx
│   │   ├── daily-budget.tsx
│   │   ├── category-allocation.tsx
│   │   └── review.tsx
│   ├── context.tsx       # App-wide state management
│   └── types.ts          # TypeScript definitions
├── assets/               # Images and fonts
├── components/           # Reusable components
├── utils/                # Utility functions
│   └── countryData.ts    # Country-specific budget calculations
└── scripts/              # Helper scripts
```

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