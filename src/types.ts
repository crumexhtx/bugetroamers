export type TravelSeason = 'cheapest' | 'best' | 'busiest';

export interface Destination {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  dailyBudget: number;
  seasonality: Record<TravelSeason, number[]>;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
export type TransportMode = 'flight' | 'driving' | 'train' | 'water';

export interface Origin {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export interface TripLeg {
  id: string;
  destinationId: string;
  days: number;
}

export interface CustomCategory {
  id: string;
  name: string;
  amountUsd: number;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
}

export interface TripPlan {
  id: string;
  startDate: string;
  endDate: string;
  originId: string;
  transportMode: TransportMode;
  groupSize: number;
  displayCurrency: CurrencyCode;
  longDistanceTransportUsd: number;
  legs: TripLeg[];
  customCategories: CustomCategory[];
  expenses: Expense[];
  updatedAt: string;
}
