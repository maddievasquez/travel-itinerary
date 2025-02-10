import React from "react"

const pastTrips = [
    { destination: "Paris, France", date: "June 2022", image: "/placeholder.svg?height=100&width=100" },
    { destination: "Tokyo, Japan", date: "September 2022", image: "/placeholder.svg?height=100&width=100" },
    { destination: "New York, USA", date: "December 2022", image: "/placeholder.svg?height=100&width=100" },
  ]
  
  export function PastTrips() {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Past Trips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pastTrips.map((trip, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <img src={trip.image || "/placeholder.svg"} alt={trip.destination} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold">{trip.destination}</h4>
                <p className="text-sm text-gray-600">{trip.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  