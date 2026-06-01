/**
 * Re-export for backward compatibility.
 * All logic lives in ThemeContext; this file exists so that
 * existing imports and vi.mock() calls continue to work.
 *
 * @example
 * ```ts
 * import { useDarkMode } from '../hooks/useDarkMode';
 * const { isDark, toggle, mode, setMode } = useDarkMode();
 * ```
 */
export { useDarkMode } from '../context/ThemeContext';
export type { ThemeMode } from '../context/ThemeContext';
