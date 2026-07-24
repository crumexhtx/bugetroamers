import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import {
  CONTACT_CATEGORIES,
  CONTACT_LIMITS,
} from '../utils/contactValidation';
import { trackAnalyticsEvent } from '../utils/observability';

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About — Planora"
        description="Learn how Planora helps travelers estimate trip costs before booking."
        canonicalPath="/about"
      />
      <main className="static-page">
        <p className="cost-summary__eyebrow">About</p>
        <h1>Plan with a clearer picture of the cost</h1>
        <p>
          Planora helps travelers answer an important early question:
          “What might this trip cost?” Compare destinations before opening
          dozens of booking tabs or committing to an itinerary.
        </p>

        <section className="static-page__grid" aria-label="How Planora works">
          <article>
            <h2>What we estimate</h2>
            <p>
              Lodging, food, local transportation, activities, contingency,
              round-trip destination transport, and any additional costs you
              choose to add.
            </p>
          </article>
          <article>
            <h2>How it works</h2>
            <p>
              Destination budget baselines, trip length, group size, room
              sharing, route distance, and travel season are combined into one
              planning total.
            </p>
          </article>
          <article>
            <h2>What it is not</h2>
            <p>
              Planora is not a booking agency and does not guarantee
              fares, room prices, weather, availability, or entry requirements.
            </p>
          </article>
        </section>

        <section className="static-page__section">
          <h2>Useful planning tools</h2>
          <ul>
            <li>Compare destinations that fit a total budget.</li>
            <li>Estimate single-city and multi-city trips.</li>
            <li>Review seasonal airfare periods and five-day forecasts.</li>
            <li>Convert currencies using clearly labeled planning rates.</li>
            <li>Add attraction, food, drink, and custom expenses.</li>
          </ul>
        </section>

        <section className="static-page__section">
          <h2>Data and transparency</h2>
          <p>
            Weather is supplied by Open-Meteo. Destination and attraction
            imagery links back to Wikipedia or Wikimedia Commons. Currency and
            destination prices are approximate planning values and are labeled
            as such throughout the site.
          </p>
        </section>

        <div className="static-page__actions">
          <Link className="explore-button" to="/">
            Start planning
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
export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: CONTACT_CATEGORIES[0] as string,
    message: '',
    website: '',
  });
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<'idle' | 'sending' | 'saved' | 'error'>(
    'idle',
  );

  async function submitContactForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    const submission = {
      ...form,
      formStartedAt,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      if (!response.ok) {
        trackAnalyticsEvent('contact_submission_failed', {
          failure_type: 'server_response',
          status_code: response.status,
        });
        setStatus('error');
        return;
      }

      setForm((current) => ({ ...current, message: '' }));
      setFormStartedAt(Date.now());
      setStatus('saved');
      trackAnalyticsEvent('contact_submission_succeeded');
    } catch {
      setStatus('error');
      trackAnalyticsEvent('contact_submission_failed', {
        failure_type: 'network',
      });
    }
  }

  return (
    <>
      <PageMeta
        title="Contact — Planora"
        description="Contact Planora with feedback, destination suggestions, or questions about trip estimates."
        canonicalPath="/contact"
      />
      <main className="static-page">
        <p className="cost-summary__eyebrow">Contact</p>
        <h1>Help us make trip estimates better</h1>
        <p>
          Useful feedback includes enough detail to reproduce or verify the
          issue. Choose the category below and gather the suggested information
          before reaching out.
        </p>

        <section className="static-page__grid" aria-label="Feedback categories">
          <article>
            <h2>Estimate feedback</h2>
            <p>
              Include the origin, destination, dates, group size, transport
              choice, displayed total, and what appeared inaccurate.
            </p>
          </article>
          <article>
            <h2>Suggest a city</h2>
            <p>
              Share the city and country, why travelers would find it useful,
              and any trusted local price or seasonality sources.
            </p>
          </article>
          <article>
            <h2>Content correction</h2>
            <p>
              Identify the city page, attraction, food, drink, image, or factual
              statement and provide a reliable source for the correction.
            </p>
          </article>
        </section>

        <form className="static-page__form" onSubmit={submitContactForm}>
          <h2>Send feedback</h2>
          <div className="static-page__form-grid">
            <label>
              Name
              <input
                type="text"
                autoComplete="name"
                value={form.name}
                maxLength={CONTACT_LIMITS.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                maxLength={CONTACT_LIMITS.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                required
              />
            </label>
            <label className="static-page__form-wide">
              Feedback type
              <select
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
              >
                {CONTACT_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="static-page__form-wide">
              Message
              <textarea
                rows={6}
                minLength={10}
                maxLength={CONTACT_LIMITS.message}
                value={form.message}
                onChange={(event) =>
                  setForm({ ...form, message: event.target.value })
                }
                placeholder="Include the city, dates, settings, or source relevant to your feedback."
                required
              />
            </label>
            <label className="visually-hidden" aria-hidden="true">
              Website
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(event) =>
                  setForm({ ...form, website: event.target.value })
                }
                autoComplete="off"
                tabIndex={-1}
              />
            </label>
          </div>
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send feedback'}
          </button>
          <small>
            By sending this form, you agree that we may use your contact details
            and message to respond, as described in our{' '}
            <Link to="/privacy">privacy notice</Link>.
          </small>
          {status === 'saved' && (
            <p className="static-page__form-status" role="status">
              Thanks—your feedback has been sent.
            </p>
          )}
          {status === 'error' && (
            <p
              className="static-page__form-status static-page__form-status--error"
              role="alert"
            >
              Your feedback could not be sent. Please try again later.
            </p>
          )}
        </form>

        <section className="static-page__section">
          <h2>For urgent travel questions</h2>
          <p>
            Planora cannot provide emergency, immigration, medical, or
            safety advice. Contact the relevant government office, transport
            provider, accommodation, insurer, or local emergency service.
          </p>
        </section>

        <div className="static-page__actions">
          <Link className="explore-button" to="/">
            Return to calculator
          </Link>
          <Link
            className="explore-button explore-button--secondary"
            to="/about"
          >
            How estimates work
          </Link>
        </div>
      </main>
    </>
  );
}