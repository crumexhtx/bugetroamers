import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { NewsletterSignup } from '../components/NewsletterSignup';

export function PartnersPage() {
  return (
    <>
      <PageMeta
        title="Partners — Budget Roamers"
        description="Advertise and affiliate with Budget Roamers. Reach travelers who are actively estimating trip costs."
        canonicalPath="/partners"
      />
      <main className="static-page partners-page">
        <p className="cost-summary__eyebrow">Partners</p>
        <h1>Monetize intent, not just traffic</h1>
        <p>
          Our visitors arrive ready to estimate a trip. That makes city pages and
          calculator results strong inventory for travel brands.
        </p>

        <section className="partners-page__grid">
          <article>
            <h2>Affiliate placements</h2>
            <p>
              Flights, stays, activities, and insurance offers on destination
              pages and after cost estimates.
            </p>
          </article>
          <article>
            <h2>Sponsored city guides</h2>
            <p>
              Feature your brand inside high-intent guides with attractions,
              food pricing, and trip calculators.
            </p>
          </article>
          <article>
            <h2>Newsletter sponsorships</h2>
            <p>
              Reach subscribers following seasonal price trends and new city
              launches.
            </p>
          </article>
        </section>

        <NewsletterSignup />

        <p>
          Ready to talk inventory? Email{' '}
          <a href="mailto:partners@bugetroamers.com">partners@bugetroamers.com</a>
          {' '}or return to the <Link to="/">planner</Link>.
        </p>
      </main>
    </>
  );
}

export default PartnersPage;
