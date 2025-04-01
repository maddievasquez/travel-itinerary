// components/itinerary/ItineraryGrid.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Loader, Edit2, Trash2 } from 'lucide-react';
import ItineraryCard from './ItineraryCard'; // Use your existing card or replace with this new implementation

const ItineraryGrid = ({ 
  itineraries = [], 
  loading = false, 
  emptyMessage = "No itineraries found", 
  onDelete, 
  showActions = true,
  columnLayout = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
}) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = React.useState(null);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    
    if (window.confirm("Delete this itinerary permanently?")) {
      try {
        setDeletingId(id);
        await onDelete(id);
      } catch (err) {
        console.error("Delete error:", err);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleEdit = (id, e) => {
    if (e) e.stopPropagation();
    navigate(`/itinerary/${id}/edit`);
  };

  const viewItinerary = (id) => {
    navigate(`/itinerary/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin h-8 w-8 text-teal-600 mr-3" />
        <span className="text-gray-600">Loading itineraries...</span>
      </div>
    );
  }

  if (!itineraries.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-700">{emptyMessage}</h3>
        <p className="text-gray-500 mt-2 mb-6">Start planning your next adventure!</p>
        <button 
          onClick={() => navigate('/itinerary/new')}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          Create New Itinerary
        </button>
      </div>
    );
  }

  return (
    <div className={`grid ${columnLayout} gap-4`}>
      {itineraries.map(itinerary => (
        <div 
          key={itinerary.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
        >
          <div 
            className="p-4 cursor-pointer h-full flex flex-col"
            onClick={() => viewItinerary(itinerary.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                {itinerary.title || "Untitled Itinerary"}
              </h3>
              {itinerary.status && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  itinerary.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {itinerary.status}
                </span>
              )}
            </div>
            
            <div className="flex-grow">
              {itinerary.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {itinerary.description}
                </p>
              )}
              
              <div className="space-y-2">
                {itinerary.city && (
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                    <span>
                      {itinerary.city}
                      {itinerary.country && `, ${itinerary.country}`}
                    </span>
                  </div>
                )}
                
                {itinerary.start_date && (
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-teal-500" />
                    <span className="text-sm">
                      {new Date(itinerary.start_date).toLocaleDateString()}
                      {itinerary.end_date && ` → ${new Date(itinerary.end_date).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-700">
                  <span className="text-sm">
                    {itinerary.days?.length || 0} days • 
                    {itinerary.total_locations || 0} locations
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Last updated: {new Date(itinerary.updated_at).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleEdit(itinerary.id, e)}
                  className="text-teal-600 hover:text-teal-800 p-1"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {onDelete && (
                  <button
                    onClick={(e) => handleDelete(itinerary.id, e)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete"
                    disabled={deletingId === itinerary.id}
                  >
                    {deletingId === itinerary.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItineraryGrid;