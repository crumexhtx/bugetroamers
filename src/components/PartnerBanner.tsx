import { Link } from 'react-router-dom';

export function PartnerBanner() {
  return (
    <section className="partner-banner planner-panel">
      <div>
        <p className="cost-summary__eyebrow">Grow with us</p>
        <h2>Turn trip estimates into bookings</h2>
        <p>
          Budget Roamers is built to convert planners into travelers. Partner
          with us for destination sponsorships, affiliate placements, and
          co-branded city guides.
        </p>
      </div>
      <div className="partner-banner__actions">
        <Link className="explore-button" to="/partners">
          Partner with Budget Roamers
        </Link>
        <Link className="explore-button explore-button--secondary" to="/destinations">
          See city inventory
        </Link>
      </div>
    </section>
  );
}

export default PartnerBanner;
