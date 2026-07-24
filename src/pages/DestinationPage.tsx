import { Link, Navigate, useParams } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { DestinationGuide } from '../components/DestinationGuide';
import { TripPlanner } from '../components/TripPlanner';
import { DestinationSnapshot } from '../components/DestinationSnapshot';
import { RevenueOffers } from '../components/RevenueOffers';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { JsonLd } from '../components/JsonLd';
import { getDestinationById } from '../utils/tripHelpers';
import { destinationDescriptions } from '../data/destinationDescriptions';
import { buildDestinationJsonLd } from '../utils/seo';

export interface DestinationPageProps {
  theme: 'light' | 'dark';
}

export function DestinationPage({ theme }: DestinationPageProps) {
  const { destinationId = '' } = useParams();
  const destination = getDestinationById(destinationId);

  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  const description =
    destinationDescriptions[destination.id] ??
    `Estimate trip costs for ${destination.name}, ${destination.country}.`;

  return (
    <>
      <PageMeta
        title={`${destination.name} Trip Cost Estimate — Budget Roamers`}
        description={`Plan a trip to ${destination.name}: cost calculator, top attractions, must-try dishes, and currency conversion. ${description}`}
        canonicalPath={`/destinations/${destination.id}`}
      />
      <JsonLd
        id={`destination-${destination.id}`}
        data={buildDestinationJsonLd(destination)}
      />

      <article className="destination-page">
        <header className="destination-page__hero planner-panel">
          <p className="cost-summary__eyebrow">City guide</p>
          <h2>
            {destination.name}
            <span> trip cost estimate</span>
          </h2>
          <p>{description}</p>
          <DestinationSnapshot destination={destination} />
          <p>
            <Link to="/">← Back to general calculator</Link>
            {' · '}
            <Link to="/destinations">All cities</Link>
          </p>
        </header>

        <DestinationGuide destination={destination} />

        <RevenueOffers
          destinationId={destination.id}
          destinationName={destination.name}
          heading={`Book your ${destination.name} trip`}
        />

        <NewsletterSignup />

        <section
          className="destination-page__calculator"
          aria-label={`${destination.name} trip calculator`}
        >
          <div className="planner-panel">
            <p className="cost-summary__eyebrow">City calculator</p>
            <h2>Estimate your {destination.name} trip</h2>
            <p className="planner-help">
              Destination is locked to {destination.name}. Change origin, dates,
              group size, and transport to update the total.
            </p>
          </div>
          <TripPlanner
            mode="city"
            lockedDestination={destination}
            theme={theme}
          />
        </section>
      </article>
    </>
  );
}

export default DestinationPage;
