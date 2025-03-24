export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  currency?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  location?: string;
  mood?: string;
  photos?: string[];
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelStyle: 'Budget' | 'Mid-range' | 'Luxury';
  totalBudget?: number;
  dailyBudget?: number;
  emergencyFundPercentage: number;
  pretrip?: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  percentage: number;
  icon: string;
  color: string;
}

export interface AppContextType {
  expenses: Expense[];
  journalEntries: JournalEntry[];
  trips: Trip[];
  dailyBudget: number;
  baseCurrency: string;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  setDailyBudget: (budget: number) => void;
  setBaseCurrency: (currency: string) => void;
} 