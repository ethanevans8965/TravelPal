import { CategoryPercentages } from './utils/countryData';

export interface Location {
  id: string;
  name: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timezone: string;
}

export interface Expense {
  id: string;
  tripId?: string; // Optional - for general expenses that aren't linked to a trip
  amount: number;
  category: string;
  description: string;
  date: string;
  currency: string;
  locationId?: string; // Optional link to location
  photos?: string[]; // Receipt photos
  tags?: string[]; // For better categorization
}

export interface JournalEntry {
  id: string;
  tripId: string; // Link to trip
  title: string;
  content: string;
  date: string;
  locationId?: string; // Link to location
  mood?: string;
  photos?: string[];
  expenses?: string[]; // Links to related expenses
  tags?: string[]; // For better organization
}

export interface Trip {
  id: string;
  name: string;
  /** @deprecated Use locationId instead */
  destination?: Location;
  locationId: string;
  startDate?: string;
  endDate?: string;
  budgetMethod: 'total-budget' | 'trip-dates' | 'both' | 'no-budget';
  travelStyle?: 'Budget' | 'Mid-range' | 'Luxury';
  totalBudget?: number;
  dailyBudget?: number;
  emergencyFundPercentage: number;
  pretrip?: number;
  categories: CategoryPercentages;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  participants?: string[]; // For future social features
  notes?: string;
}

export interface AppContextType {
  expenses: Expense[];
  journalEntries: JournalEntry[];
  trips: Trip[];
  locations: Location[];
  dailyBudget: number;
  baseCurrency: string;

  // Trip operations
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (tripId: string) => void;

  // Expense operations
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;

  // Journal operations
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (entryId: string) => void;

  // Location operations
  addLocation: (location: Omit<Location, 'id'>) => void;
  updateLocation: (location: Location) => void;

  // Settings
  setDailyBudget: (budget: number) => void;
  setBaseCurrency: (currency: string) => void;

  // Utility functions
  getTripExpenses: (tripId: string) => Expense[];
  getTripJournalEntries: (tripId: string) => JournalEntry[];
  getLocationExpenses: (locationId: string) => Expense[];
  getLocationJournalEntries: (locationId: string) => JournalEntry[];
}
