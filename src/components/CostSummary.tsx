import type { Destination } from './BudgetTravelMap';
import {
  formatCurrency,
  type CostBreakdown,
  type TravelTier,
} from '../utils/costEngine';

export interface CostSummaryProps {
  destination: Destination;
  numberOfDays: number;
  groupSize: number;
  travelTier: TravelTier;
  costs: CostBreakdown;
}

const TIER_LABELS: Record<TravelTier, string> = {
  budget: 'Budget',
  midrange: 'Midrange',
  luxury: 'Luxury',
};

const LINE_ITEMS: {
  key: keyof Pick<
    CostBreakdown,
    'lodging' | 'food' | 'localTransport' | 'activities' | 'contingency'
  >;
  label: string;
}[] = [
  { key: 'lodging', label: 'Lodging' },
  { key: 'food', label: 'Food & drink' },
  { key: 'localTransport', label: 'Local transport' },
  { key: 'activities', label: 'Activities' },
  { key: 'contingency', label: 'Contingency' },
];

export function CostSummary({
  destination,
  numberOfDays,
  groupSize,
  travelTier,
  costs,
}: CostSummaryProps) {
  return (
    <section className="cost-summary" aria-labelledby="cost-summary-heading">
      <header className="cost-summary__header">
        <div>
          <p className="cost-summary__eyebrow">Live estimate</p>
          <h2 id="cost-summary-heading">
            {destination.name}
            <span>, {destination.country}</span>
          </h2>
        </div>
        <p className="cost-summary__meta">
          {numberOfDays} day{numberOfDays === 1 ? '' : 's'} · {groupSize}{' '}
          traveler{groupSize === 1 ? '' : 's'} · {TIER_LABELS[travelTier]}
        </p>
      </header>

      <dl className="cost-summary__lines">
        {LINE_ITEMS.map((item) => (
          <div key={item.key} className="cost-summary__line">
            <dt>{item.label}</dt>
            <dd>{formatCurrency(costs[item.key])}</dd>
          </div>
        ))}
      </dl>

      <div className="cost-summary__totals">
        <div className="cost-summary__stat">
          <span>Per person / day</span>
          <strong>{formatCurrency(costs.perPersonDaily)}</strong>
        </div>
        <div className="cost-summary__stat">
          <span>Per person trip</span>
          <strong>{formatCurrency(costs.perPersonTrip)}</strong>
        </div>
        <div className="cost-summary__grand">
          <span>Grand total</span>
          <strong>{formatCurrency(costs.grandTotal)}</strong>
        </div>
      </div>
    </section>
  );
}

export default CostSummary;
