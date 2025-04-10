import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserItineraries from '../hooks/useUserItineraries';
import ItineraryList from '../components/itinerary/ItineraryList';
import { LoadingState, ErrorState, EmptyState, NoResultsState } from '../components/itinerary/display/ItineraryEmptyStates';

const MyItinerariesPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const {
    itineraries,
    loading,
    error,
    refetch,
    deleteItinerary,
    deletingId,
    hasNoMatchingResults,
    resetFilters,
    pagination,
    goToPage,
    changePageSize
  } = useUserItineraries();

  const handleViewItinerary = (id) => {
    navigate(`/itinerary/${id}`);
  };

  const handleCreateItinerary = () => {
    navigate('/itinerary/new');
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        onLogin={() => navigate('/login')}
        onRetry={refetch}
      />
    );
  }

  if (itineraries.length === 0) {
    return (
      <EmptyState
        onCreateNew={handleCreateItinerary}
        message="You don't have any itineraries yet."
        actionText="Create Your First Itinerary"
      />
    );
  }

  if (hasNoMatchingResults) {
    return (
      <NoResultsState
        onClearFilters={resetFilters}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Itineraries</h1>
      
      <ItineraryList
        itineraries={itineraries}
        onView={handleViewItinerary}
        onCreate={handleCreateItinerary}
        onDelete={deleteItinerary}
        deletingId={deletingId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        pagination={pagination}
        goToPage={goToPage}
        changePageSize={changePageSize}
      />
    </div>
  );
};

export default MyItinerariesPage;