// components/itinerary/ItineraryManager.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus } from 'lucide-react';
import ItineraryGrid from './ItineraryGrid';
import Button from '../ui/button';

const ItineraryManager = ({ 
  itineraries = [], 
  loading = false, 
  error = null, 
  onDelete, 
  onRefresh 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'updated_at:desc'
  });
  
  // Filter and sort itineraries
  const filteredItineraries = React.useMemo(() => {
    return itineraries
      .filter(itinerary => {
        // Apply search term filter
        if (searchTerm && searchTerm.trim() !== '') {
          const search = searchTerm.toLowerCase();
          const matchesSearch = 
            (itinerary.title && itinerary.title.toLowerCase().includes(search)) ||
            (itinerary.description && itinerary.description.toLowerCase().includes(search)) ||
            (itinerary.city && itinerary.city.toLowerCase().includes(search)) ||
            (itinerary.country && itinerary.country.toLowerCase().includes(search));
          
          if (!matchesSearch) return false;
        }
        
        // Apply status filter
        if (filters.status && itinerary.status !== filters.status) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Apply sorting
        const [field, direction] = filters.sortBy.split(':');
        const modifier = direction === 'desc' ? -1 : 1;
        
        if (field === 'updated_at') {
          return modifier * (new Date(a.updated_at) - new Date(b.updated_at));
        } else if (field === 'date') {
          return modifier * (new Date(a.start_date) - new Date(b.start_date));
        } else if (field === 'title') {
          return modifier * a.title.localeCompare(b.title);
        }
        
        return 0;
      });
  }, [itineraries, searchTerm, filters]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      sortBy: 'updated_at:desc'
    });
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-grow sm:w-64">
            <input
              type="text"
              placeholder="Search by city, title, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <Button 
            variant={filterActive ? "default" : "outline"}
            onClick={() => setFilterActive(!filterActive)}
            className="flex items-center"
          >
            <Filter size={18} className="mr-1" />
            Filter
          </Button>
          
          <Button 
            onClick={() => navigate('/itinerary/new')}
            className="bg-teal-600 text-white hover:bg-teal-700 flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New Itinerary
          </Button>
        </div>
      </div>
      
      {filterActive && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="updated_at:desc">Recently Updated</option>
                <option value="updated_at:asc">Oldest Updated</option>
                <option value="date:asc">Trip Date (Asc)</option>
                <option value="date:desc">Trip Date (Desc)</option>
                <option value="title:asc">Title (A-Z)</option>
                <option value="title:desc">Title (Z-A)</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {filteredItineraries.length === 0 && itineraries.length > 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700">No matching itineraries</h3>
          <p className="text-gray-500 mt-2 mb-6">Try adjusting your search or filters</p>
          <Button 
            onClick={resetFilters}
            className="bg-teal-600 text-white hover:bg-teal-700"
          >
            Clear All Filters
          </Button>
        </div>
      )}
      
      {filteredItineraries.length > 0 && (
        <ItineraryGrid 
          itineraries={filteredItineraries} 
          loading={loading} 
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default ItineraryManager;