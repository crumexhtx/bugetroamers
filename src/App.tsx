import { useMemo, useState } from 'react';
import destinationsData from './data/destinations.json';
import {
  BudgetTravelMap,
  type Destination,
} from './components/BudgetTravelMap';
import { TripControls } from './components/TripControls';
import { CostSummary } from './components/CostSummary';
import {
  calculateTripCost,
  type TravelTier,
} from './utils/costEngine';

const destinations = destinationsData as Destination[];

export default function App() {
  const [selectedDestinationId, setSelectedDestinationId] = useState(
    destinations[0].id,
  );
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [groupSize, setGroupSize] = useState(2);
  const [travelTier, setTravelTier] = useState<TravelTier>('midrange');

  const selectedDestination =
    destinations.find((destination) => destination.id === selectedDestinationId) ??
    destinations[0];

  const costs = useMemo(
    () =>
      calculateTripCost({
        destination: selectedDestination,
        numberOfDays,
        groupSize,
        travelTier,
      }),
    [selectedDestination, numberOfDays, groupSize, travelTier],
  );

  return (
    <div className="app-shell">
      <header className="app-shell__brand">
        <p className="app-shell__brand-mark">Budget Roamers</p>
        <h1>Estimate your trip cost before you book</h1>
      </header>

      <div className="app-layout">
        <section className="app-layout__map" aria-label="Destination map">
          <BudgetTravelMap
            onSelectDestination={setSelectedDestinationId}
          />
        </section>

        <aside className="app-layout__dashboard" aria-label="Trip cost planner">
          <CostSummary
            destination={selectedDestination}
            numberOfDays={numberOfDays}
            groupSize={groupSize}
            travelTier={travelTier}
            costs={costs}
          />
          <TripControls
            numberOfDays={numberOfDays}
            groupSize={groupSize}
            travelTier={travelTier}
            onNumberOfDaysChange={setNumberOfDays}
            onGroupSizeChange={setGroupSize}
            onTravelTierChange={setTravelTier}
          />
        </aside>
      </div>
    </div>
  );
}
