interface StaticPageProps {
  onBackToPlanner: () => void;
}

export function AboutPage({ onBackToPlanner }: StaticPageProps) {
  return (
    <main className="static-page">
      <p className="cost-summary__eyebrow">About</p>
      <h1>Plan with a clearer picture of the cost</h1>
      <p>
        Budget Roamers is a lightweight trip-estimation tool designed to help
        travelers compare destinations, dates, transportation, and everyday
        costs before booking.
      </p>
      <p>
        Estimates are planning averages rather than live quotes. Our goal is to
        make early trip decisions simpler while clearly showing the assumptions
        behind each estimate.
      </p>
      <button type="button" onClick={onBackToPlanner}>
        Start planning
      </button>
    </main>
  );
}

export function ContactPage({ onBackToPlanner }: StaticPageProps) {
  return (
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
      <button type="button" onClick={onBackToPlanner}>
        Return to planner
      </button>
    </main>
  );
}
