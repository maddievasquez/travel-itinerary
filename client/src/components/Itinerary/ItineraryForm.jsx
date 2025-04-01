import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isAfter, addDays } from 'date-fns';
import { MapPin, Calendar, ArrowRight, ChevronDown, AlertCircle, Loader2, Edit, Check } from 'lucide-react';
import { cities } from '../../Data/cities';
import { useItinerary } from '../../hooks/useItinerary';

const ItineraryForm = ({ editMode = false }) => {
  // Navigation and route parameters
  const navigate = useNavigate();
  const { id } = useParams(); // Grab the itinerary ID from URL if we're in edit mode
  
  // Custom hook for itinerary-related operations
  const { 
    createItinerary, 
    updateItinerary,
    fetchItineraryDetails,
    loading, 
    error, 
    setError 
  } = useItinerary();
  
  // All our form state variables
  const [title, setTitle] = useState('');
  const [customTitle, setCustomTitle] = useState(false); // Tracks if user modified auto-generated title
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(editMode); // Only true when loading existing itinerary

  // Automatically generates a title based on city and dates
  const generatedTitle = useMemo(() => {
    if (!city) return ''; // No city? No title yet
    
    // If we have both dates, include them in the title
    if (startDate && endDate) {
      const formattedStartDate = format(startDate, 'MMM dd');
      const formattedEndDate = format(endDate, 'MMM dd, yyyy');
      return `Trip to ${city} (${formattedStartDate} - ${formattedEndDate})`;
    }
    
    // Fallback to simpler title if dates aren't set
    return `Trip to ${city}`;
  }, [city, startDate, endDate]);

  // Sync the title with our generated version unless user customized it
  useEffect(() => {
    if (!customTitle && generatedTitle) {
      setTitle(generatedTitle);
    }
  }, [generatedTitle, customTitle]);

  // Load existing itinerary data when in edit mode
  useEffect(() => {
    if (editMode && id) {
      const loadItineraryData = async () => {
        setIsLoadingData(true);
        try {
          const data = await fetchItineraryDetails(id);
          if (data) {
            // Populate form with existing data
            setCity(data.city || '');
            setStartDate(data.start_date ? new Date(data.start_date) : null);
            setEndDate(data.end_date ? new Date(data.end_date) : null);
            
            // If there's a custom title, use it and mark as customized
            if (data.title) {
              setTitle(data.title);
              setCustomTitle(true);
            }
          } else {
            // Handle case where itinerary isn't found
            setFormErrors(prev => ({ ...prev, api: "Itinerary not found or unauthorized access" }));
            setTimeout(() => navigate('/itineraries'), 3000);
          }
        } catch (err) {
          console.error("Failed to load itinerary data:", err);
          setFormErrors(prev => ({ ...prev, api: `Failed to load itinerary data: ${err.message || 'Unknown error'}` }));
        } finally {
          setIsLoadingData(false);
        }
      };
      
      loadItineraryData();
    }
  }, [editMode, id, fetchItineraryDetails, navigate]);

  // Clear any API errors when form inputs change (after submission)
  useEffect(() => {
    if (error && formSubmitted) {
      if (typeof setError === "function") {
        setError(null);
      }
      
      // Clean up error state
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.api;
        return newErrors;
      });
    }
  }, [city, startDate, endDate, title, error, setError, formSubmitted]);

  // Keep our form errors in sync with API errors
  useEffect(() => {
    if (error) {
      setFormErrors(prev => ({ ...prev, api: error }));
    }
  }, [error]);

  // Validates all form fields and sets error messages
  const validateForm = () => {
    const errors = {};
    
    // Basic validation checks
    if (!title) errors.title = 'Please provide a title for your trip';
    if (!city) errors.city = 'Please select a city';
    if (!startDate) errors.startDate = 'Please select a start date';
    if (!endDate) errors.endDate = 'Please select an end date';
    
    // Date logic validation
    if (startDate && endDate && isAfter(startDate, endDate)) {
      errors.dateRange = 'End date must be after start date';
    }
    
    // Optional validation: limit trip duration
    if (startDate && endDate) {
      const days = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (days > 14) {
        errors.dateRange = 'Trip duration should be 14 days or less';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  // Handles form submission for both create and edit modes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Reset previous errors
    if (typeof setError === "function") {
      setError(null);
    }
    
    // Bail if validation fails
    if (!validateForm()) return;

    try {
      // Prepare our data for API submission
      const itineraryData = {
        title,
        city,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: format(endDate, 'yyyy-MM-dd'),
      };

      console.log("Submitting itinerary data:", itineraryData);
      
      let result;
      
      // Choose between update or create based on mode
      if (editMode && id) {
        result = await updateItinerary(id, itineraryData);
      } else {
        result = await createItinerary(itineraryData);
      }
      
      console.log("Result:", result);
      
      // Navigate to the itinerary detail page if successful
      if (result && (result.id || (result.itinerary && result.itinerary.id))) {
        const itineraryId = result.id || result.itinerary.id;
        navigate(`/itineraries/${itineraryId}`);
      } else {
        navigate('/itineraries');
        console.log("Result full object:", JSON.stringify(result));
      }
    } catch (err) {
      console.error('Itinerary form submission error:', err);
      console.error('Response data:', err.response?.data);
      
      // Build a helpful error message
      const responseError = err.response?.data;
      let errorMessage = err.message || 'Unknown error occurred';
      
      // Handle validation errors from API
      if (responseError && typeof responseError === 'object') {
        const errorDetails = Object.entries(responseError)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        
        if (errorDetails) {
          errorMessage = errorDetails;
        }
      }
      
      // Contextualize the error message
      const contextualMessage = editMode 
        ? `Failed to update itinerary: ${errorMessage}`
        : `Failed to create itinerary: ${errorMessage}`;
      
      setFormErrors(prev => ({ ...prev, api: contextualMessage }));
      
      // Scroll up so the user sees the error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Special handler for start date that also validates end date
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.startDate;
      delete newErrors.dateRange;
      return newErrors;
    });
  
    // Reset end date if it's now invalid
    if (endDate && date && isAfter(date, endDate)) {
      setEndDate(null);
    }
  };

  // Close city dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showCityDropdown && !event.target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCityDropdown]);

  // Title change handler that marks title as customized
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setCustomTitle(true);
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.title;
      return newErrors;
    });
  };

  // Resets title to auto-generated version
  const resetToGeneratedTitle = () => {
    setTitle(generatedTitle);
    setCustomTitle(false);
  };

  // Show loading state while fetching existing itinerary
  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-teal-500" />
          <p className="mt-4 text-gray-600 font-medium">Loading itinerary data...</p>
        </div>
      </div>
    );
  }

  // Main form rendering
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      {/* Form container with nice shadow and accent */}
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-3 w-full"></div>
        
        {/* Form content area */}
        <div className="p-10 space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-tight">
            {editMode ? 'Edit Your Journey' : 'Plan Your Journey'}
          </h2>

          {/* API error display */}
          {formErrors.api && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 text-red-500" />
              <span className="font-medium">{formErrors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title field with auto-generation toggle */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Trip Title</label>
                {generatedTitle && (
                  <button 
                    type="button"
                    onClick={resetToGeneratedTitle}
                    className={`text-xs px-3 py-1.5 rounded-full ${customTitle ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-teal-100 text-teal-700'}`}
                  >
                    <div className="flex items-center space-x-1">
                      {customTitle ? <Edit className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                      <span>{customTitle ? 'Auto-generate' : 'Auto-generated'}</span>
                    </div>
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter trip title"
                  value={title}
                  onChange={handleTitleChange}
                  className={`w-full p-4 border-2 rounded-xl text-lg
                           focus:outline-none transition duration-300
                           ${formErrors.title ? 'border-red-400' : 'border-gray-200 focus:border-teal-500'}`}
                />
                {formErrors.title && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
            </div>

            {/* City selection dropdown */}
            <div className="relative city-dropdown-container">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <div 
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl 
                         focus:outline-none cursor-pointer text-lg
                         transition duration-300 text-gray-700 font-medium flex justify-between items-center
                         ${formErrors.city ? 'border-red-400' : 'border-gray-200 focus:border-teal-500'}`}
                onClick={() => setShowCityDropdown(!showCityDropdown)}
              >
                {city || "Select a city"}
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
              {formErrors.city && (
                <p className="mt-2 text-sm text-red-600">{formErrors.city}</p>
              )}
              
              {/* City dropdown options */}
              {showCityDropdown && (
                <div className="absolute z-20 mt-2 w-full max-h-72 overflow-auto bg-white border border-gray-200 rounded-lg shadow-xl">
                  <input
                    type="text"
                    placeholder="Search cities..."
                    className="w-full p-3 border-b border-gray-200 sticky top-0 bg-white text-base"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {cities.map((cityOption) => (
                    <div
                      key={cityOption}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-base"
                      onClick={() => {
                        setCity(cityOption);
                        setShowCityDropdown(false);
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.city;
                          return newErrors;
                        });
                      }}
                    >
                      {cityOption}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Date range pickers */}
            <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
              {/* Start date picker */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-4 bg-gray-100 p-1.5 rounded-full">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Start Date"
                  className={`w-full pl-14 pr-4 py-4 border-2 rounded-xl text-lg
                             focus:outline-none transition duration-300 text-gray-700 font-medium
                             ${formErrors.startDate ? 'border-red-400' : 'border-gray-200 focus:border-teal-500'}`}
                  popperPlacement="bottom-start"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                      escapeWithReference: false,
                    }
                  }}
                />
                {formErrors.startDate && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.startDate}</p>
                )}
              </div>
              
              {/* End date picker */}
              <div className="relative flex-1">
                <div className="absolute left-4 top-4 bg-gray-100 p-1.5 rounded-full">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                    setFormErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.endDate;
                      delete newErrors.dateRange;
                      return newErrors;
                    });
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate ? addDays(startDate, 1) : new Date()}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="End Date"
                  className={`w-full pl-14 pr-4 py-4 border-2 rounded-xl text-lg
                             focus:outline-none transition duration-300 text-gray-700 font-medium
                             ${formErrors.endDate || formErrors.dateRange ? 'border-red-400' : 'border-gray-200 focus:border-teal-500'}`}
                  disabled={!startDate}
                  popperPlacement="bottom-start"
                  popperModifiers={{
                    preventOverflow: {
                      enabled: true,
                      escapeWithReference: false,
                    }
                  }}
                />
                {formErrors.endDate && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.endDate}</p>
                )}
              </div>
            </div>
            {formErrors.dateRange && (
              <p className="text-sm text-red-600">{formErrors.dateRange}</p>
            )}

            {/* Trip duration display */}
            {startDate && endDate && !formErrors.dateRange && (
              <div className="text-base text-gray-600 bg-gray-50 p-4 rounded-lg">
                <span className="font-medium">Trip Duration:</span> {Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))} days
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white 
                         py-4 rounded-xl font-semibold tracking-wide text-lg
                         transition duration-300 flex items-center justify-center space-x-3
                         hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{editMode ? "Update Itinerary" : "Create Itinerary"}</span>
                  <ArrowRight className="ml-3 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItineraryForm;