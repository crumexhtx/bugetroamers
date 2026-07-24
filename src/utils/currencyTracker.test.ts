import { describe, expect, it } from 'vitest';
import {
  DESTINATION_LOCAL_CURRENCY,
  TRACKER_USD_RATES,
  convertCurrency,
  formatTrackerAmount,
} from './currencyTracker';
import { USD_EXCHANGE_RATES } from './costEngine';
import { destinations } from './tripHelpers';
import {
  PLANNING_DATA_AS_OF,
  PLANNING_DATA_AS_OF_LABEL,
} from './pricingAssumptions';

describe('convertCurrency', () => {
  it('converts through USD as the base', () => {
    expect(convertCurrency(100, 'USD', 'EUR')).toBe(86);
    expect(convertCurrency(86, 'EUR', 'USD')).toBe(100);
  });

  it('converts between non-USD currencies', () => {
    const yen = convertCurrency(50, 'USD', 'JPY');
    expect(yen).toBe(7860);
    expect(convertCurrency(yen, 'JPY', 'USD')).toBe(50);
  });

  it('returns zero for invalid amounts', () => {
    expect(convertCurrency(Number.NaN, 'USD', 'EUR')).toBe(0);
  });
});

describe('destination local currency mapping', () => {
  it('maps popular destinations to local currencies', () => {
    expect(DESTINATION_LOCAL_CURRENCY.tokyo).toBe('JPY');
    expect(DESTINATION_LOCAL_CURRENCY.bangkok).toBe('THB');
    expect(DESTINATION_LOCAL_CURRENCY.paris).toBe('EUR');
  });

  it('covers every published destination', () => {
    destinations.forEach((destination) => {
      expect(DESTINATION_LOCAL_CURRENCY[destination.id]).toBeDefined();
    });
  });
});

describe('formatTrackerAmount', () => {
  it('formats zero-decimal currencies without cents', () => {
    expect(formatTrackerAmount(1500, 'JPY')).toContain('1,500');
  });
});

describe('shared planning assumptions', () => {
  it('keeps cost-engine and tracker exchange rates aligned', () => {
    Object.entries(USD_EXCHANGE_RATES).forEach(([currency, rate]) => {
      expect(TRACKER_USD_RATES[currency as keyof typeof TRACKER_USD_RATES]).toBe(
        rate,
      );
    });
  });

  it('exposes an ISO freshness date and human label for July 2026', () => {
    expect(PLANNING_DATA_AS_OF).toMatch(/^2026-07-\d{2}$/);
    expect(PLANNING_DATA_AS_OF_LABEL).toBe('July 2026');
  });
});
