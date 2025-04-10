import React from 'react';
import PropTypes from 'prop-types';
import { MapPin, Calendar, Clock, Edit, Trash2, Loader2 } from 'lucide-react';

const ItinerarySummaryCard = ({ itinerary, onEdit, onDelete, deleting }) => {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col">
      <div className="p-4 flex-grow">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">{itinerary.title}</h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" />
            <span className="truncate">{itinerary.city}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" />
            <span className="truncate">
              {new Date(itinerary.start_date).toLocaleDateString()} - {new Date(itinerary.end_date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-teal-500 flex-shrink-0" />
            <span>{duration.text}</span>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end space-x-2">
        <button 
          onClick={() => onEdit(itinerary)}
          className="px-3 py-1.5 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-100 rounded-md flex items-center"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </button>
        
        <button 
          onClick={() => onDelete(itinerary.id)}
          className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md flex items-center"
          disabled={deleting}
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 mr-1" />
          )}
          Delete
        </button>
      </div>
    </div>
  );
};

ItinerarySummaryCard.propTypes = {
  itinerary: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  deleting: PropTypes.bool
};

export default ItinerarySummaryCard;