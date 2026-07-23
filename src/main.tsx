import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BudgetTravelMap } from './components/BudgetTravelMap';
import './index.css';

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <main className="app">
      <header className="app__header">
        <h1>Budget Roamers</h1>
        <p>
          {selectedId
            ? `Selected destination: ${selectedId}`
            : 'Select a destination pin on the map'}
        </p>
      </header>
      <BudgetTravelMap
        className="app__map"
        onSelectDestination={setSelectedId}
      />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
