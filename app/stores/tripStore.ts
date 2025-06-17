import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Trip, Leg } from '../types';
import { useExpenseStore } from './expenseStore';

interface TripState {
  trips: Trip[];
  legs: Leg[];
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  addTrip: (tripData: Omit<Trip, 'id'>) => Trip;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (tripId: string) => void;

  // Leg CRUD operations
  addLeg: (legData: Omit<Leg, 'id'>) => Leg;
  updateLeg: (leg: Leg) => void;
  deleteLeg: (legId: string) => void;
  getLegsByTrip: (tripId: string) => Leg[];

  // Onboarding operations
  markOnboardingComplete: (tripId: string) => void;

  // Utility functions
  getTripById: (tripId: string) => Trip | undefined;
  getTripsByStatus: (status: Trip['status']) => Trip[];
  getUpcomingTrips: () => Trip[];
  getCurrentTrips: () => Trip[];
  getPastTrips: () => Trip[];

  // Cross-store utility functions (matching Context API)
  getTripExpenses: (tripId: string) => any[];
  getTripJournalEntries: (tripId: string) => any[];

  // Batch operations for coordination with other stores
  deleteExpensesByTripId: (tripId: string) => void;
  deleteJournalEntriesByTripId: (tripId: string) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [],
      legs: [],
      isLoading: false,
      error: null,

      addTrip: (tripData) => {
        const newTrip: Trip = {
          ...tripData,
          id: Crypto.randomUUID(),
        };

        // Create default leg for the trip
        if (newTrip.startDate && newTrip.endDate) {
          const defaultLeg: Leg = {
            id: Crypto.randomUUID(),
            tripId: newTrip.id,
            country: newTrip.countries?.[0] || 'Unknown',
            startDate: newTrip.startDate,
            endDate: newTrip.endDate,
            budget: newTrip.totalBudget || 0,
          };

          set((state) => ({
            trips: [...state.trips, newTrip],
            legs: [...state.legs, defaultLeg],
          }));
        } else {
          set((state) => ({ trips: [...state.trips, newTrip] }));
        }

        return newTrip;
      },

      updateTrip: (updatedTrip) =>
        set((state) => ({
          trips: state.trips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip)),
        })),

      markOnboardingComplete: (tripId) =>
        set((state) => ({
          trips: state.trips.map((trip) =>
            trip.id === tripId ? { ...trip, onboardingCompleted: true } : trip
          ),
        })),

      deleteTrip: (tripId) => {
        // First, delete associated data from other stores
        get().deleteExpensesByTripId(tripId);
        get().deleteJournalEntriesByTripId(tripId);

        // Delete associated legs
        const legsToDelete = get().legs.filter((leg) => leg.tripId === tripId);
        legsToDelete.forEach((leg) => get().deleteLeg(leg.id));

        // Then delete the trip itself
        set((state) => ({
          trips: state.trips.filter((trip) => trip.id !== tripId),
        }));
      },

      getTripById: (tripId) => {
        return get().trips.find((trip) => trip.id === tripId);
      },

      getTripsByStatus: (status) => {
        return get().trips.filter((trip) => trip.status === status);
      },

      getUpcomingTrips: () => {
        const now = new Date();
        return get()
          .trips.filter((trip) => {
            if (!trip.startDate) return false;
            return new Date(trip.startDate) > now;
          })
          .sort((a, b) => {
            if (!a.startDate || !b.startDate) return 0;
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          });
      },

      getCurrentTrips: () => {
        const now = new Date();
        return get().trips.filter((trip) => {
          if (!trip.startDate || !trip.endDate) return false;
          const start = new Date(trip.startDate);
          const end = new Date(trip.endDate);
          return start <= now && now <= end;
        });
      },

      getPastTrips: () => {
        const now = new Date();
        return get()
          .trips.filter((trip) => {
            if (!trip.endDate) return false;
            return new Date(trip.endDate) < now;
          })
          .sort((a, b) => {
            if (!a.endDate || !b.endDate) return 0;
            return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
          });
      },

      // Cross-store utility functions (matching Context API interface)
      getTripExpenses: (tripId) => {
        const expenseStore = useExpenseStore.getState();
        return expenseStore.getExpensesByTripId(tripId);
      },

      getTripJournalEntries: (tripId) => {
        // TODO: Implement when journal store is created
        // For now, return empty array to maintain interface compatibility
        console.log('getTripJournalEntries called for tripId:', tripId);
        return [];
      },

      // Coordination methods - these will call other stores
      deleteExpensesByTripId: (tripId) => {
        const expenseStore = useExpenseStore.getState();
        const expensesToDelete = expenseStore.expenses.filter((e) => e.tripId === tripId);
        expensesToDelete.forEach((expense) => expenseStore.deleteExpense(expense.id));
      },

      deleteJournalEntriesByTripId: (tripId) => {
        // TODO: Implement when journal store is created
        console.log('deleteJournalEntriesByTripId called for tripId:', tripId);
      },

      // Leg CRUD operations
      addLeg: (legData) => {
        const newLeg: Leg = {
          ...legData,
          id: Crypto.randomUUID(),
        };
        set((state) => ({ legs: [...state.legs, newLeg] }));
        return newLeg;
      },

      updateLeg: (updatedLeg) =>
        set((state) => ({
          legs: state.legs.map((leg) => (leg.id === updatedLeg.id ? updatedLeg : leg)),
        })),

      deleteLeg: (legId) => {
        set((state) => ({
          legs: state.legs.filter((leg) => leg.id !== legId),
        }));
      },

      getLegsByTrip: (tripId) => {
        return get().legs.filter((leg) => leg.tripId === tripId);
      },
    }),
    {
      name: 'travelpal-trip-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
