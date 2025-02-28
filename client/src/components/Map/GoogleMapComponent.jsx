import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function GoogleMapComponent({ locations }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      center={{
        lat: locations[0]?.latitude || 48.8566, // Default: Paris
        lng: locations[0]?.longitude || 2.3522,
      }}
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {locations.map((loc, index) => (
        <Marker key={index} position={{ lat: Number(loc.latitude), lng: Number(loc.longitude) }} />
      ))}
    </GoogleMap>
  );
}
