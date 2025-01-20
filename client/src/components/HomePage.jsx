"use client";

import { useState } from "react";
import { Plus, MapPin } from "lucide-react";

export default function HomePage() {
  const [recentTrips] = useState([
    {
      id: "1",
      destination: "Paris, France",
      startDate: "2024-06-15",
      endDate: "2024-06-22",
    },
    {
      id: "2",
      destination: "Tokyo, Japan",
      startDate: "2024-08-01",
      endDate: "2024-08-14",
    },
  ]);

  const [suggestions] = useState([
    {
      id: "1",
      destination: "Bali, Indonesia",
      description: "Experience tropical paradise and rich culture.",
    },
    {
      id: "2",
      destination: "Santorini, Greece",
      description: "Enjoy stunning sunsets and white-washed architecture.",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Travel Planner</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Create New Itinerary */}
        <section className="mb-8">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Create New Itinerary</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter destination"
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                className="w-full p-2 border rounded"
                placeholder="Start Date"
              />
              <input
                type="date"
                className="w-full p-2 border rounded"
                placeholder="End Date"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded"
              >
                <Plus className="inline-block mr-2" />
                Create Itinerary
              </button>
            </form>
          </div>
        </section>

        {/* Suggestions */}
        <section className="mb-8">
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Travel Suggestions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{suggestion.destination}</h3>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Trips */}
        <section>
          <div className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Recent Trips</h2>
            {recentTrips.length === 0 ? (
              <p className="text-gray-600">No trips planned yet.</p>
            ) : (
              <ul className="space-y-4">
                {recentTrips.map((trip) => (
                  <li
                    key={trip.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{trip.destination}</h3>
                      <p className="text-sm text-gray-600">
                        {trip.startDate} - {trip.endDate}
                      </p>
                    </div>
                    <MapPin className="text-blue-500" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
