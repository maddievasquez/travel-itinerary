import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { format } from "date-fns";

export default function ItineraryCard({ day, locations, activities }) {
  return (
    <Card className="mb-6 border-2 border-gray-700 rounded-3xl shadow-xl bg-white">
      {/* Gradient Header */}
      <CardHeader className="bg-gradient-to-r from-teal to-midnight-blue text-white rounded-t-3xl py-5 px-6">
        <CardTitle className="text-xl font-semibold">Day {day}</CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Locations Section */}
        {locations.length > 0 ? (
          locations.map((loc, index) => (
            <div key={index} className="border-b pb-3 last:border-b-0">
              <p className="font-semibold text-midnightBlue text-lg">{loc.name}</p>
              <p className="text-sm text-gray-600">{loc.address}</p> {/* Slightly darker for contrast */}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No locations added yet.</p>
        )}

        {/* Activities Section */}
        <div className="mt-4">
          <p className="font-semibold text-midnightBlue text-lg">Activities:</p>
          {activities.length === 0 ? (
            <p className="text-gray-500 italic">No activities available.</p>
          ) : (
            activities.map((act, index) => (
              <p key={index} className="text-sm text-gray-700 mt-1">
                <span className="font-medium text-coral">{format(new Date(act.date), "MMMM d")}:</span> 
                <span className="text-gray-600">{act.description}</span>
              </p>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
