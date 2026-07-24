import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { destinationDescriptions } from '../data/destinationDescriptions';
import { DestinationSnapshot } from './DestinationSnapshot';
import { FeaturedDestinations } from './FeaturedDestinations';
import { TripControls } from './TripControls';
import { CostSummary } from './CostSummary';
import { ExploreDestination } from './ExploreDestination';
import { DestinationGuide } from './DestinationGuide';
import {
  calculateTripPlanCost,
  estimateTripTransport,
  getTravelSeason,
} from '../utils/costEngine';
import {
  alignLegsToDateRange,
  createTrip,
  currencies,
  dateRangeDays,
  destinations,
  featuredDestinations,
  makeId,
  origins,
  today,
  transportModes,
} from '../utils/tripHelpers';
import type {
  CurrencyCode,
  Destination,
  Expense,
  TransportMode,
  TripPlan,
} from '../types';
import {
  trackAnalyticsEvent,
  trackAnalyticsEventOnce,
} from '../utils/observability';

const BudgetTravelMap = lazy(() => import('./BudgetTravelMap'));

class MapErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="budget-travel-map__shell">
          <p className="budget-travel-map__status" role="alert">
            The map could not load. You can still use the trip controls below.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export interface TripPlannerProps {
  mode: 'general' | 'city';
  lockedDestination?: Destination;
  theme: 'light' | 'dark';
  showDestinationSnapshot?: boolean;
}

