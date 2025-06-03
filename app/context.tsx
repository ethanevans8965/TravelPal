import React, { createContext, useContext, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { AppContextType, Expense, JournalEntry, Trip, Location } from './types';
import { useExpenseStore } from './stores/expenseStore';

const AppContext = createContext<AppContextType | null>(null);

// Sample data for demonstration
// const sampleTrips: Trip[] = [
//   ... (removed)
// ];

// const sampleExpenses: Expense[] = [
//   ... (removed)
// ];

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Use Zustand store for expenses
  const expenses = useExpenseStore((state) => state.expenses);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]); // Start empty
  const [locations, setLocations] = useState<Location[]>([]);
  const [dailyBudget, setDailyBudget] = useState(100); // Default daily budget
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Default currency

  // Trip operations
  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Crypto.randomUUID(),
    };
    setTrips((prev) => [...prev, newTrip]);
  };

  const updateTrip = (trip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === trip.id ? trip : t)));
  };

  const deleteTrip = (tripId: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    // Also delete associated expenses using expense store
    const expenseStore = useExpenseStore.getState();
    expenseStore.deleteExpensesByTripId(tripId);
    // Delete associated journal entries
    setJournalEntries((prev) => prev.filter((j) => j.tripId !== tripId));
  };

  // Expense operations - delegate to Zustand store
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

  // Journal operations
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

  // Location operations
  const addLocation = (location: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...location,
      id: Crypto.randomUUID(),
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const updateLocation = (location: Location) => {
    setLocations((prev) => prev.map((l) => (l.id === location.id ? location : l)));
  };

  // Utility functions - delegate to Zustand store
  const getTripExpenses = (tripId: string) => {
    const expenseStore = useExpenseStore.getState();
    return expenseStore.getExpensesByTripId(tripId);
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
    expenses, // From Zustand store
    journalEntries,
    trips,
    locations,
    dailyBudget,
    baseCurrency,
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
