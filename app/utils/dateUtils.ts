/**
 * Date utility functions for TravelPal
 */

/**
 * Format a date string or Date object to a human-readable format
 * @param date Date string (YYYY-MM-DD) or Date object
 * @param options Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options: {
    includeWeekday?: boolean;
    format?: 'short' | 'medium' | 'long';
  } = {}
): string {
  // Set defaults
  const { includeWeekday = false, format = 'medium' } = options;
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Define formatting options based on format parameter
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: format === 'short' ? 'short' : format === 'medium' ? 'short' : 'long',
    day: 'numeric',
    year: 'numeric',
  };
  
  // Add weekday if requested
  if (includeWeekday) {
    formatOptions.weekday = format === 'short' ? 'short' : 'long';
  }
  
  return dateObj.toLocaleDateString('en-US', formatOptions);
}

/**
 * Format a date to ISO format (YYYY-MM-DD)
 * @param date Date object
 * @returns ISO formatted date string
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Calculate duration between two dates in days (inclusive)
 * @param startDate Start date string or Date object
 * @param endDate End date string or Date object
 * @returns Number of days
 */
export function calculateDurationInDays(startDate: string | Date, endDate: string | Date): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include end day
} 