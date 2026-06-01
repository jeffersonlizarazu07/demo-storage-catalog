import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactInfoSection } from './ContactInfoSection';

/**
 * Mock de IntersectionObserver: useInView inicia con inView=false.
 * No disparamos intersección, el contenido sigue en el DOM con opacity-0.
 */
function createMockIntersectionObserver() {
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();

  class MockIO {
    constructor() {
      /* no-op */
    }
    observe = observe;
    unobserve = unobserve;
    disconnect = disconnect;
  }

  return { MockIO, observe };
}

describe('ContactInfoSection', () => {
  let mockIO: ReturnType<typeof createMockIntersectionObserver>;

  beforeEach(() => {
    mockIO = createMockIntersectionObserver();
    vi.stubGlobal('IntersectionObserver', mockIO.MockIO);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function renderSection() {
    return render(<ContactInfoSection />);
  }

  it('should render all 3 contact items', () => {
    renderSection();
    expect(screen.getByText('Dirección')).toBeInTheDocument();
    expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByText('Teléfono')).toBeInTheDocument();
  });

  it('should render Dirección details', () => {
    renderSection();
    expect(screen.getByText('Cra 45 # 23-12, Oficina 302')).toBeInTheDocument();
    expect(screen.getByText('Bogotá, Colombia')).toBeInTheDocument();
  });

  it('should render Correo Electrónico details', () => {
    renderSection();
    expect(screen.getByText('contacto@techstore.com')).toBeInTheDocument();
    expect(screen.getByText('Respuesta en 24 horas')).toBeInTheDocument();
  });

  it('should render Teléfono details', () => {
    renderSection();
    expect(screen.getByText('+57 320 952 0302')).toBeInTheDocument();
    expect(screen.getByText(/lun–vie.*9:00.*6:00/i)).toBeInTheDocument();
  });

  describe('contact links', () => {
    it('should render 3 links with aria-label', () => {
      renderSection();
      expect(screen.getByRole('link', { name: /abrir dirección/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /abrir correo electrónico/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /abrir teléfono/i })).toBeInTheDocument();
    });

    it('should have correct href for Dirección with target and rel for external links', () => {
      renderSection();
      const link = screen.getByRole('link', { name: /abrir dirección/i });
      expect(link).toHaveAttribute('href', 'https://maps.google.com/?q=4.6793236,-74.1090964');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have correct href for Correo Electrónico without target', () => {
      renderSection();
      const link = screen.getByRole('link', { name: /abrir correo electrónico/i });
      expect(link).toHaveAttribute('href', 'mailto:jeffersonlizarazu@hotmail.com');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });

    it('should have correct href for Teléfono without target', () => {
      renderSection();
      const link = screen.getByRole('link', { name: /abrir teléfono/i });
      expect(link).toHaveAttribute('href', 'tel:+573209520302');
      expect(link).not.toHaveAttribute('target');
      expect(link).not.toHaveAttribute('rel');
    });
  });

  it('should register IntersectionObserver on mount', () => {
    renderSection();
    expect(mockIO.observe).toHaveBeenCalledTimes(1);
  });
});
