import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Utensils, Hotel, Landmark, Coffee, Bus, Calendar, User } from 'lucide-react';

const ItineraryCard = ({ 
  day, 
  locations = [], 
  activities = [], 
  itinerary, 
  onClick, 
  minimal = false 
}) => {
  const [expanded, setExpanded] = useState(true);

  // Get appropriate icon for activity type
  const getActivityIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'food':
      case 'restaurant':
        return <Utensils className="h-4 w-4 text-red-500" />;
      case 'hotel':
      case 'accommodation':
        return <Hotel className="h-4 w-4 text-blue-500" />;
      case 'attraction':
      case 'landmark':
        return <Landmark className="h-4 w-4 text-green-500" />;
      case 'cafe':
      case 'coffee':
        return <Coffee className="h-4 w-4 text-yellow-500" />;
      case 'transport':
      case 'transit':
        return <Bus className="h-4 w-4 text-purple-500" />;
      default:
        return <MapPin className="h-4 w-4 text-teal-500" />;
    }
  };

  // Ensure activities and locations are arrays
  const activitiesList = Array.isArray(activities) ? activities : [];
  const locationsList = Array.isArray(locations) ? locations : [];

  // Sort activities by start_time if available
  const sortedActivities = [...activitiesList].sort((a, b) => {
    if (!a.start_time || !b.start_time) return 0;
    return a.start_time.localeCompare(b.start_time);
  });

  // Render minimal card for itinerary overview
  if (itinerary) {
    return (
      <div 
        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white cursor-pointer"
        onClick={onClick}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
              {itinerary.title || "Untitled Itinerary"}
            </h3>
            {!minimal && itinerary.status && (
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
            {!minimal && itinerary.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {itinerary.description}
              </p>
            )}
            
            <div className="space-y-2">
              {itinerary.city && (
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                  <span className="text-sm">
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
              
              {!minimal && (
                <div className="flex items-center text-gray-700">
                  <span className="text-sm">
                    {itinerary.days?.length || 0} days • 
                    {itinerary.total_locations || 0} locations
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!minimal && (
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
            <span className="text-xs text-gray-500">
              {itinerary.updated_at && `Last updated: ${new Date(itinerary.updated_at).toLocaleDateString()}`}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Render detailed card for day view
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div 
        className="bg-gradient-to-r from-teal-600 to-blue-700 text-white py-3 px-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <span className="bg-white/20 p-1 rounded-full mr-2">
            <span className="font-bold">Day {day}</span>
          </span>
        </div>
        <button className="focus:outline-none hover:bg-white/10 p-1 rounded">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="p-4 space-y-4">
          {/* Locations Section */}
          {locationsList.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                Locations
              </h4>
              <div className="space-y-3">
                {locationsList.map((location, index) => (
                  <div 
                    key={`location-${index}`} 
                    className="flex items-start pl-2 hover:bg-gray-50 rounded p-1"
                  >
                    <MapPin className="h-4 w-4 mt-0.5 mr-2 text-teal-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {location.name || 'Unnamed Location'}
                      </p>
                      {location.address && (
                        <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Section */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-teal-500" />
              Activities
            </h4>
            
            {sortedActivities.length === 0 ? (
              <p className="text-gray-500 italic pl-2">No activities planned for this day</p>
            ) : (
              <div className="space-y-3">
                {sortedActivities.map((activity, index) => (
                  <div 
                    key={`day-${day}-activity-${index}`}
                    className="border-l-3 border-teal-500 pl-3 py-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-start">
                      {getActivityIcon(activity.category)}
                      <div className="ml-2">
                        <h4 className="font-medium text-gray-800">
                          {activity.name || activity.title || 
                           (activity.description ? `${activity.description.substring(0, 40)}...` : 'New Activity')}
                        </h4>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          {activity.start_time && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>
                                {activity.start_time}
                                {activity.end_time && ` - ${activity.end_time}`}
                              </span>
                            </div>
                          )}
                          
                          {activity.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>
                                {typeof activity.location === 'string' 
                                  ? activity.location 
                                  : activity.location.name || activity.location}
                              </span>
                            </div>
                          )}
                        </div>

                        {activity.notes && (
                          <p className="text-sm text-gray-700 mt-2 bg-gray-100 p-2 rounded">
                            {activity.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;