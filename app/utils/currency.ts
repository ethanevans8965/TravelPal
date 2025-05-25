import AsyncStorage from '@react-native-async-storage/async-storage';

export type ExchangeRates = Record<string, number>;

const RATES_CACHE_KEY = 'exchange_rates_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedRates {
  rates: ExchangeRates;
  base: string;
  timestamp: number;
}

// Fetches rates from exchangerate-api.com for a base currency
export async function fetchExchangeRates(base: string = 'USD'): Promise<ExchangeRates> {
  const url = `https://api.exchangerate-api.com/v4/latest/${base}`;
  console.log('Fetching from URL:', url);

  const response = await fetch(url);
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);

  if (!response.ok) throw new Error('Failed to fetch exchange rates');

  const data = await response.json();
  console.log('Full API response:', JSON.stringify(data, null, 2));
  console.log('Rates from response:', data.rates);

  return data.rates as ExchangeRates;
}

// Converts an amount from one currency to another using a rates object
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: ExchangeRates
): number {
  if (from === to) return amount;
  if (!rates[from] || !rates[to]) throw new Error('Currency not supported');
  // Convert from -> base (e.g., USD), then base -> to
  // If rates are relative to base, e.g., rates[EUR] = 0.92 means 1 USD = 0.92 EUR
  // To convert from USD to EUR: amount * rates[EUR]
  // To convert from EUR to USD: amount / rates[EUR]
  if (from === 'USD') {
    return amount * rates[to];
  } else if (to === 'USD') {
    return amount / rates[from];
  } else {
    // Convert from -> USD -> to
    return (amount / rates[from]) * rates[to];
  }
}

// Save rates to AsyncStorage
async function saveRatesToCache(rates: ExchangeRates, base: string) {
  const cache: CachedRates = {
    rates,
    base,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(RATES_CACHE_KEY, JSON.stringify(cache));
}

// Load rates from AsyncStorage
async function loadRatesFromCache(base: string): Promise<CachedRates | null> {
  const raw = await AsyncStorage.getItem(RATES_CACHE_KEY);
  if (!raw) return null;
  try {
    const cache: CachedRates = JSON.parse(raw);
    if (cache.base !== base) return null;
    return cache;
  } catch {
    return null;
  }
}

// Get rates, using cache if <24h old, otherwise fetch and update cache
export async function getCachedExchangeRates(base: string = 'USD'): Promise<ExchangeRates> {
  console.log('getCachedExchangeRates called with base:', base);
  const cache = await loadRatesFromCache(base);
  console.log('Loaded cache:', cache);

  // Check if cache is valid and has rates
  if (cache && cache.rates && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    console.log('rates loaded from cache');
    console.log('Cache rates:', cache.rates);
    return cache.rates;
  }

  console.log('Cache miss, expired, or corrupted. Fetching new rates...');
  try {
    const rates = await fetchExchangeRates(base);
    console.log('Fetched new rates:', rates);

    if (!rates) {
      throw new Error('API returned undefined rates');
    }

    await saveRatesToCache(rates, base);
    return rates;
  } catch (error) {
    console.log('Error fetching rates:', error);
    // If we have corrupted cache but can't fetch new rates, clear the cache
    if (cache) {
      await AsyncStorage.removeItem(RATES_CACHE_KEY);
      console.log('Cleared corrupted cache');
    }
    throw error;
  }
}
