import { useState } from "react";
import Cookie from "../components/cookies";

export function useItinerary() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createItinerary = async (city, startDate, endDate) => {
    setLoading(true);
    try {
      const token = Cookie.getCookie("access") || localStorage.getItem("userToken");
      if (!token) throw new Error("Unauthorized: No valid token");

      const response = await fetch("http://127.0.0.1:8000/api/locations/generate-itinerary/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ city, start_date: startDate, end_date: endDate }),
      });

      if (!response.ok) throw new Error("Failed to create itinerary");

      const data = await response.json();
      setItinerary(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { itinerary, loading, error, createItinerary };
}
