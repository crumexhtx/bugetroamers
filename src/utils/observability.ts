import * as Sentry from '@sentry/react';
import { track } from '@vercel/analytics/react';

type AnalyticsValue = string | number | boolean | null;
type AnalyticsProperties = Record<string, AnalyticsValue>;
const trackedOnce = new Set<string>();

export function initializeClientObservability() {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.02,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    sendDefaultPii: false,
  });
}

export function trackAnalyticsEvent(
  name: string,
  properties?: AnalyticsProperties,
) {
  track(name, properties);
}

export function trackAnalyticsEventOnce(
  name: string,
  dedupeKey: string,
  properties?: AnalyticsProperties,
) {
  const key = `${name}:${dedupeKey}`;
  if (trackedOnce.has(key)) return;

  trackedOnce.add(key);
  trackAnalyticsEvent(name, properties);
}
