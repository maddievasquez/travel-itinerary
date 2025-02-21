import { useState, useEffect } from "react";

export default function useItineraryMap(itineraryId) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!itineraryId) return;

    const fetchLocations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/itineraries/${itineraryId}/`);
        if (!response.ok) throw new Error("Itinerary not found");
        const data = await response.json();
        setLocations(data.days.flatMap((day) => day.locations));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [itineraryId]);

  return { locations, loading, error };
}
