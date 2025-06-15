import { useMemo } from 'react';
import { Trip } from '../types';

interface TripCompletionResult {
  percentage: number;
  missingFields: string[];
  completedFields: string[];
  isComplete: boolean;
}

export function useTripCompletion(trip: Trip): TripCompletionResult {
  return useMemo(() => {
    const requiredFields = [
      {
        key: 'destination',
        label: 'Destination',
        check: () => trip.destination?.name || trip.locationId !== 'temp-location-id',
      },
      { key: 'dates', label: 'Travel Dates', check: () => trip.startDate && trip.endDate },
      {
        key: 'budget',
        label: 'Budget',
        check: () => trip.budgetMethod !== 'no-budget' && (trip.totalBudget || trip.dailyBudget),
      },
      {
        key: 'itinerary',
        label: 'Itinerary',
        check: () => trip.itinerary && trip.itinerary.length > 0,
      },
    ];

    const completedFields: string[] = [];
    const missingFields: string[] = [];

    requiredFields.forEach((field) => {
      if (field.check()) {
        completedFields.push(field.label);
      } else {
        missingFields.push(field.label);
      }
    });

    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
    const isComplete = percentage === 100;

    return {
      percentage,
      missingFields,
      completedFields,
      isComplete,
    };
  }, [
    trip.destination,
    trip.locationId,
    trip.startDate,
    trip.endDate,
    trip.budgetMethod,
    trip.totalBudget,
    trip.dailyBudget,
    trip.itinerary,
  ]);
}
