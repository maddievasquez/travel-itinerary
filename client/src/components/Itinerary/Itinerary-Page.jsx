import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ItineraryCard from "./ItineraryCard";
import MapComponent from "../Map/MapComponent";

export default function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
  const [mapLocations, setMapLocations] = useState([]);
  
  // Log location state for debugging
  useEffect(() => {
    console.log("Location state:", location.state);
    if (location.state?.itinerary) {
      setItinerary(location.state.itinerary);
      localStorage.setItem("itinerary", JSON.stringify(location.state.itinerary));
    } else {
      const savedItinerary = localStorage.getItem("itinerary");
      if (savedItinerary) {
        try {
          const parsedItinerary = JSON.parse(savedItinerary);
          setItinerary(parsedItinerary);
          console.log("Loaded itinerary from localStorage:", parsedItinerary);
        } catch (error) {
          console.error("Error parsing saved itinerary:", error);
          navigate("/");
        }
      } else {
        console.log("No itinerary found in localStorage, redirecting to home");
        navigate("/");
      }
    }
  }, [location.state, navigate]);
  
  // Process locations for map when itinerary changes
  useEffect(() => {
    if (itinerary && itinerary.days && Array.isArray(itinerary.days)) {
      console.log("Processing itinerary for map locations:", itinerary);
      
      try {
        const locations = itinerary.days.flatMap((day) => {
          if (!day.locations || !Array.isArray(day.locations)) {
            console.warn(`Day ${day.day} has no locations array`);
            return [];
          }
          
          return day.locations.map((loc) => {
            // Ensure we have valid data
            const latitude = loc.latitude ? parseFloat(loc.latitude) : null;
            const longitude = loc.longitude ? parseFloat(loc.longitude) : null;
            
            return {
              latitude: latitude,
              longitude: longitude,
              name: loc.name || `Location in Day ${day.day}`,
              address: loc.address || ''
            };
          }).filter(loc => loc.latitude !== null && loc.longitude !== null);
        });
        
        console.log("Processed locations for map:", locations);
        setMapLocations(locations);
      } catch (error) {
        console.error("Error processing locations:", error);
        setMapLocations([]);
      }
    } else {
      console.warn("Itinerary is missing or has invalid structure");
      setMapLocations([]);
    }
  }, [itinerary]);

  if (!itinerary) return <p className="text-center text-lg">Loading itinerary...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-150px)] p-6">
      {/* Left Section - Itinerary Activities */}
      <div className="lg:col-span-1 overflow-y-auto max-h-full p-4 bg-white shadow-md rounded-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text shadow-lg p-2 rounded-lg">
              Itinerary for {itinerary.city}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {itinerary.days && Array.isArray(itinerary.days) ? (
              itinerary.days.map((day) => (
                <ItineraryCard key={day.day} day={day.day} locations={day.locations} activities={day.activities} />
              ))
            ) : (
              <p>No itinerary days available</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Right Section - Map */}
      <div className="lg:col-span-2 flex flex-col">
        <Card className="flex-grow">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Map View</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            {console.log("Map locations before passing to MapComponent:", mapLocations)}
            
            {/* Debug information about locations */}
            <div className="text-xs text-gray-500 mb-2">
              Locations count: {mapLocations.length}
              {mapLocations.length > 0 && (
                <span> (First location: {JSON.stringify(mapLocations[0])})</span>
              )}
            </div>
            
            {/* Pass the processed locations directly to MapComponent */}
            <MapComponent locations={mapLocations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}