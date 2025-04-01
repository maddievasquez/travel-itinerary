import { useState, useEffect } from "react";
import Cookie from "../components/cookies";
import axios from 'axios';

export function useItinerary() {
  const [itinerary, setItinerary] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Backend API base URL (explicitly pointing to Django server)
  const API_URL = 'http://127.0.0.1:8000/api';

  // Create axios instance with default configuration
  const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // Equivalent to credentials: 'include'
  });

  // Add request interceptor for authentication
  api.interceptors.request.use(
    config => {
      const token = Cookie.getCookie("access") || localStorage.getItem("accessToken");
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for global error handling
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized, redirecting to login');
        // Handle unauthorized access (optional redirect)
      }
      return Promise.reject(error);
    }
  );

  const createItinerary = async (itineraryData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Log the request for debugging
      console.log("Making request to:", `${API_URL}/itineraries/`);
      console.log("Request data:", itineraryData);

      // Use the correct endpoint for itinerary creation
      // This matches your Django router setup
      const response = await api.post('itineraries/', itineraryData);
      
      const resultItinerary = response.data.itinerary || response.data;
      setItinerary(resultItinerary);
      return resultItinerary;
    } catch (err) {
      console.error('Itinerary creation error:', err);
      console.error('Response data:', err.response?.data); // Added to show detailed error
      setError(err.response?.data?.detail || err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchItineraries = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use user/itineraries/ to fetch user-specific itineraries
      const response = await api.get('/user/itineraries/');
      setItineraries(response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch itineraries error:', err);
      console.error('Response data:', err.response?.data);
      setError(err.response?.data?.detail || err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchItineraryDetails = async (itineraryId) => {
    setLoading(true);
    setError(null);
    console.log('fetching itinerary details');
    try {
      // Use the correct endpoint based on your router setup
      const response = await api.get(`/itineraries/${itineraryId}/details/`);
      setItinerary(response.data);
      return response.data;
    } catch (err) {
      console.error('Fetch itinerary details error:', err);
      console.error('Response data:', err.response?.data);
      setError(err.response?.data?.detail || err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItinerary = async (itineraryId, itineraryData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use PATCH to update an existing itinerary
      const response = await api.patch(`/itineraries/${itineraryId}/`, itineraryData);
      setItinerary(response.data);
      return response.data;
    } catch (err) {
      console.error('Update itinerary error:', err);
      console.error('Response data:', err.response?.data);
      setError(err.response?.data?.detail || err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = async (itineraryId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the correct delete endpoint
      await api.delete(`/itineraries/${itineraryId}/`);
      // Remove the deleted itinerary from the list
      setItineraries(prev => prev.filter(itin => itin.id !== itineraryId));
      return true;
    } catch (err) {
      console.error('Delete itinerary error:', err);
      console.error('Response data:', err.response?.data);
      setError(err.response?.data?.detail || err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to itinerary details page after creation
  const navigateToItinerary = (itineraryId, navigate) => {
    if (navigate && itineraryId) {
      navigate(`/itineraries/${itineraryId}`);
    }
  };

  return { 
    itinerary, 
    itineraries, 
    loading, 
    error,
    setError, 
    createItinerary, 
    fetchItineraries, 
    fetchItineraryDetails,
    updateItinerary,
    deleteItinerary,
    navigateToItinerary
  };
}

export default useItinerary;
