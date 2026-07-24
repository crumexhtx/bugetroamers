import { describe, expect, it } from 'vitest';
import {
  DESTINATION_LOCAL_CURRENCY,
  convertCurrency,
  formatTrackerAmount,
} from './currencyTracker';

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
});

describe('formatTrackerAmount', () => {
  it('formats zero-decimal currencies without cents', () => {
    expect(formatTrackerAmount(1500, 'JPY')).toContain('1,500');
  });
});
