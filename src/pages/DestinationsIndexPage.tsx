import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { destinations } from '../utils/tripHelpers';

export function DestinationsIndexPage() {
  return (
    <>
      <PageMeta
        title="City Trip Cost Guides — Budget Roamers"
        description="Browse destination guides with trip cost calculators, top attractions, must-try dishes, and currency conversion."
        canonicalPath="/destinations"
      />
      <main className="static-page destinations-index">
        <p className="cost-summary__eyebrow">City guides</p>
        <h1>Explore destinations</h1>
        <p>
          Each city page includes a dedicated trip cost calculator, currency
          tracker, top attractions, and must-try dishes with average prices.
        </p>
        <ul className="destinations-index__list">
          {destinations.map((destination) => (
            <li key={destination.id}>
              <Link to={`/destinations/${destination.id}`}>
                <strong>{destination.name}</strong>
                <span>{destination.country}</span>
                <small>From ${destination.dailyBudget}/day baseline</small>
              </Link>
            </li>
          ))}
        </ul>
        <p>
          <Link to="/">Open the general calculator →</Link>
        </p>
      </main>
    </>
  );
}

export default DestinationsIndexPage;
