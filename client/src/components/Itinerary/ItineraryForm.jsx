import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, startOfDay } from "date-fns";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { cities } from "../../Data/cities";

export default function ItineraryForm({ onCreate, loading }) {
  // State management for form inputs
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Today's date at midnight to ensure we start from the current day
  const today = startOfDay(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions and validate inputs
    if (isSubmitting || !city || !startDate || !endDate) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Format dates for submission
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      // Call onCreate with formatted dates
      await onCreate(city, formattedStartDate, formattedEndDate);
    } catch (err) {
      // Handle any errors during itinerary creation
      setError(err.message || "Failed to create itinerary");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-2 w-full"></div>
        
        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 tracking-tight">
            Plan Your Journey
          </h2>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* City Selector */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                           focus:outline-none focus:border-teal-500 
                           transition duration-300 appearance-none 
                           text-gray-700 font-medium"
                required
              >
                <option value="" disabled>Select Your Destination</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                    // Reset end date if it's before the new start date
                    if (endDate && date && date > endDate) {
                      setEndDate(null);
                    }
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={today}  // Restrict to today and forward
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Start Date"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                             focus:outline-none focus:border-teal-500 
                             transition duration-300 text-gray-700 font-medium"
                />
              </div>
              
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || today}  // Ensure end date is after start date
                  dateFormat="yyyy-MM-dd"
                  placeholderText="End Date"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl 
                             focus:outline-none focus:border-teal-500 
                             transition duration-300 text-gray-700 font-medium"
                  disabled={!startDate}  // Disable until start date is selected
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSubmitting || !city || !startDate || !endDate}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white 
                         py-3 rounded-xl font-semibold tracking-wide 
                         transition duration-300 
                         flex items-center justify-center space-x-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Creating..." : "Create Itinerary"}</span>
              <ArrowRight className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

