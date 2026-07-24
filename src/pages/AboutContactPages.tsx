import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About — Budget Roamers"
        description="Learn how Budget Roamers helps travelers estimate trip costs before booking."
        canonicalPath="/about"
      />
      <main className="static-page">
        <p className="cost-summary__eyebrow">About</p>
        <h1>Plan with a clearer picture of the cost</h1>
        <p>
          Budget Roamers is a trip-estimation tool designed to help travelers
          compare destinations, dates, transportation, and everyday costs before
          booking.
        </p>
        <p>
          Use the{' '}
          <Link to="/">general calculator</Link> for flexible trips, or open a{' '}
          <Link to="/destinations">city guide</Link> for destination-specific
          estimates, attractions, and food pricing.
        </p>
        <p>
          Estimates are planning averages rather than live quotes. Our goal is to
          make early trip decisions simpler while clearly showing the assumptions
          behind each estimate.
        </p>
        <Link className="explore-button" to="/">
          Start planning
        </Link>
      </main>
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <PageMeta
        title="Contact — Budget Roamers"
        description="Contact Budget Roamers with feedback, destination suggestions, or questions about trip estimates."
        canonicalPath="/contact"
      />
      <main className="static-page">
        <p className="cost-summary__eyebrow">Contact</p>
        <h1>We’d like to hear from you</h1>
        <p>
          Have feedback, a destination suggestion, or a question about an
          estimate? Contact options are being prepared for the public launch.
        </p>
        <div className="static-page__notice">
          <strong>Contact form coming soon</strong>
          <span>For now, keep your feedback ready for the MVP launch.</span>
        </div>
        <Link className="explore-button" to="/">
          Return to planner
        </Link>
      </main>
    </>
  );
}
