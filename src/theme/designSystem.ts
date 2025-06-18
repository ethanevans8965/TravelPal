// 🎨 TravelPal Comprehensive Design System
// Complete styling standards for consistent UI/UX across the entire app

import { Platform } from 'react-native';

// ==========================================
// 🌙 DARK THEME COLORS (Primary)
// ==========================================

export const colors = {
  // Background Hierarchy
  background: '#000000', // Pure black - main screens (OLED optimized)
  surface: '#171717', // Dark surface - modals, cards
  surfaceElevated: '#262626', // Elevated elements - inputs, chips
  surfaceHover: '#333333', // Hover/pressed states

  // Text Hierarchy
  text: '#FFFFFF', // Primary text - high contrast
  textSecondary: '#CCCCCC', // Secondary text - labels, captions
  textTertiary: '#999999', // Tertiary text - placeholders
  textDisabled: '#666666', // Disabled text and elements

  // Interactive Elements
  accent: '#007AFF', // Blue accent - buttons, links, focus
  accentHover: '#0056CC', // Accent hover/pressed state
  accentBackground: 'rgba(0, 122, 255, 0.1)', // Light accent backgrounds
  accentBackgroundHover: 'rgba(0, 122, 255, 0.2)', // Hover accent backgrounds

  // Borders and Dividers
  border: '#404040', // Default borders
  borderLight: '#333333', // Subtle borders
  borderStrong: '#555555', // Emphasized borders
  divider: '#2A2A2A', // Section dividers

  // Status Colors
  success: '#34C759', // Green - success states
  warning: '#FF9500', // Orange - warning states
  error: '#FF3B30', // Red - error states
  info: '#5AC8FA', // Light blue - info states

  // Overlays and Shadows
  overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays
  overlayLight: 'rgba(0, 0, 0, 0.5)', // Light overlays
  shadowColor: '#000000', // Shadow color for depth
};

// ==========================================
// 📏 SPACING SYSTEM
// ==========================================

export const spacing = {
  // Base spacing units (8px grid system)
  xs: 4, // 0.25rem - tight spacing, icon gaps
  sm: 8, // 0.5rem  - small gaps, internal padding
  md: 16, // 1rem    - standard spacing, card padding
  lg: 24, // 1.5rem  - section spacing, large gaps
  xl: 32, // 2rem    - major section breaks
  xxl: 48, // 3rem    - screen-level spacing
  xxxl: 64, // 4rem    - extra large spacing

  // Component-specific spacing
  screen: 24, // Screen edge padding
  card: 16, // Card internal padding
  cardElevated: 20, // Elevated card padding
  modal: 20, // Modal container padding
  section: 24, // Between major sections
  input: 16, // Input field padding
  button: 12, // Button vertical padding
  chip: 8, // Chip internal padding
  list: 16, // List item padding

  // Layout spacing
  headerHeight: 60, // Standard header height
  tabBarHeight: 80, // Tab bar height
  modalHeaderHeight: 60, // Modal header height
  touchTarget: 44, // Minimum touch target size

  // Grid spacing
  gridGutter: 16, // Space between grid items
  gridRowGap: 24, // Space between grid rows
};

// ==========================================
// 🔤 TYPOGRAPHY SYSTEM
// ==========================================

export const typography = {
  // Font weights
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Font sizes
  sizes: {
    xs: 12, // Small text, captions
    sm: 14, // Secondary text, labels
    base: 16, // Body text, inputs
    lg: 18, // Section headers, larger body
    xl: 20, // Modal titles, important headers
    xxl: 24, // Page titles, hero text
    xxxl: 32, // Display text, main headlines
  },

  // Line heights (relative to font size)
  lineHeights: {
    tight: 1.2, // Headlines, titles
    normal: 1.4, // Body text
    relaxed: 1.6, // Long-form content
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.5, // Large headlines
    tight: -0.3, // Section headers
    normal: 0, // Default text
    wide: 0.5, // Buttons, labels
  },

  // Predefined text styles
  styles: {
    // Headlines
    h1: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.text,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 1.2,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 1.3,
      letterSpacing: -0.3,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 1.3,
    },

    // Body text
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.text,
      lineHeight: 1.4,
    },
    bodyMedium: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
      lineHeight: 1.4,
    },
    bodySemibold: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      lineHeight: 1.4,
    },

    // Secondary text
    caption: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.textSecondary,
      lineHeight: 1.4,
    },
    captionMedium: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
      lineHeight: 1.4,
    },

    // Small text
    small: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.textSecondary,
      lineHeight: 1.3,
    },
    smallMedium: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.textSecondary,
      lineHeight: 1.3,
    },

    // Interactive elements
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: 0.5,
    },
    link: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.accent,
    },
    chip: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textSecondary,
    },

    // Placeholders
    placeholder: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.textTertiary,
    },
  },
};

// ==========================================
// 🔄 BORDER RADIUS SYSTEM
// ==========================================

