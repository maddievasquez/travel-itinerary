import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Cookie from "../components/cookies";
import { v4 as uuidv4 } from 'uuid';

export default function useItineraryMap(itineraryId) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://127.0.0.1:8000/api',
      timeout: 10000,
      withCredentials: true
    });

    instance.interceptors.request.use(config => {
      const token = Cookie.getCookie("access") || localStorage.getItem("accessToken");
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });

    return instance;
  }, []);

  // Enhanced coordinate validator
  const isValidCoordinate = (coord, type) => {
    const num = parseFloat(coord);
    if (isNaN(num)) return false;
    if (type === 'lat') return num >= -90 && num <= 90;
    if (type === 'lng') return num >= -180 && num <= 180;
    return false;
  };

  // Location processor that handles multiple coordinate formats
  const processLocation = (loc, dayNum, context = {}) => {
    if (!loc) return null;

    // Handle different coordinate field names
    const coordinates = loc.geometry?.coordinates || [loc.longitude, loc.latitude];
    const [lng, lat] = Array.isArray(coordinates) ? coordinates : [loc.longitude, loc.latitude];

    const isValid = isValidCoordinate(lat, 'lat') && isValidCoordinate(lng, 'lng');

    return {
      id: loc.id || uuidv4(),
    name: loc.name || loc.title || 'Unnamed Location',
    address: loc.address || loc.formatted_address,
    latitude: isValid ? parseFloat(lat) : null,
    longitude: isValid ? parseFloat(lng) : null,
    category: loc.category || context.category,
    day: dayNum,
    isValid,
    context
    };
  };

  const fetchItinerary = async () => {
    if (!itineraryId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`itineraries/${itineraryId}/`);
      
      if (!response.data?.days) {
        throw new Error('Invalid itinerary data structure');
      }

      // Process all locations from days and activities
      const processedLocations = response.data.days.flatMap(day => {
        const dayLocations = (day.locations || []).map(loc => 
          processLocation(loc, day.day, { source: 'day.locations' })
        );

        const activityLocations = (day.activities || [])
          .filter(activity => activity.location)
          .map(activity => processLocation(
            activity.location, 
            day.day, 
            { 
              source: 'activity',
              time: activity.start_time,
              description: activity.description
            }
          ));

        return [...dayLocations, ...activityLocations].filter(Boolean);
      });

      // Filter out completely invalid locations
      const validLocations = processedLocations.filter(loc => loc.isValid);

      setLocations(validLocations);
      setError(null);
    } catch (err) {
      setError({
        message: err.response?.data?.message || err.message,
        status: err.response?.status
      });
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [itineraryId]);

  return { 
    locations,
    loading,
    error,
    retry: fetchItinerary,
    hasValidLocations: locations.length > 0
  };
}