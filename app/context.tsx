import React, { createContext, useContext, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { AppContextType, Expense, JournalEntry, Trip, Location } from './types';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [dailyBudget, setDailyBudget] = useState(100); // Default daily budget
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Default currency

  // Trip operations
  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Crypto.randomUUID(),
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const updateTrip = (trip: Trip) => {
    setTrips(prev => prev.map(t => t.id === trip.id ? trip : t));
  };

  const deleteTrip = (tripId: string) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    // Also delete associated expenses and journal entries
    setExpenses(prev => prev.filter(e => e.tripId !== tripId));
    setJournalEntries(prev => prev.filter(j => j.tripId !== tripId));
  };

  // Expense operations
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Crypto.randomUUID(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (expense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  // Journal operations
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Crypto.randomUUID(),
    };
    setJournalEntries(prev => [...prev, newEntry]);
  };

  const updateJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
  };

  const deleteJournalEntry = (entryId: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== entryId));
  };

  // Location operations
  const addLocation = (location: Omit<Location, 'id'>) => {
    const newLocation: Location = {
      ...location,
      id: Crypto.randomUUID(),
    };
    setLocations(prev => [...prev, newLocation]);
  };

  const updateLocation = (location: Location) => {
    setLocations(prev => prev.map(l => l.id === location.id ? location : l));
  };

  // Utility functions
  const getTripExpenses = (tripId: string) => {
    return expenses.filter(e => e.tripId === tripId);
  };

  const getTripJournalEntries = (tripId: string) => {
    return journalEntries.filter(j => j.tripId === tripId);
  };

  const getLocationExpenses = (locationId: string) => {
    return expenses.filter(e => e.locationId === locationId);
  };

  const getLocationJournalEntries = (locationId: string) => {
    return journalEntries.filter(j => j.locationId === locationId);
  };

  const value: AppContextType = {
    expenses,
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