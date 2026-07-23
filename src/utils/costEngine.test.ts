import { describe, expect, it } from 'vitest';
import type { Destination, Origin } from '../types';
import {
  calculateTripCost,
  estimateDestinationTransport,
  getTravelSeason,
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

describe('estimateDestinationTransport', () => {
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

  it('estimates group flight cost from Houston', () => {
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
