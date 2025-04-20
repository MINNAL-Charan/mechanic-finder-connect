
import React, { useState, useEffect, useRef } from 'react';
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
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
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
    if (!mapContainerRef.current) return;
    
    // Use the user's position if available, otherwise use the default
    const center = userPosition || defaultCenter;
    
    // Only initialize map if it doesn't exist yet
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, 12);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else {
      // If map exists, just update the view
      mapRef.current.setView(center, 12);
    }
    
    // Clean up on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapContainerRef.current]); // Only re-run when the ref changes (component mounts)

  // Update view when user position changes
  useEffect(() => {
    if (!mapRef.current || !userPosition) return;
    mapRef.current.setView(userPosition, 12);
  }, [userPosition]);

  // Add markers when results change
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];
    
    // Add markers for each result
    const center = userPosition || defaultCenter;
    results.forEach(result => {
      // In a real app, each result would have lat/lng
      // For demo purposes, we'll use random positions around the map center
      const lat = center[0] + (Math.random() - 0.5) * 0.1;
      const lng = center[1] + (Math.random() - 0.5) * 0.1;
      
      const marker = L.marker([lat, lng])
        .addTo(mapRef.current!)
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
      
      // Store marker reference for cleanup
      markersRef.current.push(marker);
    });
  }, [results, userPosition, onResultSelect, mapRef.current]);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0"
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem', background: '#f8f9fa' }}
      />
    </div>
  );
};

export default Map;
