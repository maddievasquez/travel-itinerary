import { useNavigate } from "react-router-dom";
import useUserItineraries from "../hooks/useUserItineraries";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function MyItineraries() {
  const navigate = useNavigate();
  const { itineraries, loading, error } = useUserItineraries();

  if (loading) return <p className="text-center">Loading your itineraries...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">My Itineraries</h1>
      
      {itineraries.length === 0 ? (
        <p className="text-center">You have no saved itineraries.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((itinerary) => (
            <Card
              key={itinerary.id}
              className="cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition"
              onClick={() => navigate(`/itinerary/${itinerary.id}`)} // ✅ Navigate to itinerary details
            >
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2" /> {itinerary.city}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  {format(new Date(itinerary.start_date), "MMM d")} - {format(new Date(itinerary.end_date), "MMM d, yyyy")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
