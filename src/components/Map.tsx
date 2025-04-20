
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from "@/hooks/use-toast";
import { Wrench, Home, MapPin } from "lucide-react";

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
  selectable?: boolean;
  onLocationSelect?: (location: { lat: number, lng: number }) => void;
}

// Function to create custom marker icons
const createMarkerIcon = (type: 'mechanic' | 'shop' | 'user') => {
  const iconHtml = type === 'mechanic'
    ? `<div class="relative p-2 bg-background rounded-lg shadow-lg border-2 border-primary transform transition-transform hover:scale-110">
         <div class="text-lg text-primary">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
           </svg>
         </div>
       </div>`
    : type === 'shop'
    ? `<div class="relative p-2 bg-background rounded-lg shadow-lg border-2 border-secondary transform transition-transform hover:scale-110">
         <div class="text-lg text-secondary">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
             <path d="M9 22V12h6v10"/>
           </svg>
         </div>
       </div>`
    : `<div class="relative">
         <div class="w-8 h-8 bg-primary rounded-full border-4 border-background shadow-lg">
           <svg class="h-full w-full text-white p-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="10"/>
             <polyline points="8 12 12 16 16 12"/>
             <line x1="12" y1="8" x2="12" y2="16"/>
           </svg>
         </div>
         <div class="absolute -inset-1 bg-primary/20 rounded-full animate-ping"></div>
       </div>`;

  return L.divIcon({
    html: iconHtml,
    className: `custom-marker-${type}`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const Map: React.FC<MapProps> = ({ results, onResultSelect, selectable = false, onLocationSelect }) => {
  const { toast } = useToast();
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const defaultCenter: [number, number] = [13.0827, 80.2707]; // Chennai coordinates
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
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
          
          // Update user marker with enhanced design
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

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    const center = userPosition || defaultCenter;
    
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, 12);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Add locate control
      const locateControl = L.control({ position: 'bottomright' });
      locateControl.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-control');
        div.innerHTML = `
          <button class="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hover:bg-accent p-2 rounded-md shadow-md border border-border flex items-center gap-2">
            <span class="text-primary"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v2M2 12h2m8-8v8h8"/></svg></span>
          </button>
        `;
        
        div.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          updateUserLocation();
        };
        
        return div;
      };
      locateControl.addTo(mapRef.current);
      
      // Initial location request
      updateUserLocation();
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when results change
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clear existing markers except user marker
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add markers for each result with enhanced design
    const center = userPosition || defaultCenter;
    results.forEach(result => {
      // Generate random positions within 5km of user location
      const radius = 0.05; // roughly 5km
      const lat = center[0] + (Math.random() - 0.5) * radius;
      const lng = center[1] + (Math.random() - 0.5) * radius;
      
      // Use the new createMarkerIcon function
      const markerIcon = createMarkerIcon(result.type === 'mechanic' ? 'mechanic' : 'shop');

      const marker = L.marker([lat, lng], { icon: markerIcon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <div class="font-semibold text-lg mb-1">${result.name}</div>
            <div class="text-sm text-muted-foreground mb-2">${result.specialization}</div>
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm">
                <svg class="w-4 h-4 text-primary mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                ${result.rating}
              </div>
              <span class="text-sm text-muted-foreground">${result.reviews} reviews</span>
            </div>
          </div>
        `, {
          className: 'custom-popup'
        });
      
      marker.on('click', () => {
        if (onResultSelect) {
          onResultSelect(result);
        }
      });
      
      markersRef.current.push(marker);
    });
  }, [results, userPosition]);

  // Add click handler for location selection if selectable
  useEffect(() => {
    if (!mapRef.current || !selectable) return;

    const handleMapClick = (e) => {
      if (onLocationSelect) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng });
        
        // Update marker position
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([lat, lng]);
        } else {
          userMarkerRef.current = L.marker([lat, lng], {
            icon: createMarkerIcon('user'),
          }).addTo(mapRef.current);
        }
      }
    };

    mapRef.current.on('click', handleMapClick);

    return () => {
      mapRef.current?.off('click', handleMapClick);
    };
  }, [selectable, onLocationSelect]);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0"
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem', background: '#f8f9fa' }}
      />
      {isLocating && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 bg-background p-4 rounded-lg shadow-lg">
            <MapPin className="w-5 h-5 animate-bounce text-primary" />
            <span>Finding your location...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
