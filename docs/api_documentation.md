# 📚 TravelPal API Documentation

> **Comprehensive API reference for TravelPal components, stores, and utilities**

---

## 🧩 Components API Reference

### Core UI Components

#### `MonthlyOverviewWidget`

**Purpose**: Displays comprehensive monthly spending analytics with trends and insights.

**Props Interface**:

```typescript
interface MonthlyOverviewWidgetProps {
  allExpenses: Expense[];
  generalExpenses: Expense[];
}
```

**Features**:

- Monthly spending totals with previous month comparison
- Daily average calculations and projections
- Top spending categories with percentages
- Progress bars for budget tracking
- Trend indicators with color-coded badges

**Usage**:

```tsx
<MonthlyOverviewWidget allExpenses={getAllExpenses()} generalExpenses={getGeneralExpenses()} />
```

---

#### `SwipeableExpenseCard`

**Purpose**: Interactive expense card with swipe gestures for edit/delete actions.

**Props Interface**:

```typescript
interface SwipeableExpenseCardProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  tripName?: string;
  showTrip?: boolean;
}
```

**Features**:

- Smooth pan gestures with visual feedback
- Edit/delete actions with confirmation dialogs
- Category icons with emoji mapping
- Trip context display
- Animated state transitions

**Usage**:

```tsx
<SwipeableExpenseCard
  expense={expense}
  onEdit={handleEdit}
  onDelete={handleDelete}
  tripName={getTripName(expense.tripId)}
  showTrip={true}
/>
```

---

#### `CurrencyConverter`

**Purpose**: Real-time currency conversion with live exchange rates.

**Props Interface**:

```typescript
interface CurrencyConverterProps {
  // No required props - fully self-contained
}
```

**Features**:

- Live exchange rates from reliable API
- Automatic currency detection
- Swap functionality between currencies
- Recent conversions history
- Error handling for network issues

**Usage**:

```tsx
<CurrencyConverter />
```

---

#### `ScreenHeader`

**Purpose**: Consistent header component with navigation and actions.

**Props Interface**:

```typescript
interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightAction?: () => void;
  rightActionIcon?: string;
  showBack?: boolean;
}
```

**Features**:

- Consistent styling across screens
- Optional back navigation
- Configurable right actions
- Subtitle support for context
- Icon integration with FontAwesome

**Usage**:

```tsx
<ScreenHeader
  title="Expenses"
  subtitle="Manage your travel costs"
  rightAction={handleAdd}
  rightActionIcon="plus"
  showBack={true}
/>
```

---

### Form Components

#### `AmountInput`

**Purpose**: Specialized input for monetary amounts with validation.

**Props Interface**:

```typescript
interface AmountInputProps {
  value: string;
  onChangeText: (text: string) => void;
  currency?: string;
  placeholder?: string;
}
```

**Features**:

- Numeric keyboard on mobile
- Currency symbol display
- Input validation and formatting
- Placeholder text support
- Error state handling

---

#### `DateSelector`

**Purpose**: Enhanced date picker with preset options and validation.

**Props Interface**:

```typescript
interface DateSelectorProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  presets?: DatePreset[];
}
```

**Features**:

- Quick preset selections (Today, Yesterday, etc.)
- Date range validation
- Platform-specific date picker integration
- Custom preset support
- Accessibility enhancements

---

#### `CountryPicker`

**Purpose**: Country selection with search and flag display.

**Props Interface**:

```typescript
interface CountryPickerProps {
  value?: Country;
  onSelect: (country: Country) => void;
  searchable?: boolean;
  showFlags?: boolean;
}
```

**Features**:

- Full country database integration
- Search functionality with fuzzy matching
- Flag emoji display
- Keyboard navigation support
- Localized country names

---

## 🗄️ Store API Reference

### ExpenseStore (Zustand)

**Purpose**: Global state management for expenses with persistence.

#### **State Interface**:

```typescript
interface ExpenseStore {
  expenses: Expense[];
  filters: ExpenseFilters;
  selectedExpenses: string[];
  isMultiSelectMode: boolean;
}
```

#### **Actions**:

##### `addExpense(expense: Omit<Expense, 'id'>): void`

- Adds new expense with auto-generated ID
- Validates expense data
- Persists to AsyncStorage
- Updates relevant trip budgets

##### `updateExpense(id: string, updates: Partial<Expense>): void`

- Updates existing expense by ID
- Merges with existing data
- Triggers re-renders and persistence
- Validates updated data

##### `deleteExpense(id: string): void`

