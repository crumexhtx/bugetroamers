import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  calculateTripCost,
  estimateTripTransport,
  formatCurrency,
} from '../utils/costEngine';
import { destinations, origins } from '../utils/tripHelpers';

export function BudgetDestinationMatcher() {
  const [budget, setBudget] = useState(3000);
  const [originId, setOriginId] = useState('houston');
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const origin =
    origins.find((candidate) => candidate.id === originId) ?? origins[0];

  const matches = useMemo(
    () =>
      destinations
        .map((destination) => {
          const groundCost = calculateTripCost({
            destination,
            numberOfDays: days,
            numberOfNights: Math.max(0, days - 1),
            groupSize: travelers,
          }).grandTotal;
          const transport = estimateTripTransport(
            origin,
            [destination],
            'flight',
            travelers,
            'best',
          );
          return {
            destination,
            total: groundCost + transport.costUsd,
            available: transport.available,
          };
        })
        .filter((match) => match.available && match.total <= budget)
        .sort((a, b) => b.total - a.total)
        .slice(0, 6),
    [budget, days, origin, travelers],
  );

  return (
    <section
      className="budget-matcher"
      aria-labelledby="budget-matcher-heading"
    >
      <header className="budget-matcher__header">
        <div>
          <p className="cost-summary__eyebrow">Destination matcher</p>
          <h2 id="budget-matcher-heading">Where can your budget take you?</h2>
        </div>
        <p>
          Compare estimated round-trip flights and everyday trip costs across
          every city in the guide.
        </p>
      </header>

      <div className="budget-matcher__controls">
        <label>
          Total budget
          <div className="budget-matcher__money-input">
            <span>$</span>
            <input
              type="number"
              min="100"
              step="100"
              value={budget || ''}
              onChange={(event) =>
                setBudget(Math.max(0, Number(event.target.value)))
              }
            />
          </div>
        </label>
        <label>
          Starting city
          <select
            value={originId}
            onChange={(event) => setOriginId(event.target.value)}
          >
            {origins.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name}, {candidate.country}
              </option>
            ))}
          </select>
        </label>
        <label>
          Trip days
          <input
            type="number"
            min="1"
            max="30"
            value={days}
            onChange={(event) =>
              setDays(Math.min(30, Math.max(1, Number(event.target.value))))
            }
          />
        </label>
        <label>
          Travelers
          <input
            type="number"
            min="1"
            max="8"
            value={travelers}
            onChange={(event) =>
              setTravelers(
                Math.min(8, Math.max(1, Number(event.target.value))),
              )
            }
          />
        </label>
      </div>

      {matches.length > 0 ? (
        <div className="budget-matcher__results" aria-live="polite">
          {matches.map(({ destination, total }) => (
            <article key={destination.id} className="budget-matcher__result">
              <div>
                <span>{destination.country}</span>
                <h3>{destination.name}</h3>
              </div>
              <div>
                <small>Estimated total</small>
                <strong>{formatCurrency(total)}</strong>
                <small>{formatCurrency(budget - total)} left</small>
              </div>
              <Link to={`/destinations/${destination.id}`}>Plan this trip</Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="budget-matcher__empty" aria-live="polite">
          No destinations currently fit those inputs. Try increasing the budget
          or shortening the trip.
        </p>
      )}

      <p className="budget-matcher__note">
        Planning estimates use typical rates and best-season airfare—not live
        booking quotes.
      </p>
    </section>
  );
}

export default BudgetDestinationMatcher;
