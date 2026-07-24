import { describe, expect, it } from 'vitest';
import { destinations } from '../utils/tripHelpers';
import { destinationBeverages } from './destinationBeverages';
import { destinationDishes } from './destinationDishes';

describe('destination food and beverage content', () => {
  it('covers every destination with two dishes, a drink, and a beer pick', () => {
    const destinationIds = destinations.map((destination) => destination.id);

    expect(Object.keys(destinationDishes).sort()).toEqual(
      [...destinationIds].sort(),
    );
    expect(Object.keys(destinationBeverages).sort()).toEqual(
      [...destinationIds].sort(),
    );

    destinationIds.forEach((destinationId) => {
      expect(destinationDishes[destinationId]).toHaveLength(2);
      expect(destinationBeverages[destinationId]).toBeDefined();
    });
  });

  it('uses complete, positive planning values', () => {
    destinations.forEach((destination) => {
      const picks = [
        ...destinationDishes[destination.id],
        destinationBeverages[destination.id].localDrink,
        destinationBeverages[destination.id].beer,
      ];

      picks.forEach((pick) => {
        expect(pick.name.trim()).not.toBe('');
        expect(pick.blurb.trim()).not.toBe('');
        expect(pick.averagePriceUsd).toBeGreaterThan(0);
      });
    });
  });
});
