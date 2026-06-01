import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'theme-mode';
const DARK_CLASS = 'dark';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialMode(): ThemeMode {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getInitialMode);
  const [systemDark, setSystemDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    function handleChange(e: MediaQueryListEvent) {
      setSystemDark(e.matches);
    }

    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const isDark = mode === 'system' ? systemDark : mode === 'dark';

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add(DARK_CLASS);
    } else {
      root.classList.remove(DARK_CLASS);
    }
  }, [isDark]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // localStorage may be unavailable (incognito, SSR)
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode }}>{children}</ThemeContext.Provider>
  );
}

export function useDarkMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      'useDarkMode must be used within a <ThemeProvider>. ' +
        'Wrap your application with <ThemeProvider> at the root level.',
    );
  }
  return context;
}
