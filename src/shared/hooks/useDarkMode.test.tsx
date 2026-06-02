import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';
import { useDarkMode, ThemeProvider } from '../context/ThemeContext';

function createWrapper(initialMode?: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    // Set localStorage before mounting
    if (initialMode) {
      localStorage.setItem('theme-mode', initialMode);
    }
    return <ThemeProvider>{children}</ThemeProvider>;
  };
}

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)' ? false : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should default to light mode when localStorage is empty', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mode).toBe('light');
  });

  it('should read dark mode from localStorage', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: createWrapper('dark'),
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should read light mode from localStorage', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: createWrapper('light'),
    });

    expect(result.current.mode).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should ignore unknown localStorage values and fall back to light', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: createWrapper('system'),
    });

    expect(result.current.mode).toBe('light');
  });

  it('should change mode via setMode and persist to localStorage', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem('theme-mode')).toBe('dark');

    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.mode).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem('theme-mode')).toBe('light');
  });

  it('should apply dark class to html element when in dark mode', () => {
    const { result } = renderHook(() => useDarkMode(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setMode('dark');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);

    act(() => {
      result.current.setMode('light');
    });

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
