import { FontAwesome } from '@expo/vector-icons';

// Define the allowed icon names based on actual usage in the app
export type FontAwesomeIconName = 
  // Transaction icons
  | 'rocket'
  | 'home'
  | 'cutlery'
  | 'map-marker'
  // Settings icons
  | 'user-circle'
  | 'bell-o'
  | 'moon-o'
  | 'dollar'
  | 'lock'
  | 'question-circle'
  | 'info-circle'
  | 'sign-out'
  | 'chevron-right'
  | 'refresh'
  // Category icons
  | 'bed'
  | 'car'
  | 'ticket'
  | 'shopping-bag'
  | 'ellipsis-h'
  | 'circle'
  | 'check'
  | 'check-circle';

// Type guard to check if a string is a valid FontAwesome icon name
export function isValidFontAwesomeIcon(name: string): name is FontAwesomeIconName {
  return name in FontAwesome.glyphMap;
} 