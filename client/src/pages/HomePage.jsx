import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Globe, Plus, Map, MapPin } from "lucide-react";
import { useEffect } from "react";

// Components
import Button from "../components/ui/button";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "../components/ui/sidebar";
import ItineraryForm from "../components/itinerary/ItineraryForm";

// Hooks
import { useItinerary } from "../hooks/useItinerary";
import useUserItineraries from "../hooks/useUserItineraries";

export default function HomePage() {
  const navigate = useNavigate();
  const { createItinerary, itinerary, loading } = useItinerary();
  const { itineraries } = useUserItineraries();

  const handleItineraryCreated = async (city, startDate, endDate) => {
    await createItinerary(city, startDate, endDate);
  };

  useEffect(() => {
    if (itinerary) {
      navigate("/itinerary", { state: { itinerary } });
    }
  }, [itinerary, navigate]);

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Main Content */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Sidebar with Enhanced Design */}
          <Sidebar className="w-full lg:w-96 bg-gradient-to-br from-midnight-blue to-teal-800 shadow-2xl rounded-l-3xl border-r border-gray-300">
            <SidebarHeader className="border-b border-white/20 px-6 py-5 bg-gradient-to-r from-teal-600 to-midnight-blue text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Map className="h-6 w-6 text-white" />
                  <h2 className="text-xl font-bold tracking-tight">My Journeys</h2>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 gap-2 text-white border-white/30 hover:bg-white/10 transition-colors"
                  onClick={() => navigate("/my-itineraries")}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">View All</span>
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {itineraries.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {itineraries.slice(0, 5).map((itinerary) => (
                      <SidebarMenuItem key={itinerary.id} className="mb-2">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={itinerary.id} className="border-0 bg-white/10 rounded-xl">
                            <AccordionTrigger className="py-3 px-4 hover:no-underline flex items-center gap-3 text-white">
                              <MapPin className="h-5 w-5 text-teal-300" />
                              <div className="flex flex-col items-start text-left flex-1">
                                <span className="font-semibold text-sm">{itinerary.city}</span>
                                <span className="text-xs text-gray-300 tracking-tight">
                                  {format(new Date(itinerary.start_date), "MMM d")} -{" "}
                                  {format(new Date(itinerary.end_date), "MMM d, yyyy")}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-3">
                              <Button
                                size="sm"
                                variant="default"
                                className="w-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                                onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                              >
                                View Details
                              </Button>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </SidebarMenuItem>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-white/60 space-y-3">
                    <Globe className="mx-auto h-12 w-12 text-white/30" />
                    <p className="text-sm">No itineraries created yet</p>
                    <p className="text-xs">Start planning your next adventure!</p>
                  </div>
                )}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          {/* Main Form */}
          <main className="flex-1 flex items-center justify-center p-8">
            <Card className="w-full max-w-xl rounded-3xl shadow-2xl bg-white border-2 border-gray-100 overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-teal-500 to-blue-600 text-white py-6">
                <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                  <Map className="h-8 w-8" />
                  Plan Your Next Trip!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ItineraryForm onCreate={handleItineraryCreated} loading={loading} />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}