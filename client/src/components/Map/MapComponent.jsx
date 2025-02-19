import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useItineraryMap from "../../hooks/useItineraryMap"; // ✅ Use the new hook name

function MapView({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map((loc) => [parseFloat(loc.latitude), parseFloat(loc.longitude)])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

export default function MapComponent({ itineraryId }) {
  const { locations, loading, error } = useItineraryMap(itineraryId); // ✅ Updated here

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!locations.length) return <p>No locations available</p>;

  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={12} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapView locations={locations} />
      {locations.map((loc, index) => (
        <Marker key={index} position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}>
          <Popup>
            <b>{loc.name}</b>
            <br />
            {loc.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
