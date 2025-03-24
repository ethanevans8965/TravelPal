# TravelPal 🌎✈️

TravelPal is a mobile application built with Expo and React Native that helps travelers manage their trip budgets, track expenses, and maintain a travel journal.

## Features

- 📊 Budget Management
  - Set total trip budgets
  - Track daily spending limits
  - Allocate budgets by category
  - Emergency fund planning

- 💰 Expense Tracking
  - Record and categorize expenses
  - Track spending against budget
  - Multiple currency support
  - Pre-trip expense management

- 📝 Travel Journal
  - Create and store travel memories
  - Add locations and dates
  - Track mood and experiences
  - Photo integration (coming soon)

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

## Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Expo Router
- @expo/vector-icons

## Project Structure
TravelPal/
├── app/ # Main application code
│ ├── (tabs)/ # Tab-based screens
│ ├── trip/ # Trip-related screens
│ ├── context.tsx # App-wide state management
│ └── types.ts # TypeScript definitions
├── assets/ # Images and fonts
└── components/ # Reusable components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.