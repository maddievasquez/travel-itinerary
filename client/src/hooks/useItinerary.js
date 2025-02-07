import { useState, useEffect } from "react";

export function useItinerary(city, startDate, endDate) {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city || !startDate || !endDate) return;

    const fetchItinerary = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/locations/generate-itinerary/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city, start_date: startDate, end_date: endDate }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch itinerary");
        }

        const data = await response.json();
        setItinerary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [city, startDate, endDate]);

  return { itinerary, loading, error };
}
