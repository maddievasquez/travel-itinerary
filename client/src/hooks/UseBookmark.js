import { useState } from 'react';
import axios from 'axios';
import auth from '../services/auth';

const API_URL = 'http://127.0.0.1:8000/api';

/**
 * Custom hook for managing itinerary bookmarks
 * 
 * @returns {Object} Functions and state for bookmark operations
 */
export function useBookmark() {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check if an itinerary is bookmarked by the current user
   * 
   * @param {string|number} itineraryId - ID of the itinerary to check
   * @returns {Promise<boolean>} - Promise resolving to bookmark status
   */
  const checkStatus = async (itineraryId) => {
    if (!auth.checkAuthStatus()) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/itineraries/${itineraryId}/bookmark/status/`);
      setIsBookmarked(response.data.isBookmarked);
      return response.data.isBookmarked;
    } catch (err) {
      console.error("Failed to check bookmark status:", err);
      setError(err.response?.data?.error || "Failed to check bookmark status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle bookmark status for an itinerary
   * 
   * @param {string|number} itineraryId - ID of the itinerary to toggle
   * @returns {Promise<boolean>} - Promise resolving to new bookmark status
   */
  const toggle = async (itineraryId) => {
    if (!auth.checkAuthStatus()) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Using the toggle-bookmark endpoint from the backend
      const response = await axios.post(`${API_URL}/itineraries/${itineraryId}/toggle-bookmark/`);
      const newBookmarkStatus = response.data.bookmarked;
      setIsBookmarked(newBookmarkStatus);
      return newBookmarkStatus;
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
      setError(err.response?.data?.error || "Failed to toggle bookmark");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isBookmarked,
    loading,
    error,
    checkStatus,
    toggle
  };
}

export default useBookmark;