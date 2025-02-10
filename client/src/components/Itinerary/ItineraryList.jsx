import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
export default function ItineraryList({ itineraries, selectItinerary }) {
  return (
    <div className="grid gap-4">
      {itineraries.map((itinerary) => (
        <Card
          key={itinerary.id}
          className="cursor-pointer hover:bg-gray-100 p-4 rounded-lg transition"
          onClick={() => selectItinerary(itinerary)}
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
  );
}
