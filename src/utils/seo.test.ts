import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SOCIAL_IMAGE_ALT,
  DEFAULT_SOCIAL_IMAGE_HEIGHT,
  DEFAULT_SOCIAL_IMAGE_PATH,
  DEFAULT_SOCIAL_IMAGE_URL,
  DEFAULT_SOCIAL_IMAGE_WIDTH,
  SITE_URL,
} from '../config/site';
import { destinations } from './tripHelpers';
import { buildDestinationJsonLd, buildWebsiteJsonLd } from './seo';

describe('SEO structured data', () => {
  it('builds a valid website entity without advertising nonexistent search', () => {
    const schema = buildWebsiteJsonLd();

    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe('Planora');
    expect(schema).not.toHaveProperty('potentialAction');
  });

  it('configures an absolute, correctly sized default social preview', () => {
    expect(DEFAULT_SOCIAL_IMAGE_PATH).toBe(
      '/og/planora-social-preview.png',
    );
    expect(DEFAULT_SOCIAL_IMAGE_URL).toBe(
      `${SITE_URL}${DEFAULT_SOCIAL_IMAGE_PATH}`,
    );
    expect(DEFAULT_SOCIAL_IMAGE_WIDTH).toBe(1200);
    expect(DEFAULT_SOCIAL_IMAGE_HEIGHT).toBe(630);
    expect(DEFAULT_SOCIAL_IMAGE_ALT).toContain('Planora');
  });

  it('builds destination geo, country, page, and offer data', () => {
    const destination = destinations[0];
    if (!destination) throw new Error('Expected at least one destination');

    const schema = buildDestinationJsonLd(destination);
    expect(schema['@type']).toBe('TouristDestination');
    expect(schema.geo).toMatchObject({
      '@type': 'GeoCoordinates',
      latitude: destination.lat,
      longitude: destination.lng,
    });
    expect(schema.containedInPlace.name).toBe(destination.country);
    expect(schema.subjectOf.url).toContain(`/destinations/${destination.id}`);
    expect(schema.makesOffer.length).toBeGreaterThan(0);
    expect(schema.makesOffer.every((offer) => offer.priceCurrency === 'USD')).toBe(
      true,
    );
  });
});
