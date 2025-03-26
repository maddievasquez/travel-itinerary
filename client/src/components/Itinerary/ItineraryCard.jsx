import Card, { CardHeader, CardTitle, CardContent } from "../ui/card";
import { format } from "date-fns";
import { 
  MapPin, 
  Activity,
  Landmark,
  Castle,
  Mountain,
  Utensils,
  Hotel,
  ShoppingBag,
  Camera,
  Trees,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from "lucide-react";

// Icon mapping based on location types
const LOCATION_ICONS = {
  landmark: <Landmark className="h-5 w-5 text-teal-600" />,
  historic: <Landmark className="h-5 w-5 text-amber-500" />,
  temple: <Castle className="h-5 w-5 text-purple-600" />,
  religious: <Castle className="h-5 w-5 text-purple-500" />,
  park: <Trees className="h-5 w-5 text-emerald-600" />,
  nature: <Mountain className="h-5 w-5 text-green-600" />,
  restaurant: <Utensils className="h-5 w-5 text-red-500" />,
  hotel: <Hotel className="h-5 w-5 text-blue-500" />,
  shopping: <ShoppingBag className="h-5 w-5 text-indigo-500" />,
  photo: <Camera className="h-5 w-5 text-gray-500" />,
  default: <MapPin className="h-5 w-5 text-teal-500" />
};

export default function ItineraryCard({ day, locations, activities }) {
  const getLocationIcon = (location) => {
    const category = location?.category?.toLowerCase();
    return LOCATION_ICONS[category] || LOCATION_ICONS.default;
  };

  return (
    <Card className="mb-6 border-2 border-teal/20 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Gradient Header */}
      <CardHeader className="bg-gradient-to-r from-teal-600 to-midnight-blue text-white py-5 px-6">
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <span className="bg-white/20 p-2 rounded-full">
            <Activity className="h-5 w-5" />
          </span>
          <span>
            Day {day}
            <span className="block text-sm font-normal opacity-90">
              {activities[0]?.date && format(new Date(activities[0].date), "MMMM d, yyyy")}
            </span>
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Locations Section */}
        <div>
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <MapPin className="h-5 w-5 mr-3 text-teal-600" />
            <h3 className="text-lg font-semibold text-midnight-blue">Locations</h3>
          </div>
          {locations.length > 0 ? (
            <div className="space-y-3">
              {locations.map((loc, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-teal-50 transition-colors">
                  <div className="mt-1">
                    {getLocationIcon(loc)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-midnight-blue text-base">{loc.name}</p>
                    <p className="text-sm text-gray-600">{loc.address}</p>
                    {loc.category && (
                      <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {loc.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-4">No locations added yet.</p>
          )}
        </div>

        {/* Activities Section */}
        <div>
          <div className="flex items-center mb-4 pb-2 border-b border-gray-200">
            <Activity className="h-5 w-5 mr-3 text-coral-500" />
            <h3 className="text-lg font-semibold text-midnight-blue">Activities</h3>
          </div>
          {activities.length === 0 ? (
            <p className="text-gray-500 italic text-center py-4">No activities available.</p>
          ) : (
            <div className="space-y-3">
              {activities.map((act, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-4 w-4 mt-0.5 text-coral-500" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-coral-600">
                          {act.time || "All day"}
                        </span>
                        {act.date && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {format(new Date(act.date), "MMM d")}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{act.description}</p>
                      {act.notes && (
                        <div className="mt-2 text-sm text-gray-600 bg-white/50 p-2 rounded border border-gray-200">
                          <span className="font-medium">Notes:</span> {act.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}