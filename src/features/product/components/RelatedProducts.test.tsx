import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RelatedProducts } from './RelatedProducts';
import type { Product } from '../../../shared/interfaces/product.interface';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Teclado Mecánico',
    price: 89.99,
    category: 'Accesorios',
    image: 'https://example.com/teclado.jpg',
    description: 'Teclado mecánico RGB',
    brand: 'Logitech',
  },
  {
    id: 2,
    name: 'Mouse Gamer',
    price: 59.99,
    category: 'Accesorios',
    image: 'https://example.com/mouse.jpg',
    description: 'Mouse ergonómico',
  },
];

/**
 * Mock de IntersectionObserver para que useInView reciba el callback y
 * podamos dispararlo manualmente.
 */
function createMockIntersectionObserver() {
  let callback: IntersectionObserverCallback = () => {};

  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockIO {
    constructor(cb: IntersectionObserverCallback) {
      callback = cb;
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }

  return {
    MockIO,
    triggerInView(inView: boolean) {
      callback(
        [{ isIntersecting: inView } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    },
    observe,
  };
}

describe('RelatedProducts', () => {
  let mockIO: ReturnType<typeof createMockIntersectionObserver>;

  beforeEach(() => {
    mockIO = createMockIntersectionObserver();
    vi.stubGlobal('IntersectionObserver', mockIO.MockIO);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render heading and product names', () => {
    render(
      <MemoryRouter>
        <RelatedProducts products={mockProducts} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Productos relacionados')).toBeInTheDocument();
    expect(screen.getByText('Teclado Mecánico')).toBeInTheDocument();
    expect(screen.getByText('Mouse Gamer')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(
      <MemoryRouter>
        <RelatedProducts products={mockProducts} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Otros productos en la misma categoría')).toBeInTheDocument();
  });

  it('should return null when products array is empty', () => {
    const { container } = render(
      <MemoryRouter>
        <RelatedProducts products={[]} />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Productos relacionados')).not.toBeInTheDocument();
    expect(container.innerHTML).toBe('');
  });

  it('should render each product as a link to its detail page', () => {
    render(
      <MemoryRouter>
        <RelatedProducts products={mockProducts} />
      </MemoryRouter>,
    );

    // ProductCard renders a Link for each product — expect 2 links (image + name each)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(2);
  });
});
