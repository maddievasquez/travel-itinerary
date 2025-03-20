import { useState, useEffect } from "react";

export default function useItineraryMap(itineraryId) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLocations() {
      if (!itineraryId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/itineraries/${itineraryId}/`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("API response for itinerary map:", data);

        if (data?.days) {
          // Process and validate locations
          const parsedLocations = data.days.flatMap((day) =>
            day.locations.map((loc) => {
              // Parse coordinates and validate
              const lat = parseFloat(loc.latitude);
              const lng = parseFloat(loc.longitude);
              
              // Check if coordinates are valid
              const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
              const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
              
              return {
                latitude: isValidLat ? lat : null,
                longitude: isValidLng ? lng : null,
                name: loc.name || "Unnamed Location",
                address: loc.address || "",
                // Flag to easily identify valid locations
                isValid: isValidLat && isValidLng
              };
            })
          );
          
          console.log("Parsed locations for map:", parsedLocations);
          setLocations(parsedLocations);
        } else {
          setLocations([]);
          console.warn("No days or locations found in the API response");
        }
      } catch (err) {
        console.error("Error fetching itinerary locations:", err);
        setError(`Failed to load locations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchLocations();
  }, [itineraryId]);

  return { 
    locations, 
    loading, 
    error,
    // Add a helper property to easily check if we have valid locations
    hasValidLocations: locations.some(loc => loc.isValid)
  };
}