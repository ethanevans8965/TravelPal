import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Expense } from '../types';

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  addExpense: (expenseData: Omit<Expense, 'id'>) => Expense;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
  deleteExpensesByTripId: (tripId: string) => void;
  getExpensesByTripId: (tripId: string) => Expense[];
  getExpensesByLocationId: (locationId: string) => Expense[];
  getGeneralExpenses: () => Expense[];
  getAllExpenses: () => Expense[];
  getRecentExpenses: (limit?: number) => Expense[];
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      isLoading: false,
      error: null,
      addExpense: (expenseData) => {
        const newExpense: Expense = {
          ...expenseData,
          id: Crypto.randomUUID(),
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
        return newExpense;
      },
      updateExpense: (updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === updatedExpense.id ? updatedExpense : expense
          ),
        })),
      deleteExpense: (expenseId) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== expenseId),
        })),
      deleteExpensesByTripId: (tripId) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.tripId !== tripId),
        })),
      getExpensesByTripId: (tripId) => {
        return get().expenses.filter((expense) => expense.tripId === tripId);
      },
      getExpensesByLocationId: (locationId) => {
        return get().expenses.filter((expense) => expense.locationId === locationId);
      },
      getGeneralExpenses: () => {
        return get().expenses.filter((expense) => !expense.tripId);
      },
      getAllExpenses: () => {
        return get().expenses.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      },
      getRecentExpenses: (limit = 5) => {
        return get().getAllExpenses().slice(0, limit);
      },
    }),
    {
      name: 'travelpal-expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
