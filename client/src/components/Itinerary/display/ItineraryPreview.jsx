import React from 'react';
import { Calendar, MapPin } from "lucide-react";

const ItineraryPreview = ({ itinerary, onClick }) => (
  <div 
    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white cursor-pointer"
    onClick={() => onClick(itinerary.id)}
  >
    <div className="p-4 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
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
      
      <div className="space-y-1 mt-1">
        {itinerary.city && (
          <div className="flex items-center text-gray-700 text-sm">
            <MapPin className="w-3 h-3 mr-1 text-teal-500" />
            <span className="truncate">
              {itinerary.city}
              {itinerary.country && `, ${itinerary.country}`}
            </span>
          </div>
        )}
        
        {itinerary.start_date && (
          <div className="flex items-center text-gray-700 text-sm">
            <Calendar className="w-3 h-3 mr-1 text-teal-500" />
            <span className="truncate">
              {new Date(itinerary.start_date).toLocaleDateString()}
              {itinerary.end_date && ` → ${new Date(itinerary.end_date).toLocaleDateString()}`}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ItineraryPreview;