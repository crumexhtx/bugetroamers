import type {
  CurrencyCode,
  Destination,
  Origin,
  TripPlan,
  TransportMode,
  TravelSeason,
} from '../types';
import { PLANNING_USD_RATES } from './pricingAssumptions';

export interface CostEngineInput {
  destination: Destination;
  /** Calendar days spent at the destination (food, local transport, activities). */
  numberOfDays: number;
  groupSize: number;
  /**
   * Lodging nights. Defaults to `numberOfDays` for the primitive helper.
   * Trip-plan aggregation passes nights explicitly (usually totalDays - 1).
   */
  numberOfNights?: number;
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
  actualSpend: number;
  /** actualSpend - grandTotal; positive means over estimate. */
  estimateVariance: number;
  totalDays: number;
  totalNights: number;
}

export interface TransportEstimate {
  available: boolean;
  distanceKm: number;
  /** One-way cost in USD for this segment. */
  costUsd: number;
}

export interface TransportLegEstimate extends TransportEstimate {
  fromName: string;
  toName: string;
}

export interface TripTransportEstimate {
  available: boolean;
  totalDistanceKm: number;
  /** Full itinerary transport cost including return to origin. */
  costUsd: number;
  legs: TransportLegEstimate[];
  includesReturn: boolean;
}

const FLIGHT_SEASON_MULTIPLIERS: Record<TravelSeason, number> = {
  cheapest: 0.78,
  best: 1,
  busiest: 1.3,
};

/** Category weights applied to the destination daily budget (must sum to 1). */
const CATEGORY_WEIGHTS = {
  lodging: 0.38,
  food: 0.28,
  localTransport: 0.14,
  activities: 0.14,
  contingency: 0.06,
} as const;

/** Display-rate subset used by the cost engine. USD remains the calculation currency. */
export const USD_EXCHANGE_RATES: Record<CurrencyCode, number> =
  PLANNING_USD_RATES;

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function positiveInteger(value: number): number {
  return Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
}

function nonNegativeNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

/**
 * Lodging nights for a stop in a multi-city plan.
 * Intermediate stops keep a night for each allocated day; the final stop
 * drops the departure day so trip nights = calendarDays - 1.
 */
export function lodgingNightsForLeg(
  days: number,
  isLastLeg: boolean,
): number {
  const safeDays = positiveInteger(days);
  return isLastLeg ? Math.max(0, safeDays - 1) : safeDays;
}

/**
 * Computes destination ground-cost subtotals from daily budget,
 * calendar days, lodging nights, and party size.
 */
export function calculateTripCost({
  destination,
  numberOfDays,
  groupSize,
  numberOfNights,
}: CostEngineInput): CostBreakdown {
  const days = positiveInteger(numberOfDays);
  const nights =
    numberOfNights === undefined
      ? days
      : Math.max(0, Math.floor(nonNegativeNumber(numberOfNights)));
  const travelers = positiveInteger(groupSize);
  const rooms = Math.ceil(travelers / 2);
  const adjustedDaily = destination.dailyBudget;

  const lodging = roundCurrency(
    adjustedDaily * CATEGORY_WEIGHTS.lodging * nights * rooms,
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

  let totalDays = 0;
  let totalNights = 0;

  trip.legs.forEach((leg, index) => {
    const destination = destinations.find(
      (candidate) => candidate.id === leg.destinationId,
    );
    if (!destination) return;

    const days = positiveInteger(leg.days);
    const nights = lodgingNightsForLeg(days, index === trip.legs.length - 1);
    totalDays += days;
    totalNights += nights;

    const legCost = calculateTripCost({
      destination,
      numberOfDays: days,
      numberOfNights: nights,
      groupSize: trip.groupSize,
    });
    totals.lodging += legCost.lodging;
    totals.food += legCost.food;
    totals.localTransport += legCost.localTransport;
    totals.activities += legCost.activities;
    totals.contingency += legCost.contingency;
  });

  const destinationTransport = roundCurrency(
    Math.max(0, trip.longDistanceTransportUsd),
  );
  const custom = roundCurrency(
    trip.customCategories.reduce(
      (sum, category) => sum + Math.max(0, category.amountUsd),
      0,
    ),
  );
  const travelers = positiveInteger(trip.groupSize);
  const actualSpend = calculateActualSpendUsd(trip);

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
    totalDays > 0 ? totals.perPersonTrip / totalDays : 0,
  );

  return {
    ...totals,
    destinationTransport,
    custom,
    actualSpend,
    estimateVariance: roundCurrency(actualSpend - totals.grandTotal),
    totalDays,
    totalNights,
  };
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

type GeoPoint = Pick<Origin, 'lat' | 'lng' | 'name'>;

/**
 * One-way transport estimate between two points.
 * Round-trip / multi-city pricing should use `estimateTripTransport`.
 */
export function estimateDestinationTransport(
  origin: Origin,
  destination: Destination,
  mode: TransportMode,
  travelers: number,
  travelSeason: TravelSeason = 'best',
): TransportEstimate {
  return estimateOneWayTransport(
    origin,
    destination,
    mode,
    travelers,
    travelSeason,
  );
}

function estimateOneWayTransport(
  from: GeoPoint,
  to: GeoPoint,
  mode: TransportMode,
  travelers: number,
  travelSeason: TravelSeason = 'best',
): TransportEstimate {
  const distanceKm = calculateDistanceKm(from, to);
  const partySize = positiveInteger(travelers);
  let available = true;
  let costUsd = 0;

  switch (mode) {
    case 'flight':
      // One-way planning average; seasonally adjusted.
      costUsd =
        Math.max(90, 60 + distanceKm * 0.035) *
        partySize *
        FLIGHT_SEASON_MULTIPLIERS[travelSeason];
      break;
    case 'driving': {
      available = distanceKm <= 3000;
      const oneWayMiles = distanceKm * 0.62137;
      const travelDays = Math.max(1, Math.ceil(distanceKm / 700));
      costUsd = oneWayMiles * 0.24 + travelDays * 45;
      break;
    }
    case 'train':
      available = distanceKm <= 2000;
      costUsd = Math.max(40, distanceKm * 0.08) * partySize;
      break;
    case 'water':
      available = distanceKm >= 300 && distanceKm <= 9000;
      costUsd = Math.max(300, distanceKm * 0.09) * partySize;
      break;
  }

  return {
    available,
    distanceKm,
    costUsd: available ? roundCurrency(costUsd) : 0,
  };
}

/**
 * Prices every itinerary segment: origin → each stop → return to origin.
 */
export function estimateTripTransport(
  origin: Origin,
  destinations: Destination[],
  mode: TransportMode,
  travelers: number,
  travelSeason: TravelSeason = 'best',
): TripTransportEstimate {
  const stops = destinations.filter(Boolean);
  if (stops.length === 0) {
    return {
      available: false,
      totalDistanceKm: 0,
      costUsd: 0,
      legs: [],
      includesReturn: true,
    };
  }

  const points: GeoPoint[] = [origin, ...stops, origin];
  const legs: TransportLegEstimate[] = [];

  for (let index = 0; index < points.length - 1; index += 1) {
    const from = points[index];
    const to = points[index + 1];
    const segment = estimateOneWayTransport(
      from,
      to,
      mode,
      travelers,
      travelSeason,
    );
    legs.push({
      ...segment,
      fromName: from.name,
      toName: to.name,
    });
  }

  const available = legs.every((leg) => leg.available);
  const totalDistanceKm = legs.reduce((sum, leg) => sum + leg.distanceKm, 0);
  const costUsd = available
    ? roundCurrency(legs.reduce((sum, leg) => sum + leg.costUsd, 0))
    : 0;

  return {
    available,
    totalDistanceKm,
    costUsd,
    legs,
    includesReturn: true,
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
