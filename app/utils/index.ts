/**
 * Utility functions for the Calctra application
 */

/**
 * Format a date for display
 * @param date Date to format
 * @param locale Locale to use for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | number, locale: string = 'en-US'): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a currency value for display
 * @param amount Amount to format
 * @param currency Currency symbol (default: 'CAL')
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'CAL',
  decimals: number = 2
): string => {
  return `${amount.toFixed(decimals)} ${currency}`;
};

/**
 * Truncate a string to a specific length with ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Truncate a wallet address for display
 * @param address Wallet address to truncate
 * @param startChars Number of characters to show at the start (default: 6)
 * @param endChars Number of characters to show at the end (default: 4)
 * @returns Truncated address
 */
export const truncateAddress = (
  address: string | null | undefined,
  startChars: number = 6,
  endChars: number = 4
): string => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Delay execution for a specified number of milliseconds
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if a string is a valid email
 * @param email Email string to validate
 * @returns Boolean indicating if the string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate a random ID
 * @param prefix Prefix for the ID (default: 'id')
 * @returns Random ID string
 */
export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Calculate the time difference between two dates in a human-readable format
 * @param date1 First date
 * @param date2 Second date (default: current time)
 * @returns Human-readable time difference
 */
export const getTimeDifference = (date1: Date | string | number, date2: Date = new Date()): string => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2;
  
  const diffInSeconds = Math.floor((d2.getTime() - d1.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}; 