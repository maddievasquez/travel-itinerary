"use client";
import { useState } from "react";
import { Home } from "./components/Home";
import { generateItinerary } from "./Utils/helpers";
import { cities, cityActivities } from "./data/cities";

export default function ItineraryPage() {
  const [currentView, setCurrentView] = useState("home");
  const [itineraries, setItineraries] = useState([]);
  const [currentItinerary, setCurrentItinerary] = useState(null);

  const addItinerary = (newItinerary) => {
    if (newItinerary.name && newItinerary.city && newItinerary.startDate && newItinerary.endDate) {
      const generatedItems = generateItinerary(newItinerary.city, newItinerary.startDate, newItinerary.endDate, cityActivities);
      const itinerary = {
        id: Date.now(),
        ...newItinerary,
        items: generatedItems,
      };
      setItineraries([...itineraries, itinerary]);
      setCurrentItinerary(itinerary);
      setCurrentView("itinerary");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentView === "home" && <Home itineraries={itineraries} setCurrentView={setCurrentView} setCurrentItinerary={setCurrentItinerary} />}
      {/* Other Views: Itinerary Details, Dashboard, etc. */}
    </div>
  );
}
