import { Trip, TripStatus, TripStatusConfig } from '../types';

// Status configuration with colors and icons
export const statusConfig: Record<TripStatus, TripStatusConfig> = {
  draft: {
    color: '#9CA3AF',
    icon: 'edit',
    label: 'Draft',
  },
  planning: {
    color: '#3B82F6',
    icon: 'calendar',
    label: 'Planning',
  },
  ready: {
    color: '#10B981',
    icon: 'check-circle',
    label: 'Ready',
  },
  active: {
    color: '#F59E0B',
    icon: 'map-marker',
    label: 'Traveling',
  },
  completed: {
    color: '#6B7280',
    icon: 'camera',
    label: 'Memories',
  },
  cancelled: {
    color: '#EF4444',
    icon: 'x-circle',
    label: 'Cancelled',
  },
};

/**
 * Calculate the completion percentage of a trip based on key requirements
 */
export function calculateCompletionPercentage(trip: Trip): number {
  let completed = 0;
  let total = 0;

  // Core requirements with weighted scores

  // Trip name (always completed since it's required to create)
  total += 15;
  completed += trip.name ? 15 : 0;

  // Destination
  total += 25;
  completed += trip.destination?.name || trip.locationId ? 25 : 0;

  // Travel dates
  total += 25;
  if (trip.startDate && trip.endDate) {
    completed += 25;
  } else if (trip.startDate || trip.endDate) {
    completed += 12.5; // Partial credit for one date
  }

  // Budget setup
  total += 20;
  if (trip.budgetMethod !== 'no-budget') {
    if (trip.totalBudget || trip.dailyBudget) {
      completed += 20;
    } else {
      completed += 10; // Partial credit for setting method but no amounts
    }
  }

  // Travel style
  total += 10;
  completed += trip.travelStyle ? 10 : 0;

  // Basic planning indicators (notes, participants)
  total += 5;
  completed += trip.notes ? 5 : 0;

  return Math.round((completed / total) * 100);
}

/**
 * Calculate the current status of a trip using Smart Auto-Status logic
 */
export function calculateTripStatus(trip: Trip): TripStatus {
  const now = new Date();
  const startDate = trip.startDate ? new Date(trip.startDate) : null;
  const endDate = trip.endDate ? new Date(trip.endDate) : null;

  // Manual override takes precedence for cancelled status
  if (trip.manualStatus === 'cancelled') {
    return 'cancelled';
  }

  // Date-based logic takes priority for time-sensitive statuses
  if (endDate && now > endDate) {
    return 'completed';
  }

  if (startDate && endDate && now >= startDate && now <= endDate) {
    return 'active';
  }

  // Completion-based logic for planning phases
  const completionPercent = calculateCompletionPercentage(trip);

  if (completionPercent < 40) {
    return 'draft';
  }

  if (completionPercent < 80) {
    return 'planning';
  }

  // If we have dates and high completion, it's ready
  if (startDate && now < startDate && completionPercent >= 80) {
    return 'ready';
  }

  // Fallback to planning if no clear dates but well planned
  return 'planning';
}

/**
 * Get the display configuration for a trip status
 */
export function getStatusConfig(status: TripStatus): TripStatusConfig {
  return statusConfig[status];
}

/**
 * Migrate old status to new status system
 */
export function migrateOldStatus(oldStatus: string): TripStatus {
  switch (oldStatus) {
    case 'planning':
      return 'planning';
    case 'upcoming':
      return 'ready';
    case 'active':
      return 'active';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'draft';
  }
}

/**
 * Get human-readable description of what's needed to improve trip status
 */
export function getStatusSuggestions(trip: Trip): string[] {
  const suggestions: string[] = [];
  const completion = calculateCompletionPercentage(trip);

  if (!trip.destination?.name && !trip.locationId) {
    suggestions.push('Add a destination');
  }

  if (!trip.startDate || !trip.endDate) {
    suggestions.push('Set travel dates');
  }

  if (trip.budgetMethod === 'no-budget') {
    suggestions.push('Set up a budget plan');
  } else if (!trip.totalBudget && !trip.dailyBudget) {
    suggestions.push('Add budget amounts');
  }

  if (!trip.travelStyle) {
    suggestions.push('Choose travel style');
  }

  if (!trip.notes) {
    suggestions.push('Add trip notes or description');
  }

  return suggestions;
}
