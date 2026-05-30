import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Brand */}
          <Link to="/" className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            Tech<span className="text-blue-600">Store</span>
          </Link>

          {/* Links */}
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/catalogo" className="transition-colors hover:text-blue-600">
              Catálogo
            </Link>
            <Link to="/contacto" className="transition-colors hover:text-blue-600">
              Contacto
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-500">
            &copy; {currentYear} TechStore. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
