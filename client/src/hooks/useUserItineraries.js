import { useState, useEffect } from "react";
import Cookie from "../components/cookies";

export default function useUserItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/itineraries/user-itineraries/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + Cookie.getCookie("access"),  // ✅ Uses JWT token for authentication
          },
        });

        if (!response.ok) throw new Error("Failed to fetch itineraries");

        const data = await response.json();
        setItineraries(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  return { itineraries, loading, error };
}
