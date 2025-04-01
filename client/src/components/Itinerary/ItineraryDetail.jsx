import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookie from "../cookies";
import { Calendar, MapPin, Clock, Info, ArrowLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import MapComponent from "../Map/MapComponent";
import ItineraryCard from "./ItineraryCard"; // Import the ItineraryCard component

const ItineraryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [activities, setActivities] = useState([]);
  const [mapLocations, setMapLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      try {
        const token = Cookie.getCookie("access") || localStorage.getItem("userToken");
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch itinerary details
        const itineraryResponse = await fetch(`http://127.0.0.1:8000/api/itineraries/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!itineraryResponse.ok) {
          throw new Error(`Failed to fetch itinerary: ${itineraryResponse.statusText}`);
        }

        const itineraryData = await itineraryResponse.json();
        setItinerary(itineraryData);

        // Fetch activities for this itinerary
        const activitiesResponse = await fetch(`http://127.0.0.1:8000/api/itineraries/${id}/activities/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!activitiesResponse.ok) {
          throw new Error(`Failed to fetch activities: ${activitiesResponse.statusText}`);
        }

        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);
        
        // Process activities for map locations
        const locations = activitiesData
          .filter(activity => activity.latitude && activity.longitude)
          .map(activity => ({
            latitude: parseFloat(activity.latitude),
            longitude: parseFloat(activity.longitude),
            name: activity.name,
            address: activity.location || ''
          }));
        
        setMapLocations(locations);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryDetails();
  }, [id, navigate]);

  // Group activities by day
  const groupActivitiesByDay = () => {
    if (!itinerary || !activities.length) return {};
    
    const days = {};
    const startDate = parseISO(itinerary.start_date);
    const endDate = parseISO(itinerary.end_date);
    
    // Initialize days object
    let currentDate = new Date(startDate);
    let dayCount = 1;
    
    while (currentDate <= endDate) {
      days[`Day ${dayCount}`] = {
        date: new Date(currentDate),
        activities: []
      };
      currentDate.setDate(currentDate.getDate() + 1);
      dayCount++;
    }
    
    // Assign activities to days
    activities.forEach(activity => {
      if (activity.day) {
        const dayKey = `Day ${activity.day}`;
        if (days[dayKey]) {
          days[dayKey].activities.push(activity);
        }
      }
    });
    
    return days;
  };

  const daysWithActivities = groupActivitiesByDay();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back button */}
      <button 
        onClick={() => navigate('/my-itineraries')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to My Itineraries
      </button>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : itinerary ? (
        <>
          {/* Title and date info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
              <MapPin className="mr-2 text-blue-600" /> 
              {itinerary.city}, {itinerary.country}
            </h1>
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar className="mr-2 h-4 w-4 text-blue-600" />
              {format(parseISO(itinerary.start_date), "MMM d, yyyy")} - {format(parseISO(itinerary.end_date), "MMM d, yyyy")}
            </div>
            {itinerary.description && (
              <p className="text-gray-700">{itinerary.description}</p>
            )}
          </div>

          {/* Two-column layout for schedule and map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Schedule */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Daily Itinerary</h2>
              
              {Object.keys(daysWithActivities).length > 0 ? (
                Object.entries(daysWithActivities).map(([day, { date, activities }]) => (
                  <ItineraryCard
                    key={day}
                    day={day.replace('Day ', '')}
                    date={date}
                    activities={activities}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <p className="text-gray-500">No activities planned yet.</p>
                </div>
              )}
            </div>
            
            {/* Right column - Map */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4 h-full">
                <h2 className="text-xl font-semibold mb-4">Map View</h2>
                <div className="h-96">
                  <MapComponent locations={mapLocations} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-lg">Itinerary not found</p>
      )}
    </div>
  );
};

export default ItineraryDetail;