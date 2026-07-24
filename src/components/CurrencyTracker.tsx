import { useEffect, useMemo, useState } from 'react';
import {
  DESTINATION_LOCAL_CURRENCY,
  TRACKER_CURRENCY_LABELS,
  TRACKER_USD_RATES,
  convertCurrency,
  formatTrackerAmount,
  type TrackerCurrency,
} from '../utils/currencyTracker';

export interface CurrencyTrackerProps {
  destinationId?: string;
  destinationName?: string;
}

interface ConversionEntry {
  id: string;
  amount: number;
  from: TrackerCurrency;
  to: TrackerCurrency;
  result: number;
  at: string;
}

const CURRENCIES = Object.keys(TRACKER_USD_RATES) as TrackerCurrency[];

export function CurrencyTracker({
  destinationId,
  destinationName,
}: CurrencyTrackerProps) {
  const localCurrency =
    (destinationId && DESTINATION_LOCAL_CURRENCY[destinationId]) || 'USD';

  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState<TrackerCurrency>('USD');
  const [to, setTo] = useState<TrackerCurrency>(localCurrency);
  const [history, setHistory] = useState<ConversionEntry[]>([]);

  useEffect(() => {
    setTo(localCurrency);
  }, [localCurrency]);

  const result = useMemo(
    () => convertCurrency(amount, from, to),
    [amount, from, to],
  );

  const rate = useMemo(() => convertCurrency(1, from, to), [from, to]);

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
  }

  function useLocalCurrency() {
    setTo(localCurrency);
  }

  function trackConversion() {
    if (!(amount > 0)) return;
    setHistory((current) => [
      {
        id: crypto.randomUUID(),
        amount,
        from,
        to,
        result,
        at: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...current,
    ].slice(0, 8));
  }

  return (
    <section className="currency-tracker" aria-labelledby="currency-tracker-heading">
      <header className="currency-tracker__header">
        <div>
          <p className="cost-summary__eyebrow">Currency tracker</p>
          <h2 id="currency-tracker-heading">Convert & track</h2>
          <p className="planner-help">
            Planning rates for trip budgeting
            {destinationName ? ` in ${destinationName}` : ''}. Not live market quotes.
          </p>
        </div>
        {destinationId && localCurrency !== 'USD' && (
          <button type="button" className="ghost-button" onClick={useLocalCurrency}>
            Use {localCurrency}
          </button>
        )}
      </header>

      <div className="currency-tracker__grid">
        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount || ''}
            onChange={(event) => setAmount(Number(event.target.value))}
          />
        </label>
        <label>
          From
          <select
            value={from}
            onChange={(event) => setFrom(event.target.value as TrackerCurrency)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code} — {TRACKER_CURRENCY_LABELS[code]}
              </option>
            ))}
          </select>
        </label>
        <label>
          To
          <select
            value={to}
            onChange={(event) => setTo(event.target.value as TrackerCurrency)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code} — {TRACKER_CURRENCY_LABELS[code]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="currency-tracker__result">
        <div>
          <span>Converted amount</span>
          <strong>{formatTrackerAmount(result, to)}</strong>
          <small>
            1 {from} ≈ {formatTrackerAmount(rate, to)}
          </small>
        </div>
        <div className="currency-tracker__actions">
          <button type="button" className="ghost-button" onClick={swapCurrencies}>
            Swap
          </button>
          <button type="button" onClick={trackConversion} disabled={!(amount > 0)}>
            Track conversion
          </button>
        </div>
      </div>

      <div className="currency-tracker__rates" aria-label="Reference rates versus USD">
        {(
          [
            'EUR',
            'GBP',
            'JPY',
            'MXN',
            'THB',
            localCurrency,
          ] as TrackerCurrency[]
        )
          .filter((code, index, list) => list.indexOf(code) === index && code !== 'USD')
          .slice(0, 5)
          .map((code) => (
            <div key={code} className="currency-tracker__rate-chip">
              <span>{code}</span>
              <strong>
                {TRACKER_USD_RATES[code].toLocaleString(undefined, {
                  maximumFractionDigits: TRACKER_USD_RATES[code] >= 100 ? 0 : 2,
                })}
              </strong>
              <small>per USD</small>
            </div>
          ))}
      </div>

      {history.length > 0 && (
        <div className="currency-tracker__history">
          <h3>Tracked conversions</h3>
          <ul>
            {history.map((entry) => (
              <li key={entry.id}>
                <span>
                  {formatTrackerAmount(entry.amount, entry.from)} →{' '}
                  {formatTrackerAmount(entry.result, entry.to)}
                </span>
                <small>{entry.at}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default CurrencyTracker;
