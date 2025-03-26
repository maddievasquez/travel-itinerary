import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useItineraryMap from "../../hooks/useItineraryMap";
import { createCustomIcon } from "./mapIconsConfig"; // Correct import

/**
 * Interactive Map Component with Category-Specific Markers
 * 
 * Features:
 * - Displays locations with custom category-based icons
 * - Auto-zooms to fit all markers
 * - Shows detailed popups on marker click
 * - Handles loading/error states gracefully
 * - Supports both direct locations and itinerary-based fetching
 * 
 * Props:
 * @param {string} [itineraryId] - ID for fetching itinerary locations
 * @param {Array} [directLocations] - Pre-loaded locations array
 */
export default function MapComponent({ itineraryId, locations: directLocations }) {
  // Refs
  const mapRef = useRef(null); // Map container DOM element
  const mapInstanceRef = useRef(null); // Leaflet map instance
  const markersRef = useRef([]); // Track marker instances

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // Custom hook for itinerary data
  const { locations: hookLocations, loading: hookLoading, error: hookError } = useItineraryMap(itineraryId);

  /**
   * Cleanup effect - removes map and markers when unmounting
   */
  useEffect(() => {
    return () => {
      // Clear all markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Remove map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  /**
   * Data source selection effect:
   * - Prioritizes directLocations if provided
   * - Falls back to hook data if itineraryId exists
   * - Manages loading/error states
   */
  useEffect(() => {
    if (directLocations?.length > 0) {
      // Case 1: Use direct locations
      setLocations(directLocations);
      setLoading(false);
      setError(null);
    } else if (itineraryId) {
      // Case 2: Use hook data
      setLocations(hookLocations);
      setLoading(hookLoading);
      setError(hookError);
    } else {
      // Case 3: Handle missing data
      setError(directLocations?.length === 0 ? 
        "Provided locations array is empty" : 
        "No locations or itineraryId provided"
      );
      setLoading(false);
    }
  }, [directLocations, itineraryId, hookLocations, hookLoading, hookError]);

  /**
   * Map initialization and marker management
   */
  useEffect(() => {
    if (loading || error || !locations.length || !mapRef.current) return;

    const initTimer = setTimeout(() => {
      try {
        const validLocations = locations.filter(loc => {
          const lat = parseFloat(loc.latitude);
          const lng = parseFloat(loc.longitude);
          return !isNaN(lat) && !isNaN(lng);
        });

        if (!validLocations.length) {
          setError("No valid coordinates found");
          return;
        }

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current).setView(
            [validLocations[0].latitude, validLocations[0].longitude], 
            12
          );
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(mapInstanceRef.current);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        validLocations.forEach(location => {
          try {
            const icon = createCustomIcon(location.category || 'default');
            
            const marker = L.marker(
              [location.latitude, location.longitude],
              { 
                icon,
                title: location.name 
              }
            )
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div class="map-popup">
                <h4>${location.name || 'Unnamed Location'}</h4>
                ${location.address ? `<p>${location.address}</p>` : ''}
                ${location.category ? `
                  <div class="category-tag">
                    ${location.category}
                  </div>
                ` : ''}
              </div>
            `);

            markersRef.current.push(marker);
          } catch (iconError) {
            console.error(`Failed to create marker for ${location.name}:`, iconError);
          }
        });

        if (validLocations.length > 1) {
          const bounds = L.latLngBounds(
            validLocations.map(loc => [loc.latitude, loc.longitude])
          );
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

        mapInstanceRef.current.invalidateSize();
      } catch (err) {
        console.error("Map initialization error:", err);
        setError("Failed to initialize map");
      }
    }, 100);

    return () => clearTimeout(initTimer);
  }, [locations, loading, error]);

  // Render states
  if (loading) return (
    <div className="map-status loading">
      <p>Loading map data...</p>
    </div>
  );

  if (error) return (
    <div className="map-status error">
      <p>Error: {error}</p>
    </div>
  );

  if (!locations.length) return (
    <div className="map-status empty">
      <p>No locations available</p>
    </div>
  );

  // Main map container
  return (
    <div 
      ref={mapRef}
      className="map-container"
      style={{ height: "500px", width: "100%" }}
      aria-label="Interactive location map"
      role="application"
      tabIndex="0" // Make focusable for accessibility
    />
  );
}