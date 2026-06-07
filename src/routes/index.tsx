import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../shared/layouts/MainLayout';
import { NotFoundPage } from '../shared/components/NotFoundPage';
import { PageFallback } from '../shared/components/PageFallback';
import { RouteErrorBoundary } from '../shared/components/RouteErrorBoundary';

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

export const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <RouteErrorBoundary>
              <Home />
            </RouteErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: '/catalogo',
        element: (
          <Suspense fallback={<PageFallback />}>
            <RouteErrorBoundary>
              <Catalog />
            </RouteErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: '/producto/:id',
        element: (
          <Suspense fallback={<PageFallback />}>
            <RouteErrorBoundary>
              <ProductDetail />
            </RouteErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: '/contacto',
        element: (
          <Suspense fallback={<PageFallback />}>
            <RouteErrorBoundary>
              <Contact />
            </RouteErrorBoundary>
          </Suspense>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
