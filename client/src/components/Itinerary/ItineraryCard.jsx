import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export function ItineraryCard({ day, locations, activities }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Day {day}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locations.map((loc, index) => (
            <div key={index} className="border-b pb-2">
              <p className="font-semibold">{loc.name}</p>
              <p className="text-sm text-gray-500">{loc.address}</p>
            </div>
          ))}
          <div className="mt-2">
            <p className="font-semibold">Activities:</p>
            {activities.map((act, index) => (
              <p key={index} className="text-sm text-gray-700">
                {format(new Date(act.date), "MMMM d")}: {act.description}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
