import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '../shared/layouts/MainLayout';
import { Home } from '../features/home/Home';
import { Catalog } from '../features/catalog/Catalog';
import { ProductDetail } from '../features/product/ProductDetail';
import { Contact } from '../features/contact/Contact';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/catalogo', element: <Catalog /> },
      { path: '/producto/:id', element: <ProductDetail /> },
      { path: '/contacto', element: <Contact /> },
    ],
  },
]);
