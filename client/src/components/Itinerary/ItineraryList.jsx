import Card, { CardHeader, CardTitle, CardContent } from "../ui/card";
import { Calendar, MapPin, ChevronRight, Loader } from "lucide-react";
import { format } from "date-fns";
import PropTypes from 'prop-types';

export default function ItineraryList({ itineraries = [], selectItinerary, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin h-8 w-8 text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading itineraries: {error.message}
      </div>
    );
  }

  if (!itineraries.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No itineraries found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {itineraries.map((itinerary) => (
        <Card
          key={itinerary.id}
          className="group border-2 border-transparent hover:border-teal-500 transition-all duration-300 rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer"
          onClick={() => selectItinerary(itinerary)}
        >
          <div className="flex items-center justify-between p-5 bg-white">
            <div className="flex items-center space-x-4">
              <div className="bg-teal-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  {itinerary.city}
                </CardTitle>
                <CardContent className="p-0 mt-1">
                  <p className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4 text-teal-600" />
                    {format(new Date(itinerary.start_date), "MMM d")} - {format(new Date(itinerary.end_date), "MMM d, yyyy")}
                  </p>
                  {itinerary.description && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                      {itinerary.description}
                    </p>
                  )}
                </CardContent>
              </div>
            </div>
            <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
          </div>
        </Card>
      ))}
    </div>
  );
}

ItineraryList.propTypes = {
  itineraries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      city: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      description: PropTypes.string,
    })
  ),
  selectItinerary: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
};