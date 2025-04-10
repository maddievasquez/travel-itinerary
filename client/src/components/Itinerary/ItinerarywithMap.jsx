import React, { useState, useEffect } from 'react';
import ItineraryCard from './ItineraryCard';
import MapComponent from './MapComponent';

const ItineraryWithMap = ({ itineraryData }) => {
  // State to track which day is selected
  const [selectedDay, setSelectedDay] = useState(null);
  // State to track locations to display on map
  const [displayLocations, setDisplayLocations] = useState([]);
  // Track loading and error states for map
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all locations from itinerary data for reference
  const allLocations = itineraryData.flatMap(day => day.locations || []);

  // Calculate center point for map based on all locations
  const mapCenter = React.useMemo(() => {
    if (allLocations.length === 0) return { lat: 40.7128, lng: -74.0060 }; // Default to NYC
    
    const validLocations = allLocations.filter(loc => 
      loc?.latitude && loc?.longitude && 
      !isNaN(loc.latitude) && !isNaN(loc.longitude)
    );
    
    if (validLocations.length === 0) return { lat: 40.7128, lng: -74.0060 };
    
    const sumLat = validLocations.reduce((sum, loc) => sum + parseFloat(loc.latitude), 0);
    const sumLng = validLocations.reduce((sum, loc) => sum + parseFloat(loc.longitude), 0);
    
    return {
      lat: sumLat / validLocations.length,
      lng: sumLng / validLocations.length
    };
  }, [allLocations]);

  // Update map locations when selected day changes
  useEffect(() => {
    setLoading(true);
    
    try {
      if (selectedDay === null) {
        // If no day selected, show all locations
        setDisplayLocations(allLocations);
      } else {
        // Find the day data
        const dayData = itineraryData.find(day => day.day === selectedDay);
        
        if (dayData) {
          // Get day locations or extract from activities
          let dayLocations = dayData.locations || [];
          
          // If no explicit locations, extract from activities
          if (dayLocations.length === 0 && dayData.activities) {
            const locationsFromActivities = dayData.activities
              .map(activity => activity.location)
              .filter(loc => loc && (loc.latitude || (typeof loc === 'object' && loc.id)));
              
            // Remove duplicates
            dayLocations = locationsFromActivities.reduce((unique, loc) => {
              return unique.some(u => 
                (u.id && loc.id && u.id === loc.id) || 
                (u.latitude && loc.latitude && u.latitude === loc.latitude && u.longitude === loc.longitude)
              ) ? unique : [...unique, loc];
            }, []);
          }
          
          setDisplayLocations(dayLocations);
        } else {
          setDisplayLocations([]);
        }
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDay, itineraryData, allLocations]);

  // Function to handle day selection from ItineraryCard
  const handleDaySelect = (day) => {
    setSelectedDay(day === selectedDay ? null : day);
  };

  // Function to retry loading map if there was an error
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Simulate loading then reset
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Itinerary Cards Section */}
      <div className="w-full md:w-2/5 lg:w-1/3 overflow-y-auto p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Your Itinerary</h2>
        
        {itineraryData.map(dayData => (
          <ItineraryCard
            key={`day-${dayData.day}`}
            day={dayData.day}
            locations={dayData.locations || []}
            activities={dayData.activities || []}
            selectedDay={selectedDay}
            onDaySelect={handleDaySelect}
            usedLocations={[]}
            allLocations={allLocations}
          />
        ))}
      </div>
      
      {/* Map Section */}
      <div className="w-full md:w-3/5 lg:w-2/3 h-1/2 md:h-full">
        <MapComponent
          locations={displayLocations}
          center={mapCenter}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
};

export default ItineraryWithMap;