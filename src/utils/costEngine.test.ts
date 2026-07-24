import { describe, expect, it } from 'vitest';
import type { Destination, Origin, TripPlan } from '../types';
import {
  calculateActualSpendUsd,
  calculateTripCost,
  calculateTripPlanCost,
  convertToUsd,
  estimateDestinationTransport,
  estimateTripTransport,
  getTravelSeason,
  lodgingNightsForLeg,
  roundCurrency,
} from './costEngine';

const destination: Destination = {
  id: 'test-city',
  name: 'Test City',
  country: 'Testland',
  lat: 0,
  lng: 0,
  dailyBudget: 100,
  seasonality: {
    cheapest: [1, 2, 11],
    best: [3, 4, 5, 9, 10, 12],
    busiest: [6, 7, 8],
  },
};

const secondCity: Destination = {
  ...destination,
  id: 'second-city',
  name: 'Second City',
  lat: 10,
  lng: 10,
  dailyBudget: 80,
};

const houston: Origin = {
  id: 'houston',
  name: 'Houston',
  country: 'United States',
  lat: 29.7604,
  lng: -95.3698,
};

const mexicoCity: Destination = {
  ...destination,
  id: 'mexico-city',
  name: 'Mexico City',
  country: 'Mexico',
  lat: 19.4326,
  lng: -99.1332,
};

