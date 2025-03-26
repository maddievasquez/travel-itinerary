import { useState, useEffect } from 'react';

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

  useEffect(() => {
    /**
     * Fetches itinerary data from API and processes locations
     */
    async function fetchLocations() {
      // Early return if no itineraryId provided
      if (!itineraryId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch itinerary data
        const response = await fetch(`/api/itineraries/${itineraryId}/`);
        
        // Handle HTTP errors
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        // Parse and log response data for debugging
        const data = await response.json();
        console.log("Full API response:", data);

        if (data?.days) {
          console.log("RAW API RESPONSE:", data);  // Debug: log complete response

          // Process locations from activities
          const parsedLocations = data.days.flatMap((day) =>
            day.activities.map((activity) => {
              // Parse and validate coordinates
              const lat = parseFloat(activity.location.latitude);
              const lng = parseFloat(activity.location.longitude);
              
              const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
              const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
              
              // Return processed location object
              return {
                latitude: isValidLat ? lat : null,
                longitude: isValidLng ? lng : null,
                name: activity.location.name || "Unnamed Location",
                address: activity.location.address || "",
                category: activity.location.category || 'default', // Fallback to 'default'
                isValid: isValidLat && isValidLng,
                // Include additional fields if needed
                originalData: activity.location // Keep reference to original data
              };
            })
          );
          
          // Debug: log processed locations with categories
          console.log("Processed locations with categories:", 
            parsedLocations.map(loc => ({
              name: loc.name,
              category: loc.category,
              coords: [loc.latitude, loc.longitude]
            }))
          );
          
          setLocations(parsedLocations);
        } else {
          console.warn("No days or locations found in the API response");
          setLocations([]);
        }
      } catch (err) {
        console.error("Error fetching itinerary locations:", err);
        setError(`Failed to load locations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    // Initiate data fetch
    fetchLocations();
  }, [itineraryId]); // Only re-run when itineraryId changes

  // Return processed data and states
  return { 
    locations,       // Array of processed location objects
    loading,         // Boolean indicating loading status
    error,           // Error message if fetch failed
    hasValidLocations: locations.some(loc => loc.isValid) // Boolean for validation
  };
}