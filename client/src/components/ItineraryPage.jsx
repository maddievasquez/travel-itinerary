import { useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";

export default function ItineraryMaster() {
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itineraryData = {
      title,
      city,
      start_date: date.from,
      end_date: date.to,
      description,
    };

    const response = await fetch("http://127.0.0.1:8000/api/itinerary/itineraries/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you are using token-based authentication
      },
      body: JSON.stringify(itineraryData),
    });

    if (response.ok) {
      // Handle successful response
      console.log("Itinerary created successfully");
    } else {
      // Handle error response
      console.error("Failed to create itinerary");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">Itinerary Master</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Plan a New Trip</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Summer Vacation"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Destination Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Where to?</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Paris, Hawaii, Japan"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Dates (optional)</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 w-full border rounded-lg text-left"
                  onClick={() => setDate({ ...date, from: new Date() })}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date.from ? date.from.toLocaleDateString() : "Start Date"}
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 w-full border rounded-lg text-left"
                  onClick={() => setDate({ ...date, to: new Date() })}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date.to ? date.to.toLocaleDateString() : "End Date"}
                </button>
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., A fun trip to explore the city"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Start Planning Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Planning
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-6">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © 2025 Itinerary Master. All rights reserved.
        </div>
      </footer>
    </div>
  );
}