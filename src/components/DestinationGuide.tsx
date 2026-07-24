import type { Destination } from '../types';
import { destinationDescriptions } from '../data/destinationDescriptions';
import { destinationExplore } from '../data/destinationExplore';
import { destinationDishes } from '../data/destinationDishes';
import { CurrencyTracker } from './CurrencyTracker';
import { DESTINATION_LOCAL_CURRENCY } from '../utils/currencyTracker';

export interface DestinationGuideProps {
  destination: Destination;
}

export function DestinationGuide({ destination }: DestinationGuideProps) {
  const explore = destinationExplore[destination.id];
  const dishes = destinationDishes[destination.id] ?? [];
  const description =
    destinationDescriptions[destination.id] ??
    `${destination.name} is a popular destination in ${destination.country}.`;
  const localCurrency = DESTINATION_LOCAL_CURRENCY[destination.id] ?? 'USD';
  const attractions = explore?.topAttractions.slice(0, 5) ?? [];

  return (
    <div className="destination-guide">
      <section className="planner-panel destination-guide__intro">
        <p className="cost-summary__eyebrow">Destination guide</p>
        <h2>
          {destination.name}
          <span>, {destination.country}</span>
        </h2>
        <p>{description}</p>
        <div className="explore-modal__facts">
          <div>
            <span>Daily budget baseline</span>
            <strong>${destination.dailyBudget} USD</strong>
          </div>
          <div>
            <span>Local currency</span>
            <strong>{localCurrency}</strong>
          </div>
          <div>
            <span>Best for</span>
            <strong>{explore?.bestFor ?? 'Flexible city travel'}</strong>
          </div>
        </div>
        {explore?.highlights && (
          <p className="planner-help">{explore.highlights}</p>
        )}
      </section>

      <section className="planner-panel">
        <h2>Top 5 attractions</h2>
        {attractions.length > 0 ? (
          <ol className="explore-modal__attractions">
            {attractions.map((attraction, index) => (
              <li key={attraction.name}>
                <span className="explore-modal__rank">{index + 1}</span>
                <div>
                  <strong>{attraction.name}</strong>
                  <p>{attraction.blurb}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="planner-help">Attraction details coming soon.</p>
        )}
      </section>

      <section className="planner-panel">
        <h2>Must-try dishes</h2>
        <p className="planner-help">
          Two local favorites with typical plate prices for budgeting.
        </p>
        <div className="dish-grid">
          {dishes.map((dish) => (
            <article key={dish.name} className="dish-card">
              <h3>{dish.name}</h3>
              <p>{dish.blurb}</p>
              <strong>Avg. ${dish.averagePriceUsd.toFixed(2)} USD</strong>
            </article>
          ))}
        </div>
      </section>

      <CurrencyTracker
        destinationId={destination.id}
        destinationName={destination.name}
      />
    </div>
  );
}

export default DestinationGuide;
