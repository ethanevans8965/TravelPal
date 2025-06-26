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

// New Smart Auto-Status types
export type TripStatus = 'draft' | 'planning' | 'ready' | 'active' | 'completed' | 'cancelled';

export interface TripStatusConfig {
  color: string;
  icon: string;
  label: string;
}

export interface Leg {
  id: string;
  tripId: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export interface TripBudget {
  currency: string; // e.g. "USD"
  style: 'frugal' | 'balanced' | 'luxury';
  autoSuggested: boolean; // true if never modified by user
  total: number; // sum of all days & categories
  perDay: number; // total / tripLengthDays
  categories: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
    misc: number;
  };
  thresholds: { warn: number; stop: number }; // % of total
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
  status: TripStatus; // Updated to use new status types
  manualStatus?: TripStatus; // Optional manual override
  participants?: string[]; // For future social features
  notes?: string;
  itinerary?: any[]; // For future itinerary items
  /** List of countries visited in this trip */
  countries?: string[];
  /** Trip legs for multi-country trips */
  legs?: Leg[];
  /** Date selection mode: both dates, start only, or flexible */
  dateMode?: 'both' | 'start-only' | 'no-dates';
  completionPercentage?: number; // Cached completion percentage
  onboardingCompleted?: boolean; // Track if user has completed onboarding for this trip
  budget?: TripBudget; // Optional budget configuration
}

export interface AppContextType {
  expenses: Expense[];
  journalEntries: JournalEntry[];
  trips: Trip[];
  locations: Location[];
  dailyBudget: number;
  baseCurrency: string;

  // Trip operations
  addTrip: (trip: Omit<Trip, 'id'>) => Trip;
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

  // Trip status utilities
  calculateTripStatus: (trip: Trip) => TripStatus;
  calculateCompletionPercentage: (trip: Trip) => number;
}
