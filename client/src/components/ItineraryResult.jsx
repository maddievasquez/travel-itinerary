import React, { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
  } from "react-router-dom";
interface Location {
  id: number;
  name: string;
  day: number;
  lat: number;
  lng: number;
}

export default function ItineraryResults({ city, startDate, endDate }: { city: string; startDate: string; endDate: string }) {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    async function fetchItinerary() {
      try {
        const response = await fetch(`/api/itinerary?city=${city}&startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching itinerary:", error);
      }
    }

    fetchItinerary();
  }, [city, startDate, endDate]);

  return (
    <div className="md:w-1/2">
      <h2 className="text-2xl font-semibold mb-4">Itinerary for {city}</h2>
      {[...new Set(locations.map((loc) => loc.day))].map((day) => (
        <div key={day} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Day {day}</h3>
          <ul className="space-y-2">
            {locations
              .filter((location) => location.day === day)
              .map((location) => (
                <li key={location.id} className="bg-white shadow rounded-lg p-4">
                  {location.name}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}