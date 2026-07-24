import type { Destination, TripPlan, TransportMode } from '../types';
import destinationsData from '../data/destinations.json';
import originsData from '../data/origins.json';
import type { Origin } from '../types';
import type { CurrencyCode } from '../types';

export const destinations = destinationsData as Destination[];
export const origins = originsData as Origin[];
export const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
export const featuredDestinationIds = ['paris', 'tokyo', 'bali', 'rome'] as const;

export const featuredDestinations = destinations.filter((destination) =>
  featuredDestinationIds.includes(
    destination.id as (typeof featuredDestinationIds)[number],
  ),
);

export const transportModes: { value: TransportMode; label: string }[] = [
  { value: 'flight', label: 'Flight' },
  { value: 'driving', label: 'Driving' },
  { value: 'train', label: 'Train' },
  { value: 'water', label: 'Ferry / cruise' },
];

export function makeId(): string {
  return crypto.randomUUID();
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(dateValue: string, days: number): string {
  const date = new Date(`${dateValue}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function dateRangeDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T12:00:00`).getTime();
  const end = new Date(`${endDate}T12:00:00`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 1;
  return Math.max(1, Math.floor((end - start) / 86_400_000) + 1);
}

export function alignLegsToDateRange(
  legs: TripPlan['legs'],
  totalDays: number,
): TripPlan['legs'] {
  let remaining = Math.max(totalDays, legs.length);
  return legs.map((leg, index) => {
    const remainingStops = legs.length - index - 1;
    const days =
      index === legs.length - 1
        ? remaining
        : Math.max(1, Math.min(leg.days, remaining - remainingStops));
    remaining -= days;
    return { ...leg, days };
  });
}

export function createTrip(destinationId = ''): TripPlan {
  const startDate = today();
  return {
    id: makeId(),
    startDate,
    endDate: addDays(startDate, 6),
    originId: 'houston',
    transportMode: 'flight',
    groupSize: 2,
    displayCurrency: 'USD',
    longDistanceTransportUsd: 0,
    legs: [{ id: makeId(), destinationId, days: 7 }],
    customCategories: [],
    expenses: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((destination) => destination.id === id);
}
