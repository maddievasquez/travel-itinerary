import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "date-fns";
import ItineraryCard from "./ItineraryCard";
import MapComponent from "../Map/MapComponent";

export default function ItineraryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const itinerary = location.state?.itinerary;

  useEffect(() => {
    if (!itinerary) {
      navigate("/"); // Redirect to Home if no itinerary is found
    }
  }, [itinerary, navigate]);

  if (!itinerary) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] p-6">
      {/* Left Section - Itinerary Activities */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Itinerary for {itinerary.city}</CardTitle>
          </CardHeader>
          <CardContent>
  {itinerary.days.map((day) => (
    <ItineraryCard key={day.day} day={day.day} locations={day.locations} activities={day.activities} />
  ))}
</CardContent>

        </Card>
      </div>

      {/* Right Section - Map */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
          </CardHeader>
          <CardContent>
          <MapComponent
  locations={itinerary.days.flatMap((day) =>
    day.locations.map((loc) => ({
      lat: parseFloat(loc.latitude),
      lng: parseFloat(loc.longitude),
      name: loc.name,
    }))
  )}
/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




// import React, { useState, useEffect } from "react";
// import { useItinerary } from "hooks/useItinerary";
// import ItineraryList from "components/itinerary/ItineraryList";
// import ItineraryCard from "components/itinerary/ItineraryCard";
// import MapComponent from "components/Map/MapComponent";

// export default function ItineraryPage() {
//   const [selectedItinerary, setSelectedItinerary] = useState(null);
//   const { itinerary, loading, error, createItinerary } = useItinerary();

//   // ✅ Fetch itinerary when selectedItinerary changes
//   useEffect(() => {
//     if (!itinerary) {
//       createItinerary("Paris", "2024-06-01", "2024-06-05");
//     }
//   }, [selectedItinerary]);  // Re-fetch when selection changes

//   if (loading) return <div className="spinner">Loading...</div>;
//   if (error) return <div className="error-message">Error: {error.message}</div>;
//   if (!itinerary) return <div className="text-gray-500">No itinerary available.</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{itinerary?.itinerary?.title || "Your Itinerary"}</h1>

//       <div className="grid md:grid-cols-2 gap-6 sm:grid-cols-1">

//         {/* Left Panel - Itinerary List & Activities */}
//         <div>
//           <ItineraryList itineraries={[itinerary.itinerary]} selectItinerary={setSelectedItinerary} />
//           {selectedItinerary && itinerary?.days?.map((dayData, index) => (
//             <ItineraryCard key={index} day={dayData.day} locations={dayData.locations} activities={dayData.activities} />
//           ))}
//         </div>

//         {/* Right Panel - Map */}
//         <div>
//         <MapComponent locations={itinerary?.days?.flatMap(day => day.locations) || []} aria-label="Map of itinerary locations" />
//         </div>
//       </div>
//     </div>
//   );
// }


// // "use client";
// // import { useState } from "react";
// // import { Home } from "./components/Home";
// // import { generateItinerary } from "./Utils/helpers";
// // import { cities, cityActivities } from "./data/cities";

// // export default function ItineraryPage() {
// //   const [currentView, setCurrentView] = useState("home");
// //   const [itineraries, setItineraries] = useState([]);
// //   const [currentItinerary, setCurrentItinerary] = useState(null);

// //   const addItinerary = (newItinerary) => {
// //     if (newItinerary.name && newItinerary.city && newItinerary.startDate && newItinerary.endDate) {
// //       const generatedItems = generateItinerary(newItinerary.city, newItinerary.startDate, newItinerary.endDate, cityActivities);
// //       const itinerary = {
// //         id: Date.now(),
// //         ...newItinerary,
// //         items: generatedItems,
// //       };
// //       setItineraries([...itineraries, itinerary]);
// //       setCurrentItinerary(itinerary);
// //       setCurrentView("itinerary");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100">
// //       {currentView === "home" && <Home itineraries={itineraries} setCurrentView={setCurrentView} setCurrentItinerary={setCurrentItinerary} />}
// //       {/* Other Views: Itinerary Details, Dashboard, etc. */}
// //     </div>
// //   );
// // }