export const borderRadius = {
  none: 0,
  xs: 4, // Small elements, tight radius
  sm: 8, // Inputs, buttons, chips
  md: 12, // Cards, larger buttons
  lg: 16, // Large cards, containers
  xl: 20, // Modal corners, large containers
  xxl: 24, // Extra large radius
  full: 9999, // Fully rounded (pills, chips)

  // Component-specific radius
  input: 8, // Input fields
  button: 12, // Standard buttons
  buttonSmall: 8, // Small buttons
  card: 16, // Cards and containers
  modal: 20, // Modal containers
  chip: 20, // Chip/tag elements (pill shape)
  image: 12, // Image containers
};

// ==========================================
// 🌟 SHADOW & ELEVATION SYSTEM
// ==========================================

export const shadows = {
  // Shadow presets for different elevation levels
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  sm: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  md: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  lg: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  xl: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  // Colored shadows for interactive elements
  accent: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  accentLarge: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
};

// ==========================================
// ⚡ ANIMATION & TIMING SYSTEM
// ==========================================

export const animations = {
  // Duration presets (in milliseconds)
  duration: {
    immediate: 0,
    fast: 150, // Quick interactions, micro-animations
    normal: 200, // Standard transitions
    slow: 300, // Slower, more dramatic transitions
    slower: 500, // Page transitions, complex animations
  },

  // Easing curves
  easing: {
    linear: 'linear',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
    // React Native specific
    spring: 'spring',
    timing: 'timing',
  },

  // Common animation presets
  presets: {
    // Button press animation
    buttonPress: {
      scale: 0.96,
      duration: 150,
    },

    // Card hover animation
    cardHover: {
      scale: 1.02,
      duration: 200,
    },

    // Fade animations
    fadeIn: {
      opacity: [0, 1],
      duration: 300,
    },
    fadeOut: {
      opacity: [1, 0],
      duration: 200,
    },

    // Slide animations
    slideUp: {
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 300,
    },
    slideDown: {
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 300,
    },

    // Modal animations
    modalSlideUp: {
      translateY: ['100%', '0%'],
      duration: 400,
    },
    modalFadeIn: {
      opacity: [0, 1],
      duration: 300,
    },
  },
};

// ==========================================
// 📐 LAYOUT & GRID SYSTEM
// ==========================================

export const layout = {
  // Container max widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Grid system
  grid: {
    columns: 12,
    gutter: spacing.md,
    margin: spacing.lg,
  },

  // Breakpoints (for responsive design)
  breakpoints: {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// ==========================================
// 🎯 COMPONENT SPECIFICATIONS
// ==========================================

export const components = {
  // Button specifications
  button: {
    height: {
      small: 36,
      medium: 44,
      large: 52,
    },
    padding: {
      small: { vertical: 8, horizontal: 16 },
      medium: { vertical: 12, horizontal: 24 },
      large: { vertical: 16, horizontal: 32 },
    },
    borderRadius: {
      small: borderRadius.sm,
      medium: borderRadius.md,
      large: borderRadius.md,
    },
  },

  // Input specifications
  input: {
    height: {
      small: 36,
      medium: 44,
      large: 52,
    },
    padding: {
      horizontal: spacing.md,
      vertical: spacing.md,
    },
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },

  // Card specifications
  card: {
    padding: {
      small: spacing.md,
      medium: spacing.lg,
      large: spacing.xl,
    },
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },

  // Modal specifications
  modal: {
    borderRadius: {
      top: borderRadius.xl,
    },
    padding: spacing.modal,
    maxHeight: '80%',
    headerHeight: 60,
  },

  // Chip specifications
  chip: {
    height: 32,
    padding: {
      horizontal: spacing.md,
      vertical: spacing.sm,
    },
    borderRadius: borderRadius.chip,
    borderWidth: 1,
  },

  // List item specifications
  listItem: {
    height: {
      small: 44,
      medium: 56,
      large: 72,
    },
    padding: {
      horizontal: spacing.md,
      vertical: spacing.md,
    },
  },
};

// ==========================================
// 📱 PLATFORM-SPECIFIC ADJUSTMENTS
// ==========================================

export const platform = {
  // iOS specific values
  ios: {
    statusBarHeight: 44,
    homeIndicatorHeight: 34,
    modalPresentationStyle: 'pageSheet',
    hapticFeedback: {
      light: 'light',
      medium: 'medium',
      heavy: 'heavy',
    },
  },

  // Android specific values
  android: {
    statusBarHeight: 24,
    navigationBarHeight: 48,
    modalPresentationStyle: 'overFullScreen',
    elevation: {
      card: 4,
      modal: 8,
      dropdown: 12,
    },
  },

  // Current platform values
  current: Platform.select({
    ios: {
      modalPresentationStyle: 'pageSheet',
      statusBarHeight: 44,
    },
    android: {
      modalPresentationStyle: 'overFullScreen',
      statusBarHeight: 24,
    },
  }),
};

// ==========================================
// 🚀 DESIGN TOKENS EXPORT
// ==========================================

// Complete design system for easy importing
export const designSystem = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animations,
  layout,
  components,
  platform,
};

// Individual exports for convenience
export {
  colors as Colors,
  spacing as Spacing,
  typography as Typography,
  borderRadius as BorderRadius,
  shadows as Shadows,
  animations as Animations,
  layout as Layout,
  components as Components,
  platform as Platform,
};

// Default export
export default designSystem;
