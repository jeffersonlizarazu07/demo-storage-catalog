import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInView } from './useInView';

describe('useInView', () => {
  let observeCallback: IntersectionObserverCallback;
  let observeMock: ReturnType<typeof vi.fn>;
  let unobserveMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    observeMock = vi.fn();
    unobserveMock = vi.fn();
    disconnectMock = vi.fn();

    /**
     * Mockeamos IntersectionObserver para capturar el callback que se
     * registra. Así podemos controlar cuándo un elemento "entra" o "sale"
     * del viewport manualmente.
     */
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn().mockImplementation(function (callback: IntersectionObserverCallback) {
        observeCallback = callback;
        return {
          observe: observeMock,
          unobserve: unobserveMock,
          disconnect: disconnectMock,
        };
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initially have inView as false', () => {
    const { result } = renderHook(() => useInView());

    expect(result.current.inView).toBe(false);
    expect(result.current.ref).toBeInstanceOf(Function);
  });

  it('should set inView to true when element intersects (once=true)', () => {
    const { result } = renderHook(() => useInView({ once: true }));
    const element = document.createElement('div');

    // Asignamos el elemento vía callback ref
    act(() => {
      (result.current.ref as unknown as (node: HTMLDivElement) => void)(element);
    });

    // Verificamos que el observer se haya creado y esté observando
    expect(observeMock).toHaveBeenCalledWith(element);

    // Simulamos que el elemento entra en el viewport
    act(() => {
      observeCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(result.current.inView).toBe(true);

    // Con once=true, debe desobservar después de la primera intersección
    expect(unobserveMock).toHaveBeenCalledWith(element);
  });

  it('should toggle inView back to false when element leaves viewport (once=false)', () => {
    const { result } = renderHook(() => useInView({ once: false }));
    const element = document.createElement('div');

    act(() => {
      (result.current.ref as unknown as (node: HTMLDivElement) => void)(element);
    });

    // Entra al viewport
    act(() => {
      observeCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(result.current.inView).toBe(true);

    // Sale del viewport
    act(() => {
      observeCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(result.current.inView).toBe(false);
  });

  it('should disconnect the observer on unmount', () => {
    const { result, unmount } = renderHook(() => useInView());
    const element = document.createElement('div');

    act(() => {
      (result.current.ref as unknown as (node: HTMLDivElement) => void)(element);
    });

    expect(disconnectMock).not.toHaveBeenCalled();

    unmount();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
