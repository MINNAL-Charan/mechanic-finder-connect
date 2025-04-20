
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Fix for default marker icons in Leaflet with React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  results: any[];
  onResultSelect?: (result: any) => void;
}

// Component to handle location changes
const LocationMarker = () => {
  const map = useMap();
  const { toast } = useToast();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy;
      L.circle(e.latlng, radius).addTo(map);
    }).on("locationerror", function (e) {
      toast({
        title: "Location Error",
        description: "Unable to find your location. Please check your browser settings.",
        variant: "destructive",
      });
    });
  }, [map, toast]);

  return null;
};

const Map: React.FC<MapProps> = ({ results, onResultSelect }) => {
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai coordinates
  const mapRef = useRef<L.Map>(null);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      <MapContainer 
        ref={mapRef}
        className="h-full w-full rounded-lg"
        style={{ background: '#f8f9fa' }}
        center={defaultCenter}
        zoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarker />
        
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
      </MapContainer>
    </div>
  );
};

export default Map;
