import type {
  CurrencyCode,
  Destination,
  Origin,
  TripPlan,
  TransportMode,
  TravelSeason,
} from '../types';

export interface CostEngineInput {
  destination: Destination;
  numberOfDays: number;
  groupSize: number;
}

export interface CostBreakdown {
  lodging: number;
  food: number;
  localTransport: number;
  activities: number;
  contingency: number;
  perPersonDaily: number;
  perPersonTrip: number;
  grandTotal: number;
}

export interface TripCostBreakdown extends CostBreakdown {
  destinationTransport: number;
  custom: number;
}

export interface TransportEstimate {
  available: boolean;
  distanceKm: number;
  costUsd: number;
}

const FLIGHT_SEASON_MULTIPLIERS: Record<TravelSeason, number> = {
  cheapest: 0.78,
  best: 1,
  busiest: 1.3,
};

/** Category weights applied to the adjusted daily rate (must sum to 1). */
const CATEGORY_WEIGHTS = {
  lodging: 0.38,
  food: 0.28,
  localTransport: 0.14,
  activities: 0.14,
  contingency: 0.06,
} as const;

/** Approximate July 2026 display rates. USD remains the calculation currency. */
export const USD_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.86,
  GBP: 0.75,
  CAD: 1.37,
  AUD: 1.52,
};

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function positiveInteger(value: number): number {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

/**
 * Computes trip subtotals from destination base daily budget,
 * travel tier, trip length, and party size.
 */
export function calculateTripCost({
  destination,
  numberOfDays,
  groupSize,
}: CostEngineInput): CostBreakdown {
  const days = positiveInteger(numberOfDays);
  const travelers = positiveInteger(groupSize);
  const rooms = Math.ceil(travelers / 2);
  const adjustedDaily = destination.dailyBudget;

  const lodging = roundCurrency(
    adjustedDaily * CATEGORY_WEIGHTS.lodging * days * rooms,
  );
  const food = roundCurrency(
    adjustedDaily * CATEGORY_WEIGHTS.food * days * travelers,
  );
  const localTransport = roundCurrency(
    adjustedDaily * CATEGORY_WEIGHTS.localTransport * days * travelers,
  );
  const activities = roundCurrency(
    adjustedDaily * CATEGORY_WEIGHTS.activities * days * travelers,
  );
  const contingency = roundCurrency(
    adjustedDaily * CATEGORY_WEIGHTS.contingency * days * travelers,
  );

  const grandTotal = roundCurrency(
    lodging + food + localTransport + activities + contingency,
  );
  const perPersonTrip = roundCurrency(grandTotal / travelers);
  const perPersonDaily = roundCurrency(perPersonTrip / days);

  return {
    lodging,
    food,
    localTransport,
    activities,
    contingency,
    perPersonDaily,
    perPersonTrip,
    grandTotal,
  };
}

export function calculateTripPlanCost(
  trip: TripPlan,
  destinations: Destination[],
): TripCostBreakdown {
  const totals: CostBreakdown = {
    lodging: 0,
    food: 0,
    localTransport: 0,
    activities: 0,
    contingency: 0,
    perPersonDaily: 0,
    perPersonTrip: 0,
    grandTotal: 0,
  };

  for (const leg of trip.legs) {
    const destination = destinations.find(
      (candidate) => candidate.id === leg.destinationId,
    );
    if (!destination) continue;

    const legCost = calculateTripCost({
      destination,
      numberOfDays: leg.days,
      groupSize: trip.groupSize,
    });
    totals.lodging += legCost.lodging;
    totals.food += legCost.food;
    totals.localTransport += legCost.localTransport;
    totals.activities += legCost.activities;
    totals.contingency += legCost.contingency;
  }

  const destinationTransport = roundCurrency(
    Math.max(0, trip.longDistanceTransportUsd),
  );
  const custom = roundCurrency(
    trip.customCategories.reduce(
      (sum, category) => sum + Math.max(0, category.amountUsd),
      0,
    ),
  );
  const days = trip.legs.reduce(
    (sum, leg) => sum + positiveInteger(leg.days),
    0,
  );
  const travelers = positiveInteger(trip.groupSize);

  totals.lodging = roundCurrency(totals.lodging);
  totals.food = roundCurrency(totals.food);
  totals.localTransport = roundCurrency(totals.localTransport);
  totals.activities = roundCurrency(totals.activities);
  totals.contingency = roundCurrency(totals.contingency);
  totals.grandTotal = roundCurrency(
    totals.lodging +
      totals.food +
      totals.localTransport +
      totals.activities +
      totals.contingency +
      destinationTransport +
      custom,
  );
  totals.perPersonTrip = roundCurrency(totals.grandTotal / travelers);
  totals.perPersonDaily = roundCurrency(
    days > 0 ? totals.perPersonTrip / days : 0,
  );

  return { ...totals, destinationTransport, custom };
}

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function calculateDistanceKm(
  from: Pick<Origin, 'lat' | 'lng'>,
  to: Pick<Destination, 'lat' | 'lng'>,
): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = degreesToRadians(to.lat - from.lat);
  const longitudeDelta = degreesToRadians(to.lng - from.lng);
  const fromLatitude = degreesToRadians(from.lat);
  const toLatitude = degreesToRadians(to.lat);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return Math.round(
    2 * earthRadiusKm * Math.asin(Math.sqrt(haversine)),
  );
}

