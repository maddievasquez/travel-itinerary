import React, { createContext, useContext, useState, useEffect } from 'react';
import useUserItineraries from '../../../hooks/useUserItineraries';

// Create context
const ItineraryContext = createContext();

// Provider component
export const ItineraryProvider = ({ children }) => {
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

  const clearAllFilters = () => {
    setSearchTerm('');
    resetFilters();
  };

  const value = {
    searchTerm,
    setSearchTerm,
    filterActive,
    setFilterActive,
    deletingId,
    filteredItineraries,
    itineraries,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    refetch,
    deleteItinerary,
    hasNoMatchingResults,
    handleSearchChange,
    handleDelete,
    clearAllFilters
  };

  return (
    <ItineraryContext.Provider value={value}>
      {children}
    </ItineraryContext.Provider>
  );
};

// Custom hook to use the itinerary context
export const useItineraryContext = () => {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItineraryContext must be used within an ItineraryProvider');
  }
  return context;
};

export default ItineraryContext;