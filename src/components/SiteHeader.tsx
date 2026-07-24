import { NavLink } from 'react-router-dom';

export interface SiteHeaderProps {
  title: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function SiteHeader({
  title,
  theme,
  onToggleTheme,
}: SiteHeaderProps) {
  return (
    <header className="app-shell__brand">
      <div>
        <p className="app-shell__brand-mark">
          <NavLink to="/" className="app-shell__brand-link">
            Planora
          </NavLink>
        </p>
        <h1>{title}</h1>
      </div>
      <div className="app-shell__actions">
        <nav aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/destinations">Cities</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={theme === 'light'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? '☀ Light' : '☾ Dark'}
        </button>
      </div>
    </header>
  );
}

export default SiteHeader;
