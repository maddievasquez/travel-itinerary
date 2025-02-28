import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useItineraryMap from "../../hooks/useItineraryMap";

function MapView({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations
          .filter(loc => loc.latitude && loc.longitude) // ✅ Ensure valid coordinates
          .map((loc) => [parseFloat(loc.latitude), parseFloat(loc.longitude)])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

export default function MapComponent({ itineraryId }) {
  const { locations, loading, error } = useItineraryMap(itineraryId);

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!locations.length) return <p>No locations available</p>;

  return (
    <MapContainer
      center={[parseFloat(locations[0]?.latitude) || 35.6895, parseFloat(locations[0]?.longitude) || 139.6917]} // Default: Tokyo
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapView locations={locations} />
      {locations
        .filter(loc => loc.latitude && loc.longitude) // ✅ Ensure valid coordinates
        .map((loc, index) => (
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
