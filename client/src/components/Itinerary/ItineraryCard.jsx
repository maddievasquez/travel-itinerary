import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, MapPin, Clock, Utensils, Hotel, Landmark, Coffee, Bus, Calendar } from 'lucide-react';

const ItineraryCard = ({ 
  day, 
  locations = [], 
  activities = [], 
  selectedDay = null,
  onDaySelect = () => {},
  usedLocations = [],
  allLocations = [],
  start_date,
  end_date
}) => {
  const [expanded, setExpanded] = useState(true);

  // Calculate duration in days based on start and end dates - fixed calculation
  const calculateDuration = useMemo(() => {
    if (!start_date || !end_date) return { days: null, text: '' };
    
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    // Reset time components to get exact day difference
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    // Calculate difference in days (add 1 because end date is inclusive)
    const diffTime = endDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Ensure minimum of 1 day
    const days = Math.max(1, diffDays);
    const text = `${days} ${days === 1 ? 'day' : 'days'}`;
    
    return { days, text };
  }, [start_date, end_date]);

  // Extract locations from activities if main locations array is empty
  const effectiveLocations = useMemo(() => {
    if (locations.length > 0) return locations;
    return activities
      .map(activity => activity.location)
      .filter(loc => loc && loc.id) // Ensure we have valid locations
      .reduce((unique, loc) => {
        return unique.some(u => u.id === loc.id) ? unique : [...unique, loc];
      }, []);
  }, [locations, activities]);
  
  // Get unique locations for this day
  const uniqueLocations = useMemo(() => {
    if (!allLocations.length || !usedLocations.length) return locations;
    return locations.filter(loc => 
      !usedLocations.some(used => used.id === loc.id)
    ) || locations;
  }, [locations, usedLocations, allLocations]);

  // Get appropriate icon for activity type
  const getActivityIcon = (category) => {
    const icons = {
      food: <Utensils className="h-4 w-4 text-red-500" />,
      restaurant: <Utensils className="h-4 w-4 text-red-500" />,
      hotel: <Hotel className="h-4 w-4 text-blue-500" />,
      accommodation: <Hotel className="h-4 w-4 text-blue-500" />,
      attraction: <Landmark className="h-4 w-4 text-green-500" />,
      landmark: <Landmark className="h-4 w-4 text-green-500" />,
      cafe: <Coffee className="h-4 w-4 text-yellow-500" />,
      coffee: <Coffee className="h-4 w-4 text-yellow-500" />,
      transport: <Bus className="h-4 w-4 text-purple-500" />,
      transit: <Bus className="h-4 w-4 text-purple-500" />
    };
    return icons[category?.toLowerCase()] || <MapPin className="h-4 w-4 text-teal-500" />;
  };

  // Sort activities by start_time
  const sortedActivities = useMemo(() => {
    return [...(Array.isArray(activities) ? activities : [])].sort((a, b) => 
      (a.start_time || '').localeCompare(b.start_time || '')
    );
  }, [activities]);

  // Handle day selection and expansion
  const handleDayHeaderClick = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onDaySelect(newExpanded ? day : null);
  };

  // Skip rendering if this day is beyond the actual duration
  if (calculateDuration.days !== null && day > calculateDuration.days) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${
      selectedDay === day ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200'
    }`}>
      <div 
        className={`bg-gradient-to-r ${
          selectedDay === day ? 'from-teal-700 to-blue-800' : 'from-teal-600 to-blue-700'
        } text-white py-3 px-4 flex justify-between items-center cursor-pointer`}
        onClick={handleDayHeaderClick}
      >
        <div className="flex items-center">
          <span className="bg-white/20 p-1 rounded-full mr-2">
            <span className="font-bold">Day {day}</span>
          </span>
          <span className="text-sm font-medium">
            {uniqueLocations.length > 0 && `${uniqueLocations.length} location${uniqueLocations.length !== 1 ? 's' : ''}`}
            {uniqueLocations.length > 0 && sortedActivities.length > 0 && ' • '}
            {sortedActivities.length > 0 && `${sortedActivities.length} activit${sortedActivities.length !== 1 ? 'ies' : 'y'}`}
            {calculateDuration.days && start_date && end_date && day === 1 && ' • '}
            {calculateDuration.days && start_date && end_date && day === 1 && (
              <span className="flex items-center ml-1">
                <Calendar className="h-3 w-3 mr-1" />
                {calculateDuration.text}
              </span>
            )}
          </span>
        </div>
        <button className="focus:outline-none hover:bg-white/10 p-1 rounded">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {expanded && (
        <div className="p-4 space-y-4">
          {start_date && end_date && day === 1 && (
            <div className="mb-2 text-sm text-gray-600 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-teal-500" />
              <span>
                {new Date(start_date).toLocaleDateString()} - {new Date(end_date).toLocaleDateString()} 
                ({calculateDuration.text})
              </span>
            </div>
          )}
          
          {uniqueLocations.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-teal-500" />
                Locations
              </h4>
              <div className="space-y-3">
                {uniqueLocations.map((location, index) => (
                  <div key={`location-${location.id || index}`} className="flex items-start pl-2 hover:bg-gray-50 rounded p-1">
                    <MapPin className="h-4 w-4 mt-0.5 mr-2 text-teal-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{location.name || 'Unnamed Location'}</p>
                      {location.address && <p className="text-sm text-gray-600 mt-1">{location.address}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  <div key={`activity-${activity.id || index}`} className="border-l-3 border-teal-500 pl-3 py-2 hover:bg-gray-50 rounded">
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

ItineraryCard.propTypes = {
  day: PropTypes.number.isRequired,
  locations: PropTypes.array,
  activities: PropTypes.array,
  selectedDay: PropTypes.number,
  onDaySelect: PropTypes.func,
  usedLocations: PropTypes.array,
  allLocations: PropTypes.array,
  start_date: PropTypes.string,
  end_date: PropTypes.string
};

ItineraryCard.defaultProps = {
  locations: [],
  activities: [],
  selectedDay: null,
  onDaySelect: () => {},
  usedLocations: [],
  allLocations: [],
  start_date: null,
  end_date: null
};

export default ItineraryCard;