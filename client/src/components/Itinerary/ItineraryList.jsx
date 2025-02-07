import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

export function ItineraryList({ itineraries, selectItinerary }) {
  return (
    <div className="grid gap-4">
      {itineraries.map((itinerary) => (
        <Card
          key={itinerary.id}
          className="cursor-pointer hover:bg-gray-100 p-4 rounded-lg"
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
              {itinerary.start_date} - {itinerary.end_date}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
