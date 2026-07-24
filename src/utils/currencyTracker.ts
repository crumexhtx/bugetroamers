/** Broader currency set for the conversion tracker (USD is the base). */
export type TrackerCurrency =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'KRW'
  | 'SGD'
  | 'THB'
  | 'VND'
  | 'MXN'
  | 'HUF'
  | 'MAD'
  | 'TRY'
  | 'AED'
  | 'IDR'
  | 'BRL'
  | 'ARS'
  | 'ZAR'
  | 'EGP';

/** Approximate July 2026 planning rates vs 1 USD. */
export const TRACKER_USD_RATES: Record<TrackerCurrency, number> = {
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
};

export const TRACKER_CURRENCY_LABELS: Record<TrackerCurrency, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  VND: 'Vietnamese Dong',
  MXN: 'Mexican Peso',
  HUF: 'Hungarian Forint',
  MAD: 'Moroccan Dirham',
  TRY: 'Turkish Lira',
  AED: 'UAE Dirham',
  IDR: 'Indonesian Rupiah',
  BRL: 'Brazilian Real',
  ARS: 'Argentine Peso',
  ZAR: 'South African Rand',
  EGP: 'Egyptian Pound',
};

/** Default local currency for a destination when available. */
export const DESTINATION_LOCAL_CURRENCY: Record<string, TrackerCurrency> = {
  lisbon: 'EUR',
  bangkok: 'THB',
  'mexico-city': 'MXN',
  budapest: 'HUF',
  hanoi: 'VND',
  marrakech: 'MAD',
  paris: 'EUR',
  london: 'GBP',
  rome: 'EUR',
  barcelona: 'EUR',
  amsterdam: 'EUR',
  istanbul: 'TRY',
  dubai: 'AED',
  tokyo: 'JPY',
  seoul: 'KRW',
  singapore: 'SGD',
  bali: 'IDR',
  'new-york': 'USD',
  'los-angeles': 'USD',
  orlando: 'USD',
  cancun: 'MXN',
  'rio-de-janeiro': 'BRL',
  'buenos-aires': 'ARS',
  'cape-town': 'ZAR',
  cairo: 'EGP',
  sydney: 'AUD',
};

export function convertCurrency(
  amount: number,
  from: TrackerCurrency,
  to: TrackerCurrency,
): number {
  if (!Number.isFinite(amount)) return 0;
  const usd = amount / TRACKER_USD_RATES[from];
  return Math.round(usd * TRACKER_USD_RATES[to] * 100) / 100;
}

export function formatTrackerAmount(
  amount: number,
  currency: TrackerCurrency,
): string {
  const zeroDecimal = new Set(['JPY', 'KRW', 'VND', 'HUF', 'IDR']);
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: zeroDecimal.has(currency) ? 0 : 2,
  }).format(amount);
}
