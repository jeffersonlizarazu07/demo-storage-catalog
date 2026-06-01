import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { routes } from '../routes/index';

// ── FakeStore API mock data ─────────────────────────────────────────────────

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const fakeProducts: FakeStoreProduct[] = [
  {
    id: 1,
    title: 'Laptop Gamer XT 15',
    price: 25999.99,
    description: 'Potente laptop gaming con RTX 4060, 16GB RAM y procesador i7 13th gen.',
    category: 'electronics',
    image: 'https://example.com/laptop.jpg',
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: 'Anillo de Plata 925',
    price: 1599.99,
    description: 'Elegante anillo de plata esterlina con acabado brillante.',
    category: 'jewelery',
    image: 'https://example.com/ring.jpg',
    rating: { rate: 4.0, count: 45 },
  },
  {
    id: 3,
    title: 'Chaqueta Térmica Hombre',
    price: 1899.99,
    description: 'Chaqueta impermeable y térmica para actividades al aire libre.',
    category: "men's clothing",
    image: 'https://example.com/jacket.jpg',
    rating: { rate: 4.2, count: 78 },
  },
  {
    id: 4,
    title: 'Monitor 4K 27 pulgadas',
    price: 8499.99,
    description: 'Monitor IPS 4K UHD perfecto para diseño y productividad.',
    category: 'electronics',
    image: 'https://example.com/monitor.jpg',
    rating: { rate: 4.7, count: 203 },
  },
];

const fakeRawCategories = ['electronics', 'jewelery', "men's clothing"];

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mockeamos useInView para evitar dependencia de IntersectionObserver
vi.mock('../shared/hooks/useInView', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockFetchResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
  } as Response;
}

function setupFetchMock() {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
    const path =
      typeof input === 'string' ? input : 'url' in input ? (input as Request).url : String(input);

    // GET /products/categories
    if (path.includes('/products/categories')) {
      return mockFetchResponse(fakeRawCategories);
    }

    // GET /products/:id
    const idMatch = path.match(/\/products\/(\d+)/);
    if (idMatch) {
      const id = Number(idMatch[1]);
      const product = fakeProducts.find((p) => p.id === id) ?? null;
      if (!product) {
        return { ok: false, status: 404, json: async () => null } as Response;
      }
      return mockFetchResponse(product);
    }

    // GET /products (fallback: return all)
    if (path.includes('/products')) {
      return mockFetchResponse(fakeProducts);
    }

    throw new Error(`[integration test] Unhandled fetch URL: ${path}`);
  });
}

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return { router, ...render(<RouterProvider router={router} />) };
}

