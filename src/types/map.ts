
export interface Result {
  id: number;
  name: string;
  type: string;
  specialization: string;
  distance: string;
  rating: number;
  reviews: number;
}

export interface MapProps {
  results: Result[];
  onResultSelect?: (result: Result) => void;
  selectable?: boolean;
  onLocationSelect?: (location: { lat: number, lng: number }) => void;
}

export type MarkerIconType = 'mechanic' | 'shop' | 'user';
