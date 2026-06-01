import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { WarningIcon } from '../shared/components/Icons';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { MainLayout } from '../shared/layouts/MainLayout';

const Home = lazy(() => import('../features/home/Home').then((m) => ({ default: m.Home })));
const Catalog = lazy(() =>
  import('../features/catalog/Catalog').then((m) => ({ default: m.Catalog })),
);
const ProductDetail = lazy(() =>
  import('../features/product/ProductDetail').then((m) => ({
    default: m.ProductDetail,
  })),
);
const Contact = lazy(() =>
  import('../features/contact/Contact').then((m) => ({ default: m.Contact })),
);

function PageFallback() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-muted">Cargando...</p>
      </div>
    </div>
  );
}

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

function withErrorBoundary(page: React.ReactNode) {
  return (
    <ErrorBoundary
      fallback={<RouteError />}
      onError={(error) => console.error('[Route Error]', error)}
    >
      {page}
    </ErrorBoundary>
  );
}

export const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<PageFallback />}>{withErrorBoundary(<Home />)}</Suspense>,
      },
      {
        path: '/catalogo',
        element: <Suspense fallback={<PageFallback />}>{withErrorBoundary(<Catalog />)}</Suspense>,
      },
      {
        path: '/producto/:id',
        element: (
          <Suspense fallback={<PageFallback />}>{withErrorBoundary(<ProductDetail />)}</Suspense>
        ),
      },
      {
        path: '/contacto',
        element: <Suspense fallback={<PageFallback />}>{withErrorBoundary(<Contact />)}</Suspense>,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
