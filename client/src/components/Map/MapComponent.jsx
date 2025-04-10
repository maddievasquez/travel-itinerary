import React, { useEffect, useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createCategoryIcon = (category) => {
  const colorMap = {
    restaurant: '#E74C3C',
    food: '#E74C3C',
    hotel: '#3498DB',
    accommodation: '#3498DB',
    attraction: '#2ECC71',
    landmark: '#2ECC71',
    cafe: '#F39C12',
    coffee: '#F39C12',
    transport: '#9B59B6',
    transit: '#9B59B6',
    default: '#3388FF'
  };

  const iconMap = {
    restaurant: '🍴',
    food: '🍔',
    hotel: '🏨',
    accommodation: '🛏️',
    attraction: '🏛️',
    landmark: '🗽',
    cafe: '☕',
    coffee: '☕',
    transport: '🚌',
    transit: '🚆',
    default: '📍'
  };

  const color = colorMap[category?.toLowerCase()] || colorMap.default;
  const icon = iconMap[category?.toLowerCase()] || iconMap.default;

  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        font-size: 18px;
        color: white;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      ">
        ${icon}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

// Helper component to handle map updates
const MapBoundsUpdater = ({ locations, center }) => {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      try {
        const bounds = L.latLngBounds(
          locations.map(loc => [loc.latitude, loc.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error("Error fitting bounds:", error);
        // Fallback to center if bounds fail
        if (center && center.lat && center.lng) {
          map.setView([center.lat, center.lng], 13);
        }
      }
    } else if (center && center.lat && center.lng) {
      // If no locations but we have a center, use it
      map.setView([center.lat, center.lng], 13);
    }
  }, [locations, center, map]);

  return null;
};

// Component to handle scroll wheel behavior
const ScrollHandler = () => {
  const map = useMap();
  
  useEffect(() => {
    // Disable scroll wheel zoom by default
    map.scrollWheelZoom.disable();
    
    // Enable scroll wheel zoom on focus/click
    const enableScrollOnFocus = () => {
      map.scrollWheelZoom.enable();
    };
    
    // Disable scroll wheel zoom when mouse leaves
    const disableScrollOnBlur = () => {
      map.scrollWheelZoom.disable();
    };
    
    // Add event listeners
    map.on('focus', enableScrollOnFocus);
    map.on('click', enableScrollOnFocus);
    map.on('mouseout', disableScrollOnBlur);
    
    // Cleanup
    return () => {
      map.off('focus', enableScrollOnFocus);
      map.off('click', enableScrollOnFocus);
      map.off('mouseout', disableScrollOnBlur);
    };
  }, [map]);
  
  return null;
};

const MapComponent = ({ 
  locations = [], 
  center,
  loading,
  error,
  onRetry,
  containerRef
}) => {
  const [mapInstance, setMapInstance] = useState(null);
  const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // Default to NYC
  const mapRef = useRef(null);

  // Filter out invalid locations
  const validLocations = useMemo(() => 
    locations.filter(loc => 
      loc?.latitude && loc?.longitude && 
      !isNaN(loc.latitude) && !isNaN(loc.longitude)
    ),
    [locations]
  );

  // Connect containerRef with wheel event prevention (for scroll isolation)
  useEffect(() => {
    if (!containerRef?.current) return;
    
    const container = containerRef.current;
    
    // Prevent wheel events from propagating to parent elements
    const preventWheelPropagation = (e) => {
      if (mapRef.current && mapRef.current.contains(e.target)) {
        e.stopPropagation();
      }
    };
    
    // Add listeners
    container.addEventListener('wheel', preventWheelPropagation, { passive: false });
    
    // Cleanup
    return () => {
      container.removeEventListener('wheel', preventWheelPropagation);
    };
  }, [containerRef]);

  return (
    <div className="relative h-full w-full" ref={mapRef}>
      {/* Loading/Error Overlay */}
      {(loading || error) && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-[1000] flex flex-col items-center justify-center p-4">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading map data...</p>
            </div>
          ) : error ? (
            <div className="text-center max-w-md">
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Error loading locations</p>
                <p className="mt-2 text-sm">{typeof error === 'string' ? error : error.message}</p>
                {onRetry && (
                  <button 
                    onClick={onRetry}
                    className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* The Map */}
      <MapContainer 
        center={[center?.lat || defaultCenter.lat, center?.lng || defaultCenter.lng]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMapInstance}
        scrollWheelZoom={false} // Disable initially
        attributionControl={true}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Map controllers */}
        <MapBoundsUpdater locations={validLocations} center={center} />
        <ScrollHandler />
        
        {/* Location Markers */}
        {validLocations.map((location, index) => (
          <Marker
            key={`${location.id || index}-${location.latitude}-${location.longitude}`}
            position={[location.latitude, location.longitude]}
            icon={createCategoryIcon(location.category)}
            title={location.name || 'Location'}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 font-semibold text-lg">
                  {location.name || 'Unnamed Location'}
                </div>
                {location.address && (
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <span className="mr-1">📍</span>
                    {location.address}
                  </p>
                )}
                {location.category && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs capitalize">
                      {location.category}
                    </span>
                  </p>
                )}
                {location.context?.description && (
                  <p className="text-sm mt-2 text-gray-700">
                    {location.context.description}
                  </p>
                )}
                {location.context?.time && (
                  <p className="text-xs mt-1 text-gray-500">
                    ⏰ {location.context.time}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* No Locations Message */}
      {validLocations.length === 0 && !loading && !error && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center p-4 text-center">
          <p className="text-gray-700">No valid locations to display on the map</p>
        </div>
      )}

      {/* Add some CSS for the map */}
      <style jsx>{`
        :global(.leaflet-container) {
          z-index: 1; /* Ensure map stays behind other elements when needed */
        }
        :global(.custom-popup .leaflet-popup-content-wrapper) {
          border-radius: 8px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default MapComponent;