function makeTrip(overrides: Partial<TripPlan> = {}): TripPlan {
  return {
    id: 'trip-1',
    startDate: '2026-07-01',
    endDate: '2026-07-07',
    originId: 'houston',
    transportMode: 'flight',
    groupSize: 2,
    displayCurrency: 'USD',
    longDistanceTransportUsd: 0,
    legs: [{ id: 'leg-1', destinationId: 'test-city', days: 7 }],
    customCategories: [],
    expenses: [],
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('calculateTripCost', () => {
  it('calculates a midrange trip and shares one room between two travelers', () => {
    const result = calculateTripCost({
      destination,
      numberOfDays: 2,
      groupSize: 2,
    });

    expect(result).toEqual({
      lodging: 76,
      food: 112,
      localTransport: 56,
      activities: 56,
      contingency: 24,
      perPersonDaily: 81,
      perPersonTrip: 162,
      grandTotal: 324,
    });
  });

  it('adds another room for an odd third traveler', () => {
    const twoTravelers = calculateTripCost({
      destination,
      numberOfDays: 1,
      groupSize: 2,
    });
    const threeTravelers = calculateTripCost({
      destination,
      numberOfDays: 1,
      groupSize: 3,
    });

    expect(twoTravelers.lodging).toBe(38);
    expect(threeTravelers.lodging).toBe(76);
    expect(threeTravelers.food).toBe(84);
  });

  it('uses the destination daily budget as the ground-cost baseline', () => {
    const result = calculateTripCost({
      destination,
      numberOfDays: 1,
      groupSize: 1,
    });

    expect(result.grandTotal).toBe(100);
  });

  it('charges lodging by nights when nights are provided', () => {
    const result = calculateTripCost({
      destination,
      numberOfDays: 7,
      numberOfNights: 6,
      groupSize: 1,
    });

    expect(result.lodging).toBe(228);
    expect(result.food).toBe(196);
    expect(result.localTransport).toBe(98);
    expect(result.activities).toBe(98);
    expect(result.contingency).toBe(42);
    expect(result.grandTotal).toBe(662);
  });

  it('clamps invalid trip lengths and party sizes to one', () => {
    const result = calculateTripCost({
      destination,
      numberOfDays: Number.NaN,
      groupSize: 0,
    });

    expect(result.grandTotal).toBe(100);
    expect(result.perPersonDaily).toBe(100);
  });

  it('rounds category and total amounts to cents', () => {
    const result = calculateTripCost({
      destination: { ...destination, dailyBudget: 33.33 },
      numberOfDays: 1,
      groupSize: 1,
    });

    expect(result.lodging).toBe(12.67);
    expect(result.grandTotal).toBe(33.34);
  });
});

describe('lodgingNightsForLeg', () => {
  it('keeps nights equal to days for intermediate stops', () => {
    expect(lodgingNightsForLeg(4, false)).toBe(4);
  });

  it('drops the departure day on the final stop', () => {
    expect(lodgingNightsForLeg(3, true)).toBe(2);
  });

  it('allows zero nights for a same-day final stop', () => {
    expect(lodgingNightsForLeg(1, true)).toBe(0);
  });
});

describe('calculateTripPlanCost', () => {
  it('uses nights = days - 1 for a single-stop trip', () => {
    const result = calculateTripPlanCost(
      makeTrip({
        legs: [{ id: 'leg-1', destinationId: 'test-city', days: 7 }],
        longDistanceTransportUsd: 400,
      }),
      [destination],
    );

    expect(result.totalDays).toBe(7);
    expect(result.totalNights).toBe(6);
    expect(result.lodging).toBe(228);
    expect(result.destinationTransport).toBe(400);
    expect(result.grandTotal).toBeGreaterThan(result.lodging);
  });

  it('prices multi-stop ground costs and total nights across legs', () => {
    const result = calculateTripPlanCost(
      makeTrip({
        legs: [
          { id: 'leg-1', destinationId: 'test-city', days: 4 },
          { id: 'leg-2', destinationId: 'second-city', days: 3 },
        ],
        longDistanceTransportUsd: 900,
      }),
      [destination, secondCity],
    );

    // Intermediate 4 nights + final 2 nights = 6 nights for a 7-day trip.
    expect(result.totalDays).toBe(7);
    expect(result.totalNights).toBe(6);
    expect(result.destinationTransport).toBe(900);
    expect(result.lodging).toBeGreaterThan(0);
    expect(result.food).toBeGreaterThan(0);
  });

  it('includes custom costs and ignores invalid destination ids', () => {
    const result = calculateTripPlanCost(
      makeTrip({
        legs: [
          { id: 'leg-1', destinationId: 'missing', days: 3 },
          { id: 'leg-2', destinationId: 'test-city', days: 4 },
        ],
        customCategories: [
          { id: 'c1', name: 'Visa', amountUsd: 50 },
          { id: 'c2', name: 'Bad', amountUsd: -20 },
        ],
        longDistanceTransportUsd: 100,
      }),
      [destination],
    );

    expect(result.custom).toBe(50);
    expect(result.totalDays).toBe(4);
    expect(result.destinationTransport).toBe(100);
    expect(result.grandTotal).toBe(
      roundCurrency(
        result.lodging +
          result.food +
          result.localTransport +
          result.activities +
          result.contingency +
          100 +
          50,
      ),
    );
  });

  it('compares actual spend against the estimate', () => {
    const result = calculateTripPlanCost(
      makeTrip({
        longDistanceTransportUsd: 200,
        expenses: [
          {
            id: 'e1',
            description: 'Hotel',
            category: 'Lodging',
            amount: 500,
            currency: 'USD',
            date: '2026-07-02',
          },
          {
            id: 'e2',
            description: 'Dinner',
            category: 'Food',
            amount: 86,
            currency: 'EUR',
            date: '2026-07-03',
          },
        ],
      }),
      [destination],
    );

    const expectedActual = roundCurrency(500 + convertToUsd(86, 'EUR'));
    expect(result.actualSpend).toBe(expectedActual);
    expect(result.estimateVariance).toBe(
      roundCurrency(expectedActual - result.grandTotal),
    );
  });
});

describe('estimateDestinationTransport', () => {
  it('estimates one-way group flight cost from Houston', () => {
    const estimate = estimateDestinationTransport(
      houston,
      mexicoCity,
      'flight',
      2,
    );

    expect(estimate.available).toBe(true);
    expect(estimate.distanceKm).toBeGreaterThan(1000);
    expect(estimate.costUsd).toBeGreaterThan(0);
  });

  it('marks trains unavailable on routes beyond the supported range', () => {
    const lisbon: Destination = {
      ...destination,
      id: 'lisbon',
      name: 'Lisbon',
      country: 'Portugal',
      lat: 38.7223,
      lng: -9.1393,
    };

    expect(
      estimateDestinationTransport(houston, lisbon, 'train', 2).available,
    ).toBe(false);
  });

  it('prices busiest-season flights above cheapest-season flights', () => {
    const cheapest = estimateDestinationTransport(
      houston,
      mexicoCity,
      'flight',
      2,
      'cheapest',
    );
    const busiest = estimateDestinationTransport(
      houston,
      mexicoCity,
      'flight',
      2,
      'busiest',
    );

    expect(busiest.costUsd).toBeGreaterThan(cheapest.costUsd);
  });

  it('uses explicit one-way flight formula', () => {
    const estimate = estimateDestinationTransport(
      houston,
      mexicoCity,
      'flight',
      1,
      'best',
    );
    const expected = roundCurrency(
      Math.max(90, 60 + estimate.distanceKm * 0.035),
    );
    expect(estimate.costUsd).toBe(expected);
  });

  it('uses explicit one-way train formula when available', () => {
    const nearby: Destination = {
      ...destination,
      id: 'nearby',
      name: 'Nearby',
      lat: 30.2672,
      lng: -97.7431,
    };
    const estimate = estimateDestinationTransport(
      houston,
      nearby,
      'train',
      2,
      'best',
    );
    expect(estimate.available).toBe(true);
    expect(estimate.costUsd).toBe(
      roundCurrency(Math.max(40, estimate.distanceKm * 0.08) * 2),
    );
  });
});

describe('estimateTripTransport', () => {
  it('prices every outbound stop plus return to origin', () => {
    const single = estimateTripTransport(
      houston,
      [mexicoCity],
      'flight',
      2,
      'best',
    );
    const multi = estimateTripTransport(
      houston,
      [mexicoCity, secondCity],
      'flight',
      2,
      'best',
    );

    expect(single.legs).toHaveLength(2);
    expect(single.includesReturn).toBe(true);
    expect(single.legs[0].fromName).toBe('Houston');
    expect(single.legs[0].toName).toBe('Mexico City');
    expect(single.legs[1].toName).toBe('Houston');

    expect(multi.legs).toHaveLength(3);
    expect(multi.costUsd).toBeGreaterThan(single.costUsd);
    expect(multi.totalDistanceKm).toBe(
      multi.legs.reduce((sum, leg) => sum + leg.distanceKm, 0),
    );
  });

  it('marks the full itinerary unavailable if any leg is unavailable', () => {
    const lisbon: Destination = {
      ...destination,
      id: 'lisbon',
      name: 'Lisbon',
      country: 'Portugal',
      lat: 38.7223,
      lng: -9.1393,
    };
    const estimate = estimateTripTransport(
      houston,
      [lisbon],
      'train',
      2,
    );

    expect(estimate.available).toBe(false);
    expect(estimate.costUsd).toBe(0);
  });

  it('returns an empty unavailable estimate without destinations', () => {
    const estimate = estimateTripTransport(houston, [], 'flight', 2);
    expect(estimate.available).toBe(false);
    expect(estimate.legs).toHaveLength(0);
    expect(estimate.costUsd).toBe(0);
  });
});

describe('calculateActualSpendUsd', () => {
  it('converts mixed-currency expenses into USD', () => {
    const total = calculateActualSpendUsd(
      makeTrip({
        expenses: [
          {
            id: 'e1',
            description: 'Taxi',
            category: 'Transport',
            amount: 100,
            currency: 'USD',
            date: '2026-07-01',
          },
          {
            id: 'e2',
            description: 'Museum',
            category: 'Activities',
            amount: 75,
            currency: 'GBP',
            date: '2026-07-02',
          },
        ],
      }),
    );

    expect(total).toBe(roundCurrency(100 + convertToUsd(75, 'GBP')));
  });
});

describe('getTravelSeason', () => {
  it('classifies dates using the destination month ranges', () => {
    expect(getTravelSeason(destination, '2026-01-10', '2026-01-20')).toBe(
      'cheapest',
    );
    expect(getTravelSeason(destination, '2026-04-01', '2026-04-15')).toBe(
      'best',
    );
    expect(getTravelSeason(destination, '2026-07-01', '2026-07-15')).toBe(
      'busiest',
    );
  });

  it('treats a date range touching a busy month as busiest', () => {
    expect(getTravelSeason(destination, '2026-05-25', '2026-06-05')).toBe(
      'busiest',
    );
  });
});
