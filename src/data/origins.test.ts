import { describe, expect, it } from 'vitest';
import { estimateTripTransport } from '../utils/costEngine';
import { createTrip, destinations, origins } from '../utils/tripHelpers';

describe('origin data integrity', () => {
  it('contains exactly 18 origins with unique stable IDs', () => {
    expect(origins).toHaveLength(18);
    expect(new Set(origins.map((origin) => origin.id)).size).toBe(18);

    origins.forEach((origin) => {
      expect(origin.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
    });
  });

  it('uses valid city-center coordinates', () => {
    origins.forEach((origin) => {
      expect(Number.isFinite(origin.lat)).toBe(true);
      expect(Number.isFinite(origin.lng)).toBe(true);
      expect(origin.lat).toBeGreaterThanOrEqual(-90);
      expect(origin.lat).toBeLessThanOrEqual(90);
      expect(origin.lng).toBeGreaterThanOrEqual(-180);
      expect(origin.lng).toBeLessThanOrEqual(180);
    });
  });

  it('keeps Houston present and selected by default', () => {
    expect(origins.some((origin) => origin.id === 'houston')).toBe(true);
    expect(createTrip().originId).toBe('houston');
  });

  it('supports flight estimates from every origin', () => {
    const destination = destinations.find(({ id }) => id === 'bali');
    expect(destination).toBeDefined();

    origins.forEach((origin) => {
      const estimate = estimateTripTransport(
        origin,
        [destination!],
        'flight',
        1,
      );
      expect(estimate.available).toBe(true);
      expect(estimate.includesReturn).toBe(true);
      expect(estimate.legs).toHaveLength(2);
      expect(estimate.totalDistanceKm).toBeGreaterThan(0);
      expect(estimate.costUsd).toBeGreaterThan(0);
    });
  });
});
