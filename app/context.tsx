import React, { createContext, useContext, useState } from 'react';
import { AppContextType, Expense, JournalEntry, Trip, Location } from './types';
import { useExpenseStore } from './stores/expenseStore';
import { useTripStore } from './stores/tripStore';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Use Zustand stores for expenses and trips (with persistence)
  const expenses = useExpenseStore((state) => state.expenses);
  const trips = useTripStore((state) => state.trips);

  // Local state for data not yet migrated to stores
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [dailyBudget, setDailyBudget] = useState(100); // Default daily budget
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Default currency

  // Trip operations - delegate to TripStore (all operations are now persisted)
  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const tripStore = useTripStore.getState();
    return tripStore.addTrip(trip);
  };

  const updateTrip = (trip: Trip) => {
    const tripStore = useTripStore.getState();
    tripStore.updateTrip(trip);
  };

  const deleteTrip = (tripId: string) => {
    const tripStore = useTripStore.getState();
    tripStore.deleteTrip(tripId);
    // Note: TripStore handles expense cleanup internally, but we still need to clean up journal entries
    setJournalEntries((prev) => prev.filter((j) => j.tripId !== tripId));
  };

  // Expense operations - delegate to ExpenseStore (all operations are persisted)
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const expenseStore = useExpenseStore.getState();
    return expenseStore.addExpense(expense);
  };

  const updateExpense = (expense: Expense) => {
    const expenseStore = useExpenseStore.getState();
    expenseStore.updateExpense(expense);
  };

  const deleteExpense = (expenseId: string) => {
    const expenseStore = useExpenseStore.getState();
    expenseStore.deleteExpense(expenseId);
  };

  // Journal operations (local state - will be migrated to JournalStore in Phase 3)
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setJournalEntries((prev) => [...prev, newEntry]);
  };

  const updateJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));
  };

  const deleteJournalEntry = (entryId: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  // Location operations (local state - will be migrated to LocationStore in Phase 2)
  const addLocation = (location: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...location,
      id: crypto.randomUUID(),
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const updateLocation = (location: Location) => {
    setLocations((prev) => prev.map((l) => (l.id === location.id ? location : l)));
  };

  // Cross-domain utility functions
  const getTripExpenses = (tripId: string) => {
    const tripStore = useTripStore.getState();
    return tripStore.getTripExpenses(tripId);
  };

  const getTripJournalEntries = (tripId: string) => {
    return journalEntries.filter((j) => j.tripId === tripId);
  };

  const getLocationExpenses = (locationId: string) => {
    const expenseStore = useExpenseStore.getState();
    return expenseStore.getExpensesByLocationId(locationId);
  };

  const getLocationJournalEntries = (locationId: string) => {
    return journalEntries.filter((j) => j.locationId === locationId);
  };

  const value: AppContextType = {
    // Data from Zustand stores (persistent)
    expenses,
    trips,

    // Data from local state (temporary - will be migrated)
    journalEntries,
    locations,
    dailyBudget,
    baseCurrency,

    // Operations (delegated to appropriate stores)
    addTrip,
    updateTrip,
    deleteTrip,
    addExpense,
    updateExpense,
    deleteExpense,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addLocation,
    updateLocation,
    setDailyBudget,
    setBaseCurrency,

    // Cross-domain utilities
    getTripExpenses,
    getTripJournalEntries,
    getLocationExpenses,
    getLocationJournalEntries,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
