
import React, { useEffect } from 'react';
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

// Separate location detector component
const LocationDetector = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location found:", position.coords);
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

  return null;
};

// Component to render the markers
const MapMarkers = ({ results, onResultSelect }: MapProps) => {
  const defaultCenter = [13.0827, 80.2707]; // Chennai coordinates
  
  return (
    <>
      {results.map((result, index) => {
        // In a real app, each result would have lat/lng
        // For demo purposes, we'll use random positions around Chennai
        const lat = defaultCenter[0] + (Math.random() - 0.5) * 0.1;
        const lng = defaultCenter[1] + (Math.random() - 0.5) * 0.1;
        
        return (
          <Marker
            key={index}
            position={[lat, lng]}
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
        );
      })}
    </>
  );
};

const Map: React.FC<MapProps> = ({ results, onResultSelect }) => {
  const defaultCenter = [13.0827, 80.2707]; // Chennai coordinates
  
  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      {/* Location detector outside MapContainer */}
      <LocationDetector />
      
      <MapContainer 
        center={defaultCenter as [number, number]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
        style={{ background: '#f8f9fa' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapMarkers results={results} onResultSelect={onResultSelect} />
      </MapContainer>
    </div>
  );
};

export default Map;
