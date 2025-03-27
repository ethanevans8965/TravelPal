import React, { createContext, useContext, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { AppContextType, Expense, JournalEntry, Trip } from './types';

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [dailyBudget, setDailyBudget] = useState(100); // Default daily budget
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Default currency

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Crypto.randomUUID(),
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Crypto.randomUUID(),
    };
    setJournalEntries(prev => [...prev, newEntry]);
  };

  const addTrip = (trip: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...trip,
      id: Crypto.randomUUID(),
    };
    setTrips(prev => [...prev, newTrip]);
  };

  const value: AppContextType = {
    expenses,
    journalEntries,
    trips,
    dailyBudget,
    baseCurrency,
    addExpense,
    addJournalEntry,
    addTrip,
    setDailyBudget,
    setBaseCurrency,
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