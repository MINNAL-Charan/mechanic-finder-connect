
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from "lucide-react";
import { MapProps } from '@/types/map';
import { initializeLeafletIcons, createMarkerIcon } from '@/utils/mapUtils';
import { useMapLocation } from '@/hooks/useMapLocation';

// Initialize Leaflet icons
initializeLeafletIcons();

const Map: React.FC<MapProps> = ({ results, onResultSelect, selectable = false, onLocationSelect }) => {
  const {
    isLocating,
    defaultCenter,
    mapRef,
    markersRef,
    userMarkerRef,
    userPosition,
    updateUserLocation
  } = useMapLocation();
  
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

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
    
    // Add markers for each result
    const center = userPosition || defaultCenter;
    results.forEach(result => {
      const radius = 0.05;
      const lat = center[0] + (Math.random() - 0.5) * radius;
      const lng = center[1] + (Math.random() - 0.5) * radius;
      
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

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      if (onLocationSelect) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng });
        
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([lat, lng]);
        } else {
          userMarkerRef.current = L.marker([lat, lng], {
            icon: createMarkerIcon('user'),
          }).addTo(mapRef.current!);
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
