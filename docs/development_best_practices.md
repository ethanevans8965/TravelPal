# 🛠️ TravelPal Development Best Practices

> **Coding standards, patterns, and best practices for maintaining high-quality TravelPal development**

---

## 📋 Table of Contents

1. [Code Organization](#-code-organization)
2. [TypeScript Standards](#-typescript-standards)
3. [Component Development](#-component-development)
4. [State Management](#-state-management)
5. [Styling Guidelines](#-styling-guidelines)
6. [Performance Best Practices](#-performance-best-practices)
7. [Testing Standards](#-testing-standards)
8. [Git Workflow](#-git-workflow)
9. [Error Handling](#-error-handling)
10. [Documentation Requirements](#-documentation-requirements)

---

## 📁 Code Organization

### File Structure Standards

```
app/
├── components/           # Reusable UI components
│   ├── charts/          # Data visualization components
│   ├── reports/         # Reporting components
│   └── forms/           # Form input components
├── stores/              # Zustand state management
├── utils/               # Utility functions and helpers
├── types/               # TypeScript type definitions
├── constants/           # App constants and enums
├── hooks/               # Custom React hooks
└── lib/                 # External library integrations
```

### Naming Conventions

#### **Files and Directories**

```typescript
// ✅ Good: PascalCase for components
MonthlyOverviewWidget.tsx;
SwipeableExpenseCard.tsx;

// ✅ Good: camelCase for utilities
formatCurrency.ts;
validateExpense.ts;

// ✅ Good: kebab-case for screens
expense - details.tsx;
trip - creation.tsx;

// ❌ Bad: Inconsistent naming
monthlywidget.tsx;
Expense_Card.tsx;
```

#### **Variables and Functions**

```typescript
// ✅ Good: Descriptive camelCase
const calculateMonthlyTotal = (expenses: Expense[]) => { ... };
const isExpenseValid = (expense: Expense) => { ... };

// ✅ Good: Boolean prefixes
const isLoading = true;
const hasActiveTrip = false;
const canDeleteExpense = true;

// ❌ Bad: Unclear or abbreviated names
const calc = (exp) => { ... };
const chk = true;
```

---

## 🔷 TypeScript Standards

### Type Definitions

#### **Interface vs Type**

```typescript
// ✅ Good: Use interfaces for object shapes
interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  currency: string;
  tripId?: string;
}

// ✅ Good: Use types for unions and computations
type ExpenseCategory = 'food' | 'transport' | 'accommodation' | 'activities';
type ExpenseWithTrip = Expense & { tripName: string };
```

#### **Generic Types**

```typescript
// ✅ Good: Use meaningful generic names
interface ApiResponse<TData> {
  data: TData;
  success: boolean;
  message?: string;
}

// ✅ Good: Constrain generics when needed
interface Store<TState extends Record<string, any>> {
  state: TState;
  actions: StoreActions<TState>;
}
```

### Strict TypeScript Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## 🧩 Component Development

### Component Structure

```typescript
// ✅ Good: Complete component template
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Types first
interface MonthlyOverviewWidgetProps {
  allExpenses: Expense[];
  generalExpenses: Expense[];
}

// Main component with clear naming
export default function MonthlyOverviewWidget({
  allExpenses,
  generalExpenses
}: MonthlyOverviewWidgetProps) {
  // Hooks at the top
  const [isLoading, setIsLoading] = useState(false);

  // Derived state and calculations
  const monthlyTotals = useMemo(() =>
    calculateMonthlyTotals(allExpenses), [allExpenses]
  );

  // Event handlers
  const handleRefresh = useCallback(() => {
    // Implementation
  }, []);

  // Early returns for loading/error states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Main render
  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
}

// Styles at the bottom
const styles = StyleSheet.create({
  container: {
    // Style definitions
  },
});
```

### Performance Optimizations

#### **Memoization Patterns**

```typescript
// ✅ Good: Memo for expensive calculations
const ExpensiveComponent = React.memo(({ data }: Props) => {
  const processedData = useMemo(() =>
    heavyCalculation(data), [data]
  );

  return <View>{/* Render */}</View>;
});

// ✅ Good: Callback memoization
const ExpenseCard = ({ expense, onEdit, onDelete }: Props) => {
  const handleEdit = useCallback(() =>
    onEdit(expense.id), [expense.id, onEdit]
  );

  const handleDelete = useCallback(() =>
    onDelete(expense.id), [expense.id, onDelete]
  );

  return <View>{/* Render */}</View>;
};
```

#### **Conditional Rendering**

```typescript
// ✅ Good: Early returns for major state changes
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

// ✅ Good: Inline conditionals for simple cases
return (
  <View>
    {showHeader && <Header title="Expenses" />}
    {expenses.map((expense) => (
      <ExpenseCard key={expense.id} expense={expense} />
    ))}
  </View>
);
```

---

## 🗄️ State Management

### Zustand Store Patterns

#### **Store Structure**

```typescript
// ✅ Good: Clear store interface
interface ExpenseStore {
  // State
  expenses: Expense[];
  filters: ExpenseFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  clearError: () => void;
}
```

#### **Action Implementation**

```typescript
// ✅ Good: Immutable updates with validation
const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],

  addExpense: (expense) => {
    // Validation
    if (!expense.amount || expense.amount <= 0) {
      throw new Error('Invalid expense amount');
    }

    // Create new expense with ID
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    // Immutable update
    set((state) => ({
      expenses: [newExpense, ...state.expenses],
    }));

    // Side effects
    persistToStorage(get().expenses);
  },
}));
```

### Context Usage Guidelines

```typescript
// ✅ Good: Focused context for specific domain
interface TripContextType {
  trips: Trip[];
  activeTrip: Trip | null;
  createTrip: (trip: Omit<Trip, 'id'>) => Promise<Trip>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
}

// ✅ Good: Provider with error boundaries
export function TripProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <TripContext.Provider value={tripContextValue}>
        {children}
      </TripContext.Provider>
    </ErrorBoundary>
  );
}
```

---

## 🎨 Styling Guidelines

### Design System Implementation

#### **Color Palette**

```typescript
// ✅ Good: Centralized color system
export const colors = {
  // Primary colors
  primary: '#0EA5E9',
  primaryDark: '#1E293B',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Neutral palette
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const;
```

#### **Typography System**

```typescript
// ✅ Good: Consistent typography scale
export const typography = {
  heading1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
    color: colors.slate[900],
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
    color: colors.slate[900],
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: colors.slate[700],
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: colors.slate[500],
  },
} as const;
```

#### **Spacing System**

```typescript
// ✅ Good: Consistent spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;
```

### StyleSheet Best Practices

```typescript
// ✅ Good: Organized and semantic styles
const styles = StyleSheet.create({
  // Container styles first
  container: {
    flex: 1,
    backgroundColor: colors.slate[50],
  },

  // Layout styles
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  // Component-specific styles
  expenseCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,

    // Shadow styles
    shadowColor: colors.slate[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Text styles using typography system
  title: {
    ...typography.heading2,
    marginBottom: spacing.sm,
  },
});
```

---

## ⚡ Performance Best Practices

### List Optimization

```typescript
// ✅ Good: Optimized FlatList implementation
<FlatList
  data={expenses}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <ExpenseCard expense={item} onEdit={handleEdit} onDelete={handleDelete} />
  )}
  getItemLayout={(data, index) => ({
    length: EXPENSE_CARD_HEIGHT,
    offset: EXPENSE_CARD_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
/>
```

### Image Optimization

```typescript
// ✅ Good: Optimized image loading
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

### Bundle Size Optimization

```typescript
// ✅ Good: Lazy loading for heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <HeavyChart data={chartData} />
    </Suspense>
  );
}

// ✅ Good: Conditional imports
const importHeavyLibrary = async () => {
  if (Platform.OS === 'ios') {
    return await import('./ios-specific-library');
  }
  return await import('./android-specific-library');
};
```

---

## 🧪 Testing Standards

### Component Testing

```typescript
// ✅ Good: Comprehensive component tests
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ExpenseCard } from '../ExpenseCard';

describe('ExpenseCard', () => {
  const mockExpense: Expense = {
    id: '1',
    amount: 50,
    description: 'Coffee',
    category: 'food',
    date: '2024-01-01',
    currency: 'USD',
  };

  it('should display expense information correctly', () => {
    const { getByText } = render(
      <ExpenseCard expense={mockExpense} />
    );

    expect(getByText('Coffee')).toBeTruthy();
    expect(getByText('$50.00')).toBeTruthy();
  });

  it('should handle edit action', async () => {
    const mockOnEdit = jest.fn();
    const { getByTestId } = render(
      <ExpenseCard expense={mockExpense} onEdit={mockOnEdit} />
    );

    fireEvent.press(getByTestId('edit-button'));

    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(mockExpense);
    });
  });
});
```

### Store Testing

```typescript
// ✅ Good: Store testing with proper setup/teardown
import { renderHook, act } from '@testing-library/react-hooks';
import { useExpenseStore } from '../expenseStore';

describe('ExpenseStore', () => {
  beforeEach(() => {
    useExpenseStore.getState().reset(); // Clear store state
  });

  it('should add expense correctly', () => {
    const { result } = renderHook(() => useExpenseStore());

    act(() => {
      result.current.addExpense({
        amount: 50,
        description: 'Test expense',
        category: 'food',
        date: '2024-01-01',
        currency: 'USD',
      });
    });

    expect(result.current.expenses).toHaveLength(1);
    expect(result.current.expenses[0].description).toBe('Test expense');
  });
});
```

---

## 🔄 Git Workflow

### Commit Message Standards

```bash
# ✅ Good: Conventional commit format
feat: add monthly overview widget to home screen
fix: resolve currency converter rate fetching issue
docs: update API documentation for new components
refactor: extract common chart logic to shared hook
test: add unit tests for expense validation
style: update button hover states and animations

# ❌ Bad: Unclear commit messages
update stuff
fix bug
changes
```

### Branch Naming Convention

```bash
# ✅ Good: Descriptive branch names
feature/monthly-overview-widget
bugfix/currency-converter-crash
refactor/expense-store-optimization
hotfix/critical-data-loss-issue

# ❌ Bad: Unclear branch names
new-feature
fix
updates
```

### Pull Request Template

```markdown
## 🎯 Purpose

Brief description of what this PR accomplishes.

## 🧪 Testing

- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] Performance impact assessed

## 📱 Screenshots

Include before/after screenshots for UI changes.

## 🔍 Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Breaking changes documented
```

---

## 🚨 Error Handling

### Error Boundaries

```typescript
// ✅ Good: Comprehensive error boundary
class ExpenseErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to crash reporting service
    logError(error, {
      component: 'ExpenseErrorBoundary',
      errorInfo,
      userId: getCurrentUserId(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}
```

### Async Error Handling

```typescript
// ✅ Good: Proper async error handling
const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get('/expenses');

    if (!response.ok) {
      throw new ApiError(`Failed to fetch expenses: ${response.status}`);
    }

    const data = await response.json();
    return validateExpenseArray(data);
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API-specific errors
      throw error;
    } else if (error instanceof NetworkError) {
      // Handle network errors
      throw new UserFriendlyError('Please check your internet connection');
    } else {
      // Handle unexpected errors
      logError(error, { context: 'fetchExpenses' });
      throw new UserFriendlyError('Something went wrong. Please try again.');
    }
  }
};
```

---

## 📚 Documentation Requirements

### Component Documentation

````typescript
/**
 * MonthlyOverviewWidget displays comprehensive monthly spending analytics
 * with trends, insights, and category breakdowns.
 *
 * @example
 * ```tsx
 * <MonthlyOverviewWidget
 *   allExpenses={expenses}
 *   generalExpenses={generalExpenses}
 * />
 * ```
 */
interface MonthlyOverviewWidgetProps {
  /** All expenses across all trips and general expenses */
  allExpenses: Expense[];
  /** Expenses not associated with any specific trip */
  generalExpenses: Expense[];
}

export default function MonthlyOverviewWidget({
  allExpenses,
  generalExpenses,
}: MonthlyOverviewWidgetProps) {
  // Implementation
}
````

### Function Documentation

````typescript
/**
 * Calculates monthly spending totals and analytics
 *
 * @param expenses - Array of expenses to analyze
 * @returns Object containing monthly totals, averages, and trends
 *
 * @example
 * ```typescript
 * const analytics = calculateMonthlyTotals(expenses);
 * console.log(analytics.thisMonth); // 1250.00
 * ```
 */
const calculateMonthlyTotals = (expenses: Expense[]): MonthlyTotals => {
  // Implementation
};
````

---

## 🎯 Code Review Guidelines

### What to Look For

#### **Code Quality**

- [ ] TypeScript types are accurate and comprehensive
- [ ] Functions are pure when possible
- [ ] No unused imports or variables
- [ ] Consistent naming conventions
- [ ] Proper error handling

#### **Performance**

- [ ] Unnecessary re-renders avoided
- [ ] Heavy computations memoized
- [ ] Lists properly optimized
- [ ] Images optimized and cached

#### **Accessibility**

- [ ] Screen reader support implemented
- [ ] Touch targets are appropriate size
- [ ] Color contrast meets standards
- [ ] Dynamic Type support added

#### **Testing**

- [ ] Critical paths have tests
- [ ] Edge cases covered
- [ ] Mock data is realistic
- [ ] Tests are maintainable

---

## 🚀 Deployment Checklist

### Pre-Release

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Accessibility audit completed
- [ ] Documentation updated
- [ ] Breaking changes documented
- [ ] Version number bumped
- [ ] Changelog updated

### Post-Release

- [ ] Monitor crash reports
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Plan next iteration
- [ ] Update project documentation

---

**Following these best practices ensures TravelPal maintains high code quality, performance, and maintainability as it grows!** 🚀✨
