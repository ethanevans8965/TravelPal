import { TripBudget, Leg } from '../types';
import { getCountryCostData, cleanPriceString } from './countryData';

// Style mapping for consistency with existing data
type TravelStyle = 'frugal' | 'balanced' | 'luxury';
type DataStyle = 'budget' | 'midRange' | 'luxury';

const styleMap: Record<TravelStyle, DataStyle> = {
  frugal: 'budget',
  balanced: 'midRange',
  luxury: 'luxury',
};

// Default daily costs if country data is missing
const defaultDailyCosts: Record<
  TravelStyle,
  { accommodation: number; food: number; transport: number; activities: number; misc: number }
> = {
  frugal: { accommodation: 25, food: 15, transport: 8, activities: 5, misc: 7 },
  balanced: { accommodation: 75, food: 45, transport: 20, activities: 15, misc: 15 },
  luxury: { accommodation: 200, food: 120, transport: 50, activities: 40, misc: 40 },
};

/**
 * Get daily cost breakdown for a specific country and travel style
 */
export const getDailyCostsForCountry = (
  country: string,
  style: TravelStyle
): { accommodation: number; food: number; transport: number; activities: number; misc: number } => {
  const countryData = getCountryCostData(country);
  const dataStyle = styleMap[style];

  if (!countryData) {
    return defaultDailyCosts[style];
  }

  const accommodation = parseFloat(cleanPriceString(countryData.accommodation[dataStyle]));
  const food = parseFloat(cleanPriceString(countryData.food[dataStyle]));
  const transport = parseFloat(cleanPriceString(countryData.transportation[dataStyle]));
  const activities = parseFloat(cleanPriceString(countryData.entertainment[dataStyle]));

  // Misc is typically 10-15% of total for incidentals
  const subtotal = accommodation + food + transport + activities;
  const misc = Math.round(subtotal * 0.12);

  return {
    accommodation: accommodation || defaultDailyCosts[style].accommodation,
    food: food || defaultDailyCosts[style].food,
    transport: transport || defaultDailyCosts[style].transport,
    activities: activities || defaultDailyCosts[style].activities,
    misc: misc || defaultDailyCosts[style].misc,
  };
};

/**
 * Calculate the number of days between two dates
 */
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays); // Ensure at least 1 day
};

/**
 * Generate budget suggestion based on trip legs and travel style
 */
export const getSuggestedBudget = (
  legs: Leg[],
  style: TravelStyle,
  currency: string = 'USD'
): TripBudget => {
  if (legs.length === 0) {
    // Fallback for trips without legs
    const dailyCosts = defaultDailyCosts[style];
    const perDay = Object.values(dailyCosts).reduce((sum, cost) => sum + cost, 0);

    return {
      currency,
      style,
      autoSuggested: true,
      total: perDay * 7, // Default to 7 days
      perDay,
      categories: dailyCosts,
      thresholds: { warn: 80, stop: 100 },
    };
  }

  let totalCosts = {
    accommodation: 0,
    food: 0,
    transport: 0,
    activities: 0,
    misc: 0,
  };

  let totalDays = 0;

  // Calculate costs for each leg
  legs.forEach((leg) => {
    if (leg.startDate && leg.endDate) {
      const days = calculateDays(leg.startDate, leg.endDate);
      const dailyCosts = getDailyCostsForCountry(leg.country, style);

      totalDays += days;
      totalCosts.accommodation += dailyCosts.accommodation * days;
      totalCosts.food += dailyCosts.food * days;
      totalCosts.transport += dailyCosts.transport * days;
      totalCosts.activities += dailyCosts.activities * days;
      totalCosts.misc += dailyCosts.misc * days;
    }
  });

  // Ensure we have at least 1 day
  if (totalDays === 0) {
    totalDays = 1;
    const dailyCosts = defaultDailyCosts[style];
    totalCosts = {
      accommodation: dailyCosts.accommodation,
      food: dailyCosts.food,
      transport: dailyCosts.transport,
      activities: dailyCosts.activities,
      misc: dailyCosts.misc,
    };
  }

  const total = Object.values(totalCosts).reduce((sum, cost) => sum + cost, 0);
  const perDay = Math.round(total / totalDays);

  return {
    currency,
    style,
    autoSuggested: true,
    total: Math.round(total),
    perDay,
    categories: {
      accommodation: Math.round(totalCosts.accommodation),
      food: Math.round(totalCosts.food),
      transport: Math.round(totalCosts.transport),
      activities: Math.round(totalCosts.activities),
      misc: Math.round(totalCosts.misc),
    },
    thresholds: { warn: 80, stop: 100 },
  };
};

/**
 * Update budget totals when categories change
 */
export const recalculateBudgetTotals = (
  budget: TripBudget,
  tripLengthDays?: number
): TripBudget => {
  const total = Object.values(budget.categories).reduce((sum, cost) => sum + cost, 0);
  const days = tripLengthDays || Math.max(1, Math.round(total / budget.perDay));
  const perDay = Math.round(total / days);

  return {
    ...budget,
    total: Math.round(total),
    perDay,
    autoSuggested: false, // Mark as modified
  };
};

/**
 * Validate budget category totals match the total budget
 */
export const validateBudget = (budget: TripBudget): { isValid: boolean; difference: number } => {
  const categoryTotal = Object.values(budget.categories).reduce((sum, cost) => sum + cost, 0);
  const difference = Math.round(categoryTotal - budget.total);

  return {
    isValid: Math.abs(difference) < 1, // Allow for rounding differences
    difference,
  };
};

/**
 * Get budget style multipliers for quick style changes
 */
export const getStyleMultipliers = (): Record<TravelStyle, number> => {
  return {
    frugal: 0.6,
    balanced: 1.0,
    luxury: 2.2,
  };
};

/**
 * Convert budget to different style while maintaining proportions
 */
export const convertBudgetStyle = (budget: TripBudget, newStyle: TravelStyle): TripBudget => {
  const multipliers = getStyleMultipliers();
  const currentMultiplier = multipliers[budget.style];
  const newMultiplier = multipliers[newStyle];
  const conversionFactor = newMultiplier / currentMultiplier;

  const newCategories = {
    accommodation: Math.round(budget.categories.accommodation * conversionFactor),
    food: Math.round(budget.categories.food * conversionFactor),
    transport: Math.round(budget.categories.transport * conversionFactor),
    activities: Math.round(budget.categories.activities * conversionFactor),
    misc: Math.round(budget.categories.misc * conversionFactor),
  };

  const newTotal = Object.values(newCategories).reduce((sum, cost) => sum + cost, 0);
  const newPerDay = Math.round(newTotal / Math.max(1, Math.round(budget.total / budget.perDay)));

  return {
    ...budget,
    style: newStyle,
    total: newTotal,
    perDay: newPerDay,
    categories: newCategories,
    autoSuggested: false,
  };
};
