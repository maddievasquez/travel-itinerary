import { useState, useEffect, useCallback, useMemo } from "react";
import Cookie from "../components/cookies";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function useUserItineraries() {
  const [state, setState] = useState({
    rawItineraries: [], // Store raw API data
    processedItineraries: [], // Store processed data for display
    loading: true,
    error: null,
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false
    }
  });

  const [filters, setFilters] = useState({
    status: '',
    sortBy: 'updated_at:desc',
    searchTerm: ''
  });

  // Process itinerary data to ensure consistent structure
  const processItinerary = (itinerary) => {
    return {
      id: itinerary.id,
      title: itinerary.title || `Trip to ${itinerary.city}`,
      city: itinerary.city || 'Unknown city',
      country: itinerary.country || '',
      description: itinerary.description || '',
      start_date: itinerary.start_date || null,
      end_date: itinerary.end_date || null,
      status: itinerary.status || 'draft',
      updated_at: itinerary.updated_at || new Date().toISOString(),
      days: itinerary.days || []
    };
  };

  const fetchItineraries = useCallback(async (page = 1, pageSize = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const token = Cookie.getCookie("access");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(`${API_BASE_URL}/user/itineraries/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          page_size: pageSize,
          status: filters.status,
          search: filters.searchTerm,
          ordering: filters.sortBy.replace(':', '')
        }
      });

      const { results, count } = response.data;

      const processed = results.map(processItinerary);

      setState(prev => ({
        ...prev,
        rawItineraries: results,
        processedItineraries: processed,
        pagination: {
          currentPage: page,
          pageSize,
          totalCount: count,
          totalPages: Math.ceil(count / pageSize),
          hasNext: page * pageSize < count,
          hasPrevious: page > 1
        },
        loading: false
      }));

      return processed;
    } catch (err) {
      const errorMessage = err.response?.data?.detail ||
        err.message ||
        "Failed to fetch itineraries";

      const isAuthError = err.response?.status === 401;

      setState(prev => ({
        ...prev,
        error: { message: errorMessage, isAuthError },
        loading: false
      }));

      if (isAuthError) {
        Cookie.deleteCookie("access");
        window.location.href = '/login';
      }

      return [];
    }
  }, [filters]);

  // Apply filters and sorting
  const filteredItineraries = useMemo(() => {
    return state.processedItineraries
      .filter(itinerary => {
        const matchesSearch = !filters.searchTerm ||
          [itinerary.title, itinerary.city, itinerary.description]
            .filter(Boolean)
            .some(field => field.toLowerCase().includes(filters.searchTerm.toLowerCase()));

        const matchesStatus = !filters.status || itinerary.status === filters.status;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const [sortField, sortDirection] = filters.sortBy.split(':');
        const modifier = sortDirection === 'desc' ? -1 : 1;

        if (sortField === 'date') {
          return (new Date(a.start_date || 0) - new Date(b.start_date || 0)) * modifier;
        }
        if (sortField === 'title') {
          return a.title.localeCompare(b.title) * modifier;
        }
        return (new Date(a.updated_at) - new Date(b.updated_at)) * modifier;
      });
  }, [state.processedItineraries, filters]);

  const hasNoMatchingResults = useMemo(() => {
    return state.processedItineraries.length > 0 && filteredItineraries.length === 0;
  }, [state.processedItineraries.length, filteredItineraries.length]);

  const deleteItinerary = useCallback(async (id) => {
    try {
      const token = Cookie.getCookie("access");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(`${API_BASE_URL}/itineraries/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setState(prev => {
        const newCount = prev.pagination.totalCount - 1;
        const newTotalPages = Math.ceil(newCount / prev.pagination.pageSize);
        const newCurrentPage = Math.min(prev.pagination.currentPage, newTotalPages || 1);

        return {
          ...prev,
          rawItineraries: prev.rawItineraries.filter(item => item.id !== id),
          processedItineraries: prev.processedItineraries.filter(item => item.id !== id),
          pagination: {
            ...prev.pagination,
            totalCount: newCount,
            totalPages: newTotalPages,
            currentPage: newCurrentPage
          }
        };
      });

      // Refetch current page if needed
      if (state.processedItineraries.length === 1 && state.pagination.currentPage > 1) {
        fetchItineraries(state.pagination.currentPage - 1, state.pagination.pageSize);
      }

      return id;
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  }, [fetchItineraries, state.pagination, state.processedItineraries.length]);

  const goToPage = useCallback((page) => {
    fetchItineraries(page, state.pagination.pageSize);
  }, [fetchItineraries, state.pagination.pageSize]);

  const changePageSize = useCallback((size) => {
    fetchItineraries(1, size); // Reset to first page when changing size
  }, [fetchItineraries]);

  useEffect(() => {
    fetchItineraries(state.pagination.currentPage, state.pagination.pageSize);
  }, [fetchItineraries, state.pagination.currentPage, state.pagination.pageSize]);

  return {
    ...state,
    itineraries: filteredItineraries,
    rawItineraries: state.rawItineraries,
    filters,
    setFilters,
    hasNoMatchingResults,
    refetch: () => fetchItineraries(state.pagination.currentPage, state.pagination.pageSize),
    deleteItinerary,
    resetFilters: () => setFilters({
      status: '',
      sortBy: 'updated_at:desc',
      searchTerm: ''
    }),
    // Pagination controls
    pagination: state.pagination,
    goToPage,
    changePageSize
  };
}