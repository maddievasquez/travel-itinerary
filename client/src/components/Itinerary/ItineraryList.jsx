import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function ItineraryList({ itineraries, selectItinerary }) {
  return (
    <div className="space-y-4">
      {itineraries.map((itinerary) => (
        <Card
          key={itinerary.id}
          className="group border-2 border-transparent hover:border-teal transition-all duration-300 rounded-2xl shadow-md hover:shadow-xl overflow-hidden"
          onClick={() => selectItinerary(itinerary)}
        >
          <div className="flex items-center justify-between p-5 bg-white">
            <div className="flex items-center space-x-4">
              <div className="bg-teal/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-teal" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-midnight-blue flex items-center">
                  {itinerary.city}
                </CardTitle>
                <CardContent className="p-0 mt-1">
                  <p className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4 text-teal" />
                    {format(new Date(itinerary.start_date), "MMM d")} - {format(new Date(itinerary.end_date), "MMM d, yyyy")}
                  </p>
                </CardContent>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-teal transition-colors" />
            </div>
        </Card>
      ))}
    </div>
  );
}