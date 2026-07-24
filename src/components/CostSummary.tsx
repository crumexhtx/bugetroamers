import {
  formatCurrency,
  type TripCostBreakdown,
  type TripTransportEstimate,
} from '../utils/costEngine';
import type { TripPlan } from '../types';

export interface CostSummaryProps {
  trip: TripPlan;
  costs: TripCostBreakdown;
  transport?: TripTransportEstimate;
}

const LINE_ITEMS: {
  key: keyof Pick<
    TripCostBreakdown,
    | 'lodging'
    | 'food'
    | 'localTransport'
    | 'activities'
    | 'contingency'
    | 'destinationTransport'
    | 'custom'
  >;
  label: string;
}[] = [
  { key: 'lodging', label: 'Lodging' },
  { key: 'food', label: 'Food & drink' },
  { key: 'localTransport', label: 'Local transport' },
  { key: 'activities', label: 'Activities' },
  { key: 'contingency', label: 'Contingency' },
  { key: 'destinationTransport', label: 'Long-distance transport' },
  { key: 'custom', label: 'Additional planned costs' },
];

export function CostSummary({
  trip,
  costs,
  transport,
}: CostSummaryProps) {
  const currency = trip.displayCurrency;
  const hasActualSpend = costs.actualSpend > 0;
  const varianceClass =
    costs.estimateVariance === 0
      ? 'is-even'
      : costs.estimateVariance > 0
        ? 'is-over'
        : 'is-under';

  return (
    <section className="cost-summary" aria-labelledby="cost-summary-heading">
      <header className="cost-summary__header">
        <p className="cost-summary__eyebrow">Trip cost estimate</p>
        <h2 id="cost-summary-heading">Your trip estimate</h2>
        <p className="cost-summary__meta">
          {trip.startDate}–{trip.endDate} · {costs.totalDays} day
          {costs.totalDays === 1 ? '' : 's'} / {costs.totalNights} night
          {costs.totalNights === 1 ? '' : 's'} · {trip.groupSize} traveler
          {trip.groupSize === 1 ? '' : 's'} · {trip.legs.length} stop
          {trip.legs.length === 1 ? '' : 's'}
        </p>
      </header>

      <div className="cost-summary__grand">
        <span>Estimated total</span>
        <strong>{formatCurrency(costs.grandTotal, currency)}</strong>
      </div>

      <div className="cost-summary__totals">
        <div className="cost-summary__stat">
          <span>Per person trip</span>
          <strong>{formatCurrency(costs.perPersonTrip, currency)}</strong>
        </div>
        <div className="cost-summary__stat">
          <span>Per person / day</span>
          <strong>{formatCurrency(costs.perPersonDaily, currency)}</strong>
        </div>
      </div>

      <h3 className="cost-summary__breakdown-title">What’s included</h3>
      <dl className="cost-summary__lines">
        {LINE_ITEMS.map((item) => (
          <div key={item.key} className="cost-summary__line">
            <dt>{item.label}</dt>
            <dd>{formatCurrency(costs[item.key], currency)}</dd>
          </div>
        ))}
      </dl>

      {transport && transport.legs.length > 0 && (
        <div className="cost-summary__transport">
          <h3 className="cost-summary__breakdown-title">Transport legs</h3>
          <ul className="cost-summary__leg-list">
            {transport.legs.map((leg) => (
              <li key={`${leg.fromName}-${leg.toName}`}>
                <span>
                  {leg.fromName} → {leg.toName}
                  <small>
                    {leg.available
                      ? `${leg.distanceKm.toLocaleString()} km`
                      : 'Unavailable'}
                  </small>
                </span>
                <strong>
                  {leg.available
                    ? formatCurrency(leg.costUsd, currency)
                    : '—'}
                </strong>
              </li>
            ))}
          </ul>
          {transport.includesReturn && (
            <p className="cost-summary__note">
              Includes return to your starting city.
            </p>
          )}
        </div>
      )}

      {hasActualSpend && (
        <div className={`cost-summary__actual ${varianceClass}`}>
          <h3 className="cost-summary__breakdown-title">Estimate vs actual</h3>
          <div className="cost-summary__stat">
            <span>Actual spend logged</span>
            <strong>{formatCurrency(costs.actualSpend, currency)}</strong>
          </div>
          <div className="cost-summary__stat">
            <span>
              {costs.estimateVariance > 0
                ? 'Over estimate'
                : costs.estimateVariance < 0
                  ? 'Under estimate'
                  : 'On estimate'}
            </span>
            <strong>
              {formatCurrency(Math.abs(costs.estimateVariance), currency)}
            </strong>
          </div>
        </div>
      )}

      <p className="cost-summary__note">
        Lodging uses nights ({costs.totalNights}), while food and local costs
        use calendar days ({costs.totalDays}). Lodging assumes one room per two
        travelers.
      </p>
    </section>
  );
}

export default CostSummary;
