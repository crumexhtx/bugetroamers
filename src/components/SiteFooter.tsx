import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <strong>Planora</strong>
        <span>Plan with context. Book with confidence.</span>
      </div>
      <nav aria-label="Footer navigation">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/destinations">City guides</Link>
      </nav>
      <div className="site-footer__disclaimer">
        <strong>Planning disclaimer</strong>
        <p>
          Trip totals, fares, exchange rates, weather, and local prices are
          approximate planning information—not live quotes, guarantees, or
          financial advice. Prices and conditions can change. Confirm current
          costs, entry requirements, availability, and safety guidance with
          official providers before booking.
        </p>
      </div>
      <small>© {new Date().getFullYear()} Planora</small>
    </footer>
  );
}

export default SiteFooter;
