// useShareableUrl.js
import { useCallback } from 'react';

export function useShareableUrl() {
  const generateItineraryUrl = useCallback((itinerary) => {
    if (!itinerary) return '';
    return `/itinerary/${itinerary.id}`;
  }, []);

  const copyToClipboard = useCallback(async (url) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      return true;
    } catch (err) {
      console.error('Failed to copy URL:', err);
      return false;
    }
  }, []);

  return {
    generateItineraryUrl,
    copyToClipboard
  };
}