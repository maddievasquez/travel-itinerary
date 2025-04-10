import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ItineraryCard from '../ItineraryCard';
import ItinerarySummaryCard from './ItinerarySummaryCard';
import { Grid, List } from 'lucide-react';

const ItineraryGrid = React.memo(({ 
  itineraries = [], 
  loading, 
  error, 
  onEdit, 
  onDelete, 
  deletingId,
  emptyState,
  viewMode = 'grid',
  onViewModeChange,
  showViewToggle = false
}) => {
  const handleViewModeChange = (mode) => {
    onViewModeChange?.(mode);
  };

  const renderContent = useMemo(() => {
    if (loading) return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
    
    if (error) return (
      <div className="text-center py-8 text-red-500">
        Error loading itineraries: {error.message}
      </div>
    );
    
    if (!itineraries?.length) {
      return emptyState || <div className="text-center py-8 text-gray-500">No itineraries found</div>;
    }

    if (viewMode === 'grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map((itinerary) => (
            <ItinerarySummaryCard
              key={itinerary.id}
              itinerary={itinerary}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deletingId === itinerary.id}
            />
          ))}
        </div>
      );
    }

    // List view - using your existing ItineraryCard
    return (
      <div className="space-y-4">
        {itineraries.map((itinerary) => (
          <ItineraryCard
            key={itinerary.id}
            day={1} // Assuming you want to show just the first day in list view
            locations={[]}
            activities={[]}
            start_date={itinerary.start_date}
            end_date={itinerary.end_date}
            // Add any other required props for your ItineraryCard
          />
        ))}
      </div>
    );
  }, [itineraries, loading, error, viewMode, deletingId, onEdit, onDelete, emptyState]);

  return (
    <div className="space-y-6">
      {showViewToggle && (
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg border ${
                viewMode === 'grid' 
                  ? 'bg-teal-600 text-white border-teal-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg border ${
                viewMode === 'list' 
                  ? 'bg-teal-600 text-white border-teal-600' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {renderContent}
    </div>
  );
});

ItineraryGrid.propTypes = {
  itineraries: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  deletingId: PropTypes.string,
  emptyState: PropTypes.node,
  viewMode: PropTypes.oneOf(['grid', 'list']),
  onViewModeChange: PropTypes.func,
  showViewToggle: PropTypes.bool
};

ItineraryGrid.defaultProps = {
  itineraries: [],
  viewMode: 'grid',
  showViewToggle: false
};

export default ItineraryGrid;