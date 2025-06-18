export const colors = {
  // PRIMARY THEME: Dark Mode
  primary: '#007AFF', // Blue accent - consistent across light/dark
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',

  // DARK MODE THEME (Current Priority)
  dark: {
    background: '#000000', // Pure black for main backgrounds
    surface: '#171717', // Dark surface (modals, cards)
    card: '#262626', // Elevated card backgrounds
    border: '#404040', // Borders and dividers
    overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays

    text: '#FFFFFF', // Primary text
    textSecondary: '#CCCCCC', // Secondary text
    textTertiary: '#666666', // Tertiary text/placeholders

    accent: '#007AFF', // Blue accent for interactive elements
    accentBackground: 'rgba(0, 122, 255, 0.1)', // Light accent background
  },

  // LIGHT MODE THEME (Future Implementation)
  light: {
    background: '#FFFFFF',
    surface: '#F2F2F7',
    card: '#FFFFFF',
    border: '#C6C6C8',
    overlay: 'rgba(0, 0, 0, 0.5)',

    text: '#000000',
    textSecondary: '#8E8E93',
    textTertiary: '#C7C7CC',

    accent: '#007AFF',
    accentBackground: 'rgba(0, 122, 255, 0.1)',
  },

  // Legacy colors (for backward compatibility)
  background: '#000000', // Now defaults to dark
  surface: '#171717',
  card: '#262626',

  text: '#FFFFFF', // Now defaults to dark theme
  textSecondary: '#CCCCCC',
  textTertiary: '#666666',

  border: '#404040',
  separator: '#404040',

  white: '#FFFFFF',
  black: '#000000',

  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// Current active theme (can be switched in future)
export const currentTheme = colors.dark;

// Theme utilities for easy switching
export const getThemeColors = (isDark: boolean = true) => {
  return isDark ? colors.dark : colors.light;
};
