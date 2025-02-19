import { useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";

export default function ItineraryForm({ onCreate, loading }) {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(city, startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-lg font-medium text-gray-700">City</label>
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city"
          required
          className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-lg font-medium text-gray-700">Start Date</label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-lg font-medium text-gray-700">End Date</label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
          className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        disabled={loading}
      >
        {loading ? "Creating..." : "Generate Itinerary"}
      </Button>
    </form>
  );
}
