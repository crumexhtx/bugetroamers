import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import destinations from '../data/destinations.json';
import type { Destination, Origin, TransportMode } from '../types';

export type { Destination } from '../types';

export interface BudgetTravelMapProps {
  onSelectDestination: (id: string) => void;
  selectedDestinationId?: string;
  destinationIds?: string[];
  origin?: Origin;
  transportMode?: TransportMode;
  theme?: 'light' | 'dark';
  className?: string;
}

const CARTO_DARK_STYLE =
  'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const CARTO_LIGHT_STYLE =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const ROUTE_SOURCE_ID = 'trip-route';
const ROUTE_LINE_LAYER_ID = 'trip-route-line';
const ROUTE_ARROW_LAYER_ID = 'trip-route-arrow';

const TRANSPORT_ICONS: Record<TransportMode, string> = {
  flight: '✈️',
  driving: '🚗',
  train: '🚆',
  water: '⛴️',
};
const TRANSPORT_LABELS: Record<TransportMode, string> = {
  flight: 'Plane',
  driving: 'Car',
  train: 'Train',
  water: 'Ferry or cruise',
};

function buildCurvedSegment(
  from: Pick<Origin, 'lat' | 'lng'>,
  destination: Destination,
) {
  let destinationLng = destination.lng;
  const rawLongitudeDelta = destinationLng - from.lng;
  if (rawLongitudeDelta > 180) destinationLng -= 360;
  if (rawLongitudeDelta < -180) destinationLng += 360;

  const longitudeDelta = destinationLng - from.lng;
  const latitudeDelta = destination.lat - from.lat;
  const length = Math.hypot(longitudeDelta, latitudeDelta) || 1;
  const curve = Math.min(18, Math.max(3, length * 0.16));
  const controlLng =
    (from.lng + destinationLng) / 2 - (latitudeDelta / length) * curve;
  const controlLat =
    (from.lat + destination.lat) / 2 + (longitudeDelta / length) * curve;
  const coordinates: [number, number][] = [];

  for (let step = 0; step <= 40; step += 1) {
    const t = step / 40;
    const inverse = 1 - t;
    coordinates.push([
      inverse * inverse * from.lng +
        2 * inverse * t * controlLng +
        t * t * destinationLng,
      inverse * inverse * from.lat +
        2 * inverse * t * controlLat +
        t * t * destination.lat,
    ]);
  }

  return {
    coordinates,
    end: { lng: destinationLng, lat: destination.lat },
  };
}

function buildCurvedRoute(origin: Origin, tripDestinations: Destination[]) {
  let current: Pick<Origin, 'lat' | 'lng'> = origin;
  const coordinates: [number, number][] = [];

  tripDestinations.forEach((destination, index) => {
    const segment = buildCurvedSegment(current, destination);
    coordinates.push(
      ...(index === 0 ? segment.coordinates : segment.coordinates.slice(1)),
    );
    current = segment.end;
  });

  const previous = coordinates[coordinates.length - 2];
  const last = coordinates[coordinates.length - 1];
  const arrowRotation =
    (Math.atan2(-(last[1] - previous[1]), last[0] - previous[0]) * 180) /
    Math.PI;

  return {
    coordinates,
    data: {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          properties: { kind: 'route' },
          geometry: { type: 'LineString' as const, coordinates },
        },
        {
          type: 'Feature' as const,
          properties: { kind: 'arrow', rotation: arrowRotation },
          geometry: {
            type: 'Point' as const,
            coordinates: last,
          },
        },
      ],
    },
  };
}

function applyEarthPalette(
  map: maplibregl.Map,
  theme: 'light' | 'dark',
): void {
  const dark = theme === 'dark';
  const colors = {
    background: dark ? '#182119' : '#eee5d1',
    land: dark ? '#263126' : '#dfd3b9',
    vegetation: dark ? '#304632' : '#b8c79c',
    water: dark ? '#183b3d' : '#91b7b4',
    building: dark ? '#493f31' : '#cdbd9f',
    road: dark ? '#8a7453' : '#b69a72',
    boundary: dark ? '#796a51' : '#8f7b5e',
    text: dark ? '#efe4ce' : '#3c3427',
    halo: dark ? '#182119' : '#f4eddd',
  };

  for (const layer of map.getStyle().layers ?? []) {
    const id = layer.id.toLowerCase();
    if (layer.type === 'background') {
      map.setPaintProperty(layer.id, 'background-color', colors.background);
    } else if (layer.type === 'fill') {
      const color = id.includes('water')
        ? colors.water
        : /park|wood|grass|vegetation|landcover/.test(id)
          ? colors.vegetation
          : id.includes('building')
            ? colors.building
            : colors.land;
      map.setPaintProperty(layer.id, 'fill-color', color);
    } else if (layer.type === 'line') {
      map.setPaintProperty(
        layer.id,
        'line-color',
        /boundary|admin/.test(id) ? colors.boundary : colors.road,
      );
    } else if (layer.type === 'symbol') {
      map.setPaintProperty(layer.id, 'text-color', colors.text);
      map.setPaintProperty(layer.id, 'text-halo-color', colors.halo);
    }
  }
}

