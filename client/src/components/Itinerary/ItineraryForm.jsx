import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { cities } from "../../Data/cities";

export default function ItineraryForm({ onCreate, loading }) {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    console.log("Form submitted");
    if (city && startDate && endDate) {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");
      console.log("onCreate triggered");
      await onCreate(city, formattedStartDate, formattedEndDate);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-light-grey px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-md border border-teal">
        <h2 className="text-2xl font-semibold text-center text-midnight-blue mb-6">Create Itinerary</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border border-teal p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-light"
            required
          >
            <option value="" disabled>Select a city</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <div className="flex flex-col md:flex-row gap-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
              className="border border-teal p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-light"
              placeholderText="Start Date"
            />

            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
              className="border border-teal p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-light"
              placeholderText="End Date"
            />
          </div>

          <button
            type="submit"
            className="bg-teal text-white py-3 rounded-lg font-medium hover:bg-teal-light transition disabled:opacity-50"
            disabled={loading || isSubmitting}
          >
            {loading ? "Creating..." : "Create Itinerary"}
          </button>
        </form>
      </div>
    </div>
  );
}