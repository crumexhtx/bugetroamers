import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { initializeClientObservability } from './utils/observability';
import './index.css';

initializeClientObservability();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
