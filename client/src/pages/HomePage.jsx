// HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Globe, Plus, Map, Menu, X, Calendar, Compass } from "lucide-react";

// Components
import Button from "../components/ui/button";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import ItineraryForm from "../components/itinerary/form/ItineraryForm";

// Hooks
import { useItinerary } from "../hooks/useItinerary";
import useUserItineraries from "../hooks/useUserItineraries";
import { groupItinerariesByStatus, formatDateRange, getTripDuration } from "../Utils/itineraryHelpers";

export default function HomePage() {
  const navigate = useNavigate();
  const { createItinerary, loading } = useItinerary();
  const { itineraries, refetch } = useUserItineraries();

  const [activeItineraryId, setActiveItineraryId] = useState(null);
  const [showLatest, setShowLatest] = useState(true);

  const handleItineraryCreated = async (itineraryData) => {
    try {
      const newItinerary = await createItinerary(itineraryData);
      refetch();
      navigate(`/itinerary/${newItinerary.id}`);
    } catch (error) {
      console.error("Failed to create itinerary:", error);
    }
  };

  const navigateToItinerary = (itineraryId) => {
    setActiveItineraryId(itineraryId);
    navigate(`/itinerary/${itineraryId}`);
  };

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/itinerary\/(\d+)/);
    if (match && match[1]) {
      setActiveItineraryId(parseInt(match[1]));
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar - scrollable */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Map className="h-6 w-6 text-teal-500" />
                <h2 className="text-xl font-bold tracking-tight">My Journeys</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-gray-500 hover:text-gray-700 transition"
                  onClick={() => setShowLatest((prev) => !prev)}
                  title="Toggle Latest Journeys"
                >
                  {showLatest ? <X size={18} /> : <Menu size={18} />}
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={() => navigate("/my-itineraries")}
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-xs">View All</span>
                </Button>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {itineraries.length > 0 ? (
                <div className="space-y-4 p-2">
                  {showLatest && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-teal-500 uppercase tracking-wider px-2 mb-2">
                        Latest Journeys
                      </h3>
                      <div className="space-y-1">
                        {itineraries
                          .sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at))
                          .slice(0, 5)
                          .map((itinerary) => (
                            <SidebarMenuItem
                              key={`latest-${itinerary.id}`}
                              active={activeItineraryId === itinerary.id}
                              onClick={() => navigateToItinerary(itinerary.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-teal-500" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline">
                                    <p className="font-medium text-sm truncate">{itinerary.city}</p>
                                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                      {formatDateRange(itinerary.start_date, itinerary.end_date)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 truncate">
                                    {getTripDuration(itinerary.start_date, itinerary.end_date)}
                                  </p>
                                </div>
                              </div>
                            </SidebarMenuItem>
                          ))}
                      </div>
                    </div>
                  )}

                  {groupItinerariesByStatus(itineraries).map((group) => (
                    <div key={group.status} className="mb-4">
                      <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wider px-2 mb-2">
                        {group.status}
                      </h3>
                      <div className="space-y-1">
                        {group.items.slice(0, 3).map((itinerary) => (
                          <SidebarMenuItem
                            key={`status-${itinerary.id}`}
                            active={activeItineraryId === itinerary.id}
                            onClick={() => navigateToItinerary(itinerary.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-2 w-2 rounded-full ${
                                group.status === 'Upcoming' ? 'bg-blue-500' :
                                group.status === 'Current' ? 'bg-green-500' :
                                'bg-gray-400'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                  <p className="font-medium text-sm truncate">{itinerary.city}</p>
                                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                    {formatDateRange(itinerary.start_date, itinerary.end_date)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-400 space-y-3">
                  <Globe className="mx-auto h-12 w-12 opacity-30" />
                  <p className="text-sm">No itineraries created yet</p>
                  <p className="text-xs">Start planning your next adventure!</p>
                </div>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content - not scrollable */}
        <main className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="lg:hidden flex items-center justify-between py-4 px-4 bg-white shadow-sm">
            <h1 className="text-lg font-bold text-teal-600">Voyaroute</h1>
            <SidebarTrigger />
          </header>

          {/* Itinerary Form - fixed at top */}
          <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <Card className="rounded-xl shadow-md bg-white border border-gray-200">
              <CardHeader className="text-center bg-gradient-to-r from-teal-500 to-blue-500 text-white py-6 rounded-t-xl">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                  <Compass className="h-6 w-6" />
                  Plan Your Next Trip
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <ItineraryForm onCreate={handleItineraryCreated} loading={loading} />
              </CardContent>
            </Card>
          </div>

          {/* Additional content area - can be scrollable if needed */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Add any additional content here if needed */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}