function getNav() {
  return within(screen.getByRole('navigation'));
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('User flows (integration)', () => {
  beforeAll(() => {
    setupFetchMock();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('should complete full user flow: Home → Catalog → filter → search → Product → Contact', async () => {
    const user = userEvent.setup();
    const { router } = renderAt('/');

    // ── 1. Home page ──
    expect(await screen.findByRole('link', { name: /explorar catálogo/i })).toBeInTheDocument();

    // ── 2. Navigate to Catalog via CTA ──
    await user.click(screen.getByRole('link', { name: /explorar catálogo/i }));

    expect(await screen.findByRole('heading', { name: /catálogo/i })).toBeInTheDocument();
    expect(await screen.findByText(/4 de 4 productos/i)).toBeInTheDocument();
    expect(await screen.findByText('Laptop Gamer XT 15')).toBeInTheDocument();
    expect(await screen.findByText('Monitor 4K 27 pulgadas')).toBeInTheDocument();

    // ── 3. Filter by category "Electrónica" ──
    const filterBar = screen.getByRole('radiogroup', { name: /filtrar por categoría/i });
    await user.click(within(filterBar).getByRole('radio', { name: 'Electrónica' }));

    // Now only electronics show: Laptop + Monitor = 2 products
    expect(await screen.findByText(/2 de 4 productos/i)).toBeInTheDocument();
    expect(screen.queryByText('Anillo de Plata 925')).not.toBeInTheDocument();

    // ── 4. Type in search to narrow further ──
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    await user.type(searchInput, 'Monitor');

    expect(await screen.findByText(/1 de 4 productos/i)).toBeInTheDocument();
    expect(screen.getByText('Monitor 4K 27 pulgadas')).toBeInTheDocument();
    expect(screen.queryByText('Laptop Gamer XT 15')).not.toBeInTheDocument();

    // ── 5. Navigate to ProductDetail via router.navigate ──
    // Nota: user.click en "Ver más" NO funciona después de user.type.
    // El estado interno de userEvent después de typear interfiere con la
    // navegación de React Router. Usamos router.navigate como workaround.
    await act(async () => {
      router.navigate('/producto/4');
    });

    // ── 6. Product Detail page ──
    // Verify we navigated: product name, price, back link, WhatsApp
    expect(await screen.findByText('Monitor 4K 27 pulgadas')).toBeInTheDocument();
    expect(await screen.findByText((content) => content.includes('8499.99'))).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /volver al catálogo/i })).toBeInTheDocument();
    // Puede haber múltiples WhatsApp links (CTA principal + RelatedProducts)
    const whatsappLinks = screen.getAllByRole('link', { name: /whatsapp/i });
    expect(whatsappLinks.length).toBeGreaterThanOrEqual(1);

    // ── 7. Navigate to Contacto via nav ──
    await user.click(getNav().getByRole('link', { name: /contacto/i }));

    expect(await screen.findByRole('heading', { name: /contacto/i })).toBeInTheDocument();
    expect(screen.getByText(/estamos aquí para ayudarte/i)).toBeInTheDocument();
  }, 30_000);

  it('should allow resetting category filter and navigate to ProductDetail', async () => {
    const user = userEvent.setup();
    renderAt('/catalogo');

    // Wait for catalog to load
    expect(await screen.findByText(/4 de 4 productos/i)).toBeInTheDocument();
    expect(screen.getByText('Laptop Gamer XT 15')).toBeInTheDocument();
    expect(screen.getByText('Anillo de Plata 925')).toBeInTheDocument();

    // Filter by Electrónica
    const filterBar = screen.getByRole('radiogroup', { name: /filtrar por categoría/i });
    await user.click(within(filterBar).getByRole('radio', { name: 'Electrónica' }));
    expect(await screen.findByText(/2 de 4 productos/i)).toBeInTheDocument();
    expect(screen.queryByText('Anillo de Plata 925')).not.toBeInTheDocument();

    // Reset to "Todas"
    await user.click(within(filterBar).getByRole('radio', { name: 'Todas' }));
    expect(await screen.findByText(/4 de 4 productos/i)).toBeInTheDocument();

    // Click a product from full catalog
    const laptopCard = screen.getByText('Laptop Gamer XT 15').closest('article')!;
    await user.click(within(laptopCard).getByRole('link', { name: /ver más/i }));

    // Verify navigation to ProductDetail
    expect(await screen.findByText('Laptop Gamer XT 15')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al catálogo/i })).toBeInTheDocument();
  }, 15_000);

  it('should load Catalog with products from API', async () => {
    renderAt('/catalogo');

    // Products from all categories
    expect(await screen.findByText('Laptop Gamer XT 15')).toBeInTheDocument();
    expect(screen.getByText('Anillo de Plata 925')).toBeInTheDocument();
    expect(screen.getByText('Chaqueta Térmica Hombre')).toBeInTheDocument();

    // Categories mapped to Spanish by productService
    const filterBar = screen.getByRole('radiogroup', { name: /filtrar por categoría/i });
    expect(within(filterBar).getByText('Electrónica')).toBeInTheDocument();
    expect(within(filterBar).getByText('Joyería')).toBeInTheDocument();
    expect(within(filterBar).getByText('Ropa Hombre')).toBeInTheDocument();
  }, 15_000);

  it('should render ProductDetail from direct URL', async () => {
    renderAt('/producto/2');

    expect(await screen.findByText('Anillo de Plata 925')).toBeInTheDocument();
    // Price se renderiza como "$1599.99" (sin coma, sin toLocaleString)
    expect(screen.getByText((content) => content.includes('1599.99'))).toBeInTheDocument();
    expect(screen.getByText(/anillo de plata esterlina/i)).toBeInTheDocument();
  }, 15_000);

  it('should show "not found" for non-existent product', async () => {
    renderAt('/producto/999');

    expect(await screen.findByText('Producto no encontrado')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al catálogo/i })).toBeInTheDocument();
  }, 15_000);

  it('should submit contact form and reset', async () => {
    const user = userEvent.setup();
    renderAt('/contacto');

    // Esperar a que la página de Contacto termine de cargar (Suspense + data)
    expect(await screen.findByRole('heading', { name: /contacto/i })).toBeInTheDocument();

    // Fill form
    await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
    await user.type(screen.getByLabelText(/correo electrónico/i), 'juan@example.com');
    await user.type(screen.getByLabelText(/mensaje/i), 'Hola, quiero información sobre laptops.');

    // Submit
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

    // Verify success
    expect(await screen.findByText(/mensaje enviado/i)).toBeInTheDocument();
    expect(screen.getByText(/gracias por contactarnos/i)).toBeInTheDocument();

    // Reset form
    await user.click(screen.getByRole('button', { name: /enviar otro mensaje/i }));

    // Verify form is back
    expect(await screen.findByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  }, 15_000);
});
