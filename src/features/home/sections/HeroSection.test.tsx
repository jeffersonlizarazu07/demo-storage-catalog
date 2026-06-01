import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroSection } from './HeroSection';

/**
 * Mock de IntersectionObserver: useInView inicia con inView=false.
 * Al no disparar triggerInView, el componente renderiza con opacity-0
 * pero el contenido sigue estando en el DOM (accesible por getByText).
 */
function createMockIntersectionObserver() {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockIO {
    constructor() {
      /* no-op — no disparamos intersección */
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }

  return { MockIO, observe };
}

describe('HeroSection', () => {
  let mockIO: ReturnType<typeof createMockIntersectionObserver>;

  beforeEach(() => {
    mockIO = createMockIntersectionObserver();
    vi.stubGlobal('IntersectionObserver', mockIO.MockIO);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function renderHero() {
    return render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    );
  }

  it('should render the main heading', () => {
    renderHero();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/descubre/i);
  });

  it('should render the description paragraph', () => {
    renderHero();
    expect(screen.getByText(/explora nuestro catálogo/i)).toBeInTheDocument();
  });

  it('should render a CTA button to /catalogo', () => {
    renderHero();
    const cta = screen.getByRole('link', { name: /explorar catálogo/i });
    expect(cta).toHaveAttribute('href', '/catalogo');
  });

  it('should render a CTA button to /contacto', () => {
    renderHero();
    const cta = screen.getByRole('link', { name: /contáctanos/i });
    expect(cta).toHaveAttribute('href', '/contacto');
  });

  it('should have background decoration elements hidden from accessibility', () => {
    renderHero();
    const decorations = document.querySelectorAll('[aria-hidden="true"]');
    expect(decorations.length).toBeGreaterThanOrEqual(1);
  });

  it('should register an IntersectionObserver on mount', () => {
    renderHero();
    expect(mockIO.observe).toHaveBeenCalledTimes(1);
  });
});