export function BudgetTravelMap({
  onSelectDestination,
  selectedDestinationId,
  destinationIds = selectedDestinationId ? [selectedDestinationId] : [],
  origin,
  transportMode = 'flight',
  theme = 'dark',
  className,
}: BudgetTravelMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const originMarkerRef = useRef<maplibregl.Marker | null>(null);
  const motionMarkerRef = useRef<maplibregl.Marker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const markerElementsRef = useRef(new Map<string, HTMLButtonElement>());
  const onSelectRef = useRef(onSelectDestination);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const destinationKey = destinationIds.join('|');

  onSelectRef.current = onSelectDestination;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: theme === 'light' ? CARTO_LIGHT_STYLE : CARTO_DARK_STYLE,
      center: [0, 20],
      zoom: 1.5,
      pitch: 0,
      maxPitch: 0,
      bearing: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    const handleError = () => setStatus('error');
    map.on('error', handleError);
    map.once('load', () => {
      applyEarthPalette(map, theme);
      setStatus('ready');
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
      el.classList.toggle(
        'is-selected',
        destinationIds.includes(destination.id),
      );
      el.hidden = !destinationIds.includes(destination.id);
      const label = document.createElement('span');
      label.className = 'budget-travel-map__marker-label';
      label.textContent = destination.name;
      el.append(label);

      el.addEventListener('click', (event) => {
        event.stopPropagation();
        onSelectRef.current(destination.id);
        map.flyTo({
          center: [destination.lng, destination.lat],
          zoom: 11.5,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map);

      markers.push(marker);
      markerElementsRef.current.set(destination.id, el);
    });

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(containerRef.current);
    mapRef.current = map;
    markersRef.current = markers;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      originMarkerRef.current?.remove();
      originMarkerRef.current = null;
      motionMarkerRef.current?.remove();
      motionMarkerRef.current = null;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      markerElementsRef.current.clear();
      resizeObserver.disconnect();
      map.off('error', handleError);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    setStatus('loading');
    mapRef.current.setStyle(
      theme === 'light' ? CARTO_LIGHT_STYLE : CARTO_DARK_STYLE,
    );
    mapRef.current.once('style.load', () => {
      if (!mapRef.current) return;
      applyEarthPalette(mapRef.current, theme);
      setStatus('ready');
    });
  }, [theme]);

  useEffect(() => {
    markerElementsRef.current.forEach((element, id) => {
      const selected = destinationIds.includes(id);
      element.classList.toggle('is-selected', selected);
      element.hidden = !selected;
      element.setAttribute(
        'aria-pressed',
        String(selected),
      );
    });
  }, [destinationKey, status]);

  useEffect(() => {
    const map = mapRef.current;
    const destination = (destinations as Destination[]).find(
      (candidate) => candidate.id === selectedDestinationId,
    );
    if (!map || status !== 'ready' || !destination) return;

    const camera = {
      center: [destination.lng, destination.lat] as [number, number],
      zoom: 11.5,
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      map.jumpTo(camera);
    } else {
      map.flyTo({ ...camera, duration: 1400 });
    }
  }, [selectedDestinationId, status]);

  useEffect(() => {
    const map = mapRef.current;
    const tripDestinations = destinationIds
      .map((id) =>
        (destinations as Destination[]).find(
          (candidate) => candidate.id === id,
        ),
      )
      .filter((destination): destination is Destination => Boolean(destination));
    if (!map || status !== 'ready' || !origin || tripDestinations.length === 0) {
      return;
    }

    originMarkerRef.current?.remove();
    const originElement = document.createElement('div');
    originElement.className = 'budget-travel-map__origin';
    originElement.setAttribute(
      'aria-label',
      `Starting destination: ${origin.name}, ${origin.country}`,
    );
    originElement.title = origin.name;
    originElement.textContent = origin.name;
    originMarkerRef.current = new maplibregl.Marker({
      element: originElement,
      anchor: 'center',
    })
      .setLngLat([origin.lng, origin.lat])
      .addTo(map);

    const route = buildCurvedRoute(origin, tripDestinations);
    const source = map.getSource(ROUTE_SOURCE_ID) as
      | maplibregl.GeoJSONSource
      | undefined;
    if (source) {
      source.setData(route.data);
    } else {
      map.addSource(ROUTE_SOURCE_ID, { type: 'geojson', data: route.data });
      map.addLayer({
        id: ROUTE_LINE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        filter: ['==', ['get', 'kind'], 'route'],
        paint: {
          'line-color': '#0f172a',
          'line-width': 4,
          'line-dasharray': [2, 2],
          'line-opacity': 0.95,
        },
      });
      map.addLayer({
        id: ROUTE_ARROW_LAYER_ID,
        type: 'symbol',
        source: ROUTE_SOURCE_ID,
        filter: ['==', ['get', 'kind'], 'arrow'],
        layout: {
          'text-field': '▶',
          'text-size': 20,
          'text-rotate': ['get', 'rotation'],
          'text-rotation-alignment': 'map',
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#ef4444',
          'text-halo-color': theme === 'dark' ? '#182119' : '#f4eddd',
          'text-halo-width': 1,
        },
      });
    }
    map.setPaintProperty(ROUTE_LINE_LAYER_ID, 'line-color', '#020617');
    map.setPaintProperty(ROUTE_LINE_LAYER_ID, 'line-width', 4);

    motionMarkerRef.current?.remove();
    const vehicleElement = document.createElement('div');
    vehicleElement.className = 'budget-travel-map__vehicle';
    const vehicleIcon = document.createElement('span');
    vehicleIcon.className = 'budget-travel-map__vehicle-icon';
    vehicleIcon.textContent = TRANSPORT_ICONS[transportMode];
    vehicleElement.append(vehicleIcon);
    vehicleElement.setAttribute(
      'aria-label',
      `${TRANSPORT_LABELS[transportMode]} traveling along the route`,
    );
    motionMarkerRef.current = new maplibregl.Marker({
      element: vehicleElement,
      anchor: 'center',
    })
      .setLngLat(route.coordinates[0])
      .addTo(map);

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let segmentIndex = 0;
    let segmentFraction = 0;
    let previousFrame = performance.now();
    const animate = (now: number) => {
      if (reduceMotion) {
        motionMarkerRef.current?.setLngLat(
          route.coordinates[route.coordinates.length - 1],
        );
        return;
      }

      const pixelsPerSecond = 45;
      let pixelsToTravel =
        (Math.min(now - previousFrame, 100) / 1000) * pixelsPerSecond;
      previousFrame = now;

      while (pixelsToTravel > 0) {
        const current = route.coordinates[segmentIndex];
        const next = route.coordinates[segmentIndex + 1];
        const currentPoint = map.project(current);
        const nextPoint = map.project(next);
        const segmentPixels = Math.max(
          0.01,
          Math.hypot(nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y),
        );
        const remainingPixels = segmentPixels * (1 - segmentFraction);

        if (pixelsToTravel < remainingPixels) {
          segmentFraction += pixelsToTravel / segmentPixels;
          pixelsToTravel = 0;
        } else {
          pixelsToTravel -= remainingPixels;
          segmentIndex += 1;
          segmentFraction = 0;
          if (segmentIndex >= route.coordinates.length - 1) {
            segmentIndex = 0;
          }
        }
      }

      const current = route.coordinates[segmentIndex];
      const next = route.coordinates[segmentIndex + 1];
      const currentPoint = map.project(current);
      const nextPoint = map.project(next);
      const routeAngle =
        (Math.atan2(
          nextPoint.y - currentPoint.y,
          nextPoint.x - currentPoint.x,
        ) *
          180) /
        Math.PI;
      vehicleIcon.style.transform = `rotate(${routeAngle + 45}deg)`;
      motionMarkerRef.current?.setLngLat([
        current[0] + (next[0] - current[0]) * segmentFraction,
        current[1] + (next[1] - current[1]) * segmentFraction,
      ]);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      motionMarkerRef.current?.remove();
      motionMarkerRef.current = null;
    };
  }, [origin, destinationKey, status, theme, transportMode]);

  return (
    <div className="budget-travel-map__shell">
      <div
        ref={containerRef}
        className={['budget-travel-map', className].filter(Boolean).join(' ')}
        role="region"
        aria-label="Budget travel destinations map"
      />
      {status === 'loading' && (
        <p className="budget-travel-map__status">Loading destination map…</p>
      )}
      {status === 'error' && (
        <p className="budget-travel-map__status" role="alert">
          The map could not load. You can still select destinations in the itinerary.
        </p>
      )}
    </div>
  );
}

export default BudgetTravelMap;
