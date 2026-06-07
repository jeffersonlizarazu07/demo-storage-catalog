import { Link } from 'react-router-dom';

import { WarningIcon } from './Icons';

/** Catch-all 404 page for undefined routes. */
export function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
        <WarningIcon className="h-7 w-7 text-amber-500" />
      </div>
      <h1 className="text-3xl font-bold text-primary dark:text-white">Página no encontrada</h1>
      <p className="mt-2 text-muted">La página que buscas no existe o ha sido movida.</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
