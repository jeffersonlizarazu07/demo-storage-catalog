import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg dark:border-white/10 dark:bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight text-primary dark:text-white"
          >
            Tech<span className="text-accent dark:text-amber-400">Store</span>
          </Link>

          {/* Links */}
          <div className="flex gap-6 text-sm text-muted dark:text-muted">
            <Link to="/catalogo" className="transition-colors hover:text-accent">
              Catálogo
            </Link>
            <Link to="/contacto" className="transition-colors hover:text-accent">
              Contacto
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted">
            &copy; {currentYear} TechStore. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
