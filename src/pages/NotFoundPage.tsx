import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

export function NotFoundPage() {
  return (
    <>
      <PageMeta
        title="Page Not Found — Planora"
        description="The Planora page you requested could not be found."
        noIndex
      />
      <main className="static-page">
        <p className="cost-summary__eyebrow">404 error</p>
        <h1>That page could not be found</h1>
        <p>
          The address may be incorrect, or the page may have moved. Continue
          with the trip calculator or browse the available city guides.
        </p>
        <div className="static-page__actions">
          <Link className="explore-button" to="/">
            Open the calculator
          </Link>
          <Link
            className="explore-button explore-button--secondary"
            to="/destinations"
          >
            Browse city guides
          </Link>
        </div>
      </main>
    </>
  );
}

export default NotFoundPage;
