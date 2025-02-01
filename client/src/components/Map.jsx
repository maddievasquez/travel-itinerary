import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapComponent({ locations }) {
  const defaultCenter = locations.length
    ? [locations[0].latitude, locations[0].longitude]
    : [48.8566, 2.3522]; // Default: Paris

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
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
