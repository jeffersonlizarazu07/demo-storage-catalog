import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CategoriesSection } from './CategoriesSection';

const MOCK_CATEGORIES = ['Electrónica', 'Joyería', 'Ropa Hombre', 'Ropa Mujer'];

describe('CategoriesSection', () => {
  const noop = vi.fn();

  function renderSection({
    categories = MOCK_CATEGORIES,
    loading = false,
    error = null,
    onRetry = noop,
  }: {
    categories?: string[];
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
  } = {}) {
    return render(
      <MemoryRouter>
        <CategoriesSection
          categories={categories}
          loading={loading}
          error={error}
          onRetry={onRetry}
        />
      </MemoryRouter>,
    );
  }

  describe('loading state', () => {
    it('should render the heading during loading', () => {
      renderSection({ loading: true });
      expect(screen.getByText('Categorías')).toBeInTheDocument();
    });

    it('should render skeleton placeholders while loading', () => {
      renderSection({ loading: true });
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThanOrEqual(4);
    });

    it('should not render category links yet', () => {
      renderSection({ loading: true });
      expect(screen.queryByText('Electrónica')).not.toBeInTheDocument();
    });
  });

  describe('loaded state', () => {
    it('should render all 4 category cards after loading', () => {
      renderSection();

      expect(screen.getByText('Electrónica')).toBeInTheDocument();
      expect(screen.getByText('Joyería')).toBeInTheDocument();
      expect(screen.getByText('Ropa Hombre')).toBeInTheDocument();
      expect(screen.getByText('Ropa Mujer')).toBeInTheDocument();
    });

    it('should render descriptions for each category', () => {
      renderSection();

      expect(screen.getByText('Dispositivos y gadgets tecnológicos')).toBeInTheDocument();
      expect(screen.getByText('Joyas y accesorios de calidad')).toBeInTheDocument();
      expect(screen.getByText('Moda y estilo para caballero')).toBeInTheDocument();
      expect(screen.getByText('Moda y estilo para dama')).toBeInTheDocument();
    });

    it('should link each category to filtered catalog page', () => {
      renderSection();

      const electronica = screen.getByText('Electrónica');
      const link = electronica.closest('a');
      expect(link).toHaveAttribute('href', '/catalogo?categoria=electrónica');
    });

    it('should not have skeleton placeholders after loading', () => {
      renderSection();
      expect(document.querySelectorAll('.animate-pulse').length).toBe(0);
    });
  });

  describe('empty state', () => {
    it('should return null when categories array is empty after loading', () => {
      const { container } = renderSection({ categories: [] });
      expect(screen.queryByText('Categorías')).not.toBeInTheDocument();
      expect(container.innerHTML).toBe('');
    });
  });

  describe('error state', () => {
    it('should show error message when error is provided', () => {
      renderSection({ error: 'No pudimos cargar las categorías. Intenta de nuevo.' });

      expect(screen.getByText(/no pudimos cargar las categorías/i)).toBeInTheDocument();
    });

    it('should show a retry button when error is provided', () => {
      renderSection({ error: 'No pudimos cargar las categorías. Intenta de nuevo.' });

      expect(screen.getByRole('button', { name: /intentar de nuevo/i })).toBeInTheDocument();
    });

    it('should NOT render category cards when in error state', () => {
      renderSection({ error: 'No pudimos cargar las categorías. Intenta de nuevo.' });

      expect(screen.queryByText('Electrónica')).not.toBeInTheDocument();
      expect(screen.queryByText('Joyería')).not.toBeInTheDocument();
    });

    it('should still show the section heading when in error state', () => {
      renderSection({ error: 'No pudimos cargar las categorías. Intenta de nuevo.' });

      expect(screen.getByText('Categorías')).toBeInTheDocument();
    });

    it('should call onRetry when retry button is clicked', async () => {
      const onRetry = vi.fn();
      const user = userEvent.setup();

      renderSection({ error: 'No pudimos cargar las categorías. Intenta de nuevo.', onRetry });

      const retryButton = screen.getByRole('button', { name: /intentar de nuevo/i });
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });
});
