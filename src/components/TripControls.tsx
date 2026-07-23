import type { TravelTier } from '../utils/costEngine';

export interface TripControlsProps {
  numberOfDays: number;
  groupSize: number;
  travelTier: TravelTier;
  onNumberOfDaysChange: (days: number) => void;
  onGroupSizeChange: (size: number) => void;
  onTravelTierChange: (tier: TravelTier) => void;
}

const TIER_OPTIONS: { value: TravelTier; label: string; hint: string }[] = [
  { value: 'budget', label: 'Budget', hint: 'Hostels & street food' },
  { value: 'midrange', label: 'Midrange', hint: 'Private rooms & cafés' },
  { value: 'luxury', label: 'Luxury', hint: 'Boutique stays & dining' },
];

export function TripControls({
  numberOfDays,
  groupSize,
  travelTier,
  onNumberOfDaysChange,
  onGroupSizeChange,
  onTravelTierChange,
}: TripControlsProps) {
  return (
    <section className="trip-controls" aria-labelledby="trip-controls-heading">
      <header className="trip-controls__header">
        <h2 id="trip-controls-heading">Adjust your estimate</h2>
        <p>Change days, group size, or travel style to update the total.</p>
      </header>

      <div className="trip-controls__fields">
        <label className="trip-controls__field">
          <span className="trip-controls__label-row">
            <span>Number of days</span>
            <output htmlFor="number-of-days">{numberOfDays}</output>
          </span>
          <input
            id="number-of-days"
            type="range"
            min={1}
            max={30}
            step={1}
            value={numberOfDays}
            onChange={(event) =>
              onNumberOfDaysChange(Number(event.target.value))
            }
          />
        </label>

        <label className="trip-controls__field">
          <span className="trip-controls__label-row">
            <span>Group size</span>
            <output htmlFor="group-size">{groupSize}</output>
          </span>
          <input
            id="group-size"
            type="range"
            min={1}
            max={8}
            step={1}
            value={groupSize}
            onChange={(event) => onGroupSizeChange(Number(event.target.value))}
          />
        </label>

        <fieldset className="trip-controls__tiers">
          <legend>Travel tier</legend>
          <div
            className="trip-controls__tier-options"
            role="radiogroup"
            aria-label="Travel tier"
          >
            {TIER_OPTIONS.map((option) => {
              const selected = travelTier === option.value;
              return (
                <label
                  key={option.value}
                  className={[
                    'trip-controls__tier',
                    selected ? 'is-selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <input
                    type="radio"
                    name="travel-tier"
                    value={option.value}
                    checked={selected}
                    onChange={() => onTravelTierChange(option.value)}
                  />
                  <span className="trip-controls__tier-label">
                    {option.label}
                  </span>
                  <span className="trip-controls__tier-hint">{option.hint}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}

export default TripControls;
