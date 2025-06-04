import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserSettings {
  dailyBudget: number;
  baseCurrency: string;
}

interface UserStore extends UserSettings {
  // Settings operations
  setDailyBudget: (budget: number) => void;
  setBaseCurrency: (currency: string) => void;

  // Utility functions
  resetToDefaults: () => void;
}

const defaultSettings: UserSettings = {
  dailyBudget: 100, // Default daily budget
  baseCurrency: 'USD', // Default currency
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      // Settings operations
      setDailyBudget: (budget: number) => {
        set({ dailyBudget: budget });
      },

      setBaseCurrency: (currency: string) => {
        set({ baseCurrency: currency });
      },

      // Utility functions
      resetToDefaults: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'travelpal-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
