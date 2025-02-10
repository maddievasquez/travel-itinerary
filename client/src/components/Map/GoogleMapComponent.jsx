import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function GoogleMapComponent({ locations }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap center={locations[0]} zoom={12} mapContainerStyle={{ width: "100%", height: "400px" }}>
      {locations.map((loc, index) => (
        <Marker key={index} position={{ lat: loc.latitude, lng: loc.longitude }} />
      ))}
    </GoogleMap>
  );
}
