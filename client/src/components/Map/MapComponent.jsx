import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useItineraryMap from "../../hooks/useItineraryMap";

// This component handles map adjustments after the map is initialized
function MapView({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations && locations.length > 0) {
      console.log("MapView received locations:", locations);

      // Filter for valid coordinates and create bounds
      const validLocations = locations.filter((loc) => {
        const hasLat = loc.latitude !== undefined || loc.lat !== undefined;
        const hasLng = loc.longitude !== undefined || loc.lng !== undefined;
        const validLat = !isNaN(parseFloat(loc.latitude || loc.lat));
        const validLng = !isNaN(parseFloat(loc.longitude || loc.lng));

        return hasLat && hasLng && validLat && validLng;
      });

      console.log("Valid locations for bounds:", validLocations);

      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(
          validLocations.map((loc) => [
            parseFloat(loc.latitude || loc.lat),
            parseFloat(loc.longitude || loc.lng),
          ])
        );

        console.log("Setting map bounds:", bounds);

        // Add a small timeout to ensure the map has fully initialized
        const timeoutId = setTimeout(() => {
          map.invalidateSize();
          map.fitBounds(bounds, { padding: [50, 50] });
          console.log("Map bounds set");
        }, 300);

        // Cleanup timeout on unmount
        return () => clearTimeout(timeoutId);
      }
    }
  }, [locations, map]);

  return null;
}

// Fix for Leaflet marker icon issue in React
const fixLeafletMarker = () => {
  if (typeof window !== "undefined") {
    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }
};

export default function MapComponent({ itineraryId, locations: directLocations }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  // Use the hook unconditionally
  const hookResult = useItineraryMap(itineraryId);

  // Debug props
  console.log("MapComponent received props:", {
    itineraryId,
    directLocations: directLocations ? directLocations.length : 0,
  });

  if (directLocations) {
    console.log("First few locations:", directLocations.slice(0, 2));
  }

  // Fix Leaflet marker icon issue when component mounts
  useEffect(() => {
    fixLeafletMarker();
  }, []);

  // Process locations based on props
  useEffect(() => {
    console.log("Processing locations in MapComponent");

    // Log the current state before making changes
    console.log("Current state:", { locations, loading, error });

    // IMPORTANT: We need to strictly check for array with actual elements
    if (directLocations && Array.isArray(directLocations) && directLocations.length > 0) {
      console.log("Using direct locations:", directLocations);
      setLocations(directLocations);
      setLoading(false);
      setError(null);
    } else if (itineraryId && hookResult.locations && hookResult.locations.length > 0) {
      console.log("Using hook locations:", hookResult.locations);
      setLocations(hookResult.locations);
      setLoading(hookResult.loading);
      setError(hookResult.error);
    } else {
      console.log("No valid locations source found");
      if (!directLocations && !itineraryId) {
        setError("No locations or itineraryId provided");
      } else if (directLocations && directLocations.length === 0) {
        setError("Provided locations array is empty");
      } else if (itineraryId && (!hookResult.locations || hookResult.locations.length === 0)) {
        setError("No locations found for the provided itineraryId");
      }
      setLoading(false);
    }
  }, [directLocations, itineraryId, hookResult.locations, hookResult.loading, hookResult.error]);

  // Force map to re-render when locations change
  useEffect(() => {
    if (locations && locations.length > 0 && !loading) {
      console.log("Forcing map re-render with key:", mapKey + 1);
      setMapKey((prevKey) => prevKey + 1);
    }
  }, [locations, loading]);

  // Early return states with more detailed messages
  if (loading) {
    return <div className="p-4 text-center">Loading map data...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading map: {error}</p>
        <p className="text-sm mt-2">
          Debug info: {JSON.stringify({
            hasDirectLocations: Boolean(directLocations && directLocations.length),
            hasItineraryId: Boolean(itineraryId),
            locationsCount: locations?.length || 0,
          })}
        </p>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>No locations available for this map</p>
        <p className="text-sm mt-2">
          Debug info: {JSON.stringify({
            hasDirectLocations: Boolean(directLocations && directLocations.length),
            hasItineraryId: Boolean(itineraryId),
            locationsCount: locations?.length || 0,
          })}
        </p>
      </div>
    );
  }

  // Find first valid location for initial center or default to Tokyo
  const defaultCenter = [35.6895, 139.6917]; // Tokyo
  let center = defaultCenter;

  // Try to find a valid location for the center
  for (const loc of locations) {
    const lat = parseFloat(loc.latitude || loc.lat);
    const lng = parseFloat(loc.longitude || loc.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      center = [lat, lng];
      console.log("Found valid center:", center);
      break;
    }
  }

  return (
    <div className="map-container" style={{ height: "500px", width: "100%" }}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(map) => {
          console.log("Map created");
          // Force map to update its size after container might have changed
          setTimeout(() => {
            map.invalidateSize();
            console.log("Map size invalidated");
          }, 300);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapView locations={locations} />

        {locations
          .filter((loc) => {
            const hasCoords = (loc.latitude || loc.lat) && (loc.longitude || loc.lng);
            const validCoords = !isNaN(parseFloat(loc.latitude || loc.lat)) && !isNaN(parseFloat(loc.longitude || loc.lng));
            return hasCoords && validCoords;
          })
          .map((loc, index) => {
            const lat = parseFloat(loc.latitude || loc.lat);
            const lng = parseFloat(loc.longitude || loc.lng);
            console.log(`Marker ${index} at [${lat}, ${lng}]`);

            return (
              <Marker
                key={`marker-${index}-${loc.name || "location"}`}
                position={[lat, lng]}
              >
                <Popup>
                  <div>
                    <strong>{loc.name || "Unnamed Location"}</strong>
                    {loc.address && <p>{loc.address}</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}