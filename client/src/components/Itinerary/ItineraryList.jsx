import React from 'react';
import PropTypes from 'prop-types';
import { Grid, List, Plus, Loader, Calendar } from 'lucide-react';
import PaginationControls from './PaginationControls';

const ItineraryList = ({
  itineraries = [],
  loading = false,
  error = null,
  onView = (id) => {},
  onCreate = () => {},
  onDelete = () => {},
  deletingId = null,
  viewMode = 'grid',
  onViewModeChange = () => {},
  pagination = { currentPage: 1, totalPages: 1, pageSize: 10 },
  goToPage = () => {},
  changePageSize = () => {}
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin h-8 w-8 text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <p className="text-red-700">{error.message || 'Error loading itineraries'}</p>
      </div>
    );
  }

  if (!itineraries.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">You haven't created any itineraries yet</p>
        <button
          onClick={onCreate}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-teal-600 hover:bg-teal-700"
        >
          Create Your First Itinerary
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* View mode toggle */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <List size={18} />
          </button>
        </div>

        {/* Create button */}
        <button
          onClick={onCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700"
        >
          <Plus size={16} className="mr-1" />
          New Itinerary
        </button>
      </div>

      {/* Itineraries list/grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.map(itinerary => (
            <div
              key={itinerary.id}
              onClick={() => onView(itinerary.id)}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">{itinerary.title}</h3>
              <p className="text-sm text-gray-600 mb-1">{itinerary.city}, {itinerary.country}</p>

              {itinerary.start_date && (
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-teal-500" />
                    <span>
                      {new Date(itinerary.start_date).toLocaleDateString()} - {new Date(itinerary.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4 flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(itinerary.id);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                  disabled={deletingId === itinerary.id}
                >
                  {deletingId === itinerary.id ? (
                    <Loader className="animate-spin h-4 w-4" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {itineraries.map(itinerary => (
            <div
              key={itinerary.id}
              onClick={() => onView(itinerary.id)}
              className="bg-white border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{itinerary.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{itinerary.city}, {itinerary.country}</p>
                {itinerary.start_date && (
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(itinerary.start_date).toLocaleDateString()} - {new Date(itinerary.end_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="px-4 py-2 border-t border-gray-100 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(itinerary.id);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded"
                  disabled={deletingId === itinerary.id}
                >
                  {deletingId === itinerary.id ? (
                    <Loader className="animate-spin h-4 w-4" />
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
          pageSize={pagination.pageSize}
          onPageSizeChange={changePageSize}
        />
      )}
    </div>
  );
};

ItineraryList.propTypes = {
  itineraries: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  onView: PropTypes.func,
  onCreate: PropTypes.func,
  onDelete: PropTypes.func,
  deletingId: PropTypes.string,
  viewMode: PropTypes.oneOf(['grid', 'list']),
  onViewModeChange: PropTypes.func,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    pageSize: PropTypes.number
  }),
  goToPage: PropTypes.func,
  changePageSize: PropTypes.func
};

ItineraryList.defaultProps = {
  itineraries: [],
  onView: () => {},
  onCreate: () => {},
  onDelete: () => {},
  viewMode: 'grid',
  pagination: { currentPage: 1, totalPages: 1, pageSize: 10 },
  goToPage: () => {},
  changePageSize: () => {}
};

export default ItineraryList;