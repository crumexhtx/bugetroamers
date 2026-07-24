import { PageMeta } from '../components/PageMeta';
import { TripPlanner } from '../components/TripPlanner';
import { BudgetDestinationMatcher } from '../components/BudgetDestinationMatcher';
import { CurrencyFooter } from '../components/CurrencyFooter';
import { JsonLd } from '../components/JsonLd';
import { buildWebsiteJsonLd } from '../utils/seo';

export interface HomePageProps {
  theme: 'light' | 'dark';
}

export function HomePage({ theme }: HomePageProps) {
  return (
    <>
      <PageMeta
        title="Planora — Trip Cost Estimator"
        description="Estimate your trip cost before you book. Compare destinations, dates, transport, and daily budgets with Planora."
        canonicalPath="/"
      />
      <JsonLd id="website" data={buildWebsiteJsonLd()} />
      <section className="travel-hero">
        <div className="travel-hero__content">
          <p className="travel-hero__eyebrow">Explore more. Spend smarter.</p>
          <h1>Discover your next trip</h1>
          <p>
            Pick where you are starting, choose a destination, and get a quick
            planning estimate for flights, stays, food, and local experiences.
          </p>
          <div className="travel-hero__actions">
            <a className="travel-hero__cta" href="#trip-planner">
              Start planning
            </a>
            <a className="travel-hero__cta" href="#currency-converter">
              Currency converter
            </a>
          </div>
        </div>
        <div className="travel-hero__art" aria-hidden="true">
          <span className="travel-hero__earth">🌍</span>
          <span className="travel-hero__route">✈</span>
        </div>
      </section>
      <BudgetDestinationMatcher />
      <div id="trip-planner">
        <TripPlanner mode="general" theme={theme} />
      </div>
      <CurrencyFooter />
    </>
  );
}

export default HomePage;
