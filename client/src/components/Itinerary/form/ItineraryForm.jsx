import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isAfter, addDays } from 'date-fns';
import { MapPin, Calendar, ArrowRight, ChevronDown, AlertCircle, Loader2, Edit, Check } from 'lucide-react';
import { cities } from '../../../Data/cities';
import { useItinerary } from '../../../hooks/useItinerary';

const ItineraryForm = ({ editMode = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { 
    createItinerary, 
    updateItinerary,
    fetchItineraryDetails,
    loading, 
    error, 
    setError
  } = useItinerary();
  
  // Form state
  const [title, setTitle] = useState('');
  const [customTitle, setCustomTitle] = useState(false);
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(editMode);

  // Helper function to calculate calendar days
  const calculateCalendarDays = (start, end) => {
    const diffTime = end - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Generate title automatically
  const generatedTitle = useMemo(() => {
    if (!city) return '';
    if (startDate && endDate) {
      return `Trip to ${city} (${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')})`;
    }
    return `Trip to ${city}`;
  }, [city, startDate, endDate]);

  // Sync title with generated version
  useEffect(() => {
    if (!customTitle && generatedTitle) {
      setTitle(generatedTitle);
    }
  }, [generatedTitle, customTitle]);

  // Load existing itinerary in edit mode
  useEffect(() => {
    if (editMode && id) {
      const loadItineraryData = async () => {
        setIsLoadingData(true);
        try {
          const data = await fetchItineraryDetails(id);
          if (data) {
            setCity(data.city || '');
            setStartDate(data.start_date ? new Date(data.start_date) : null);
            setEndDate(data.end_date ? new Date(data.end_date) : null);
            if (data.title) {
              setTitle(data.title);
              setCustomTitle(true);
            }
          }
        } catch (err) {
          setFormErrors({ api: err.message });
          setTimeout(() => navigate('/itineraries'), 3000);
        } finally {
          setIsLoadingData(false);
        }
      };
      loadItineraryData();
    }
  }, [editMode, id, fetchItineraryDetails, navigate]);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) {
      setFormErrors(prev => ({ ...prev, api: error }));
    }
  }, [error]);

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    if (!title) errors.title = 'Trip title required';
    if (!city) errors.city = 'Please select a city';
    if (!startDate) errors.startDate = 'Start date required';
    if (!endDate) errors.endDate = 'End date required';
    
    if (startDate && endDate) {
      if (isAfter(startDate, endDate)) {
        errors.dateRange = 'End date must be after start date';
      }
      
      const days = calculateCalendarDays(startDate, endDate);
      if (days > 14) errors.dateRange = 'Maximum 14 days';
      if (days < 1) errors.dateRange = 'Minimum 1 day (same day for start and end)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Format date for API
  const formatDateForApi = (date) => {
    return date ? format(date, 'yyyy-MM-dd') : null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const itineraryData = {
        title,
        city,
        start_date: formatDateForApi(startDate),
        end_date: formatDateForApi(endDate)
      };

      console.log('Submitting:', itineraryData);

      const result = editMode && id 
        ? await updateItinerary(id, itineraryData)
        : await createItinerary(itineraryData);

      console.log('Response:', result);

      if (result?.id || result?.itinerary?.id) {
        const itineraryId = result.id || result.itinerary.id;
        setTimeout(() => navigate(`/itineraries/${itineraryId}`), 500);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setFormErrors({
        api: err.response?.data?.message || err.message || 'Submission failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Date change handlers
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date && isAfter(date, endDate)) {
      setEndDate(null);
    }
    setFormErrors(prev => ({
      ...prev,
      startDate: undefined,
      dateRange: undefined
    }));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setFormErrors(prev => ({
      ...prev,
      endDate: undefined,
      dateRange: undefined
    }));
  };

  // Title handlers
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setCustomTitle(true);
    setFormErrors(prev => ({ ...prev, title: undefined }));
  };

  const resetToGeneratedTitle = () => {
    setTitle(generatedTitle);
    setCustomTitle(false);
  };

  // City selection
  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setShowCityDropdown(false);
    setFormErrors(prev => ({ ...prev, city: undefined }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showCityDropdown && !e.target.closest('.city-dropdown-container')) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCityDropdown]);

  // Custom styles for date picker
  const datePickerStyles = `
    .react-datepicker {
      font-family: 'Inter', sans-serif;
      border-radius: 1rem;
      border: none;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      overflow: hidden;
    }
    .react-datepicker__header {
      background: linear-gradient(to right, #0d9488, #2563eb);
      border-bottom: none;
      padding-top: 0.8rem;
      padding-bottom: 0.8rem;
    }
    .react-datepicker__current-month {
      color: white;
      font-weight: 600;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    .react-datepicker__day-name {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
    }
    .react-datepicker__day--selected, 
    .react-datepicker__day--in-selecting-range, 
    .react-datepicker__day--in-range {
      background-color: #0d9488;
      border-radius: 0.5rem;
    }
    .react-datepicker__day--keyboard-selected {
      background-color: rgba(13, 148, 136, 0.5);
      border-radius: 0.5rem;
    }
    .react-datepicker__day:hover {
      border-radius: 0.5rem;
    }
    .react-datepicker__navigation {
      top: 1rem;
    }
    .react-datepicker__day {
      border-radius: 0.5rem;
      margin: 0.2rem;
      width: 2rem;
      line-height: 2rem;
    }
    .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range) {
      background-color: rgba(13, 148, 136, 0.2);
      color: #0d9488;
    }
  `;

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-teal-500" />
          <p className="mt-4 text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <style>{datePickerStyles}</style>
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-3 w-full"></div>
        
        <div className="p-8 space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {editMode ? 'Edit Itinerary' : 'Create New Itinerary'}
          </h2>

          {formErrors.api && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-start">
              <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
              <span>{formErrors.api}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Trip Title</label>
                {generatedTitle && (
                  <button
                    type="button"
                    onClick={resetToGeneratedTitle}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 ${
                      customTitle 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-teal-100 text-teal-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center">
                      {customTitle ? (
                        <>
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          <span>Use Suggested</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          <span>Auto-generated</span>
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className={`w-full p-4 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-opacity-20 ${
                    formErrors.title 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                  }`}
                  placeholder="Enter trip title"
                />
              </div>
              {formErrors.title && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.title}
                </p>
              )}
            </div>

            {/* City Selection */}
            <div className="relative city-dropdown-container">
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <div
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  formErrors.city 
                    ? 'border-red-400' 
                    : showCityDropdown 
                      ? 'border-teal-500 ring-4 ring-teal-200 ring-opacity-20' 
                      : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setShowCityDropdown(!showCityDropdown)}
              >
                <MapPin className="h-5 w-5 text-teal-500 mr-3" />
                <span className="flex-1 text-gray-800">{city || 'Select a city'}</span>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${showCityDropdown ? 'transform rotate-180' : ''}`} />
              </div>
              {showCityDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-auto">
                  <div className="py-2">
                    {cities.map((cityOption) => (
                      <div
                        key={cityOption}
                        className="px-4 py-2.5 hover:bg-teal-50 cursor-pointer transition-colors duration-150 text-gray-800"
                        onClick={() => handleCitySelect(cityOption)}
                      >
                        {cityOption}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {formErrors.city && (
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {formErrors.city}
                </p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    placeholderText="Select start date"
                    className={`w-full p-4 pl-12 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-opacity-20 ${
                      formErrors.startDate 
                        ? 'border-red-400 focus:ring-red-200' 
                        : 'border-gray-200 focus:border-teal-500 focus:ring-teal-200'
                    }`}
                  />
                  <Calendar className="absolute left-4 top-4 h-5 w-5 text-teal-500" />
                </div>
                {formErrors.startDate && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate ? addDays(startDate, 1) : new Date()}
                    placeholderText="Select end date"
                    className={`w-full p-4 pl-12 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-opacity-20 ${
                      formErrors.endDate 
                        ? 'border-red-400 focus:ring-red-200' 
                        : startDate ? 'border-gray-200 focus:border-teal-500 focus:ring-teal-200' : 'border-gray-200 bg-gray-50 text-gray-400'
                    }`}
                    disabled={!startDate}
                  />
                  <Calendar className={`absolute left-4 top-4 h-5 w-5 ${startDate ? 'text-teal-500' : 'text-gray-300'}`} />
                </div>
                {formErrors.endDate && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {formErrors.endDate}
                  </p>
                )}
              </div>
            </div>
            {formErrors.dateRange && (
              <p className="text-sm text-red-600 flex items-center -mt-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formErrors.dateRange}
              </p>
            )}

            {/* Trip Duration */}
            {startDate && endDate && !formErrors.dateRange && (
              <div className="px-4 py-3 bg-teal-50 rounded-xl border border-teal-100 text-teal-700 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>
                  Trip Duration: <span className="font-medium">{calculateCalendarDays(startDate, endDate)} days</span>
                  <span className="text-sm ml-2">
                    ({format(startDate, 'MMM d')} - {format(endDate, 'MMM d')})
                  </span>
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-teal-500 focus:ring-opacity-30 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  {editMode ? 'Update Itinerary' : 'Create Itinerary'}
                  <ArrowRight className="ml-2 h-5 w-5" />
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