import React, { useState, useEffect } from "react"; // <-- This is crucial
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Globe, Plus, Map, MapPin } from "lucide-react";

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
import { 
  groupItinerariesByStatus, 
  formatDateRange, 
  getTripDuration 
} from "../Utils/itineraryHelpers";
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
        {/* Group itineraries by status */}
        {groupItinerariesByStatus(itineraries).map((group) => (
          <div key={group.status} className="mb-4">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider px-2 mb-2">
              {group.status}
            </h3>
            <div className="space-y-2">
              {group.items.slice(0, 5).map((itinerary) => (
                <SidebarMenuItem 
                  key={itinerary.id} 
                  className="hover:bg-white/10 transition-colors rounded-lg"
                  onClick={() => navigate(`/itinerary/${itinerary.id}`)}
                >
                  <div className="flex items-center gap-3 py-3 px-4 text-white cursor-pointer">
                    <div className={`h-2 w-2 rounded-full ${
                      group.status === 'Upcoming' ? 'bg-blue-400' : 
                      group.status === 'Current' ? 'bg-green-400' : 
                      'bg-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium text-sm truncate">{itinerary.city}</p>
                        <span className="text-xs text-white/60 ml-2">
                          {formatDateRange(itinerary.start_date, itinerary.end_date)}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 truncate">
                        {getTripDuration(itinerary.start_date, itinerary.end_date)}
                      </p>
                    </div>
                  </div>
                </SidebarMenuItem>
              ))}
            </div>
          </div>
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