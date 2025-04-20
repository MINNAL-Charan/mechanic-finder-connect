
import { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { useToast } from "@/hooks/use-toast";
import { Result } from '@/types/map';
import { createMarkerIcon } from '@/utils/mapUtils';

export const useMapLocation = () => {
  const { toast } = useToast();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai coordinates
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const updateUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location found:", position.coords);
          const newPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserPosition(newPosition);
          setIsLocating(false);
          
          if (mapRef.current) {
            if (userMarkerRef.current) {
              userMarkerRef.current.setLatLng(newPosition);
            } else {
              userMarkerRef.current = L.marker(newPosition, {
                icon: L.divIcon({
                  html: `
                    <div class="relative">
                      <div class="w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg animate-pulse"></div>
                      <div class="absolute -inset-1 bg-primary/20 rounded-full animate-ping"></div>
                    </div>
                  `,
                  className: 'custom-marker-icon',
                })
              }).addTo(mapRef.current);
            }
            
            mapRef.current.setView(newPosition, 14);
            
            toast({
              title: "Location Updated",
              description: "Showing mechanics and shops near you",
            });
          }
        },
        (error) => {
          setIsLocating(false);
          toast({
            title: "Location Error",
            description: "Unable to find your location. Please check your browser settings.",
            variant: "destructive",
          });
          console.error("Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

  return {
    userPosition,
    isLocating,
    defaultCenter,
    mapRef,
    markersRef,
    userMarkerRef,
    updateUserLocation,
  };
};
