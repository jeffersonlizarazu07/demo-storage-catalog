import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Catalog } from './Catalog';
import type { Product } from '../../shared/interfaces/product.interface';

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Gamer',
    price: 25000,
    category: 'Laptops',
    image: '/images/laptop.jpg',
    description: 'Una laptop potente para gaming',
    brand: 'TechBrand',
  },
  {
    id: 2,
    name: 'Mouse Inalámbrico',
    price: 800,
    category: 'Accesorios',
    image: '/images/mouse.jpg',
    description: 'Mouse ergonómico con batería de larga duración',
    brand: 'ClickPro',
  },
];

const mockCategories = ['Todas', 'Laptops', 'Accesorios'];

// ── Mocks ─────────────────────────────────────────────────────────────────────

// Mockeamos useInView para que inView=true por defecto
vi.mock('../../shared/hooks/useInView', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

// Mockeamos useProductFilters para controlar loading/error/success
const mockUseProductFilters = vi.fn();
vi.mock('./hooks/useProductFilters', () => ({
  useProductFilters: () => mockUseProductFilters(),
}));

describe('Catalog page', () => {
  beforeEach(() => {
    // Reset del mock antes de cada test
    mockUseProductFilters.mockReset();
  });

  function renderCatalog() {
    return render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>,
    );
  }

  /* ── Loading state ── */

  describe('loading state', () => {
    beforeEach(() => {
      mockUseProductFilters.mockReturnValue({
        searchQuery: '',
        setSearchQuery: vi.fn(),
        selectedCategory: 'Todas',
        setCategory: vi.fn(),
        categories: [],
        filteredProducts: [],
        totalCount: 0,
        loading: true,
        error: null,
      });
    });

    it('should show skeleton placeholders while loading', () => {
      renderCatalog();
      // El skeleton tiene múltiples divs con animate-pulse
      const skeleton = document.querySelectorAll('.animate-pulse');
      expect(skeleton.length).toBeGreaterThanOrEqual(1);
    });
  });

  /* ── Error state ── */

  describe('error state', () => {
    beforeEach(() => {
      mockUseProductFilters.mockReturnValue({
        searchQuery: '',
        setSearchQuery: vi.fn(),
        selectedCategory: 'Todas',
        setCategory: vi.fn(),
        categories: [],
        filteredProducts: [],
        totalCount: 0,
        loading: false,
        error: 'Error de conexión',
      });
    });

    it('should show error heading', () => {
      renderCatalog();
      expect(
        screen.getByRole('heading', { name: /error al cargar productos/i }),
      ).toBeInTheDocument();
    });

    it('should show the error message', () => {
      renderCatalog();
      expect(screen.getByText('Error de conexión')).toBeInTheDocument();
    });

    it('should show a retry button', () => {
      renderCatalog();
      expect(screen.getByRole('button', { name: /intentar de nuevo/i })).toBeInTheDocument();
    });

    it('should call window.location.reload when retry button is clicked', async () => {
      const user = userEvent.setup();
      const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

      renderCatalog();

      await user.click(screen.getByRole('button', { name: /intentar de nuevo/i }));

      expect(reloadSpy).toHaveBeenCalledTimes(1);
      reloadSpy.mockRestore();
    });

    it('should NOT show the catalog content', () => {
      renderCatalog();
      expect(screen.queryByRole('heading', { name: /catálogo/i })).not.toBeInTheDocument();
      // "Error al cargar productos" contiene "productos" — aserción más específica
      expect(screen.queryByText(/2 de 2 productos/i)).not.toBeInTheDocument();
    });
  });

  /* ── Success state ── */

  describe('success state', () => {
    beforeEach(() => {
      mockUseProductFilters.mockReturnValue({
        searchQuery: '',
        setSearchQuery: vi.fn(),
        selectedCategory: 'Todas',
        setCategory: vi.fn(),
        categories: mockCategories,
        filteredProducts: mockProducts,
        totalCount: 2,
        loading: false,
        error: null,
      });
    });

    it('should render the page title', () => {
      renderCatalog();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Catálogo');
    });

    it('should show product count', () => {
      renderCatalog();
      expect(screen.getByText(/2 de 2 productos/i)).toBeInTheDocument();
    });

    it('should render SearchBar', () => {
      renderCatalog();
      expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument();
    });

    it('should render FilterBar with categories', () => {
      renderCatalog();
      // "Laptops" aparece también como badge en las tarjetas — usar radiogroup para acotar
      const filterBar = screen.getByRole('radiogroup', { name: /filtrar por categoría/i });
      expect(within(filterBar).getByText('Laptops')).toBeInTheDocument();
      expect(within(filterBar).getByText('Accesorios')).toBeInTheDocument();
    });

    it('should render product cards', () => {
      renderCatalog();
      expect(screen.getByText('Laptop Gamer')).toBeInTheDocument();
      expect(screen.getByText('Mouse Inalámbrico')).toBeInTheDocument();
    });

    it('should show product prices', () => {
      renderCatalog();
      // Los precios usualmente tienen formato $25,000
      expect(screen.getByText(/\$25/i)).toBeInTheDocument();
      expect(screen.getByText(/\$80/i)).toBeInTheDocument();
    });
  });

  /* ── Interactions ── */

  describe('interactions', () => {
    const mockSetSearchQuery = vi.fn();
    const mockSetCategory = vi.fn();

    beforeEach(() => {
      mockSetSearchQuery.mockClear();
      mockSetCategory.mockClear();
      mockUseProductFilters.mockReturnValue({
        searchQuery: '',
        setSearchQuery: mockSetSearchQuery,
        selectedCategory: 'Todas',
        setCategory: mockSetCategory,
        categories: mockCategories,
        filteredProducts: mockProducts,
        totalCount: 2,
        loading: false,
        error: null,
      });
    });

    it('should call setSearchQuery when typing in search bar', async () => {
      const user = userEvent.setup();
      renderCatalog();

      const searchInput = screen.getByPlaceholderText(/buscar/i);
      await user.type(searchInput, 'lap');

      // user.type escribe carácter por carácter. Como searchQuery es siempre ''
      // (el mock no actualiza estado), cada keystroke envía 1 solo carácter.
      expect(mockSetSearchQuery).toHaveBeenCalledTimes(3);
      expect(mockSetSearchQuery).toHaveBeenNthCalledWith(1, 'l');
      expect(mockSetSearchQuery).toHaveBeenNthCalledWith(2, 'a');
      expect(mockSetSearchQuery).toHaveBeenNthCalledWith(3, 'p');
    });

    it('should call setCategory when clicking a category filter', async () => {
      const user = userEvent.setup();
      renderCatalog();

      await user.click(screen.getByRole('radio', { name: 'Accesorios' }));

      expect(mockSetCategory).toHaveBeenCalledTimes(1);
      expect(mockSetCategory).toHaveBeenCalledWith('Accesorios');
    });

    it('should call setCategory with "Todas" when clicking Todas filter', async () => {
      // Configuramos con una categoría activa
      mockUseProductFilters.mockReturnValue({
        searchQuery: '',
        setSearchQuery: mockSetSearchQuery,
        selectedCategory: 'Laptops',
        setCategory: mockSetCategory,
        categories: mockCategories,
        filteredProducts: mockProducts,
        totalCount: 2,
        loading: false,
        error: null,
      });

      const user = userEvent.setup();
      renderCatalog();

      await user.click(screen.getByRole('radio', { name: 'Todas' }));

      expect(mockSetCategory).toHaveBeenCalledWith('Todas');
    });
  });

  /* ── Empty results state ── */

  describe('empty results state', () => {
    beforeEach(() => {
      mockUseProductFilters.mockReturnValue({
        searchQuery: 'xyznoexiste',
        setSearchQuery: vi.fn(),
        selectedCategory: 'Todas',
        setCategory: vi.fn(),
        categories: mockCategories,
        filteredProducts: [],
        totalCount: 2,
        loading: false,
        error: null,
      });
    });

    it('should show empty results message when search has no matches', () => {
      renderCatalog();
      expect(screen.getByText('Sin resultados')).toBeInTheDocument();
      expect(screen.getByText(/no encontramos productos para/i)).toBeInTheDocument();
    });
  });
});
