import { PageMeta } from '../components/PageMeta';
import { TripPlanner } from '../components/TripPlanner';

export interface HomePageProps {
  theme: 'light' | 'dark';
}

export function HomePage({ theme }: HomePageProps) {
  return (
    <>
      <PageMeta
        title="Budget Roamers — Trip Cost Estimator"
        description="Estimate your trip cost before you book. Compare destinations, dates, transport, and daily budgets with Budget Roamers."
        canonicalPath="/"
      />
      <div className="page-intro planner-panel">
        <p className="cost-summary__eyebrow">General trip calculator</p>
        <h2>Plan any destination</h2>
        <p>
          Use the calculator below for a flexible multi-city estimate, or open a
          dedicated city page for attractions, must-try dishes, and a calculator
          locked to that destination.
        </p>
      </div>
      <TripPlanner mode="general" theme={theme} />
    </>
  );
}

export default HomePage;
