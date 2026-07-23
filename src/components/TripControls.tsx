import { MONTH_LABELS } from '../utils/costEngine';
import type { Destination, TravelSeason } from '../types';

export interface TripControlsProps {
  groupSize: number;
  travelSeason: TravelSeason;
  seasonality: Destination['seasonality'];
  onGroupSizeChange: (size: number) => void;
}

const SEASON_OPTIONS: { value: TravelSeason; label: string; hint: string }[] = [
  { value: 'cheapest', label: 'Cheapest', hint: 'Lowest typical airfares' },
  { value: 'best', label: 'Best time', hint: 'Balanced weather and demand' },
  { value: 'busiest', label: 'Busiest', hint: 'Highest demand and airfares' },
];

export function TripControls({
  groupSize,
  travelSeason,
  seasonality,
  onGroupSizeChange,
}: TripControlsProps) {
  return (
    <section className="trip-controls" aria-labelledby="trip-controls-heading">
      <header className="trip-controls__header">
        <h2 id="trip-controls-heading">Adjust your estimate</h2>
        <p>Your dates automatically determine the expected flight season.</p>
      </header>

      <div className="trip-controls__fields">
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
          <legend>When to fly</legend>
          <div
            className="trip-controls__tier-options"
            aria-label="Destination travel seasons"
          >
            {SEASON_OPTIONS.map((option) => {
              const selected = travelSeason === option.value;
              const months = seasonality[option.value]
                .map((month) => MONTH_LABELS[month - 1])
                .join(', ');
              return (
                <div
                  key={option.value}
                  className={[
                    'trip-controls__tier',
                    selected ? 'is-selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={selected ? 'true' : undefined}
                >
                  <span className="trip-controls__tier-label">
                    {option.label}
                  </span>
                  <span className="trip-controls__tier-hint">{option.hint}</span>
                  <span className="trip-controls__tier-months">{months}</span>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}

export default TripControls;
