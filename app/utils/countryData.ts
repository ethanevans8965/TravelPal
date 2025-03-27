import countryData from '../../assets/data/all_countries.json';

export interface CountryCost {
  country: string;
  accommodation: {
    budget: string;
    midRange: string;
    luxury: string;
  };
  transportation: {
    budget: string;
    midRange: string;
    luxury: string;
  };
  food: {
    budget: string;
    midRange: string;
    luxury: string;
  };
  entertainment: {
    budget: string;
    midRange: string;
    luxury: string;
  };
  alcohol?: {
    budget: string;
    midRange: string;
    luxury: string;
  };
}

// Define the type for category percentages
export interface CategoryPercentages {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  shopping: number;
  other: number;
  [key: string]: number;
}

// Process raw country data into a more structured format
export const processCountryData = (): CountryCost[] => {
  const countries: Record<string, CountryCost> = {};
  
  countryData.forEach((item: any) => {
    const country = item.Country;
    const category = item.Category.toLowerCase();
    
    if (!countries[country]) {
      countries[country] = {
        country,
        accommodation: { budget: '0', midRange: '0', luxury: '0' },
        transportation: { budget: '0', midRange: '0', luxury: '0' },
        food: { budget: '0', midRange: '0', luxury: '0' },
        entertainment: { budget: '0', midRange: '0', luxury: '0' },
      };
    }
    
    if (category === 'accommodation') {
      countries[country].accommodation = {
        budget: cleanPriceString(item.Budget),
        midRange: cleanPriceString(item['Mid-Range']),
        luxury: cleanPriceString(item.Luxury),
      };
    } else if (category === 'transportation') {
      countries[country].transportation = {
        budget: cleanPriceString(item.Budget),
        midRange: cleanPriceString(item['Mid-Range']),
        luxury: cleanPriceString(item.Luxury),
      };
    } else if (category === 'food') {
      countries[country].food = {
        budget: cleanPriceString(item.Budget),
        midRange: cleanPriceString(item['Mid-Range']),
        luxury: cleanPriceString(item.Luxury),
      };
    } else if (category === 'entertainment') {
      countries[country].entertainment = {
        budget: cleanPriceString(item.Budget),
        midRange: cleanPriceString(item['Mid-Range']),
        luxury: cleanPriceString(item.Luxury),
      };
    } else if (category === 'alcohol') {
      countries[country].alcohol = {
        budget: cleanPriceString(item.Budget),
        midRange: cleanPriceString(item['Mid-Range']),
        luxury: cleanPriceString(item.Luxury),
      };
    }
  });
  
  return Object.values(countries);
};

// Clean price strings (remove currency symbols and convert to numbers)
export const cleanPriceString = (priceStr: string): string => {
  if (!priceStr) return '0';
  
  // Handle ranges (e.g., "$5-15")
  if (priceStr.includes('-')) {
    const [min, max] = priceStr.split('-');
    const cleanMin = cleanPriceString(min);
    const cleanMax = cleanPriceString(max);
    
    // Return the average of min and max
    return ((parseFloat(cleanMin) + parseFloat(cleanMax)) / 2).toString();
  }
  
  // Remove currency symbols, commas, and extract the first number
  const numericValue = priceStr.replace(/[^0-9.]/g, '');
  return numericValue || '0';
};

// Get country names for dropdown
export const getCountryNames = (): string[] => {
  const uniqueCountries = new Set<string>();
  countryData.forEach((item: any) => {
    if (item.Country) {
      uniqueCountries.add(item.Country);
    }
  });
  
  return Array.from(uniqueCountries).sort();
};

// Get cost data for a specific country
export const getCountryCostData = (countryName: string): CountryCost | null => {
  const allCountries = processCountryData();
  return allCountries.find(c => c.country === countryName) || null;
};

