import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Enhanced icon creation with better visibility
const createCategoryIcon = (category) => {
  // Color scheme for different categories
  const colorMap = {
    restaurant: '#E74C3C',  // Red
    food: '#E74C3C',
    hotel: '#3498DB',       // Blue
    accommodation: '#3498DB',
    attraction: '#2ECC71',  // Green
    landmark: '#2ECC71',
    cafe: '#F39C12',        // Orange
    coffee: '#F39C12',
    transport: '#9B59B6',   // Purple
    transit: '#9B59B6',
    default: '#3388FF'      // Light blue
  };

  // Icon components with better visibility
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

const MapComponent = ({ locations = [], center }) => {
  const [map, setMap] = useState(null);
  const [validLocations, setValidLocations] = useState([]);
  
  const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // Default to NYC
  const mapCenter = center || defaultCenter;
  
  useEffect(() => {
    if (locations.length > 0) {
      const processed = locations.filter(loc =>
        loc?.latitude && loc?.longitude && !isNaN(loc.latitude) && !isNaN(loc.longitude)
      );
      setValidLocations(processed);

      if (processed.length > 0 && map) {
        const bounds = L.latLngBounds(processed.map(loc => [loc.latitude, loc.longitude]));
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [locations, map]);

  return (
    <div className="relative h-full w-full">
      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={13} 
        style={{ 
          height: '100%', 
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }} 
        whenCreated={setMap}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; OpenStreetMap contributors' 
        />
        {validLocations.map((location, index) => (
          <Marker
            key={index}
            position={[location.latitude, location.longitude]}
            icon={createCategoryIcon(location.category)}
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
                {location.description && (
                  <p className="text-sm mt-2 text-gray-700">
                    {location.description}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;