import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDarkMode } from './useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    // 1. Limpiamos localStorage antes de cada prueba
    localStorage.clear();

    // 2. Limpiamos las clases en el elemento raíz del DOM
    document.documentElement.className = '';

    // 3. Mock por defecto de window.matchMedia (preferencia de sistema en 'light')
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should initialize with light mode by default if localStorage is empty and system theme is light', () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should initialize with dark mode if system preference is dark and localStorage is empty', () => {
    // Cambiamos el mock para simular que el usuario tiene activado el dark mode en su sistema operativo
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should prioritize dark mode stored in localStorage over light system preference', () => {
    localStorage.setItem('theme', 'dark');

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should prioritize light mode stored in localStorage over dark system preference', () => {
    // Sistema en dark, pero localStorage en light
    localStorage.setItem('theme', 'light');
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
      })),
    });

    const { result } = renderHook(() => useDarkMode());

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should toggle theme from light to dark, updating state, DOM and localStorage', () => {
    const { result } = renderHook(() => useDarkMode());

    // Inicialmente es light (false)
    expect(result.current.isDark).toBe(false);

    // Hacemos toggle. Como cambia el estado de un hook de React, usamos act()
    act(() => {
      result.current.toggle();
    });

    // Ahora debe ser dark (true)
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    // Hacemos toggle de regreso a light
    act(() => {
      result.current.toggle();
    });

    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
