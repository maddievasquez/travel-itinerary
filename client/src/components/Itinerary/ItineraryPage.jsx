import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Loader, 
  AlertCircle, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Share2, 
  Bookmark, 
  Edit 
} from 'lucide-react';
import MapComponent from '../Map/MapComponent';
import ItineraryCard from '../../components/itinerary/ItineraryCard';
import { useItinerary } from '../../hooks/useItinerary';
import useItineraryMap from '../../hooks/useItineraryMap';
import auth from '../../services/auth'; // Import the auth module
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export default function ItineraryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Create endpoints for itinerary-specific operations
  const toggleBookmarkItinerary = async (itineraryId, bookmarked) => {
    try {
      const endpoint = `${API_URL}/itineraries/${itineraryId}/bookmark/`;
      const response = await axios.post(endpoint, { bookmarked });
      return response.data;
    } catch (error) {
      console.error('Bookmark toggle error:', error);
      throw error;
    }
  };
  
  // Use the custom hooks
  const { 
    itinerary, 
    loading: itineraryLoading, 
    error: itineraryError, 
    fetchItineraryDetails 
  } = useItinerary();
  
  const { 
    locations, 
    loading: locationsLoading, 
    error: locationsError,
    hasValidLocations 
  } = useItineraryMap(id);
  
  // Combined loading and error states
  const isLoading = itineraryLoading || locationsLoading;
  const error = itineraryError || locationsError;
  
  // Fetch itinerary data on component mount
  useEffect(() => {
    if (id) {
      fetchItineraryDetails(id).catch(err => {
        console.error("Failed to fetch itinerary:", err);
        // Error handling is managed within the hook
      });
      
      // // Check bookmark status
      // const checkBookmarkStatus = async () => {
      //   try {
      //     const response = await axios.get(`${API_URL}/itineraries/${id}/bookmark/status/`);
      //     setIsBookmarked(response.data.isBookmarked);
      //   } catch (err) {
      //     console.error("Failed to check bookmark status:", err);
      //   }
      // };
      
      if (auth.checkAuthStatus()) {
        // checkBookmarkStatus();
      }
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  // Check if user is authorized to edit by comparing with user ID from localStorage
  const canEdit = auth.checkAuthStatus() && itinerary?.user_id === parseInt(localStorage.getItem('userId'));
  
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: itinerary.title || `Trip to ${itinerary.city}`,
        text: `Check out this itinerary for ${itinerary.city}!`,
        url: url,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Failed to copy link:', err));
    }
  };

  const handleBookmark = async () => {
    if (!auth.checkAuthStatus()) {
      // If not logged in, redirect to login
      navigate('/login', { state: { from: `/itinerary/${id}` } });
      return;
    }
    
    try {
      await toggleBookmarkItinerary(id, !isBookmarked);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-itinerary/${id}`);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-12 w-12 text-teal-600" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">
              {error.includes("404") ? 'Itinerary not found' : 'Error loading itinerary'}
            </h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }
  
  if (!itinerary || !itinerary.days) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">No itinerary data available</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    );
  }
  
  // Default center coordinates if no valid locations
  const defaultCenter = { lat: 0, lng: 0 };
  
  // Find first valid location for map center
  const mapCenter = locations.find(loc => loc.isValid)
    ? {
        lat: locations.find(loc => loc.isValid).latitude,
        lng: locations.find(loc => loc.isValid).longitude
      }
    : defaultCenter;

  // Calculate total number of locations
  const totalLocations = itinerary.days.reduce((total, day) => 
    total + (day.locations?.length || 0), 0);

  // Calculate total number of activities
  const totalActivities = itinerary.days.reduce((total, day) => 
    total + (day.activities?.length || 0), 0);
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center text-teal-600 hover:text-teal-800"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to itineraries
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {itinerary.title || `Trip to ${itinerary.city}`}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-gray-600 gap-2 sm:gap-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{itinerary.city}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {format(new Date(itinerary.start_date), 'MMM d, yyyy')} - 
                  {format(new Date(itinerary.end_date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex mt-4 md:mt-0 space-x-2">
            <button
              onClick={handleShare}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </button>
            
            <button
              onClick={handleBookmark}
              className={`flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${
                isBookmarked 
                  ? 'border-teal-600 text-teal-600 bg-teal-50 hover:bg-teal-100' 
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-teal-600' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </button>
            
            {canEdit && (
              <button
                onClick={handleEdit}
                className="flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </div>
        </div>

        {itinerary.description && (
          <div className="mt-4 text-gray-700">
            <p>{itinerary.description}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            {itinerary.days.length} {itinerary.days.length === 1 ? 'day' : 'days'}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            {totalLocations} {totalLocations === 1 ? 'location' : 'locations'}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            {totalActivities} {totalActivities === 1 ? 'activity' : 'activities'}
          </div>
        </div>
      </header>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          {itinerary.days.map(day => (
            <ItineraryCard
            key={day.day}
            day={day.day}
            locations={Array.isArray(day.locations) ? day.locations : []}
            activities={Array.isArray(day.activities) ? day.activities : []}
            />
          ))}
        </div>
        
        <div className="md:col-span-2">
  <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
    {!hasValidLocations && (
      <div className="h-full flex items-center justify-center p-4 text-center text-gray-500">
        <p>No valid location coordinates found for this itinerary</p>
      </div>
    )}
    
    {hasValidLocations && (
      <MapComponent
        locations={locations.filter(loc => loc.isValid)}
        center={mapCenter}
      />
    )}
  </div>
</div>
      </div>
    </div>
  );
}