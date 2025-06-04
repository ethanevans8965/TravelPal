import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { Location } from '../types';
import { useExpenseStore } from './expenseStore';

interface LocationState {
  locations: Location[];
  isLoading: boolean;
  error: string | null;

  // CRUD operations
  addLocation: (locationData: Omit<Location, 'id'>) => Location;
  updateLocation: (location: Location) => void;
  deleteLocation: (locationId: string) => void;

  // Utility functions
  getLocationById: (locationId: string) => Location | undefined;
  getLocationsByCountry: (country: string) => Location[];
  getAllCountries: () => string[];
  searchLocations: (query: string) => Location[];

  // Cross-store utility functions (matching Context API)
  getLocationExpenses: (locationId: string) => any[];
  getLocationJournalEntries: (locationId: string) => any[];

  // Batch operations for coordination with other stores
  deleteExpensesByLocationId: (locationId: string) => void;
  deleteJournalEntriesByLocationId: (locationId: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      locations: [],
      isLoading: false,
      error: null,

      addLocation: (locationData) => {
        const newLocation: Location = {
          ...locationData,
          id: Crypto.randomUUID(),
        };
        set((state) => ({ locations: [...state.locations, newLocation] }));
        return newLocation;
      },

      updateLocation: (updatedLocation) =>
        set((state) => ({
          locations: state.locations.map((location) =>
            location.id === updatedLocation.id ? updatedLocation : location
          ),
        })),

      deleteLocation: (locationId) => {
        // First, delete associated data from other stores
        get().deleteExpensesByLocationId(locationId);
        get().deleteJournalEntriesByLocationId(locationId);

        // Then delete the location itself
        set((state) => ({
          locations: state.locations.filter((location) => location.id !== locationId),
        }));
      },

      getLocationById: (locationId) => {
        return get().locations.find((location) => location.id === locationId);
      },

      getLocationsByCountry: (country) => {
        return get().locations.filter(
          (location) => location.country.toLowerCase() === country.toLowerCase()
        );
      },

      getAllCountries: () => {
        const countries = get().locations.map((location) => location.country);
        return [...new Set(countries)].sort();
      },

      searchLocations: (query) => {
        const searchTerm = query.toLowerCase();
        return get().locations.filter(
          (location) =>
            location.name.toLowerCase().includes(searchTerm) ||
            location.country.toLowerCase().includes(searchTerm)
        );
      },

      // Cross-store utility functions (matching Context API interface)
      getLocationExpenses: (locationId) => {
        const expenseStore = useExpenseStore.getState();
        return expenseStore.getExpensesByLocationId(locationId);
      },

      getLocationJournalEntries: (locationId) => {
        // TODO: Implement when journal store is created
        // For now, return empty array to maintain interface compatibility
        console.log('getLocationJournalEntries called for locationId:', locationId);
        return [];
      },

      // Coordination methods - these will call other stores
      deleteExpensesByLocationId: (locationId) => {
        const expenseStore = useExpenseStore.getState();
        const expensesToDelete = expenseStore.expenses.filter((e) => e.locationId === locationId);
        expensesToDelete.forEach((expense) => expenseStore.deleteExpense(expense.id));
      },

      deleteJournalEntriesByLocationId: (locationId) => {
        // TODO: Implement when journal store is created
        console.log('deleteJournalEntriesByLocationId called for locationId:', locationId);
      },
    }),
    {
      name: 'travelpal-location-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