// Calculate daily budget based on country and travel style
export const calculateDailyBudget = (
  country: string,
  travelStyle: 'Budget' | 'Mid-range' | 'Luxury'
): number => {
  const countryData = getCountryCostData(country);
  if (!countryData) return getDefaultBudget(travelStyle);
  
  const styleKey = travelStyle === 'Budget' 
    ? 'budget' 
    : travelStyle === 'Mid-range' 
      ? 'midRange' 
      : 'luxury';
  
  const accommodation = parseFloat(countryData.accommodation[styleKey]);
  const transportation = parseFloat(countryData.transportation[styleKey]);
  const food = parseFloat(countryData.food[styleKey]);
  const entertainment = parseFloat(countryData.entertainment[styleKey]);
  
  // Sum up all categories for the daily budget
  return accommodation + transportation + food + entertainment;
};

// Fallback default budgets if country data is not available
function getDefaultBudget(travelStyle: 'Budget' | 'Mid-range' | 'Luxury'): number {
  switch (travelStyle) {
    case 'Budget':
      return 50;
    case 'Mid-range':
      return 150;
    case 'Luxury':
      return 350;
    default:
      return 100;
  }
}

// Get default category percentages based on country data
export const getDefaultCategoryPercentages = (
  country: string, 
  travelStyle: 'Budget' | 'Mid-range' | 'Luxury'
): CategoryPercentages => {
  const countryData = getCountryCostData(country);
  if (!countryData) {
    // Fallback to default percentages
    return getDefaultPercentages(travelStyle);
  }
  
  const styleKey = travelStyle === 'Budget' 
    ? 'budget' 
    : travelStyle === 'Mid-range' 
      ? 'midRange' 
      : 'luxury';
  
  const accommodation = parseFloat(countryData.accommodation[styleKey]);
  const transportation = parseFloat(countryData.transportation[styleKey]);
  const food = parseFloat(countryData.food[styleKey]);
  const entertainment = parseFloat(countryData.entertainment[styleKey]);
  
  const total = accommodation + transportation + food + entertainment;
  if (total === 0) {
    return getDefaultPercentages(travelStyle);
  }
  
  // Convert costs to percentages
  const accommodationPercent = Math.round((accommodation / total) * 100);
  const foodPercent = Math.round((food / total) * 100);
  const transportationPercent = Math.round((transportation / total) * 100);
  const activitiesPercent = Math.round((entertainment / total) * 100);
  
  // Calculate shopping and other as the remainder
  const allocatedPercent = accommodationPercent + foodPercent + transportationPercent + activitiesPercent;
  const remainingPercent = Math.max(0, 100 - allocatedPercent);
  
  // Split remaining between shopping and other
  const shoppingPercent = Math.round(remainingPercent * 0.7);
  const otherPercent = remainingPercent - shoppingPercent;
  
  // Create result object
  const result: CategoryPercentages = {
    accommodation: accommodationPercent,
    food: foodPercent,
    transportation: transportationPercent,
    activities: activitiesPercent,
    shopping: shoppingPercent,
    other: otherPercent
  };
  
  // Ensure total is exactly 100%
  const totalPercentage = Object.values(result).reduce((sum, value) => sum + value, 0);
  if (totalPercentage !== 100) {
    // Adjust the largest category
    const largestCategory = Object.keys(result).reduce(
      (max, cat) => result[cat] > result[max] ? cat : max,
      'accommodation' as keyof CategoryPercentages
    );
    result[largestCategory] += (100 - totalPercentage);
  }
  
  return result;
};

// Default category percentages by travel style if country data is not available
function getDefaultPercentages(travelStyle: 'Budget' | 'Mid-range' | 'Luxury'): CategoryPercentages {
  switch (travelStyle) {
    case 'Budget':
      return {
        accommodation: 35,
        food: 30,
        transportation: 15,
        activities: 10,
        shopping: 5,
        other: 5
      };
    case 'Mid-range':
      return {
        accommodation: 30,
        food: 25,
        transportation: 15,
        activities: 15,
        shopping: 10,
        other: 5
      };
    case 'Luxury':
      return {
        accommodation: 40,
        food: 20,
        transportation: 10,
        activities: 15,
        shopping: 10,
        other: 5
      };
    default:
      return {
        accommodation: 35,
        food: 25,
        transportation: 15,
        activities: 15,
        shopping: 5,
        other: 5
      };
  }
} 