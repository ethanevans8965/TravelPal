import { colors } from './colors';

const typography = {
  primaryFont: "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  secondaryFont: "'Roboto Mono', 'Courier New', monospace", // For financial figures
  fontSizes: {
    xs: 10,
    small: 12,
    medium: 16,
    large: 20,
    xl: 24,
    xxl: 28,
    xxxl: 32,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    small: 1.5, // unitless line heights
    medium: 1.6,
    large: 1.7,
  },
  letterSpacings: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const borders = {
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 16,
  borderWidthSmall: 1,
  borderWidthMedium: 2,
};

export const theme = {
  colors,
  typography,
  spacing,
  borders,
};

export type AppTheme = typeof theme;
