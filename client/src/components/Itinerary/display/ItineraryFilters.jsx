import React from 'react';
import { Filter, Search, Plus } from "lucide-react";
import Button from '../../ui/button';

const ItineraryFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  setFilters,
  resetFilters,
  filterActive,
  setFilterActive,
  onCreateNew
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Travel Itineraries</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search by city, title, or country..."
              value={searchTerm}
              onChange={onSearchChange}
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
            onClick={onCreateNew}
            className="bg-teal-600 text-white hover:bg-teal-700 flex items-center"
          >
            <Plus size={18} className="mr-1" />
            New
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
                onClick={() => {
                  resetFilters();
                }}
                variant="outline"
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ItineraryFilters;