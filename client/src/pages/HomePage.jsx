import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Globe } from "lucide-react";
import ItineraryForm from "../components/itinerary/ItineraryForm";
import { useItinerary } from "../hooks/useItinerary"; // Calls the API
import Sidebar from "../components/ui/sidebar"; // Assuming Sidebar is part of your UI components
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/accordion"; // Accordion for itinerary list

export default function HomePage() {
  const navigate = useNavigate();
  const { createItinerary, itinerary, loading, error } = useItinerary();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state

  // Function to handle successful itinerary creation
  const handleItineraryCreated = async (city, startDate, endDate) => {
    await createItinerary(city, startDate, endDate);

    if (itinerary) {
      navigate("/itinerary", { state: { itinerary } }); // Redirect to Itinerary Page
    }
  };

  // Sample data for existing itineraries
  const sampleItineraries = [
    {
      id: "1",
      destination: "Tokyo, Japan",
      dateRange: "May 15 - May 25, 2025",
      activities: ["Visit Mount Fuji", "Explore Tokyo Tower", "Try local cuisine"],
    },
    {
      id: "2",
      destination: "Paris, France",
      dateRange: "July 10 - July 20, 2025",
      activities: ["Visit Eiffel Tower", "Louvre Museum", "Seine River Cruise"],
    },
    {
      id: "3",
      destination: "New York, USA",
      dateRange: "September 5 - September 12, 2025",
      activities: ["Times Square", "Central Park", "Broadway Show"],
    },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-6">
      {/* Sidebar for itineraries */}
      <div className={`md:w-1/4 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <Sidebar>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-white">My Itineraries</h2>
            <Accordion>
              {sampleItineraries.map((itinerary) => (
                <AccordionItem key={itinerary.id} value={itinerary.id}>
                  <AccordionTrigger>{itinerary.destination}</AccordionTrigger>
                  <AccordionContent>
                    <p>{itinerary.dateRange}</p>
                    <ul>
                      {itinerary.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Sidebar>
      </div>

      {/* Main content: Itinerary creation form */}
      <div className="flex-1">
        <Card className="w-full max-w-lg rounded-lg shadow-xl mx-auto mt-6 md:mt-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-4xl font-bold text-white">
              <Globe className="mr-2" /> Plan Your Dream Itinerary
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white rounded-lg p-6 shadow-lg">
            <ItineraryForm onCreate={handleItineraryCreated} loading={loading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