- Removes expense from store
- Updates trip budget calculations
- Handles cascading updates
- Persists changes immediately

##### `getAllExpenses(): Expense[]`

- Returns all expenses sorted by date (newest first)
- Includes computed properties
- Cached for performance

##### `getExpensesByTripId(tripId: string): Expense[]`

- Filters expenses by specific trip
- Returns sorted array
- Useful for trip-specific views

##### `getRecentExpenses(limit: number): Expense[]`

- Returns most recent expenses
- Configurable limit
- Optimized for home screen display

##### `getFilteredExpenses(): Expense[]`

- Applies current filter state
- Returns paginated results
- Handles complex filter combinations

##### `searchExpenses(query: string): Expense[]`

- Full-text search across descriptions, categories
- Case-insensitive matching
- Returns relevance-sorted results

---

### TripStore (Zustand)

**Purpose**: Global state management for trips with persistence.

#### **Current Usage**:

- **Primary Interface**: Used through Context API (`useAppContext()`)
- **Direct Access**: Available via `useTripStore()` for advanced use cases
- **Persistence**: Automatically persists to AsyncStorage with key `'travelpal-trip-storage'`

#### **State Interface**:

```typescript
interface TripState {
  trips: Trip[];
  isLoading: boolean;
  error: string | null;
}
```

#### **Actions**:

##### `addTrip(trip: Omit<Trip, 'id'>): Trip`

- Creates new trip with auto-generated ID
- Validates trip data
- Persists to AsyncStorage immediately
- Returns the created trip object
- **Access**: Via Context API `addTrip()` or direct store access

##### `updateTrip(trip: Trip): void`

- Updates existing trip by ID
- Merges with existing data
- Triggers re-renders and persistence
- Validates updated data
- **Access**: Via Context API `updateTrip()` or direct store access

##### `deleteTrip(tripId: string): void`

- Removes trip from store
- Automatically deletes associated expenses via ExpenseStore
- Handles cascading updates
- Persists changes immediately
- **Access**: Via Context API `deleteTrip()` or direct store access

##### `getTripById(tripId: string): Trip | undefined`

- Returns specific trip by ID
- Cached for performance
- **Access**: Direct store access only

##### `getTripsByStatus(status: Trip['status']): Trip[]`

- Filters trips by status (planning, active, completed, cancelled)
- Returns sorted array
- **Access**: Direct store access only

##### `getUpcomingTrips(): Trip[]`

- Returns trips with start date in the future
- Sorted by start date (earliest first)
- **Access**: Direct store access only

##### `getCurrentTrips(): Trip[]`

- Returns trips that are currently active (between start and end dates)
- **Access**: Direct store access only

##### `getPastTrips(): Trip[]`

- Returns completed trips (end date in the past)
- Sorted by end date (most recent first)
- **Access**: Direct store access only

##### `getTripExpenses(tripId: string): Expense[]`

- Returns all expenses for a specific trip
- Delegates to ExpenseStore for data consistency
- **Access**: Via Context API `getTripExpenses()` or direct store access

##### `getTripJournalEntries(tripId: string): JournalEntry[]`

- Returns all journal entries for a specific trip
- Currently returns empty array (pending JournalStore implementation)
- **Access**: Via Context API `getTripJournalEntries()` or direct store access

---

### TripStore (Context) - **DEPRECATED PATTERN**

**Purpose**: Trip management with comprehensive CRUD operations.

**⚠️ Important**: As of the latest update, the Context API now delegates all trip operations to the TripStore (Zustand) above. This provides persistence while maintaining the same interface for components.

#### **Migration Notes**:

- All trip data is now persisted via TripStore
- Context API methods remain unchanged for backward compatibility
- Components using `useAppContext()` automatically get persistence
- No component changes required for the migration

## 🛠️ Utility Functions

### Date Utilities

#### `formatDate(date: string | Date): string`

- Formats dates for display
- Handles relative dates (Today, Yesterday)
- Localization support

#### `getDateRange(preset: DatePreset): { start: Date; end: Date }`

- Calculates date ranges for filters
- Supports presets like "This Week", "Last Month"
- Timezone aware

### Currency Utilities

#### `formatCurrency(amount: number, currency: string): string`

- Formats monetary amounts with proper symbols
- Handles decimal places by currency
- Localization support

#### `convertCurrency(amount: number, from: string, to: string): Promise<number>`

- Real-time currency conversion
- Caches exchange rates
- Error handling for network issues

### Category Utilities

#### `getCategoryEmoji(category: string): string`

