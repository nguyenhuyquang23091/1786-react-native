import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Search and filtering utilities for yoga classes
export const searchUtils = {
  // Get time category from time string (e.g., "09:00" -> "Morning")
  getTimeCategory: (timeString: string): 'Morning' | 'Afternoon' | 'Evening' => {
    const hour = parseInt(timeString.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    return 'Evening';
  },

  // Check if a day matches the filter
  matchesDay: (courseDay: string, dayFilter: string): boolean => {
    if (dayFilter === 'All Days') return true;
    return courseDay.toLowerCase() === dayFilter.toLowerCase();
  },

  // Check if a time matches the filter
  matchesTime: (courseTime: string, timeFilter: string): boolean => {
    if (timeFilter === 'All Times') return true;
    const timeCategory = searchUtils.getTimeCategory(courseTime);
    return timeCategory === timeFilter;
  },

  // Search in multiple fields with case-insensitive matching
  searchInFields: (searchQuery: string, ...fields: string[]): boolean => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return fields.some(field => 
      field && field.toLowerCase().includes(query)
    );
  },

  // Get day name from date string
  getDayFromDate: (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()] || dateString;
  }
};