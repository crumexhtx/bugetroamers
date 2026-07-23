import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import destinations from '../data/destinations.json';

export interface Destination {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  dailyBudget: number;
}

export interface BudgetTravelMapProps {
  onSelectDestination: (id: string) => void;
  className?: string;
}

const CARTO_DARK_STYLE = 'https://cartocdn.com';

export function BudgetTravelMap({
  onSelectDestination,
  className,
}: BudgetTravelMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const onSelectRef = useRef(onSelectDestination);

  onSelectRef.current = onSelectDestination;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_DARK_STYLE,
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      maxPitch: 0,
      bearing: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    map.addControl(new maplibregl.NavigationControl({
      showCompass: false,
      visualizePitch: false,
    }), 'top-right');

    const markers: maplibregl.Marker[] = [];

    (destinations as Destination[]).forEach((destination) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'budget-travel-map__marker';
      el.setAttribute('aria-label', `${destination.name}, ${destination.country}`);
      el.innerHTML = `<span class="budget-travel-map__marker-dot"></span><span class="budget-travel-map__marker-label">${destination.name}</span>`;

      el.addEventListener('click', (event) => {
        event.stopPropagation();
        onSelectRef.current(destination.id);
        map.flyTo({
          center: [destination.lng, destination.lat],
          zoom: 5,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map);

      markers.push(marker);
    });

    mapRef.current = map;
    markersRef.current = markers;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={['budget-travel-map', className].filter(Boolean).join(' ')}
      role="application"
      aria-label="Budget travel destinations map"
    />
  );
}

export default BudgetTravelMap;
