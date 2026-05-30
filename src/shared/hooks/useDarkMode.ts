import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme';
const DARK_CLASS = 'dark';

function getInitialTheme(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  if (isDark) {
    root.classList.add(DARK_CLASS);
  } else {
    root.classList.remove(DARK_CLASS);
  }
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((prev) => !prev), []);

  return { isDark, toggle };
}
