import {
  formatCurrency,
  type TripCostBreakdown,
} from '../utils/costEngine';
import type { TripPlan } from '../types';

export interface CostSummaryProps {
  trip: TripPlan;
  costs: TripCostBreakdown;
}

export function CostSummary({
  trip,
  costs,
}: CostSummaryProps) {
  const currency = trip.displayCurrency;

  return (
    <section className="cost-summary" aria-labelledby="cost-summary-heading">
      <header className="cost-summary__header">
        <p className="cost-summary__eyebrow">Average trip cost</p>
        <h2 id="cost-summary-heading">Your trip estimate</h2>
        <p className="cost-summary__meta">
          {trip.startDate}–{trip.endDate} · {trip.groupSize} traveler
          {trip.groupSize === 1 ? '' : 's'} · {trip.legs.length} stop
          {trip.legs.length === 1 ? '' : 's'}
        </p>
      </header>

      <div className="cost-summary__grand">
        <span>Average estimated total</span>
        <strong>{formatCurrency(costs.grandTotal, currency)}</strong>
      </div>
    </section>
  );
}

export default CostSummary;
