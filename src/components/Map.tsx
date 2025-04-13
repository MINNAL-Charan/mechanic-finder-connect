
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface MapProps {
  results: any[];
  onResultSelect?: (result: any) => void;
}

const Map: React.FC<MapProps> = ({ results, onResultSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(localStorage.getItem('mapboxToken') || '');
  const [showTokenInput, setShowTokenInput] = useState<boolean>(!localStorage.getItem('mapboxToken'));
  const { toast } = useToast();
  const markers = useRef<mapboxgl.Marker[]>([]);

  const saveToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapboxToken', mapboxToken.trim());
      setShowTokenInput(false);
      initializeMap();
      toast({
        title: "Token saved",
        description: "Your Mapbox token has been saved for future use.",
      });
    } else {
      toast({
        title: "Token required",
        description: "Please enter a valid Mapbox token.",
        variant: "destructive",
      });
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current) return;
    if (!mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      if (map.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [80.2707, 13.0827], // Chennai coordinates
        zoom: 11,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });
      
      map.current.addControl(geolocate, 'top-right');

      // Trigger geolocation after map loads
      map.current.on('load', () => {
        geolocate.trigger();
        addResultsToMap();
      });

      map.current.on('move', () => {
        // You can add code here to fetch new mechanics based on the new map bounds
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "There was an error initializing the map. Please check your token.",
        variant: "destructive",
      });
      localStorage.removeItem('mapboxToken');
      setShowTokenInput(true);
    }
  };

  const addResultsToMap = () => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each result
    results.forEach(result => {
      // In a real app, each result would have lat/lng
      // For demo purposes, we'll use random positions around Chennai
      const lat = 13.0827 + (Math.random() - 0.5) * 0.1;
      const lng = 80.2707 + (Math.random() - 0.5) * 0.1;
      
      // Create a DOM element for the marker
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundSize = '100%';
      el.style.cursor = 'pointer';
      
      // Add a popup with information
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${result.name}</strong><br>
          ${result.specialization}<br>
          Rating: ${result.rating} (${result.reviews} reviews)
        `);
      
      // Create and add the marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Add click event to marker
      el.addEventListener('click', () => {
        if (onResultSelect) {
          onResultSelect(result);
        }
      });
      
      markers.current.push(marker);
    });
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }
    
    return () => {
      // Cleanup
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      addResultsToMap();
    }
  }, [results]);

  if (showTokenInput) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center h-[400px] text-center">
        <h2 className="text-xl font-bold mb-4">MapBox API Key Required</h2>
        <p className="text-muted-foreground mb-4 max-w-md">
          To use the interactive map feature, please enter your MapBox API token.
          You can get one for free at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
        </p>
        <div className="flex gap-2 w-full max-w-sm mb-4">
          <Input
            type="text"
            placeholder="Enter your MapBox token"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button onClick={saveToken}>Save</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Your token will be saved in your browser for future use.
        </p>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
