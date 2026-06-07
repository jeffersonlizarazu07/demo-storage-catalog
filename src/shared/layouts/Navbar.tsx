import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from '../components/Icons';
import { useDarkMode, type ThemeMode } from '../hooks/useDarkMode';

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/catalogo', label: 'Catálogo' },
  { path: '/contacto', label: 'Contacto' },
];

const MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Claro',
  dark: 'Oscuro',
};

const NEXT_MODE_LABEL: Record<ThemeMode, string> = {
  light: 'Oscuro',
  dark: 'Claro',
};

export function Navbar() {
  const { mode, cycleMode } = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 10);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-white bg-accent'
        : 'text-muted hover:text-primary hover:bg-border dark:text-muted dark:hover:text-white dark:hover:bg-white/10'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-border/60 bg-surface/80 shadow-lg shadow-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-primary/80'
          : 'border-b border-transparent bg-surface/50 backdrop-blur-sm dark:bg-primary/30'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-primary dark:text-white"
        >
          Tech<span className="text-accent dark:text-amber-400">Store</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClasses} end={item.path === '/'}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right section: Dark mode toggle + Mobile menu button */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle — cycles: light → dark → system */}
          <button
            type="button"
            onClick={cycleMode}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-border hover:text-primary dark:text-muted dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={`Modo ${MODE_LABELS[mode]} — cambiar a ${NEXT_MODE_LABEL[mode]}`}
          >
            {mode === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:bg-border hover:text-primary md:hidden dark:text-muted dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Abrir menú de navegación"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-surface px-4 pt-2 pb-4 md:hidden dark:border-white/10 dark:bg-primary">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-muted hover:bg-border hover:text-primary dark:text-muted dark:hover:bg-white/10 dark:hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
