import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Trip, Leg, TripBudget } from '../types';
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
  addLeg: (legData: Omit<Leg, 'id'>, bypassValidation?: boolean) => Leg;
  updateLeg: (leg: Leg) => void;
  deleteLeg: (legId: string) => void;
  getLegsByTrip: (tripId: string) => Leg[];

  // Onboarding operations
  markOnboardingComplete: (tripId: string) => void;

  // Budget operations
  setBudget: (tripId: string, budget: TripBudget) => void;

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

  // Validation methods for data integrity
  validateLegData: (
    legData: Omit<Leg, 'id'> | Leg,
    excludeLegId?: string
  ) => {
    isValid: boolean;
    error?: string;
    type?: string;
    conflictingLeg?: Leg;
  };

  // Helper method to get legs sorted chronologically
  getLegsByTripSorted: (tripId: string) => Leg[];

  // Helper method to detect gaps in trip timeline
  detectTripGaps: (tripId: string) => {
    afterLeg: Leg;
    beforeLeg: Leg;
    days: number;
    gapStart: Date;
    gapEnd: Date;
  }[];
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

      setBudget: (tripId, budget) =>
        set((state) => ({
          trips: state.trips.map((trip) => (trip.id === tripId ? { ...trip, budget } : trip)),
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
      addLeg: (legData: Omit<Leg, 'id'>, bypassValidation?: boolean) => {
        console.log('Store addLeg called with:', { legData, bypassValidation });

        // Validate leg data before adding (unless bypassed)
        if (!bypassValidation) {
          console.log('Running validation...');
          const validation = get().validateLegData(legData);
          if (!validation.isValid) {
            console.log('Validation failed:', validation);
            throw new Error(validation.error || 'Invalid leg data');
          }
          console.log('Validation passed');
        } else {
          console.log('Validation bypassed');
        }

        console.log('Creating new leg...');
        let newId: string;
        try {
          newId = Crypto.randomUUID();
        } catch (cryptoError) {
          console.log('Crypto.randomUUID failed, using fallback:', cryptoError);
          newId = `leg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        const newLeg: Leg = {
          ...legData,
          id: newId,
        };
        console.log('New leg created:', newLeg);

        console.log('Updating store state...');
        set((state) => ({ legs: [...state.legs, newLeg] }));
        console.log('Store state updated');

        return newLeg;
      },

      updateLeg: (updatedLeg) => {
        // Validate updated leg data
        const validation = get().validateLegData(updatedLeg, updatedLeg.id);
        if (!validation.isValid) {
          throw new Error(validation.error || 'Invalid leg data');
        }

        set((state) => ({
          legs: state.legs.map((leg) => (leg.id === updatedLeg.id ? updatedLeg : leg)),
        }));
      },

      deleteLeg: (legId) => {
        set((state) => ({
          legs: state.legs.filter((leg) => leg.id !== legId),
        }));
      },

      getLegsByTrip: (tripId) => {
        return get().legs.filter((leg) => leg.tripId === tripId);
      },

      // Validation methods for data integrity
      validateLegData: (legData: Omit<Leg, 'id'> | Leg, excludeLegId?: string) => {
        const { legs } = get();
        const tripLegs = legs.filter(
          (leg) => leg.tripId === legData.tripId && (excludeLegId ? leg.id !== excludeLegId : true)
        );

        // Check for duplicate country in the same trip
        const duplicateCountry = tripLegs.find(
          (leg) => leg.country.toLowerCase() === legData.country.toLowerCase()
        );

        // Check for date overlaps if dates are provided
        let dateOverlap = null;
        if (legData.startDate && legData.endDate) {
          const newStart = new Date(legData.startDate);
          const newEnd = new Date(legData.endDate);

          dateOverlap = tripLegs.find((leg) => {
            if (!leg.startDate || !leg.endDate) return false;

            const legStart = new Date(leg.startDate);
            const legEnd = new Date(leg.endDate);

            // Check for overlap: newStart < legEnd && newEnd > legStart
            return newStart < legEnd && newEnd > legStart;
          });
        }

        // Return validation result
        if (duplicateCountry) {
          return {
            isValid: false,
            error: `A leg for ${legData.country} already exists in this trip`,
            type: 'duplicate_country',
            conflictingLeg: duplicateCountry,
          };
        }

        if (dateOverlap) {
          return {
            isValid: false,
            error: `Date range overlaps with existing ${dateOverlap.country} leg`,
            type: 'date_overlap',
            conflictingLeg: dateOverlap,
          };
        }

        return { isValid: true };
      },

      // Helper method to get legs sorted chronologically
      getLegsByTripSorted: (tripId: string) => {
        return get()
          .getLegsByTrip(tripId)
          .sort((a, b) => {
            if (!a.startDate || !b.startDate) return 0;
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          });
      },

      // Helper method to detect gaps in trip timeline
      detectTripGaps: (tripId: string) => {
        const sortedLegs = get()
          .getLegsByTripSorted(tripId)
          .filter((leg) => leg.startDate && leg.endDate);

        const gaps = [];
        for (let i = 0; i < sortedLegs.length - 1; i++) {
          const currentLeg = sortedLegs[i];
          const nextLeg = sortedLegs[i + 1];

          const currentEnd = new Date(currentLeg.endDate);
          const nextStart = new Date(nextLeg.startDate);

          // Check if there's a gap (more than 1 day)
          const daysDifference = Math.ceil(
            (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDifference > 1) {
            gaps.push({
              afterLeg: currentLeg,
              beforeLeg: nextLeg,
              days: daysDifference - 1,
              gapStart: new Date(currentEnd.getTime() + 24 * 60 * 60 * 1000), // Day after current leg ends
              gapEnd: new Date(nextStart.getTime() - 24 * 60 * 60 * 1000), // Day before next leg starts
            });
          }
        }

        return gaps;
      },
    }),
    {
      name: 'travelpal-trip-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
