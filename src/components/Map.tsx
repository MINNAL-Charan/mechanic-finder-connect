
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useToast } from "@/hooks/use-toast";

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define the type for the result items
interface Result {
  id: number;
  name: string;
  type: string;
  specialization: string;
  distance: string;
  rating: number;
  reviews: number;
}

interface MapProps {
  results: Result[];
  onResultSelect?: (result: Result) => void;
}

// Custom map view control component
const MapViewControl = ({ mapCenter }: { mapCenter: [number, number] }) => {
  useEffect(() => {
    // This is just a placeholder - the actual view setting is done in the parent
    console.log("Map center updated:", mapCenter);
  }, [mapCenter]);
  
  return null;
};

const Map: React.FC<MapProps> = ({ results, onResultSelect }) => {
  const { toast } = useToast();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai coordinates
  
  // Handle location detection
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location found:", position.coords);
          setUserPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to find your location. Please check your browser settings.",
            variant: "destructive",
          });
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [toast]);

  // Generate marker positions based on results
  const getMarkerPositions = (results: Result[], center: [number, number]) => {
    return results.map(result => {
      // In a real app, each result would have lat/lng
      // For demo purposes, we'll use random positions around the map center
      const lat = center[0] + (Math.random() - 0.5) * 0.1;
      const lng = center[1] + (Math.random() - 0.5) * 0.1;
      return {
        result,
        position: [lat, lng] as [number, number]
      };
    });
  };

  // Use the user's position if available, otherwise use the default
  const mapCenter = userPosition || defaultCenter;
  const markers = getMarkerPositions(results, mapCenter);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      {/* Key added to force re-render when mapCenter changes */}
      <MapContainer 
        key={`${mapCenter[0]}-${mapCenter[1]}`}
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem', background: '#f8f9fa' }}
      >
        {/* Basic map tile layer */}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Render markers for each result */}
        {markers.map(({ result, position }) => (
          <Marker
            key={result.id}
            position={position}
            eventHandlers={{
              click: () => {
                if (onResultSelect) {
                  onResultSelect(result);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <strong>{result.name}</strong><br />
                {result.specialization}<br />
                Rating: {result.rating} ({result.reviews} reviews)
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapViewControl mapCenter={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default Map;
