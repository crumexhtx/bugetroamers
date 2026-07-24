import { SITE_URL } from './site';

export type OfferCategory = 'flights' | 'stays' | 'activities' | 'insurance';

export interface AffiliateOffer {
  id: string;
  category: OfferCategory;
  partner: string;
  label: string;
  description: string;
  /** Replace with real affiliate/deep links before launch. */
  href: string;
  cta: string;
}

export interface DestinationOffers {
  destinationId: string;
  offers: AffiliateOffer[];
}

function offerUrl(
  partner: string,
  category: OfferCategory,
  destinationId: string,
): string {
  const url = new URL('/out', SITE_URL);
  url.searchParams.set('partner', partner);
  url.searchParams.set('category', category);
  url.searchParams.set('destination', destinationId);
  url.searchParams.set('utm_source', 'budget_roamers');
  url.searchParams.set('utm_medium', 'affiliate');
  url.searchParams.set('utm_campaign', destinationId);
  return url.pathname + url.search;
}

/** Placeholder partner offers — swap hrefs for live affiliate programs. */
export function getDestinationOffers(
  destinationId: string,
  destinationName: string,
): AffiliateOffer[] {
  return [
    {
      id: `${destinationId}-flights`,
      category: 'flights',
      partner: 'flight-partner',
      label: `Flights to ${destinationName}`,
      description: 'Compare round-trip options and set a fare alert before you book.',
      href: offerUrl('flight-partner', 'flights', destinationId),
      cta: 'Compare flights',
    },
    {
      id: `${destinationId}-stays`,
      category: 'stays',
      partner: 'stay-partner',
      label: `Stays in ${destinationName}`,
      description: 'Browse hotels and apartments that fit your daily budget baseline.',
      href: offerUrl('stay-partner', 'stays', destinationId),
      cta: 'Find stays',
    },
    {
      id: `${destinationId}-activities`,
      category: 'activities',
      partner: 'activity-partner',
      label: `${destinationName} experiences`,
      description: 'Reserve popular tours and attraction tickets in advance.',
      href: offerUrl('activity-partner', 'activities', destinationId),
      cta: 'Browse activities',
    },
  ];
}

export const HOME_PARTNER_OFFERS: AffiliateOffer[] = [
  {
    id: 'home-insurance',
    category: 'insurance',
    partner: 'insurance-partner',
    label: 'Travel insurance',
    description: 'Protect flights, stays, and medical costs once your estimate looks right.',
    href: offerUrl('insurance-partner', 'insurance', 'home'),
    cta: 'Get a quote',
  },
  {
    id: 'home-flights',
    category: 'flights',
    partner: 'flight-partner',
    label: 'Flexible flight search',
    description: 'Use your estimate as a budget ceiling, then compare live fares.',
    href: offerUrl('flight-partner', 'flights', 'home'),
    cta: 'Search flights',
  },
];

export const NEWSLETTER_STORAGE_KEY = 'planora.newsletter';
export const NEWSLETTER_ENDPOINT = (import.meta.env.VITE_NEWSLETTER_ENDPOINT ??
  '') as string;
