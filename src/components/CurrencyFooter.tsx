import { useRef, useState } from 'react';
import { CurrencyTracker } from './CurrencyTracker';
import {
  TRACKER_USD_RATES,
  type TrackerCurrency,
} from '../utils/currencyTracker';

const BANNER_CURRENCIES: TrackerCurrency[] = [
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'MXN',
  'BRL',
  'THB',
  'INR',
  'KRW',
  'AED',
  'ZAR',
];

const CURRENCY_FLAG_CODES: Partial<Record<TrackerCurrency, string>> = {
  EUR: 'eu',
  GBP: 'gb',
  CAD: 'ca',
  AUD: 'au',
  JPY: 'jp',
  MXN: 'mx',
  BRL: 'br',
  THB: 'th',
  INR: 'in',
  KRW: 'kr',
  AED: 'ae',
  ZAR: 'za',
};

function CurrencyItems({
  onSelect,
  focusable = true,
}: {
  onSelect: (currency: TrackerCurrency) => void;
  focusable?: boolean;
}) {
  return (
    <>
      {BANNER_CURRENCIES.map((currency) => {
        const rate = TRACKER_USD_RATES[currency];
        const flagCode = CURRENCY_FLAG_CODES[currency];
        return (
          <button
            className="currency-banner__item"
            key={currency}
            type="button"
            tabIndex={focusable ? 0 : -1}
            onClick={() => onSelect(currency)}
            aria-label={`Convert US dollars to ${currency}`}
          >
            {flagCode && (
              <img
                className="currency-banner__flag"
                src={`https://flagcdn.com/w160/${flagCode}.png`}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
            )}
            <strong>{currency}</strong>
            <span>
              {rate.toLocaleString(undefined, {
                maximumFractionDigits: rate >= 100 ? 0 : 2,
              })}
            </span>
            <small>per USD</small>
          </button>
        );
      })}
    </>
  );
}

export function CurrencyFooter() {
  const [selection, setSelection] = useState({
    currency: 'EUR' as TrackerCurrency,
    version: 0,
  });
  const converterRef = useRef<HTMLDivElement>(null);

  function openConverter(currency = selection.currency) {
    setSelection((current) => ({
      currency,
      version: current.version + 1,
    }));
    requestAnimationFrame(() =>
      converterRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      }),
    );
  }

  return (
    <footer className="currency-footer">
      <section
        className="currency-banner"
        aria-label="Rotating reference currency values"
      >
        <div className="currency-banner__label">
          <span>Currency snapshot</span>
          <strong>1 USD</strong>
        </div>
        <div className="currency-banner__viewport">
          <div className="currency-banner__track">
            <div className="currency-banner__group">
              <CurrencyItems onSelect={openConverter} />
            </div>
            <div className="currency-banner__group" aria-hidden="true">
              <CurrencyItems onSelect={openConverter} focusable={false} />
            </div>
          </div>
        </div>
      </section>

      <div
        id="currency-converter"
        className="currency-footer__converter"
        ref={converterRef}
      >
        <CurrencyTracker
          showRates={false}
          targetCurrency={selection.currency}
          targetCurrencyChangeKey={selection.version}
        />
      </div>
    </footer>
  );
}

export default CurrencyFooter;
