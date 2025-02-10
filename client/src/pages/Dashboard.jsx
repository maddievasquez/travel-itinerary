"use client"

import { useState, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "../components/ui/card";
import ScrollArea from "../components/ui/scroll-area";

const containerStyle = {
  width: "100%",
  height: "100%",
}

const center = {
  lat: 0,
  lng: 0,
}

export default function({ itineraries }) {
  const [selectedItinerary, setSelectedItinerary] = useState(null)

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  useEffect(() => {
    if (itineraries.length > 0) {
      setSelectedItinerary(itineraries[0])
    }
  }, [itineraries])

  const renderItineraryItems = (items) => {
    const groupedByDay = items.reduce(
      (acc, item) => {
        if (!acc[item.day]) {
          acc[item.day] = []
        }
        acc[item.day].push(item)
        return acc
      },
      {},
    )

    return Object.entries(groupedByDay)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([day, dayItems]) => (
        <div key={day} className="mb-4">
          <h4 className="font-semibold">Day {day}</h4>
          {dayItems
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((item) => (
              <p key={item.id} className="ml-4">
                {item.time} - {item.activity}
              </p>
            ))}
        </div>
      ))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Itineraries</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {itineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className={`p-4 mb-2 rounded cursor-pointer ${
                    selectedItinerary?.id === itinerary.id ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedItinerary(itinerary)}
                >
                  <h3 className="font-semibold">{itinerary.name}</h3>
                  <p className="text-sm text-gray-500">{itinerary.country}</p>
                  <p className="text-sm text-gray-500">{itinerary.items.length} activities</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        {selectedItinerary && (
          <Card className="flex-grow overflow-hidden">
            <CardHeader>
              <CardTitle>
                {selectedItinerary.name} - {selectedItinerary.country}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] overflow-hidden">
              <ScrollArea className="h-full">{renderItineraryItems(selectedItinerary.items)}</ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
      <Card className="lg:col-span-2 flex flex-col">
        <CardHeader>
          <CardTitle>Map View</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {isLoaded && selectedItinerary ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selectedItinerary.items[0]?.location || center}
              zoom={10}
            >
              {selectedItinerary.items.map(
                (item) => item.location && <Marker key={item.id} position={item.location} title={item.activity} />,
              )}
            </GoogleMap>
          ) : (
            <div className="h-full flex items-center justify-center">Loading map...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

