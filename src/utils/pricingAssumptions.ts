/** ISO date for the planning data currently used across cost and currency tools. */
export const PLANNING_DATA_AS_OF = '2026-07-01';

/** Human-readable counterpart to `PLANNING_DATA_AS_OF`. */
export const PLANNING_DATA_AS_OF_LABEL = 'July 2026';

/** Approximate planning rates versus 1 USD. These are not live market quotes. */
export const PLANNING_USD_RATES = {
  USD: 1,
  EUR: 0.86,
  GBP: 0.75,
  CAD: 1.37,
  AUD: 1.52,
  JPY: 157.2,
  KRW: 1385,
  SGD: 1.28,
  THB: 33.1,
  VND: 25_450,
  MXN: 18.4,
  HUF: 345,
  MAD: 9.15,
  TRY: 40.2,
  AED: 3.67,
  IDR: 16_250,
  BRL: 5.55,
  ARS: 1180,
  ZAR: 18.1,
  EGP: 49.5,
  CZK: 21.5,
  DKK: 6.45,
  NZD: 1.68,
  TWD: 31.2,
  HKD: 7.82,
  PEN: 3.72,
  INR: 85.5,
} as const;
