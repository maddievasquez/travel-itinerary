import { format } from "date-fns";

/**
 * Groups itineraries by status (Upcoming, Current, Past)
 * @param {Array} itineraries - Array of itinerary objects
 * @returns {Array} Grouped itineraries with status labels
 */
export function groupItinerariesByStatus(itineraries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const groups = {
    Upcoming: [],
    Current: [],
    Past: []
  };

  itineraries.forEach(itinerary => {
    const startDate = new Date(itinerary.start_date);
    const endDate = new Date(itinerary.end_date);
    
    if (startDate > today) {
      groups.Upcoming.push(itinerary);
    } else if (endDate >= today) {
      groups.Current.push(itinerary);
    } else {
      groups.Past.push(itinerary);
    }
  });

  // Sort each group
  groups.Upcoming.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  groups.Current.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  groups.Past.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  return [
    { status: 'Current', items: groups.Current },
    { status: 'Upcoming', items: groups.Upcoming },
    { status: 'Past', items: groups.Past }
  ].filter(group => group.items.length > 0);
}

/**
 * Formats a date range for display
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Formatted date range
 */
export function formatDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.getFullYear() === end.getFullYear()) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  }
  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
}

/**
 * Calculates trip duration in days
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Duration in days
 */
export function getTripDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
}