import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { destinations } from '../utils/tripHelpers';

const COUNTRY_FLAG_CODES: Record<string, string> = {
  Portugal: 'pt',
  Thailand: 'th',
  Mexico: 'mx',
  Hungary: 'hu',
  Vietnam: 'vn',
  Morocco: 'ma',
  France: 'fr',
  'United Kingdom': 'gb',
  Italy: 'it',
  Spain: 'es',
  Netherlands: 'nl',
  Türkiye: 'tr',
  'United Arab Emirates': 'ae',
  Japan: 'jp',
  'South Korea': 'kr',
  Singapore: 'sg',
  Indonesia: 'id',
  'United States': 'us',
  Brazil: 'br',
  Argentina: 'ar',
  'South Africa': 'za',
  Egypt: 'eg',
  Australia: 'au',
  'Czech Republic': 'cz',
  Austria: 'at',
  Germany: 'de',
  Greece: 'gr',
  Ireland: 'ie',
  Denmark: 'dk',
  Canada: 'ca',
  'New Zealand': 'nz',
  Taiwan: 'tw',
  China: 'cn',
  Peru: 'pe',
  India: 'in',
};

export function DestinationsIndexPage() {
  return (
    <>
      <PageMeta
        title="City Trip Cost Guides — Planora"
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
                <img
                  className="destinations-index__flag"
                  src={`https://flagcdn.com/w320/${
                    destination.id === 'hong-kong'
                      ? 'hk'
                      : COUNTRY_FLAG_CODES[destination.country]
                  }.png`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
                <strong>{destination.name}</strong>
                <span>{destination.country}</span>
                <small>From ${destination.dailyBudget}/day baseline</small>
              </Link>
            </li>
          ))}
        </ul>
        <p className="destinations-index__action">
          <Link className="explore-button" to="/">
            Open the calculator
          </Link>
        </p>
      </main>
    </>
  );
}

export default DestinationsIndexPage;
