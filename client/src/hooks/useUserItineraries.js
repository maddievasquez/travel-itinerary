import { useState, useEffect } from "react";
import Cookie from "../components/cookies";

export default function useUserItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const token = Cookie.getCookie("access") || localStorage.getItem("userToken");
        if (!token) throw new Error("Unauthorized: No valid token");

        const response = await fetch("http://127.0.0.1:8000/api/itineraries/user-itineraries/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch itineraries: ${response.statusText}`);
        }

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