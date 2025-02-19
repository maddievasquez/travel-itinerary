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
        setError(null);

        const response = await fetch(`/api/itineraries/${itineraryId}/`);
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();

        if (data.days) {
          const extractedLocations = data.days.flatMap((day) => day.locations);
          setLocations(extractedLocations);
        } else {
          setLocations([]);
        }
      } catch (err) {
        setError(err.message);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [itineraryId]);

  return { locations, loading, error };
}
