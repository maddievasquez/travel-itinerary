import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Plus, Search, Filter, Trash2, Loader, AlertCircle, Edit2 } from "lucide-react";
import Button from '../components/ui/button';
import useUserItineraries from '../hooks/useUserItineraries';
import authService from '../services/auth';

// Reusable components
const LoadingState = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <Loader className="animate-spin h-12 w-12 text-teal-600 mr-3" />
    <span className="text-gray-600">Loading your itineraries...</span>
  </div>
);

const ErrorState = ({ error, onLogin, onRetry }) => (
  <div className="container mx-auto p-6 text-center">
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded inline-block text-left max-w-md">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <h3 className="font-bold">Error loading itineraries</h3>
      </div>
      <p className="mt-2">{error.message}</p>
      {error.isAuthError ? (
        <Button
          onClick={onLogin}
          className="mt-4 bg-teal-600 text-white hover:bg-teal-700"
        >
          Please login
        </Button>
      ) : (
        <Button
          onClick={onRetry}
          className="mt-4 bg-teal-600 text-white hover:bg-teal-700"
        >
          Try Again
        </Button>
      )}
    </div>
  </div>
);

const EmptyState = ({ onCreateNew }) => (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <MapPin size={32} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-700">No itineraries yet</h3>
    <p className="text-gray-500 mt-2 mb-6">Start planning your next adventure!</p>
    <Button 
      onClick={onCreateNew}
      className="bg-teal-600 text-white hover:bg-teal-700"
    >
      Create New Itinerary
    </Button>
  </div>
);

const NoResultsState = ({ onClearFilters }) => (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Search size={32} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-700">No matching itineraries</h3>
    <p className="text-gray-500 mt-2 mb-6">Try adjusting your search or filters</p>
    <Button 
      onClick={onClearFilters}
      className="bg-teal-600 text-white hover:bg-teal-700"
    >
      Clear All Filters
    </Button>
  </div>
);

const ItineraryCard = ({ itinerary, onEdit, onDelete, deletingId }) => (
  <div 
    key={itinerary.id}
    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
  >
    <div 
      className="p-4 cursor-pointer h-full flex flex-col"
      onClick={() => onEdit(itinerary.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
          {itinerary.title || "Untitled Itinerary"}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          itinerary.status === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {itinerary.status || 'Draft'}
        </span>
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
    
    <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex justify-between items-center">
      <span className="text-xs text-gray-500">
        Last updated: {new Date(itinerary.updated_at).toLocaleDateString()}
      </span>
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(itinerary.id, true);
          }}
          className="text-teal-600 hover:text-teal-800 p-1"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(itinerary.id);
          }}
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
      </div>
    </div>
  </div>
);

export default function MyItineraries() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  // Use our custom hook
  const {
    filteredItineraries,
    itineraries,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refetch,
    deleteItinerary,
    hasNoMatchingResults
  } = useUserItineraries();

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = authService.checkAuthStatus();
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilters(prev => ({ ...prev, searchTerm: term }));
  };
  
  // Handle delete with loading state
  const handleDelete = async (id) => {
    if (window.confirm("Delete this itinerary permanently?")) {
      try {
        setDeletingId(id);
        await deleteItinerary(id);
      } catch (err) {
        console.error("Delete error:", err);
        alert(`Error deleting: ${err.message}`);
        refetch();
      } finally {
        setDeletingId(null);
      }
    }
  };
  
  // Navigation handlers
  const navigateToItinerary = (id, isEdit = false) => {
    navigate(isEdit ? `/itinerary/${id}/edit` : `/itinerary/${id}`);
  };
  
  const createNewItinerary = () => navigate('/itinerary/new');
  
  // Render loading and error states
  if (loading) return <LoadingState />;
  
  if (error) {
    return <ErrorState 
      error={error} 
      onLogin={() => navigate('/login')} 
      onRetry={refetch} 
    />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Travel Itineraries</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search by city, title, or country..."
              value={searchTerm}
              onChange={handleSearchChange}
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
            onClick={createNewItinerary}
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
                  setSearchTerm('');
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
      
      {itineraries.length === 0 ? (
        <EmptyState onCreateNew={createNewItinerary} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItineraries && filteredItineraries.length > 0 ? (
              filteredItineraries.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  onEdit={navigateToItinerary}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>No itineraries match your current filters.</p>
              </div>
            )}
          </div>
          
          {hasNoMatchingResults && (
            <NoResultsState 
              onClearFilters={() => {
                setSearchTerm('');
                resetFilters();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}