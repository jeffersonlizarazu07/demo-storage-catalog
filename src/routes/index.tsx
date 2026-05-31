import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

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

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/catalogo',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Catalog />
          </Suspense>
        ),
      },
      {
        path: '/producto/:id',
        element: (
          <Suspense fallback={<PageFallback />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: '/contacto',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Contact />
          </Suspense>
        ),
      },
    ],
  },
]);
