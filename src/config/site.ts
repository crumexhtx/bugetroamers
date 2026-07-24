/** Public site config used for SEO, sitemap, and affiliate attribution. */
export const SITE_NAME = 'Budget Roamers';
export const SITE_TAGLINE = 'Estimate your trip cost before you book';

const envSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const SITE_URL = (envSiteUrl || 'https://bugetroamers.com').replace(
  /\/$/,
  '',
);

export const DEFAULT_DESCRIPTION =
  'Estimate your trip cost before you book. Compare destinations, dates, transport, and daily budgets with Budget Roamers.';
