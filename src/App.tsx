import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { HomePage } from './pages/HomePage';
import { DestinationPage } from './pages/DestinationPage';
import { DestinationsIndexPage } from './pages/DestinationsIndexPage';
import { AboutPage, ContactPage } from './pages/AboutContactPages';
import { PartnersPage } from './pages/PartnersPage';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    localStorage.getItem('budget-roamers.theme') === 'light' ? 'light' : 'dark',
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('budget-roamers.theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <SiteHeader
        title="Estimate your trip cost before you book"
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
        }
      />
      <Routes>
        <Route path="/" element={<HomePage theme={theme} />} />
        <Route path="/destinations" element={<DestinationsIndexPage />} />
        <Route
          path="/destinations/:destinationId"
          element={<DestinationPage theme={theme} />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
