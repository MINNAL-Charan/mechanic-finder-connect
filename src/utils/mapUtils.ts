
import L from 'leaflet';
import { MarkerIconType } from '@/types/map';

// Fix for default marker icons in Leaflet with React
export const initializeLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

export const createMarkerIcon = (type: MarkerIconType) => {
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
