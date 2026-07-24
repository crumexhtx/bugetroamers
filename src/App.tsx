import { useEffect, useMemo, useState } from 'react';
import destinationsData from './data/destinations.json';
import originsData from './data/origins.json';
import { destinationDescriptions } from './data/destinationDescriptions';
import { BudgetTravelMap } from './components/BudgetTravelMap';
import { DestinationSnapshot } from './components/DestinationSnapshot';
import { FeaturedDestinations } from './components/FeaturedDestinations';
import { AboutPage, ContactPage } from './components/StaticPages';
import { TripControls } from './components/TripControls';
import { CostSummary } from './components/CostSummary';
import {
  calculateTripPlanCost,
  estimateTripTransport,
  getTravelSeason,
} from './utils/costEngine';
import type {
  CurrencyCode,
  Destination,
  Expense,
  Origin,
  TransportMode,
  TripPlan,
} from './types';

const destinations = destinationsData as Destination[];
const origins = originsData as Origin[];
const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
const featuredDestinations = destinations.filter((destination) =>
  ['paris', 'tokyo', 'bali', 'rome'].includes(destination.id),
);
const transportModes: { value: TransportMode; label: string }[] = [
  { value: 'flight', label: 'Flight' },
  { value: 'driving', label: 'Driving' },
  { value: 'train', label: 'Train' },
  { value: 'water', label: 'Ferry / cruise' },
];

