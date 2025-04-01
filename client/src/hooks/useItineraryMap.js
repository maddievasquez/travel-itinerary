import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Cookie from "../components/cookies";

/**
 * Custom hook to fetch and process itinerary locations
 * @param {string} itineraryId - ID of the itinerary to fetch
 * @returns {Object} - Contains locations, loading state, error, and validation status
 */
export default function useItineraryMap(itineraryId) {
  // State management for locations, loading status, and errors
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize API client to prevent recreation on each render
  const api = useMemo(() => {
    const API_URL = 'http://127.0.0.1:8000/api';
    
    // Create axios instance with default configuration
    const instance = axios.create({
      baseURL: API_URL,
      withCredentials: true // Equivalent to credentials: 'include'
    });

    // Request interceptor for authentication
    instance.interceptors.request.use(
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

    // Response interceptor for global error handling
    instance.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          console.log('Unauthorized, redirecting to login');
          // Handle unauthorized access (optional redirect)
        }
        return Promise.reject(error);
      }
    );
    
    return instance;
  }, []); // Empty dependency array ensures this is only created once

  useEffect(() => {
    // Reset states when itineraryId changes
    if (itineraryId) {
      setLoading(true);
      setError(null);
    }

    // Create abort controller for cleanup
    const controller = new AbortController();
    
    /**
     * Processes a location object from API data
     * @param {Object} locationData - Raw location data from API
     * @param {number} dayNumber - Day number for this location
     * @param {string} locationType - Type of location ('activity' or 'location')
     * @param {string} description - Optional description text
     * @param {string} time - Optional time information
     * @returns {Object} - Processed location object
     */
    function processLocation(locationData, dayNumber, locationType, description = "", time = null) {
      if (!locationData) return null;
      
      // Parse and validate coordinates
      const lat = parseFloat(locationData.latitude);
      const lng = parseFloat(locationData.longitude);
      
      const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
      const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
      
      // Ensure address is string to prevent React rendering errors
      const address = typeof locationData.address === 'string' 
        ? locationData.address 
        : locationData.address 
          ? JSON.stringify(locationData.address) 
          : "";
      
      // Return processed location object
      return {
        latitude: isValidLat ? lat : null,
        longitude: isValidLng ? lng : null,
        name: locationData.name || "Unnamed Location",
        address: address,
        category: locationData.category || 'default',
        isValid: isValidLat && isValidLng,
        day: dayNumber,
        type: locationType,
        description: description || "",
        time: time || null,
        // Store a shallow copy of original data to avoid reference issues
        originalData: { ...locationData }
      };
    }
    
    /**
     * Remove duplicate locations based on coordinates and name
     * @param {Array} locations - Array of location objects
     * @returns {Array} - Array with duplicates removed
     */
    function removeDuplicateLocations(locations) {
      const uniqueMap = new Map();
      const invalidLocs = [];
      
      locations.forEach(loc => {
        if (!loc) return; // Skip null entries
        
        // Separate valid and invalid locations
        if (!loc.isValid) {
          invalidLocs.push(loc);
          return;
        }
        
        // Create a unique key based on coordinates and name
        const key = `${loc.latitude},${loc.longitude},${loc.name}`;
        
        // Only add if not already in the map
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, loc);
        }
      });
      
      return [...uniqueMap.values(), ...invalidLocs];
    }

    /**
     * Fetches itinerary data from API and processes locations
     */
    async function fetchLocations() {
      // Early return if no itineraryId provided
      if (!itineraryId) {
        setLoading(false);
        setLocations([]);
        return;
      }

      try {
        // Fetch itinerary data with abort signal
        const response = await api.get(`itineraries/${itineraryId}/`, {
          signal: controller.signal
        });
        
        // Check response status
        if (response.status !== 200) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = response.data;
        console.log("Full API response:", data);

        if (data?.days && Array.isArray(data.days)) {
          // Process locations from both activities and locations arrays
          const parsedLocations = [];
          
          // Process each day in the itinerary
          data.days.forEach((day) => {
            const dayNumber = day.day;
            
            // Process activities with locations
            if (day.activities && Array.isArray(day.activities)) {
              day.activities.forEach((activity) => {
                if (activity.location) {
                  const processedLocation = processLocation(
                    activity.location,
                    dayNumber,
                    'activity',
                    activity.description,
                    activity.time
                  );
                  
                  if (processedLocation) {
                    parsedLocations.push(processedLocation);
                  }
                }
              });
            }
            
            // Process direct locations array if it exists
            if (day.locations && Array.isArray(day.locations)) {
              day.locations.forEach((location) => {
                const processedLocation = processLocation(
                  location,
                  dayNumber,
                  'location',
                  location.description
                );
                
                if (processedLocation) {
                  parsedLocations.push(processedLocation);
                }
              });
            }
          });
          
          // Debug: log processed locations with categories
          console.log("Processed locations with categories:", 
            parsedLocations.map(loc => ({
              name: loc.name,
              category: loc.category,
              day: loc.day,
              type: loc.type,
              coords: [loc.latitude, loc.longitude]
            }))
          );
          
          // Remove duplicate locations
          const uniqueLocations = removeDuplicateLocations(parsedLocations);
          
          setLocations(uniqueLocations);
        } else {
          console.warn("No days or locations found in the API response");
          setLocations([]);
        }
      } catch (err) {
        // Ignore aborted requests
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          console.log('Request was cancelled');
          return;
        }
        
        console.error("Error fetching itinerary locations:", err);
        setError(`Failed to load locations: ${err.message}`);
        setLocations([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    // Initiate data fetch
    fetchLocations();

    // Cleanup function to abort ongoing requests when component unmounts
    return () => {
      controller.abort();
    };
  }, [itineraryId, api]); // Dependencies: itineraryId and api instance

  // Calculate if there are valid locations
  const hasValidLocations = useMemo(() => 
    locations.some(loc => loc.isValid), 
    [locations]
  );

  // Return processed data and states
  return { 
    locations,       // Array of processed location objects
    loading,         // Boolean indicating loading status
    error,           // Error message if fetch failed
    hasValidLocations // Boolean for validation
  };
}