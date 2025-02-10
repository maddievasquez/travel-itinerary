import { useState } from "react";
import { useItinerary } from "../../hooks/useItinerary";
import Button from "../ui/button";
import Input from "../ui/input";

export default function ItineraryForm() {
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { createItinerary, loading, error } = useItinerary();

  const handleSubmit = (e) => {
    e.preventDefault();
    createItinerary(city, startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" required />
      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
      <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Itinerary"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