export function TripPlanner({
  mode,
  lockedDestination,
  theme,
  showDestinationSnapshot = true,
}: TripPlannerProps) {
  const lockedId = lockedDestination?.id ?? '';
  const [trip, setTrip] = useState<TripPlan>(() => createTrip(lockedId));
  const [exploreOpen, setExploreOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState(0);
  const additionalCostsRef = useRef<HTMLElement>(null);
  const [expenseDraft, setExpenseDraft] = useState<Omit<Expense, 'id'>>({
    description: '',
    category: 'Other',
    amount: 0,
    currency: 'USD',
    date: today(),
  });

  useEffect(() => {
    if (!lockedId) return;
    setTrip((current) => {
      const [first, ...rest] = current.legs;
      if (first?.destinationId === lockedId) return current;
      return {
        ...current,
        legs: [
          {
            id: first?.id ?? makeId(),
            destinationId: lockedId,
            days: first?.days ?? 7,
          },
          ...rest.filter((leg) => leg.destinationId !== lockedId),
        ],
        updatedAt: new Date().toISOString(),
      };
    });
  }, [lockedId]);

  const primaryDestinationId = trip.legs[0]?.destinationId;
  const totalDays = dateRangeDays(trip.startDate, trip.endDate);
  const hasDestination = Boolean(primaryDestinationId);
  const origin =
    origins.find((candidate) => candidate.id === trip.originId) ?? origins[0];
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
        .filter((destination): destination is Destination =>
          Boolean(destination),
        ),
    [alignedLegs],
  );
  const firstDestination =
    lockedDestination ?? selectedDestinations[0] ?? destinations[0];
  const travelSeason = getTravelSeason(
    firstDestination,
    trip.startDate,
    trip.endDate,
  );
  const modeEstimates = useMemo(
    () =>
      transportModes.map((transportMode) => ({
        ...transportMode,
        estimate: estimateTripTransport(
          origin,
          selectedDestinations,
          transportMode.value,
          trip.groupSize,
          travelSeason,
        ),
      })),
    [origin, selectedDestinations, trip.groupSize, travelSeason],
  );
  const transportEstimate =
    modeEstimates.find((candidate) => candidate.value === trip.transportMode)
      ?.estimate ?? modeEstimates[0].estimate;
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

  useEffect(() => {
    if (!primaryDestinationId) return;
    trackAnalyticsEventOnce(
      'estimate_completed',
      `${mode}:${primaryDestinationId}`,
      {
        destination_id: primaryDestinationId,
        planner_mode: mode,
        transport_available: transportEstimate.available,
      },
    );
  }, [mode, primaryDestinationId, transportEstimate.available]);

  function updateTrip(patch: Partial<TripPlan>) {
    setTrip((current) => ({
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    }));
  }

  function selectDestination(destinationId: string) {
    if (mode === 'city') return;
    trackAnalyticsEvent('destination_selected', {
      destination_id: destinationId,
      planner_mode: mode,
    });
    const [first, ...rest] = trip.legs;
    if (!first) {
      updateTrip({
        legs: [{ id: makeId(), destinationId, days: 1 }],
      });
      return;
    }
    updateTrip({ legs: [{ ...first, destinationId }, ...rest] });
  }

  function stageAdditionalCost(name: string, amountUsd = 0) {
    setCustomName(name);
    setCustomAmount(amountUsd);
    requestAnimationFrame(() =>
      additionalCostsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      }),
    );
  }

  return (
    <div className="app-layout app-layout--single">
      <aside className="app-layout__dashboard" aria-label="Trip cost planner">
        <section className="planner-panel location-first">
          <h2>Where are you starting?</h2>
          <p className="planner-help">
            Houston is selected by default, but you can change your origin.
          </p>
          <label>
            Starting city
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

        {mode === 'general' && (
          <>
            <FeaturedDestinations
              destinations={featuredDestinations}
              onSelect={selectDestination}
            />
            <section className="planner-panel location-first">
              <h2>Where do you want to go?</h2>
              <p className="planner-help">
                Choose a destination for the calculator, or open a city
                page for a dedicated estimate.
              </p>
              <label>
                Target destination
                <select
                  value={trip.legs[0]?.destinationId ?? ''}
                  onChange={(event) => selectDestination(event.target.value)}
                >
                  <option value="" disabled>
                    Select a destination
                  </option>
                  {destinations.map((destination) => (
                    <option key={destination.id} value={destination.id}>
                      {destination.name}, {destination.country}
                    </option>
                  ))}
                </select>
              </label>
            </section>
          </>
        )}

        {mode === 'city' && lockedDestination && (
          <section className="planner-panel location-first">
            <h2>Estimating a trip to {lockedDestination.name}</h2>
            <p className="planner-help">
              This calculator is locked to {lockedDestination.name}. Adjust
              dates, travelers, and transport below. For other cities, visit the{' '}
              <Link to="/destinations">city guide index</Link>.
            </p>
          </section>
        )}

        {hasDestination && (
          <>
            <section className="city-overview" aria-label="Selected city overview">
              <div className="city-overview__map">
                <MapErrorBoundary>
                  <Suspense
                    fallback={
                      <div className="budget-travel-map__shell">
                        <p className="budget-travel-map__status">
                          Loading destination map…
                        </p>
                      </div>
                    }
                  >
                    <BudgetTravelMap
                      selectedDestinationId={trip.legs[0]?.destinationId}
                      destinationIds={trip.legs.map((leg) => leg.destinationId)}
                      origin={origin}
                      transportMode={trip.transportMode}
                      theme={theme}
                      onSelectDestination={
                        mode === 'general' ? selectDestination : undefined
                      }
                    />
                  </Suspense>
                </MapErrorBoundary>
              </div>
              <aside className="planner-panel city-overview__description">
                <p className="cost-summary__eyebrow">Destination overview</p>
                <h2>{firstDestination.name}</h2>
                <p>{firstDestination.country}</p>
                {showDestinationSnapshot && (
                  <DestinationSnapshot destination={firstDestination} />
                )}
                <p>
                  {destinationDescriptions[firstDestination.id] ??
                    `Explore ${firstDestination.name}, a popular destination in ${firstDestination.country}.`}
                </p>
                <p className="planner-help">
                  Typical on-the-ground planning baseline: $
                  {firstDestination.dailyBudget} USD per traveler per day.
                </p>
                {mode === 'general' ? (
                  <>
                    <button
                      type="button"
                      className="explore-button"
                      onClick={() => setExploreOpen(true)}
                    >
                      Explore {firstDestination.name}
                    </button>
                    <Link
                      className="explore-button explore-button--secondary"
                      to={`/destinations/${firstDestination.id}`}
                    >
                      Open {firstDestination.name} city page
                    </Link>
                  </>
                ) : null}
              </aside>
            </section>

            {mode === 'general' && (
              <>
                <ExploreDestination
                  destination={firstDestination}
                  open={exploreOpen}
                  onClose={() => setExploreOpen(false)}
                />
              </>
            )}

            <section
              className="planner-panel planner-grid planner-grid--dates"
              aria-label="Trip details"
            >
              <label>
                Start date
                <input
                  type="date"
                  value={trip.startDate}
                  max={trip.endDate}
                  onChange={(event) => {
                    const startDate = event.target.value;
                    const endDate =
                      trip.endDate < startDate ? startDate : trip.endDate;
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
                    updateTrip({
                      displayCurrency: event.target.value as CurrencyCode,
                    })
                  }
                >
                  {currencies.map((currency) => (
                    <option key={currency}>{currency}</option>
                  ))}
                </select>
              </label>
            </section>

            <TripControls
              groupSize={trip.groupSize}
              travelSeason={travelSeason}
              seasonality={firstDestination.seasonality}
              onGroupSizeChange={(groupSize) => updateTrip({ groupSize })}
            />

            <section className="planner-panel planner-grid">
              <h2>Travel between cities</h2>
              <label>
                Transport
                <select
                  value={trip.transportMode}
                  onChange={(event) =>
                    updateTrip({
                      transportMode: event.target.value as TransportMode,
                    })
                  }
                >
                  {modeEstimates.map((transportMode) => (
                    <option
                      key={transportMode.value}
                      value={transportMode.value}
                      disabled={
                        transportMode.value === 'driving' ||
                        transportMode.value === 'water' ||
                        !transportMode.estimate.available
                      }
                    >
                      {transportMode.label}
                      {transportMode.value === 'driving' ||
                      transportMode.value === 'water'
                        ? ' — coming soon'
                        : transportMode.estimate.available
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
                  {trip.groupSize} traveler
                  {trip.groupSize === 1 ? '' : 's'} · includes return to{' '}
                  {origin.name}.
                </small>
              </div>
              <p className="planner-help">
                Prices every stop in your itinerary plus the return home.
                Figures are planning averages from route distance, not live
                fares.
              </p>
            </section>

            <CostSummary
              trip={tripWithTransport}
              costs={costs}
              transport={transportEstimate}
            />

            {mode === 'general' && (
              <section className="planner-panel">
                <h2>Itinerary</h2>
                <p className="planner-help">
                  Add each city and allocate the {totalDays} days between{' '}
                  {trip.startDate} and {trip.endDate}.
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
                                ? {
                                    ...candidate,
                                    destinationId: event.target.value,
                                  }
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
                                ? {
                                    ...candidate,
                                    days: Math.max(
                                      1,
                                      Number(event.target.value),
                                    ),
                                  }
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
                          updateTrip({
                            legs: trip.legs.filter(
                              (candidate) => candidate.id !== leg.id,
                            ),
                          })
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
                          {
                            id: makeId(),
                            destinationId: destinations[0].id,
                            days: 1,
                          },
                        ],
                        totalDays,
                      ),
                    })
                  }
                >
                  Add destination
                </button>
              </section>
            )}

            {mode === 'city' && lockedDestination && (
              <DestinationGuide
                destination={lockedDestination}
                showIntro={false}
                onAddAdditionalCost={stageAdditionalCost}
              />
            )}

            <section
              ref={additionalCostsRef}
              className="planner-panel planner-grid"
            >
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
                  onChange={(event) =>
                    setCustomAmount(Number(event.target.value))
                  }
                />
                <button
                  type="button"
                  disabled={!customName.trim() || customAmount <= 0}
                  onClick={() => {
                    updateTrip({
                      customCategories: [
                        ...trip.customCategories,
                        {
                          id: makeId(),
                          name: customName.trim(),
                          amountUsd: customAmount,
                        },
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
                    setExpenseDraft({
                      ...expenseDraft,
                      description: event.target.value,
                    })
                  }
                />
                <input
                  aria-label="Expense category"
                  placeholder="Category"
                  value={expenseDraft.category}
                  onChange={(event) =>
                    setExpenseDraft({
                      ...expenseDraft,
                      category: event.target.value,
                    })
                  }
                />
                <input
                  aria-label="Expense amount"
                  type="number"
                  min="0"
                  value={expenseDraft.amount || ''}
                  onChange={(event) =>
                    setExpenseDraft({
                      ...expenseDraft,
                      amount: Number(event.target.value),
                    })
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
                    setExpenseDraft({
                      ...expenseDraft,
                      date: event.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  disabled={
                    !expenseDraft.description.trim() || expenseDraft.amount <= 0
                  }
                  onClick={() => {
                    updateTrip({
                      expenses: [
                        ...trip.expenses,
                        {
                          ...expenseDraft,
                          id: makeId(),
                          description: expenseDraft.description.trim(),
                        },
                      ],
                    });
                    setExpenseDraft({
                      ...expenseDraft,
                      description: '',
                      amount: 0,
                    });
                  }}
                >
                  Add expense
                </button>
              </div>
              {trip.expenses.map((expense) => (
                <div className="planner-row" key={expense.id}>
                  <span>
                    {expense.date} · {expense.description} ({expense.category})
                  </span>
                  <span>
                    {expense.amount.toFixed(2)} {expense.currency}
                  </span>
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
              Estimates cover lodging nights, food and local costs by calendar
              day, activities, contingency, long-distance transport including
              return, and custom costs. Destination rates are approximate
              planning values, not live quotes.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}

export default TripPlanner;
