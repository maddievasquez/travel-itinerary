// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useItinerary } from "../../hooks/useItinerary";
// import Card, { CardHeader, CardTitle, CardContent } from "../ui/card";
// import ItineraryCard from "./ItineraryCard";
// import MapComponent from "../Map/MapComponent";

// export default function ItineraryPage() {
//   const { itineraryId } = useParams();
//   const navigate = useNavigate();
//   const { itinerary, loading, error, fetchItinerary } = useItinerary();
//   const [mapLocations, setMapLocations] = useState([]);

//   useEffect(() => {
//     if (itineraryId) {
//       fetchItinerary(itineraryId).catch(() => {
//         navigate("/");
//       });
//     } else {
//       navigate("/");
//     }
//   }, [itineraryId, navigate, fetchItinerary]);

//   // Process locations for map when itinerary changes
//   useEffect(() => {
//     if (itinerary?.days) {
//       const locations = itinerary.days.flatMap(day => 
//         (day.locations || []).map(loc => ({
//           latitude: loc.latitude ? parseFloat(loc.latitude) : null,
//           longitude: loc.longitude ? parseFloat(loc.longitude) : null,
//           name: loc.name || `Location in Day ${day.day}`,
//           address: loc.address || ''
//         })).filter(loc => loc.latitude && loc.longitude)
//       );
//       setMapLocations(locations);
//     }
//   }, [itinerary]);

//   // Process locations for map when itinerary changes
//   useEffect(() => {
//     if (itinerary && itinerary.days && Array.isArray(itinerary.days)) {
//       try {
//         const locations = itinerary.days.flatMap((day) => {
//           if (!day.locations || !Array.isArray(day.locations)) return [];
          
//           return day.locations.map((loc) => ({
//             latitude: loc.latitude ? parseFloat(loc.latitude) : null,
//             longitude: loc.longitude ? parseFloat(loc.longitude) : null,
//             name: loc.name || `Location in Day ${day.day}`,
//             address: loc.address || ''
//           })).filter(loc => loc.latitude !== null && loc.longitude !== null);
//         });
        
//         setMapLocations(locations);
//       } catch (error) {
//         console.error("Error processing locations:", error);
//         setMapLocations([]);
//       }
//     } else {
//       setMapLocations([]);
//     }
//   }, [itinerary]);

//   if (loading) return <p className="text-center text-lg">Loading itinerary...</p>;
//   if (error) return <p className="text-center text-lg text-red-500">{error}</p>;
//   if (!itinerary) return <p className="text-center text-lg">No itinerary found</p>;

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-150px)] p-6">
//       {/* Left Section - Itinerary Activities */}
//       <div className="lg:col-span-1 overflow-y-auto max-h-full p-4 bg-white shadow-md rounded-lg">
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text shadow-lg p-2 rounded-lg">
//               Itinerary for {itinerary.city}
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {itinerary.days && Array.isArray(itinerary.days) ? (
//               itinerary.days.map((day) => (
//                 <ItineraryCard key={day.day} day={day.day} locations={day.locations} activities={day.activities} />
//               ))
//             ) : (
//               <p>No itinerary days available</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
      
//       {/* Right Section - Map */}
//       <div className="lg:col-span-2 flex flex-col">
//         <Card className="flex-grow">
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold">Map View</CardTitle>
//           </CardHeader>
//           <CardContent className="h-full">
//             <MapComponent locations={mapLocations} />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// ItineraryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MapComponent from '../Map/MapComponent';

const fetchItinerary = async (id) => {
  const response = await fetch(`/api/itineraries/${id}/`);
  if (!response.ok) throw new Error('Itinerary not found');
  return response.json();
};

export default function ItineraryPage() {
  const { id } = useParams();
  
  const { 
    data: itinerary, 
    isLoading, 
    error,
    isError 
  } = useQuery({
    queryKey: ['itinerary', id],
    queryFn: () => fetchItinerary(id)
  });

  if (isLoading) return <div className="loading-spinner">Loading itinerary...</div>;
  if (isError) return <div className="error-message">Error: {error.message}</div>;

  const mapLocations = itinerary.days.flatMap(day => 
    day.locations.map(loc => ({
      ...loc,
      day: day.day
    }))
  );
  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{itinerary.title || `Trip to ${itinerary.city}`}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <span className="mr-4">{itinerary.city}</span>
          <span>
            {new Date(itinerary.start_date).toLocaleDateString()} - 
            {new Date(itinerary.end_date).toLocaleDateString()}
          </span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {itinerary.days.map(day => (
            <div key={day.day} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-bold text-lg">Day {day.day}</h2>
              <div className="mt-2 space-y-3">
                {day.activities.map(activity => (
                  <div key={activity.id} className="border-l-2 border-teal-500 pl-3">
                    <h3 className="font-medium">{activity.description}</h3>
                    <p className="text-sm text-gray-600">
                      {activity.start_time} - {activity.end_time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-2">
          <div className="h-[600px] rounded-lg overflow-hidden">
            <MapComponent 
              locations={mapLocations}
              center={{
                lat: parseFloat(mapLocations[0]?.latitude || 0),
                lng: parseFloat(mapLocations[0]?.longitude || 0)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}