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

  describe('clickable icons', () => {
    function getClickableIcons() {
      return document.querySelectorAll('.hover\\:cursor-pointer');
    }

    it('should have 3 clickable icons', () => {
      renderSection();
      expect(getClickableIcons().length).toBe(3);
    });

    it('should open Google Maps when Dirección icon is clicked', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      renderSection();

      (getClickableIcons()[0] as HTMLElement).click();
      expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('google.com/maps'), '_blank');

      openSpy.mockRestore();
    });

    it('should open mailto when Correo Electrónico icon is clicked', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      renderSection();

      (getClickableIcons()[1] as HTMLElement).click();
      expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('mailto:'), '_blank');

      openSpy.mockRestore();
    });

    it('should open tel link when Teléfono icon is clicked', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      renderSection();

      (getClickableIcons()[2] as HTMLElement).click();
      expect(openSpy).toHaveBeenCalledWith(expect.stringContaining('tel:'), '_blank');

      openSpy.mockRestore();
    });
  });

  it('should register IntersectionObserver on mount', () => {
    renderSection();
    expect(mockIO.observe).toHaveBeenCalledTimes(1);
  });
});
