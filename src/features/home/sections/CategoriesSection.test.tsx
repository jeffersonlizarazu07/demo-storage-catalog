import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CategoriesSection } from './CategoriesSection';

// Mockeamos el servicio para no depender de fetch
vi.mock('../../../shared/services/productService', () => ({
  fetchCategories: vi.fn(),
}));

import { fetchCategories } from '../../../shared/services/productService';

/**
 * Mock de IntersectionObserver
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
        [{ isIntersecting: inView } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    },
    observe,
  };
}

const MOCK_CATEGORIES = ['Electrónica', 'Joyería', 'Ropa Hombre', 'Ropa Mujer'];

describe('CategoriesSection', () => {
  let mockIO: ReturnType<typeof createMockIntersectionObserver>;

  beforeEach(() => {
    mockIO = createMockIntersectionObserver();
    vi.stubGlobal('IntersectionObserver', mockIO.MockIO);
    vi.mocked(fetchCategories).mockResolvedValue(MOCK_CATEGORIES);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  function renderSection() {
    return render(
      <MemoryRouter>
        <CategoriesSection />
      </MemoryRouter>,
    );
  }

  describe('loading state', () => {
    it('should render the heading during loading', () => {
      renderSection();
      expect(screen.getByText('Categorías')).toBeInTheDocument();
    });

    it('should render skeleton placeholders while loading', () => {
      renderSection();
      // 4 skeleton cards con animate-pulse
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });

    it('should not render category links yet', () => {
      renderSection();
      expect(screen.queryByText('Electrónica')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('should render all 4 category cards after loading', async () => {
      renderSection();

      expect(await screen.findByText('Electrónica')).toBeInTheDocument();
      expect(screen.getByText('Joyería')).toBeInTheDocument();
      expect(screen.getByText('Ropa Hombre')).toBeInTheDocument();
      expect(screen.getByText('Ropa Mujer')).toBeInTheDocument();
    });

    it('should render descriptions for each category', async () => {
      renderSection();

      expect(await screen.findByText('Dispositivos y gadgets tecnológicos')).toBeInTheDocument();
      expect(screen.getByText('Joyas y accesorios de calidad')).toBeInTheDocument();
      expect(screen.getByText('Moda y estilo para caballero')).toBeInTheDocument();
      expect(screen.getByText('Moda y estilo para dama')).toBeInTheDocument();
    });

    it('should link each category to filtered catalog page', async () => {
      renderSection();

      const electronica = await screen.findByText('Electrónica');
      const link = electronica.closest('a');
      expect(link).toHaveAttribute('href', '/catalogo?categoria=electrónica');
    });

    it('should not have skeleton placeholders after loading', async () => {
      renderSection();

      await screen.findByText('Electrónica');

      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });
  });

  describe('empty state', () => {
    it('should return null when categories array is empty after loading', async () => {
      vi.mocked(fetchCategories).mockResolvedValue([]);

      const { container } = renderSection();

      // Esperamos a que el efecto se complete
      await vi.waitFor(() => {
        expect(fetchCategories).toHaveBeenCalledTimes(1);
      });

      // Pequeña espera para que se procese el estado
      await vi.waitFor(() => {
        expect(screen.queryByText('Categorías')).not.toBeInTheDocument();
      });

      expect(container.innerHTML).toBe('');
    });
  });

  describe('error state', () => {
    it('should show error message when fetch fails', async () => {
      vi.mocked(fetchCategories).mockRejectedValue(new Error('Network error'));

      renderSection();

      expect(await screen.findByText(/no pudimos cargar las categorías/i)).toBeInTheDocument();
    });

    it('should show a retry button when fetch fails', async () => {
      vi.mocked(fetchCategories).mockRejectedValue(new Error('Network error'));

      renderSection();

      expect(await screen.findByRole('button', { name: /intentar de nuevo/i })).toBeInTheDocument();
    });

    it('should NOT render category cards when in error state', async () => {
      vi.mocked(fetchCategories).mockRejectedValue(new Error('Network error'));

      renderSection();

      await screen.findByText(/no pudimos cargar las categorías/i);

      expect(screen.queryByText('Electrónica')).not.toBeInTheDocument();
      expect(screen.queryByText('Joyería')).not.toBeInTheDocument();
    });

    it('should still show the section heading when in error state', async () => {
      vi.mocked(fetchCategories).mockRejectedValue(new Error('Network error'));

      renderSection();

      expect(await screen.findByText('Categorías')).toBeInTheDocument();
    });

    it('should retry fetchCategories when retry button is clicked', async () => {
      // First call fails, second succeeds
      vi.mocked(fetchCategories)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(MOCK_CATEGORIES);

      renderSection();
      const user = userEvent.setup();

      // Wait for error state
      const retryButton = await screen.findByRole('button', { name: /intentar de nuevo/i });

      // Click retry
      await user.click(retryButton);

      // Categories should appear after successful retry
      expect(await screen.findByText('Electrónica')).toBeInTheDocument();
      expect(screen.getByText('Joyería')).toBeInTheDocument();
      expect(fetchCategories).toHaveBeenCalledTimes(2);
    });
  });
});
