import { HOME_PARTNER_OFFERS, getDestinationOffers } from '../config/monetization';
import type { AffiliateOffer } from '../config/monetization';

export interface RevenueOffersProps {
  destinationId?: string;
  destinationName?: string;
  heading?: string;
}

function OfferCard({ offer }: { offer: AffiliateOffer }) {
  return (
    <a
      className="revenue-offer"
      href={offer.href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      data-partner={offer.partner}
      data-category={offer.category}
    >
      <span className="revenue-offer__category">{offer.category}</span>
      <strong>{offer.label}</strong>
      <p>{offer.description}</p>
      <span className="revenue-offer__cta">{offer.cta}</span>
    </a>
  );
}

export function RevenueOffers({
  destinationId,
  destinationName,
  heading = 'Book with confidence',
}: RevenueOffersProps) {
  const offers =
    destinationId && destinationName
      ? getDestinationOffers(destinationId, destinationName)
      : HOME_PARTNER_OFFERS;

  return (
    <section className="revenue-offers planner-panel" aria-labelledby="revenue-offers-heading">
      <header>
        <p className="cost-summary__eyebrow">Partner picks</p>
        <h2 id="revenue-offers-heading">{heading}</h2>
        <p className="planner-help">
          Use your estimate as a budget ceiling, then compare booking options.
          We may earn a commission if you book through these partner links.
        </p>
      </header>
      <div className="revenue-offers__grid">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

export default RevenueOffers;
