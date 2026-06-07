import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { WarningIcon } from './Icons';
import { ErrorBoundary } from './ErrorBoundary';

/** Error fallback shown inside a route when the page component crashes. */
function RouteError() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <WarningIcon className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-primary dark:text-white">Algo salió mal</h2>
      <p className="mt-1 text-sm text-muted">
        Ocurrió un error al cargar esta página. Intenta de nuevo desde el inicio.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Volver al inicio
      </Link>
    </section>
  );
}

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

/**
 * Wraps a page with an ErrorBoundary whose fallback is the RouteError screen.
 *
 * This is a component (not an HOC) so Fast Refresh works correctly.
 */
export function RouteErrorBoundary({ children }: RouteErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={<RouteError />}
      onError={(error) => {
        if (import.meta.env.DEV) console.error('[Route Error]', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
