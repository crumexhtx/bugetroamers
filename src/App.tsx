import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { SiteHeader } from './components/SiteHeader';
import { HomePage } from './pages/HomePage';
import { DestinationPage } from './pages/DestinationPage';
import { DestinationsIndexPage } from './pages/DestinationsIndexPage';
import { AboutPage, ContactPage } from './pages/AboutContactPages';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SiteFooter } from './components/SiteFooter';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme =
      localStorage.getItem('planora.theme') ??
      localStorage.getItem('budget-roamers.theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('planora.theme', theme);
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
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}
