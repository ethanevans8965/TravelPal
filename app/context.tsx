import React, { createContext, useContext, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { AppContextType, Expense, JournalEntry, Trip, Location } from './types';
import { useExpenseStore } from './stores/expenseStore';
import { useTripStore } from './stores/tripStore';
import { useLocationStore } from './stores/locationStore';
import { useUserStore } from './stores/userStore';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Use Zustand stores for expenses, trips, locations, and user settings (with persistence)
  const expenses = useExpenseStore((state) => state.expenses);
  const trips = useTripStore((state) => state.trips);
  const locations = useLocationStore((state) => state.locations);
  const dailyBudget = useUserStore((state) => state.dailyBudget);
  const baseCurrency = useUserStore((state) => state.baseCurrency);

  // Local state for data not yet migrated to stores
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

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
      id: Crypto.randomUUID(),
    };
    setJournalEntries((prev) => [...prev, newEntry]);
  };

  const updateJournalEntry = (entry: JournalEntry) => {
    setJournalEntries((prev) => prev.map((e) => (e.id === entry.id ? entry : e)));
  };

  const deleteJournalEntry = (entryId: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  // Location operations - delegate to LocationStore (all operations are now persisted)
  const addLocation = (location: Omit<Location, 'id'>) => {
    const locationStore = useLocationStore.getState();
    return locationStore.addLocation(location);
  };

  const updateLocation = (location: Location) => {
    const locationStore = useLocationStore.getState();
    locationStore.updateLocation(location);
  };

  // User settings operations - delegate to UserStore (all operations are now persisted)
  const setDailyBudget = (budget: number) => {
    const userStore = useUserStore.getState();
    userStore.setDailyBudget(budget);
  };

  const setBaseCurrency = (currency: string) => {
    const userStore = useUserStore.getState();
    userStore.setBaseCurrency(currency);
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
    const locationStore = useLocationStore.getState();
    return locationStore.getLocationExpenses(locationId);
  };

  const getLocationJournalEntries = (locationId: string) => {
    return journalEntries.filter((j) => j.locationId === locationId);
  };

  const value: AppContextType = {
    // Data from Zustand stores (persistent)
    expenses,
    trips,
    locations,

    // Data from local state (temporary - will be migrated)
    journalEntries,
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
