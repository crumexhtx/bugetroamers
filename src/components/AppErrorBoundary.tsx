import * as Sentry from '@sentry/react';
import type { ReactNode } from 'react';

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ resetError }) => (
        <main className="static-page" role="alert">
          <h1>Something went wrong</h1>
          <p>
            The page hit an unexpected error. Your contact form details and
            budget values are not included in our error reports.
          </p>
          <div className="static-page__actions">
            <button type="button" onClick={resetError}>
              Try again
            </button>
            <button type="button" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </main>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
