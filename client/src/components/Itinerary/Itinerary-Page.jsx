import React, { useState } from "react";
import { useItinerary } from "../hooks/useItinerary";
import ItineraryList from "../components/Itinerary/ItineraryList";
import ItineraryCard from "../components/Itinerary/ItineraryCard";
import MapComponent from "../components/Map/MapComponent";

export default function ItineraryPage() {
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const { itinerary, loading, error } = useItinerary("Paris", "2024-06-01", "2024-06-05");

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{itinerary.itinerary.title}</h1>

      <div className="grid md:grid-cols-2 gap-6 sm:grid-cols-1">

        {/* Left Panel - Itinerary List & Activities */}
        <div>
          <ItineraryList itineraries={[itinerary.itinerary]} selectItinerary={setSelectedItinerary} />
          {selectedItinerary &&
            itinerary.days.map((dayData, index) => (
              <ItineraryCard key={index} day={dayData.day} locations={dayData.locations} activities={dayData.activities} />
            ))}
        </div>

        {/* Right Panel - Map */}
        <div>
        <MapComponent locations={itinerary.days.flatMap(day => day.locations)} aria-label="Map of itinerary locations" />

        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useState } from "react";
// import { Home } from "./components/Home";
// import { generateItinerary } from "./Utils/helpers";
// import { cities, cityActivities } from "./data/cities";

// export default function ItineraryPage() {
//   const [currentView, setCurrentView] = useState("home");
//   const [itineraries, setItineraries] = useState([]);
//   const [currentItinerary, setCurrentItinerary] = useState(null);

//   const addItinerary = (newItinerary) => {
//     if (newItinerary.name && newItinerary.city && newItinerary.startDate && newItinerary.endDate) {
//       const generatedItems = generateItinerary(newItinerary.city, newItinerary.startDate, newItinerary.endDate, cityActivities);
//       const itinerary = {
//         id: Date.now(),
//         ...newItinerary,
//         items: generatedItems,
//       };
//       setItineraries([...itineraries, itinerary]);
//       setCurrentItinerary(itinerary);
//       setCurrentView("itinerary");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {currentView === "home" && <Home itineraries={itineraries} setCurrentView={setCurrentView} setCurrentItinerary={setCurrentItinerary} />}
//       {/* Other Views: Itinerary Details, Dashboard, etc. */}
//     </div>
//   );
// }
