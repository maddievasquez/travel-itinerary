import { useState, useEffect, useCallback, useMemo } from "react";
import authService from "../services/auth";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function useUserItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'updated_at:desc',
    searchTerm: ''
  });
  
  // Fetch itineraries using your authService
  const fetchItineraries = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching itineraries...");
      
      // Use your authService which already handles token management
      const data = await authService.fetchUserItineraries();
      console.log("Fetched itineraries data:", data);
      
      // Ensure we have an array
      const itinerariesArray = Array.isArray(data) ? data : [];
      setItineraries(itinerariesArray);
      setError(null);
      return itinerariesArray;
    } catch (err) {
      console.error("Full API error:", err);
      
      const errorMessage = 
        err.response?.data?.detail || 
        err.response?.data?.message || 
        err.message || 
        "Failed to fetch itineraries";
      
      const isAuthError = 
        err.response?.status === 401 || 
        errorMessage.toLowerCase().includes('unauthorized') ||
        errorMessage.toLowerCase().includes('token');
        
      setError({ message: errorMessage, isAuthError });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Create new itinerary - replaced fetch with axios
  const createItinerary = useCallback(async (itineraryData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/itineraries/`, itineraryData);
      const newItinerary = response.data;
      
      // Update local state
      setItineraries(current => [...current, newItinerary]);
      
      return newItinerary;
    } catch (err) {
      console.error("Create itinerary error:", err);
      throw err;
    }
  }, []);
  
  // Update existing itinerary - replaced fetch with axios
  const updateItinerary = useCallback(async (id, itineraryData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/itineraries/${id}/`, itineraryData);
      const updatedItinerary = response.data;
      
      // Update local state
      setItineraries(current => 
        current.map(item => item.id === id ? updatedItinerary : item)
      );
      
      return updatedItinerary;
    } catch (err) {
      console.error("Update itinerary error:", err);
      throw err;
    }
  }, []);
  
  // Delete itinerary - replaced fetch with axios
  const deleteItinerary = useCallback(async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/itineraries/${id}/`);
      
      // Update local state
      setItineraries(current => current.filter(item => item.id !== id));
      return id;
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  }, []);
  
  // Filter and sort itineraries
  const filteredItineraries = useMemo(() => {
    return itineraries.filter(itinerary => {
      // Search term filter
      const matchesSearch = !filters.searchTerm || 
        [itinerary.title, itinerary.city, itinerary.country, itinerary.description]
          .filter(Boolean) // Filter out undefined/null fields
          .some(field => field.toLowerCase().includes(filters.searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = !filters.status || itinerary.status === filters.status;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const [sortField, sortDirection] = filters.sortBy.split(':');
      const modifier = sortDirection === 'desc' ? -1 : 1;
      
      if (sortField === 'date') {
        return (new Date(a.start_date || 0) - new Date(b.start_date || 0)) * modifier;
      }
      if (sortField === 'title') {
        return ((a.title || '').localeCompare(b.title || '')) * modifier;
      }
      return (new Date(a.updated_at || 0) - new Date(b.updated_at || 0)) * modifier;
    });
  }, [itineraries, filters]);
  
  // Initialize data load
  useEffect(() => {
    fetchItineraries().catch(err => {
      console.error("Initial fetch failed:", err);
    });
  }, [fetchItineraries]);
  
  return { 
    itineraries, 
    filteredItineraries,
    loading, 
    error, 
    filters,
    setFilters,
    refetch: fetchItineraries,
    createItinerary,
    updateItinerary,
    deleteItinerary
  };
}