export function estimateDestinationTransport(
  origin: Origin,
  destination: Destination,
  mode: TransportMode,
  travelers: number,
  travelSeason: TravelSeason = 'best',
): TransportEstimate {
  const distanceKm = calculateDistanceKm(origin, destination);
  const partySize = positiveInteger(travelers);
  let available = true;
  let costUsd = 0;

  switch (mode) {
    case 'flight':
      costUsd =
        Math.max(180, 120 + distanceKm * 0.07) *
        partySize *
        FLIGHT_SEASON_MULTIPLIERS[travelSeason];
      break;
    case 'driving': {
      available = distanceKm <= 3000;
      const roundTripMiles = distanceKm * 1.24274;
      const travelDays = Math.max(1, Math.ceil((distanceKm * 2) / 700));
      costUsd = roundTripMiles * 0.24 + travelDays * 45;
      break;
    }
    case 'train':
      available = distanceKm <= 2000;
      costUsd = Math.max(80, distanceKm * 0.16) * 2 * partySize;
      break;
    case 'water':
      available = distanceKm >= 300 && distanceKm <= 9000;
      costUsd = Math.max(600, distanceKm * 0.18) * partySize;
      break;
  }

  return {
    available,
    distanceKm,
    costUsd: available ? roundCurrency(costUsd) : 0,
  };
}

export const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function getTravelSeason(
  destination: Destination,
  startDate: string,
  endDate: string,
): TravelSeason {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    return 'best';
  }

  const months = new Set<number>();
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1, 12);
  const lastMonth = new Date(end.getFullYear(), end.getMonth(), 1, 12);
  while (cursor <= lastMonth && months.size < 12) {
    months.add(cursor.getMonth() + 1);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  if (
    [...months].some((month) =>
      destination.seasonality.busiest.includes(month),
    )
  ) {
    return 'busiest';
  }
  if (
    [...months].every((month) =>
      destination.seasonality.cheapest.includes(month),
    )
  ) {
    return 'cheapest';
  }
  return 'best';
}

export function convertFromUsd(
  amountUsd: number,
  currency: CurrencyCode,
): number {
  return roundCurrency(amountUsd * USD_EXCHANGE_RATES[currency]);
}

export function convertToUsd(
  amount: number,
  currency: CurrencyCode,
): number {
  return roundCurrency(amount / USD_EXCHANGE_RATES[currency]);
}

export function calculateActualSpendUsd(trip: TripPlan): number {
  return roundCurrency(
    trip.expenses.reduce(
      (sum, expense) => sum + convertToUsd(expense.amount, expense.currency),
      0,
    ),
  );
}

export function formatCurrency(
  amountUsd: number,
  currency: CurrencyCode = 'USD',
): string {
  const amount = convertFromUsd(amountUsd, currency);
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
