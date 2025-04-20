
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Component to set the map view dynamically
const SetView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  
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

  // Use the user's position if available, otherwise use the default
  const mapCenter = userPosition || defaultCenter;

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

  const markers = getMarkerPositions(results, mapCenter);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      <MapContainer 
        className="h-full w-full rounded-lg"
        style={{ background: '#f8f9fa' }}
        // In react-leaflet v4, center and zoom are handled by the initial configuration
        // but don't accept props directly on MapContainer
        center={defaultCenter as L.LatLngExpression}
        zoom={12}
      >
        <SetView center={mapCenter} />
        
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
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
      </MapContainer>
    </div>
  );
};

export default Map;
