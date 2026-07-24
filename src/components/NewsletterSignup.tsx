import { type FormEvent, useState } from 'react';
import {
  NEWSLETTER_ENDPOINT,
  NEWSLETTER_STORAGE_KEY,
} from '../config/monetization';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setStatus('error');
      return;
    }

    try {
      const existing = JSON.parse(
        localStorage.getItem(NEWSLETTER_STORAGE_KEY) ?? '[]',
      ) as string[];
      const next = Array.from(new Set([...existing, trimmed]));
      localStorage.setItem(NEWSLETTER_STORAGE_KEY, JSON.stringify(next));

      if (NEWSLETTER_ENDPOINT) {
        await fetch(NEWSLETTER_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: trimmed, source: 'budget-roamers' }),
        });
      }

      setStatus('saved');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="newsletter planner-panel" aria-labelledby="newsletter-heading">
      <header>
        <p className="cost-summary__eyebrow">Stay ahead of prices</p>
        <h2 id="newsletter-heading">Get budget trip alerts</h2>
        <p className="planner-help">
          Monthly destination deals, seasonal price swings, and new city guides.
        </p>
      </header>
      <form className="newsletter__form" onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setStatus('idle');
            }}
            required
          />
        </label>
        <button type="submit">Subscribe</button>
      </form>
      {status === 'saved' && (
        <p className="newsletter__status" role="status">
          You’re on the list. We’ll only send trip-planning value.
        </p>
      )}
      {status === 'error' && (
        <p className="newsletter__status newsletter__status--error" role="alert">
          Enter a valid email to subscribe.
        </p>
      )}
    </section>
  );
}

export default NewsletterSignup;
