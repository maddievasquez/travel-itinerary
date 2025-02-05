import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Globe, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export function Home({ itineraries, setCurrentView, setCurrentItinerary }) {
  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-12 mb-8">
        <h2 className="text-4xl font-bold mb-4">Welcome to Your Travel Planner</h2>
        <p className="text-xl mb-6">Create unforgettable journeys and explore the world with ease.</p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Globe className="mr-2" /> Create New Itinerary
            </CardTitle>
            <CardDescription>Plan your next adventure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form for adding an itinerary */}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create Itinerary</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <MapPin className="mr-2" /> Your Itineraries
            </CardTitle>
            <CardDescription>View and manage your travel plans</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itineraries.map((itinerary) => (
                <li key={itinerary.id}>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setCurrentItinerary(itinerary)
                      setCurrentView("itinerary")
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="flex-grow">{itinerary.name}</span>
                    <span className="text-sm text-gray-500">{itinerary.city}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {format(new Date(itinerary.startDate), "MMM d")} -{" "}
                      {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
