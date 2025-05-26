import React, { createContext, useContext, useState } from 'react';
import * as Crypto from 'expo-crypto';
import { AppContextType, Expense, JournalEntry, Trip, Location } from './types';

const AppContext = createContext<AppContextType | null>(null);

// Sample data for demonstration
const sampleTrips: Trip[] = [
  {
    id: 'trip-1',
    name: 'Paris Adventure',
    locationId: 'location-1',
    destination: {
      id: 'location-1',
      name: 'Paris, France',
      country: 'France',
      timezone: 'Europe/Paris',
    },
    startDate: '2024-10-26',
    endDate: '2024-11-03',
    budgetMethod: 'total-budget',
    travelStyle: 'Mid-range',
    totalBudget: 2000,
    dailyBudget: 250,
    emergencyFundPercentage: 10,
    categories: {
      accommodation: 80,
      food: 60,
      transportation: 40,
      activities: 50,
      shopping: 20,
      other: 10,
    },
    status: 'active',
  },
  {
    id: 'trip-2',
    name: 'Tokyo Explorer',
    locationId: 'location-2',
    destination: {
      id: 'location-2',
      name: 'Tokyo, Japan',
      country: 'Japan',
      timezone: 'Asia/Tokyo',
    },
    startDate: '2024-12-15',
    endDate: '2024-12-22',
    budgetMethod: 'total-budget',
    travelStyle: 'Luxury',
    totalBudget: 3500,
    dailyBudget: 500,
    emergencyFundPercentage: 15,
    categories: {
      accommodation: 150,
      food: 120,
      transportation: 80,
      activities: 100,
      shopping: 50,
      other: 25,
    },
    status: 'planning',
  },
];

const sampleExpenses: Expense[] = [
  {
    id: 'expense-1',
    tripId: 'trip-1',
    amount: 45.0,
    category: 'food',
    description: 'Dinner at Le Bistro',
    date: new Date().toISOString(),
    currency: 'USD',
  },
  {
    id: 'expense-2',
    tripId: 'trip-1',
    amount: 12.5,
    category: 'transportation',
    description: 'Metro Pass',
    date: new Date().toISOString(),
    currency: 'USD',
  },
  {
    id: 'expense-3',
    tripId: 'trip-1',
    amount: 8.75,
    category: 'food',
    description: 'Coffee & Croissant',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    currency: 'USD',
  },
  {
    id: 'expense-4',
    tripId: 'trip-1',
    amount: 120.0,
    category: 'accommodation',
    description: 'Hotel Le Marais - 2 nights',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    currency: 'USD',
  },
  {
    id: 'expense-5',
    tripId: 'trip-1',
    amount: 35.0,
    category: 'activities',
    description: 'Louvre Museum Ticket',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    currency: 'USD',
  },
  {
    id: 'expense-6',
    tripId: 'trip-1',
    amount: 25.0,
    category: 'shopping',
    description: 'Souvenir Postcards',
    date: new Date().toISOString(),
    currency: 'USD',
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [trips, setTrips] = useState<Trip[]>(sampleTrips);
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
    // Also delete associated expenses and journal entries
    setExpenses((prev) => prev.filter((e) => e.tripId !== tripId));
    setJournalEntries((prev) => prev.filter((j) => j.tripId !== tripId));
  };

  // Expense operations
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Crypto.randomUUID(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const updateExpense = (expense: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === expense.id ? expense : e)));
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
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

  // Utility functions
  const getTripExpenses = (tripId: string) => {
    return expenses.filter((e) => e.tripId === tripId);
  };

  const getTripJournalEntries = (tripId: string) => {
    return journalEntries.filter((j) => j.tripId === tripId);
  };

  const getLocationExpenses = (locationId: string) => {
    return expenses.filter((e) => e.locationId === locationId);
  };

  const getLocationJournalEntries = (locationId: string) => {
    return journalEntries.filter((j) => j.locationId === locationId);
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
