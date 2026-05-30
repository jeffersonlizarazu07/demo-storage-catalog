import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Inicio' },
  { path: '/catalogo', label: 'Catálogo' },
  { path: '/contacto', label: 'Contacto' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-white bg-accent'
        : 'text-muted hover:text-primary hover:bg-border dark:text-muted dark:hover:text-white dark:hover:bg-white/10'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface/80 backdrop-blur-md dark:border-white/10 dark:bg-primary/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold tracking-tight text-primary dark:text-white">
          Tech<span className="text-accent">Store</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClasses} end={item.path === '/'}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:bg-border hover:text-primary md:hidden dark:text-muted dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Abrir menú de navegación"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
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
