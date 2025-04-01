// import Card, { CardHeader, CardTitle, CardContent } from "../ui/card";
// import { Calendar, MapPin, ChevronRight, Loader } from "lucide-react";
// import { format } from "date-fns";
// import PropTypes from 'prop-types';

// export default function ItineraryList({ itineraries = [], selectItinerary, loading = false, error = null }) {
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <Loader className="animate-spin h-8 w-8 text-teal-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         Error loading itineraries: {error.message}
//       </div>
//     );
//   }

//   if (!itineraries.length) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         No itineraries found
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {itineraries.map((itinerary) => (
//         <Card
//           key={itinerary.id}
//           className="group border-2 border-transparent hover:border-teal-500 transition-all duration-300 rounded-2xl shadow-md hover:shadow-xl overflow-hidden cursor-pointer"
//           onClick={() => selectItinerary(itinerary)}
//         >
//           <div className="flex items-center justify-between p-5 bg-white">
//             <div className="flex items-center space-x-4">
//               <div className="bg-teal-100 p-3 rounded-full">
//                 <MapPin className="h-6 w-6 text-teal-600" />
//               </div>
//               <div>
//                 <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
//                   {itinerary.city}
//                 </CardTitle>
//                 <CardContent className="p-0 mt-1">
//                   <p className="flex items-center text-sm text-gray-500">
//                     <Calendar className="mr-2 h-4 w-4 text-teal-600" />
//                     {format(new Date(itinerary.start_date), "MMM d")} - {format(new Date(itinerary.end_date), "MMM d, yyyy")}
//                   </p>
//                   {itinerary.description && (
//                     <p className="mt-2 text-sm text-gray-600 line-clamp-1">
//                       {itinerary.description}
//                     </p>
//                   )}
//                 </CardContent>
//               </div>
//             </div>
//             <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
//           </div>
//         </Card>
//       ))}
//     </div>
//   );
// }

// ItineraryList.propTypes = {
//   itineraries: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       city: PropTypes.string.isRequired,
//       start_date: PropTypes.string.isRequired,
//       end_date: PropTypes.string.isRequired,
//       description: PropTypes.string,
//     })
//   ),
//   selectItinerary: PropTypes.func.isRequired,
//   loading: PropTypes.bool,
//   error: PropTypes.instanceOf(Error),
// };

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Plus, Search, Filter, SortAsc, SortDesc, Loader } from 'lucide-react';
import ItineraryCard from './ItineraryCard';

const ItineraryList = ({ 
  itineraries = [], 
  loading = false, 
  error = null, 
  showFilters = true,
  emptyStateMessage = "You haven't created any itineraries yet.",
  emptyStateAction = "Create Your First Itinerary",
  onEmptyStateAction = () => {},
  onCreateNew = () => {},
  containerClassName = ""
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updated_at:desc');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filtered and sorted itineraries
  const filteredItineraries = itineraries.filter(itinerary => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      [itinerary.title, itinerary.city, itinerary.country, itinerary.description]
        .filter(Boolean) // Filter out undefined/null fields
        .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Status filter
    const matchesStatus = !statusFilter || itinerary.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const [sortField, sortDirection] = sortBy.split(':');
    const modifier = sortDirection === 'desc' ? -1 : 1;
    
    if (sortField === 'date') {
      return (new Date(a.start_date || 0) - new Date(b.start_date || 0)) * modifier;
    }
    if (sortField === 'title') {
      return ((a.title || '').localeCompare(b.title || '')) * modifier;
    }
    // Default to updated_at
    return (new Date(a.updated_at || 0) - new Date(b.updated_at || 0)) * modifier;
  });
  
  const handleViewItinerary = (id) => {
    navigate(`/itinerary/${id}`);
  };
  
  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin h-8 w-8 text-teal-600" />
      </div>
    );
  }
  
  // Empty state
  if (!itineraries.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">{emptyStateMessage}</p>
        <button
          onClick={onEmptyStateAction}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          {emptyStateAction}
        </button>
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${containerClassName}`}>
      {/* Controls section */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {/* Left side - view mode switcher */}
        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
            aria-label="Grid view"
          >
            <Grid size={18} />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>

        {/* Right side - create button */}
        <button
          onClick={onCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Plus size={16} className="mr-1" />
          Create New Itinerary
        </button>
      </div>
      
      {/* Filters section */}
      {showFilters && (
        <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search itineraries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-lg py-2"
            />
          </div>
          
          {/* Status filter */}
          <div className="relative w-full sm:w-auto sm:min-w-[150px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={16} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-lg py-2 pr-8"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          {/* Sort */}
          <div className="relative w-full sm:w-auto sm:min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {sortBy.endsWith('desc') ? 
                <SortDesc size={16} className="text-gray-400" /> : 
                <SortAsc size={16} className="text-gray-400" />
              }
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-10 focus:ring-teal-500 focus:border-teal-500 block w-full text-sm border-gray-300 rounded-lg py-2 pr-8"
            >
              <option value="updated_at:desc">Latest Updated</option>
              <option value="updated_at:asc">Oldest Updated</option>
              <option value="date:desc">Latest Trip Date</option>
              <option value="date:asc">Earliest Trip Date</option>
              <option value="title:asc">Title (A-Z)</option>
              <option value="title:desc">Title (Z-A)</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredItineraries.length} {filteredItineraries.length === 1 ? 'itinerary' : 'itineraries'}
      </div>
      
      {/* Itineraries display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              onClick={() => handleViewItinerary(itinerary.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItineraries.map((itinerary) => (
            <div 
              key={itinerary.id}
              onClick={() => handleViewItinerary(itinerary.id)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{itinerary.title || `Trip to ${itinerary.city}`}</h3>
                  <p className="text-sm text-gray-600 mt-1">{itinerary.city}, {itinerary.country}</p>
                  
                  {itinerary.description && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{itinerary.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {itinerary.start_date && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {new Date(itinerary.start_date).toLocaleDateString()}
                      </span>
                    )}
                    {itinerary.status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${itinerary.status === 'published' ? 'bg-green-100 text-green-800' : 
                          itinerary.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {itinerary.status}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-xs text-gray-500">
                  <div>Updated: {new Date(itinerary.updated_at).toLocaleDateString()}</div>
                  {itinerary.days && (
                    <div className="mt-2 bg-gray-100 rounded-full px-2 py-1 inline-block">
                      {itinerary.days.length} days
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryList;