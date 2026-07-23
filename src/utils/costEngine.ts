import type { Destination } from '../components/BudgetTravelMap';

export type TravelTier = 'budget' | 'midrange' | 'luxury';

export interface CostEngineInput {
  destination: Destination;
  numberOfDays: number;
  groupSize: number;
  travelTier: TravelTier;
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

const TIER_MULTIPLIERS: Record<TravelTier, number> = {
  budget: 0.72,
  midrange: 1,
  luxury: 1.65,
};

/** Category weights applied to the adjusted daily rate (must sum to 1). */
const CATEGORY_WEIGHTS = {
  lodging: 0.38,
  food: 0.28,
  localTransport: 0.14,
  activities: 0.14,
  contingency: 0.06,
} as const;

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Computes trip subtotals from destination base daily budget,
 * travel tier, trip length, and party size.
 */
export function calculateTripCost({
  destination,
  numberOfDays,
  groupSize,
  travelTier,
}: CostEngineInput): CostBreakdown {
  const days = Math.max(1, numberOfDays);
  const travelers = Math.max(1, groupSize);
  const adjustedDaily =
    destination.dailyBudget * TIER_MULTIPLIERS[travelTier];

  const lodging = roundCurrency(
    adjustedDaily * CATEGORY_WEIGHTS.lodging * days * travelers,
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

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
