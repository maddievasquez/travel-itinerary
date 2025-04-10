import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, Calendar, Clock, Edit, Trash2, Loader2 } from 'lucide-react';

const ItineraryListItem = ({ itinerary, onEdit, onDelete, deleting }) => {
  const calculateDuration = (start, end) => {
    if (!start || !end) return { days: 0, text: '' };
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const diffTime = endDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const text = `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
    
    return { days: diffDays, text };
  };

  const duration = calculateDuration(itinerary.start_date, itinerary.end_date);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">{itinerary.title}</h3>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-teal-500" />
              <span>{itinerary.city}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-teal-500" />
              <span>
                {new Date(itinerary.start_date).toLocaleDateString()} - {new Date(itinerary.end_date).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-teal-500" />
              <span>{duration.text}</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button 
            onClick={() => onEdit(itinerary)}
            className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full"
            aria-label="Edit itinerary"
          >
            <Edit className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => onDelete(itinerary.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
            aria-label="Delete itinerary"
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

ItineraryListItem.propTypes = {
  itinerary: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleting: PropTypes.bool
};

export default ItineraryListItem;