- Maps expense categories to emoji icons
- Fallback for unknown categories
- Consistent visual representation

#### `getCategoryColor(category: string): string`

- Maps categories to brand colors
- Used for charts and indicators
- Accessibility-compliant contrast

---

## 🎯 Navigation API

### Route Structure

```typescript
// App Router file-based routing
app/
├── index.tsx                 // Home dashboard
├── finances.tsx             // Expense management
├── trips.tsx               // Trip overview
├── expenses/
│   └── add/
│       ├── association-choice.tsx
│       ├── expense-details.tsx
│       └── success.tsx
└── trip/
    ├── [id].tsx            // Dynamic trip details
    └── create/             // Trip creation flow
```

### Navigation Hooks

#### `useRouter()`

- Expo Router navigation hook
- Type-safe navigation
- Supports parameters and query strings

#### `useLocalSearchParams()`

- Access URL parameters
- Type-safe parameter extraction
- Useful for dynamic routes

---

## 🔧 Configuration

### Environment Variables

```typescript
// Required for currency conversion
EXCHANGE_RATE_API_KEY = your_api_key_here;

// Optional analytics
ANALYTICS_ENABLED = true;
```

### App Configuration

```typescript
// app.config.ts
export default {
  expo: {
    name: 'TravelPal',
    slug: 'travelpal',
    version: '3.0.0',
    platforms: ['ios', 'android'],
    // ... additional config
  },
};
```

---

## 🧪 Testing APIs

### Component Testing

```typescript
// Example component test
import { render, fireEvent } from '@testing-library/react-native';
import { SwipeableExpenseCard } from '../components/SwipeableExpenseCard';

describe('SwipeableExpenseCard', () => {
  it('should handle swipe gestures', () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { getByTestId } = render(
      <SwipeableExpenseCard
        expense={mockExpense}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Test swipe interactions
    fireEvent.press(getByTestId('edit-button'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockExpense);
  });
});
```

### Store Testing

```typescript
// Example store test
import { useExpenseStore } from '../stores/expenseStore';

describe('ExpenseStore', () => {
  it('should add expense correctly', () => {
    const store = useExpenseStore.getState();
    const newExpense = {
      amount: 50,
      description: 'Test expense',
      category: 'food',
      date: new Date().toISOString(),
      currency: 'USD',
    };

    store.addExpense(newExpense);
    const expenses = store.getAllExpenses();

    expect(expenses).toHaveLength(1);
    expect(expenses[0].description).toBe('Test expense');
  });
});
```

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **Memoization**: Use `React.memo` for expensive components
2. **Virtualization**: Implement for large expense lists
3. **Lazy Loading**: Load charts and heavy components on demand
4. **Image Optimization**: Compress and cache images
5. **Bundle Splitting**: Code splitting for better startup time

### Memory Management

1. **Store Cleanup**: Remove unused expenses and trips
2. **AsyncStorage**: Regular cleanup of old data
3. **Event Listeners**: Proper cleanup in useEffect
4. **Image Caching**: Implement cache size limits

---

## 🔒 Security Considerations

### Data Protection

1. **Local Storage Encryption**: Encrypt sensitive data in AsyncStorage
2. **API Security**: Use HTTPS for all external requests
3. **Input Validation**: Sanitize all user inputs
4. **Error Handling**: Don't expose sensitive information in errors

### Privacy

1. **Data Minimization**: Only collect necessary data
2. **Local-First**: Keep financial data on device
3. **Consent Management**: Clear privacy policy and permissions
4. **Data Export**: Allow users to export their data

---

## 📱 Platform-Specific APIs

### iOS-Specific Features

```typescript
// Haptic feedback
import * as Haptics from 'expo-haptics';

const triggerHaptic = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};
```

### Android-Specific Features

```typescript
// Status bar configuration
import { StatusBar } from 'expo-status-bar';

<StatusBar style="auto" backgroundColor="#1E293B" />
```

---

## 🎨 Theming API

### Color System

```typescript
const colors = {
  // Primary palette
  primary: '#0EA5E9',
  primaryDark: '#1E293B',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Neutral palette
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate500: '#64748B',
  slate900: '#1E293B',
};
```

### Typography System

```typescript
const typography = {
  heading1: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.slate900,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.slate700,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.slate500,
  },
};
```

---

#### `NavigationBar`

**Purpose**: Enhanced navigation component with modern styling, animations, and haptic feedback.

**Props Interface**:

