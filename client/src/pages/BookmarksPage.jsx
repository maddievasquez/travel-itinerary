import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Loader, AlertCircle, MapPin, Calendar } from 'lucide-react';
import { useBookmark } from '../hooks/UseBookmark';
import auth from '../services/auth';

export default function BookmarksPage() {
  const [bookmarkedItineraries, setBookmarkedItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { getUserBookmarks } = useBookmark();
  
  useEffect(() => {
    // Check if user is authenticated
    if (!auth.checkAuthStatus()) {
      navigate('/login', { state: { from: '/bookmarks' } });
      return;
    }
    
    // Fetch bookmarked itineraries
    const fetchBookmarks = async () => {
      try {
        const data = await getUserBookmarks();
        setBookmarkedItineraries(data);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError(err.message || 'Failed to load bookmarked itineraries');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [getUserBookmarks, navigate]);
  
  if (loading) {
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
            <h3 className="text-lg font-medium text-red-800">Error loading bookmarks</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Saved Itineraries</h1>
        <p className="text-gray-600 mt-2">All your bookmarked travel itineraries in one place</p>
      </header>
      
      {bookmarkedItineraries.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">You haven't bookmarked any itineraries yet.</p>
          <Link 
            to="/explore" 
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            Explore Itineraries
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedItineraries.map(itinerary => (
            <Link 
              key={itinerary.id} 
              to={`/itinerary/${itinerary.id}`}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                {/* If you have itinerary images, you can display them here */}
                <MapPin className="h-10 w-10 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {itinerary.title || `Trip to ${itinerary.city}`}
                </h3>
                <div className="flex items-center mt-2 text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{itinerary.city}</span>
                </div>
                <div className="flex items-center mt-1 text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {format(new Date(itinerary.start_date), 'MMM d, yyyy')} - 
                    {format(new Date(itinerary.end_date), 'MMM d, yyyy')}
                  </span>
                </div>
                {itinerary.description && (
                  <p className="mt-2 text-gray-600 line-clamp-2">{itinerary.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}