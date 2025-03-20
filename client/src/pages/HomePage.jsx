import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Globe, Plus } from "lucide-react";
import { useEffect } from "react";

// Components
import Button from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-light-grey via-white to-light-grey">
        {/* Main Content */}
        <div className="flex flex-1 flex-col lg:flex-row">
          {/* Sidebar */}
          <Sidebar className="w-full lg:w-80 bg-midnight-blue shadow-xl rounded-l-lg border-r border-gray-300">
            <SidebarHeader className="border-b px-4 py-3 bg-teal text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Itineraries</h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 text-teal border-teal hover:bg-teal-light"
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
                  itineraries.slice(0, 5).map((itinerary) => (
                    <SidebarMenuItem key={itinerary.id}>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={itinerary.id} className="border-0">
                          <AccordionTrigger className="py-2 px-4 hover:no-underline flex items-center gap-2">
                            <Globe className="h-5 w-5 text-teal" />
                            <div className="flex flex-col items-start text-left">
                              <span className="font-medium text-white">{itinerary.city}</span>
                              <span className="text-xs text-gray-300">
                                {format(new Date(itinerary.start_date), "MMM d")} -{" "}
                                {format(new Date(itinerary.end_date), "MMM d, yyyy")}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="w-full text-teal hover:bg-teal-light"
                              onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                            >
                              View Itinerary
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <p className="text-center p-4 text-gray-500">No itineraries yet.</p>
                )}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          {/* Main Form */}
          <main className="flex-1 flex items-center justify-center p-8">
            <Card className="w-full max-w-xl rounded-2xl shadow-lg bg-teal-light/20 p-8 border border-teal">
              <CardHeader className="text-center bg-gradient-to-r from-teal to-midnight-blue text-white rounded-t-2xl">
                <CardTitle className="text-3xl font-bold">Plan Your Next Trip!</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ItineraryForm onCreate={handleItineraryCreated} loading={loading} />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