```typescript
interface NavigationBarProps {
  showFAB?: boolean;
  fabAction?: () => void;
  fabIcon?: string;
  onNewTripPress?: () => void;
  onLogExpensePress?: () => void;
  onNewMemoryPress?: () => void;
}
```

**Features**:

- Modern tab bar with color-coded active indicators
- Smooth sliding indicator that follows active tab
- Haptic feedback for touch interactions (iOS)
- Floating action button with expandable menu
- Gradient designs and staggered animations
- Automatic route detection and highlighting

**Usage**:

```tsx
<NavigationBar showFAB={true} onNewTripPress={handleNewTrip} onLogExpensePress={handleLogExpense} />
```

---

#### `PageTransition`

**Purpose**: Smooth page transitions with multiple animation types and loading states.

**Props Interface**:

```typescript
interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale' | 'slideUp';
  duration?: number;
  delay?: number;
  style?: any;
}
```

**Features**:

- Multiple transition types (fade, slide, scale, slideUp)
- Configurable duration and delay
- Smooth bezier curve animations
- Native driver optimization for 60fps performance
- Automatic cleanup on unmount

**Usage**:

```tsx
<PageTransition transitionType="slideUp" duration={600}>
  <YourComponent />
</PageTransition>
```

---

#### `StaggeredTransition`

**Purpose**: Staggered animations for list items and multiple components.

**Props Interface**:

```typescript
interface StaggeredTransitionProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  transitionType?: 'fade' | 'slide' | 'slideUp';
  style?: any;
}
```

**Features**:

- Automatic staggering of child component animations
- Configurable delay between items
- Supports all PageTransition animation types
- Perfect for list items and card grids

**Usage**:

```tsx
<StaggeredTransition staggerDelay={150} transitionType="slideUp">
  <Card1 />
  <Card2 />
  <Card3 />
</StaggeredTransition>
```

---

### Loading Components

#### `Skeleton`

**Purpose**: Loading placeholder with pulse animation.

**Props Interface**:

```typescript
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}
```

**Features**:

- Smooth pulse animation
- Customizable dimensions and border radius
- Matches app color scheme
- Native driver optimization

---

#### `ExpenseCardSkeleton`

**Purpose**: Loading placeholder specifically for expense cards.

**Features**:

- Matches expense card layout exactly
- Icon, text, and amount placeholders
- Consistent spacing and sizing
- Automatic pulse animation

**Usage**:

```tsx
{
  isLoading ? (
    <ExpenseListSkeleton itemCount={5} />
  ) : (
    expenses.map((expense) => <ExpenseCard key={expense.id} expense={expense} />)
  );
}
```

---

#### `WidgetSkeleton`

**Purpose**: Loading placeholder for home screen widgets.

**Features**:

- Widget-specific layout
- Header and content sections
- Stats grid placeholders
- Progress bar placeholders

---

This API documentation will be updated as new features are added and existing APIs evolve. For the most current information, refer to the TypeScript definitions in the source code.

### AppContext (Delegation Layer)

**Purpose**: Provides a unified interface for all app data while delegating to appropriate stores.

**⚠️ Migration Status**:

- ✅ **Trips**: Fully migrated to TripStore (persistent)
- ✅ **Expenses**: Fully migrated to ExpenseStore (persistent)
- 🔄 **Locations**: Phase 2 - Planned for LocationStore migration
- 📋 **Journals**: Phase 3 - Planned for JournalStore migration
- ⚙️ **Settings**: Phase 4 - Planned for UserStore migration

#### **Current Architecture**:

```typescript
interface AppContextType {
  // Persistent data (from Zustand stores)
  trips: Trip[]; // ← TripStore
  expenses: Expense[]; // ← ExpenseStore

  // Temporary local state (will be migrated)
  journalEntries: JournalEntry[]; // → JournalStore
  locations: Location[]; // → LocationStore
  dailyBudget: number; // → UserStore
  baseCurrency: string; // → UserStore
}
```

#### **Usage Patterns**:

##### **For Components**:

```typescript
const { trips, addTrip, expenses, addExpense } = useAppContext();
```

##### **For Advanced Use Cases**:

```typescript
// Direct store access for performance-critical operations
const trips = useTripStore((state) => state.trips);
const getUpcomingTrips = useTripStore((state) => state.getUpcomingTrips);
```

#### **Benefits of Current Design**:

- **Backward Compatibility**: Existing components work unchanged
- **Gradual Migration**: Migrate one domain at a time
- **Performance**: Can opt into direct store access when needed
- **Consistency**: Single import for all app data
