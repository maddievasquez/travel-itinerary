import React from 'react';
import { MapPin, Search, Loader, AlertCircle } from "lucide-react";
import Button from '../../ui/button';

export const LoadingState = ({ message = "Loading your itineraries..." }) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <Loader className="animate-spin h-12 w-12 text-teal-600 mr-3" />
    <span className="text-gray-600">{message}</span>
  </div>
);

export const ErrorState = ({ error, onLogin, onRetry, title = "Error loading itineraries" }) => (
  <div className="container mx-auto p-6 text-center">
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded inline-block text-left max-w-md">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        <h3 className="font-bold">{title}</h3>
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

export const EmptyState = ({ 
  onCreateNew, 
  message = "No itineraries yet", 
  actionText = "Create New Itinerary",
  icon = <MapPin size={32} className="text-gray-400" />
}) => (
  <div className="text-center py-12 bg-gray-50 rounded-lg">
    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-medium text-gray-700">{message}</h3>
    <p className="text-gray-500 mt-2 mb-6">Start planning your next adventure!</p>
    {onCreateNew && (
      <Button 
        onClick={onCreateNew}
        className="bg-teal-600 text-white hover:bg-teal-700"
      >
        {actionText}
      </Button>
    )}
  </div>
);

export const NoResultsState = ({ onClearFilters }) => (
  <EmptyState 
    onCreateNew={onClearFilters}
    message="No matching itineraries"
    actionText="Clear All Filters"
    icon={<Search size={32} className="text-gray-400" />}
  />
);