
import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const Map: React.FC<MapProps> = ({ results, onResultSelect }) => {
  const { toast } = useToast();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai coordinates
  const [map, setMap] = useState<L.Map | null>(null);
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);
  
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

  // Initialize map
  useEffect(() => {
    if (!mapElement) return;
    
    // Clean up the previous map instance
    if (map) {
      map.remove();
    }
    
    // Use the user's position if available, otherwise use the default
    const center = userPosition || defaultCenter;
    
    // Create a new map instance
    const mapInstance = L.map(mapElement).setView(center, 12);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    
    // Save the map instance
    setMap(mapInstance);
    
    // Clean up function
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapElement, userPosition]);

  // Add markers when map and results change
  useEffect(() => {
    if (!map) return;
    
    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
    
    // Add markers for each result
    const center = userPosition || defaultCenter;
    results.forEach(result => {
      // In a real app, each result would have lat/lng
      // For demo purposes, we'll use random positions around the map center
      const lat = center[0] + (Math.random() - 0.5) * 0.1;
      const lng = center[1] + (Math.random() - 0.5) * 0.1;
      
      const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <strong>${result.name}</strong><br />
            ${result.specialization}<br />
            Rating: ${result.rating} (${result.reviews} reviews)
          </div>
        `);
      
      // Add click event handler
      marker.on('click', () => {
        if (onResultSelect) {
          onResultSelect(result);
        }
      });
    });
    
  }, [map, results, userPosition, onResultSelect]);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      <div 
        ref={setMapElement} 
        className="absolute inset-0"
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem', background: '#f8f9fa' }}
      />
    </div>
  );
};

export default Map;
