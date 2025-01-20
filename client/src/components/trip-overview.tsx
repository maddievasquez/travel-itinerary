import React from "react"
import { Calendar, MapPin } from "lucide-react"

export function TripOverview() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Trip Overview</h2>
      <div className="space-y-4">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          <span>Destination: Paris, France</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-500" />
          <span>Date: June 15 - June 22, 2023</span>
        </div>
        <div>
          <span className="font-semibold">Trip Duration:</span> 7 days
        </div>
        <div>
          <span className="font-semibold">Travelers:</span> 2 adults
        </div>
      </div>
    </div>
  )
}

