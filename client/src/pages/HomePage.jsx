import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Globe } from "lucide-react";
import ItineraryForm from "../components/itinerary/ItineraryForm";
import { useItinerary } from "../hooks/useItinerary"; // ✅ Calls the API

export default function HomePage() {
  const navigate = useNavigate();
  const { createItinerary, itinerary, loading, error } = useItinerary();

  // Function to handle successful itinerary creation
  const handleItineraryCreated = async (city, startDate, endDate) => {
    await createItinerary(city, startDate, endDate);

    if (itinerary) {
      navigate("/itinerary", { state: { itinerary } }); // Redirect to Itinerary Page
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-6">
      <Card className="w-full max-w-lg rounded-lg shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center text-4xl font-bold text-white">
            <Globe className="mr-2" /> Plan Your Dream Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-lg p-6 shadow-lg">
          {/* Pass the callback to handle navigation after itinerary creation */}
          <ItineraryForm onCreate={handleItineraryCreated} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
