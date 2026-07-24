import type { Destination } from '../types';
import { destinationDescriptions } from '../data/destinationDescriptions';
import { destinationExplore } from '../data/destinationExplore';
import { destinationDishes } from '../data/destinationDishes';
import { SITE_NAME, SITE_URL } from '../config/site';

export function buildDestinationJsonLd(destination: Destination) {
  const explore = destinationExplore[destination.id];
  const dishes = destinationDishes[destination.id] ?? [];
  const description =
    destinationDescriptions[destination.id] ??
    `Trip cost estimate for ${destination.name}, ${destination.country}.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description,
    url: `${SITE_URL}/destinations/${destination.id}`,
    touristType: explore?.bestFor,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: destination.lat,
      longitude: destination.lng,
    },
    containedInPlace: {
      '@type': 'Country',
      name: destination.country,
    },
    makesOffer: dishes.map((dish) => ({
      '@type': 'Offer',
      name: dish.name,
      description: dish.blurb,
      price: dish.averagePriceUsd,
      priceCurrency: 'USD',
    })),
    subjectOf: {
      '@type': 'WebPage',
      name: `${destination.name} Trip Cost Estimate — ${SITE_NAME}`,
      url: `${SITE_URL}/destinations/${destination.id}`,
    },
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
  };
}