function makeId(): string {
  return crypto.randomUUID();
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateValue: string, days: number): string {
  const date = new Date(`${dateValue}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function dateRangeDays(startDate: string, endDate: string): number {
  const start = new Date(`${startDate}T12:00:00`).getTime();
  const end = new Date(`${endDate}T12:00:00`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 1;
  return Math.max(1, Math.floor((end - start) / 86_400_000) + 1);
}

function alignLegsToDateRange(
  legs: TripPlan['legs'],
  totalDays: number,
): TripPlan['legs'] {
  let remaining = Math.max(totalDays, legs.length);
  return legs.map((leg, index) => {
    const remainingStops = legs.length - index - 1;
    const days =
      index === legs.length - 1
        ? remaining
        : Math.max(1, Math.min(leg.days, remaining - remainingStops));
    remaining -= days;
    return { ...leg, days };
  });
}

function createTrip(): TripPlan {
  const startDate = today();
  return {
    id: makeId(),
    startDate,
    endDate: addDays(startDate, 6),
    originId: 'houston',
    transportMode: 'flight',
    groupSize: 2,
    displayCurrency: 'USD',
    longDistanceTransportUsd: 0,
    legs: [{ id: makeId(), destinationId: '', days: 7 }],
    customCategories: [],
    expenses: [],
    updatedAt: new Date().toISOString(),
  };
}

export default function App() {
  const [trip, setTrip] = useState<TripPlan>(createTrip);
  const [view, setView] = useState<'planner' | 'about' | 'contact'>('planner');
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    localStorage.getItem('budget-roamers.theme') === 'light' ? 'light' : 'dark',
  );
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState(0);
  const [expenseDraft, setExpenseDraft] = useState<
    Omit<Expense, 'id'>
  >({
    description: '',
    category: 'Other',
    amount: 0,
    currency: 'USD',
    date: today(),
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('budget-roamers.theme', theme);
  }, [theme]);

  const totalDays = dateRangeDays(trip.startDate, trip.endDate);
  const hasDestination = Boolean(trip.legs[0]?.destinationId);
  const origin = origins.find((candidate) => candidate.id === trip.originId) ?? origins[0];
  const alignedLegs = useMemo(
    () => alignLegsToDateRange(trip.legs, totalDays),
    [trip.legs, totalDays],
  );
  const selectedDestinations = useMemo(
    () =>
      alignedLegs
        .map((leg) =>
          destinations.find((candidate) => candidate.id === leg.destinationId),
        )
        .filter((destination): destination is Destination => Boolean(destination)),
    [alignedLegs],
  );
  const firstDestination = selectedDestinations[0] ?? destinations[0];
  const travelSeason = getTravelSeason(
    firstDestination,
    trip.startDate,
    trip.endDate,
  );
  const modeEstimates = useMemo(
    () =>
      transportModes.map((mode) => ({
        ...mode,
        estimate: estimateTripTransport(
          origin,
          selectedDestinations,
          mode.value,
          trip.groupSize,
          travelSeason,
        ),
      })),
    [origin, selectedDestinations, trip.groupSize, travelSeason],
  );
  const transportEstimate =
    modeEstimates.find((mode) => mode.value === trip.transportMode)?.estimate ??
    modeEstimates[0].estimate;
  const tripWithTransport = useMemo(
    () => ({
      ...trip,
      legs: alignedLegs,
      longDistanceTransportUsd: transportEstimate.costUsd,
    }),
    [trip, alignedLegs, transportEstimate.costUsd],
  );
  const costs = useMemo(
    () => calculateTripPlanCost(tripWithTransport, destinations),
    [tripWithTransport],
  );

  function updateTrip(patch: Partial<TripPlan>) {
    setTrip((current) => ({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }));
  }

  function selectDestination(destinationId: string) {
    const [first, ...rest] = trip.legs;
    if (!first) {
      updateTrip({
        legs: [{ id: makeId(), destinationId, days: 1 }],
      });
      return;
    }
    updateTrip({ legs: [{ ...first, destinationId }, ...rest] });
  }

  return (
    <div className="app-shell">
      <header className="app-shell__brand">
        <div>
          <p className="app-shell__brand-mark">Budget Roamers</p>
          <h1>Estimate your trip cost before you book</h1>
        </div>
        <div className="app-shell__actions">
          <nav aria-label="Main navigation">
            <button type="button" onClick={() => setView('planner')}>Planner</button>
            <button type="button" onClick={() => setView('about')}>About</button>
            <button type="button" onClick={() => setView('contact')}>Contact</button>
          </nav>
          <button
            className="theme-toggle"
            type="button"
            aria-pressed={theme === 'light'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? '☀ Light' : '☾ Dark'}
          </button>
        </div>
      </header>

      {view === 'planner' ? (
      <div className="app-layout app-layout--single">
        <aside className="app-layout__dashboard" aria-label="Trip cost planner">
          <section className="planner-panel location-first">
            <h2>Where are you starting?</h2>
            <p className="planner-help">
              Houston is selected by default, but you can change your origin.
            </p>
            <label>
              Starting destination
              <select
                value={trip.originId}
                onChange={(event) => updateTrip({ originId: event.target.value })}
              >
                {origins.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name}, {candidate.country}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <FeaturedDestinations
            destinations={featuredDestinations}
            onSelect={selectDestination}
          />

          <section className="planner-panel location-first">
            <h2>Where do you want to go?</h2>
            <p className="planner-help">
              Choose your first destination to start building the estimate.
            </p>
            <label>
              Target destination
              <select
                value={trip.legs[0]?.destinationId ?? ''}
                onChange={(event) => selectDestination(event.target.value)}
              >
                <option value="" disabled>Select a destination</option>
                {destinations.map((destination) => (
                  <option key={destination.id} value={destination.id}>
                    {destination.name}, {destination.country}
                  </option>
                ))}
              </select>
            </label>
          </section>

          {hasDestination && (
            <>
          <section className="city-overview" aria-label="Selected city overview">
            <div className="city-overview__map">
              <BudgetTravelMap
                selectedDestinationId={trip.legs[0]?.destinationId}
                destinationIds={trip.legs.map((leg) => leg.destinationId)}
                origin={origin}
                transportMode={trip.transportMode}
                theme={theme}
                onSelectDestination={selectDestination}
              />
            </div>
            <aside className="planner-panel city-overview__description">
              <p className="cost-summary__eyebrow">Destination overview</p>
              <h2>{firstDestination.name}</h2>
              <p>{firstDestination.country}</p>
              <DestinationSnapshot destination={firstDestination} />
              <p>
                {destinationDescriptions[firstDestination.id] ??
                  `Explore ${firstDestination.name}, a popular destination in ${firstDestination.country}.`}
              </p>
              <p className="planner-help">
                Typical on-the-ground planning baseline: ${firstDestination.dailyBudget}
                {' '}USD per traveler per day.
              </p>
            </aside>
          </section>

          <section className="planner-panel planner-actions">
            <div>
              <strong>Saved trips</strong>
              <p className="planner-help">Account-based trip saving is coming soon.</p>
            </div>
            <button type="button" disabled>Save trip — coming soon</button>
            <button type="button" onClick={() => setTrip(createTrip())}>New</button>
          </section>

          <section className="planner-panel planner-grid" aria-label="Trip details">
            <label>
              Start date
              <input
                type="date"
                value={trip.startDate}
                max={trip.endDate}
                onChange={(event) => {
                  const startDate = event.target.value;
                  const endDate = trip.endDate < startDate ? startDate : trip.endDate;
                  updateTrip({
                    startDate,
                    endDate,
                    legs: alignLegsToDateRange(
                      trip.legs,
                      dateRangeDays(startDate, endDate),
                    ),
                  });
                }}
              />
            </label>
            <label>
              End date
              <input
                type="date"
                value={trip.endDate}
                min={trip.startDate}
                onChange={(event) => {
                  const endDate = event.target.value;
                  updateTrip({
                    endDate,
                    legs: alignLegsToDateRange(
                      trip.legs,
                      dateRangeDays(trip.startDate, endDate),
                    ),
                  });
                }}
              />
            </label>
            <label>
              Display currency
              <select
                value={trip.displayCurrency}
                onChange={(event) =>
                  updateTrip({ displayCurrency: event.target.value as CurrencyCode })
                }
              >
                {currencies.map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </label>
          </section>

          <section className="planner-panel planner-grid">
            <h2>Travel between cities</h2>
            <label>
              Transport
              <select
                value={trip.transportMode}
                onChange={(event) =>
                  updateTrip({ transportMode: event.target.value as TransportMode })
                }
              >
                {modeEstimates.map((mode) => (
                  <option
                    key={mode.value}
                    value={mode.value}
                    disabled={
                      mode.value === 'driving' ||
                      mode.value === 'water' ||
                      !mode.estimate.available
                    }
                  >
                    {mode.label}
                    {mode.value === 'driving' || mode.value === 'water'
                      ? ' — coming soon'
                      : mode.estimate.available
                        ? ''
                        : ' — unavailable for this route'}
                  </option>
                ))}
              </select>
            </label>
            <div className="transport-estimate">
              <span>Estimated round-trip itinerary cost</span>
              <strong>
                {transportEstimate.available
                  ? `$${transportEstimate.costUsd.toFixed(2)} USD`
                  : 'Unavailable'}
              </strong>
              <small>
                {transportEstimate.legs.length} leg
                {transportEstimate.legs.length === 1 ? '' : 's'} ·{' '}
                {transportEstimate.totalDistanceKm.toLocaleString()} km total ·{' '}
                {trip.groupSize} traveler{trip.groupSize === 1 ? '' : 's'} ·
                includes return to {origin.name}.
              </small>
            </div>
            <p className="planner-help">
              Prices every stop in your itinerary plus the return home. Figures are
              planning averages from route distance, not live fares. Train is only
              enabled within the estimator’s supported range. Driving and
              ferry/cruise estimates are coming soon.
            </p>
          </section>

          <CostSummary
            trip={tripWithTransport}
            costs={costs}
            transport={transportEstimate}
          />

          <TripControls
            groupSize={trip.groupSize}
            travelSeason={travelSeason}
            seasonality={firstDestination.seasonality}
            onGroupSizeChange={(groupSize) => updateTrip({ groupSize })}
          />

          <section className="planner-panel">
            <h2>Itinerary</h2>
            <p className="planner-help">
              Add each city and allocate the {totalDays} days between {trip.startDate}
              {' '}and {trip.endDate}. Estimates use the date range if allocations differ.
            </p>
            <div className="planner-list">
              {trip.legs.map((leg, index) => (
                <div className="planner-row" key={leg.id}>
                  <span>{index + 1}</span>
                  <select
                    aria-label={`Destination ${index + 1}`}
                    value={leg.destinationId}
                    onChange={(event) =>
                      updateTrip({
                        legs: trip.legs.map((candidate) =>
                          candidate.id === leg.id
                            ? { ...candidate, destinationId: event.target.value }
                            : candidate,
                        ),
                      })
                    }
                  >
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}, {destination.country}
                      </option>
                    ))}
                  </select>
                  <input
                    aria-label={`Days in stop ${index + 1}`}
                    type="number"
                    min="1"
                    max="30"
                    value={leg.days}
                    onChange={(event) =>
                      updateTrip({
                        legs: trip.legs.map((candidate) =>
                          candidate.id === leg.id
                            ? { ...candidate, days: Math.max(1, Number(event.target.value)) }
                            : candidate,
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Remove stop ${index + 1}`}
                    disabled={trip.legs.length === 1}
                    onClick={() =>
                      updateTrip({ legs: trip.legs.filter((candidate) => candidate.id !== leg.id) })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              disabled={trip.legs.length >= totalDays}
              onClick={() =>
                updateTrip({
                  legs: alignLegsToDateRange(
                    [
                      ...trip.legs,
                      { id: makeId(), destinationId: destinations[0].id, days: 1 },
                    ],
                    totalDays,
                  ),
                })
              }
            >
              Add destination
            </button>
          </section>

          <section className="planner-panel planner-grid">
            <h2>Additional planned costs</h2>
            <div className="planner-row">
              <input
                aria-label="Custom cost name"
                placeholder="Visa, insurance…"
                value={customName}
                onChange={(event) => setCustomName(event.target.value)}
              />
              <input
                aria-label="Custom cost amount in USD"
                type="number"
                min="0"
                placeholder="USD"
                value={customAmount || ''}
                onChange={(event) => setCustomAmount(Number(event.target.value))}
              />
              <button
                type="button"
                disabled={!customName.trim() || customAmount <= 0}
                onClick={() => {
                  updateTrip({
                    customCategories: [
                      ...trip.customCategories,
                      { id: makeId(), name: customName.trim(), amountUsd: customAmount },
                    ],
                  });
                  setCustomName('');
                  setCustomAmount(0);
                }}
              >
                Add
              </button>
            </div>
            {trip.customCategories.map((category) => (
              <div className="planner-row" key={category.id}>
                <span>{category.name}</span>
                <span>${category.amountUsd.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateTrip({
                      customCategories: trip.customCategories.filter(
                        (candidate) => candidate.id !== category.id,
                      ),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <section className="planner-panel">
            <h2>Actual expenses</h2>
            <div className="planner-grid">
              <input
                aria-label="Expense description"
                placeholder="Hotel deposit"
                value={expenseDraft.description}
                onChange={(event) =>
                  setExpenseDraft({ ...expenseDraft, description: event.target.value })
                }
              />
              <input
                aria-label="Expense category"
                placeholder="Category"
                value={expenseDraft.category}
                onChange={(event) =>
                  setExpenseDraft({ ...expenseDraft, category: event.target.value })
                }
              />
              <input
                aria-label="Expense amount"
                type="number"
                min="0"
                value={expenseDraft.amount || ''}
                onChange={(event) =>
                  setExpenseDraft({ ...expenseDraft, amount: Number(event.target.value) })
                }
              />
              <select
                aria-label="Expense currency"
                value={expenseDraft.currency}
                onChange={(event) =>
                  setExpenseDraft({
                    ...expenseDraft,
                    currency: event.target.value as CurrencyCode,
                  })
                }
              >
                {currencies.map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
              <input
                aria-label="Expense date"
                type="date"
                value={expenseDraft.date}
                onChange={(event) =>
                  setExpenseDraft({ ...expenseDraft, date: event.target.value })
                }
              />
              <button
                type="button"
                disabled={!expenseDraft.description.trim() || expenseDraft.amount <= 0}
                onClick={() => {
                  updateTrip({
                    expenses: [
                      ...trip.expenses,
                      { ...expenseDraft, id: makeId(), description: expenseDraft.description.trim() },
                    ],
                  });
                  setExpenseDraft({ ...expenseDraft, description: '', amount: 0 });
                }}
              >
                Add expense
              </button>
            </div>
            {trip.expenses.map((expense) => (
              <div className="planner-row" key={expense.id}>
                <span>{expense.date} · {expense.description} ({expense.category})</span>
                <span>{expense.amount.toFixed(2)} {expense.currency}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateTrip({
                      expenses: trip.expenses.filter(
                        (candidate) => candidate.id !== expense.id,
                      ),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          <p className="estimate-disclaimer">
            Estimates cover lodging nights (one room per two travelers), food and
            local costs by calendar day, activities, contingency, long-distance
            transport for every itinerary leg including return, and custom costs.
            Log actual expenses below to compare against the estimate. Destination
            rates and currency conversions are approximate USD-based planning
            values, not live quotes.
          </p>
            </>
          )}
        </aside>
      </div>
      ) : view === 'about' ? (
        <AboutPage onBackToPlanner={() => setView('planner')} />
      ) : (
        <ContactPage onBackToPlanner={() => setView('planner')} />
      )}
    </div>
  );
}
