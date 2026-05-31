import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '../../../shared/hooks/useInView';
import { fetchCategories } from '../../../shared/services/productService';

/* ── Icon & description map per category keyword ── */

interface CategoryDisplay {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const CATEGORY_DISPLAY: Record<string, CategoryDisplay> = {
  'Electrónica': {
    name: 'Electrónica',
    description: 'Dispositivos y gadgets tecnológicos',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  },
  'Joyería': {
    name: 'Joyería',
    description: 'Joyas y accesorios de calidad',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
  },
  'Ropa Hombre': {
    name: 'Ropa Hombre',
    description: 'Moda y estilo para caballero',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  'Ropa Mujer': {
    name: 'Ropa Mujer',
    description: 'Moda y estilo para dama',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
};

/** Fallback for any API category that doesn't have a predefined display */
function fallbackDisplay(name: string): CategoryDisplay {
  return {
    name,
    description: `Explora nuestra colección de ${name.toLowerCase()}`,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
      </svg>
    ),
  };
}

function getCategoryDisplay(name: string): CategoryDisplay {
  return CATEGORY_DISPLAY[name] ?? fallbackDisplay(name);
}

export function CategoriesSection() {
  const { ref, inView } = useInView();
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const names = await fetchCategories();
        if (!cancelled) {
          setCategories(names.map(getCategoryDisplay));
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Don't render the section at all if there are no categories after loading */
  if (!loading && categories.length === 0) return null;

  return (
    <section ref={ref} className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      {/* Gradient top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-accent/30 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2
            className={`text-3xl font-bold tracking-tight text-primary dark:text-white ${
              inView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Categorías
          </h2>
          <p
            className={`mt-2 text-muted ${
              inView ? 'animate-fade-in-up delay-100' : 'opacity-0'
            }`}
          >
            Explora nuestros productos por categoría
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-xl border border-border bg-surface p-8"
                >
                  <div className="h-14 w-14 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
                  <div className="mt-4 h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                  <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                </div>
              ))
            : categories.map((category, index) => (
                <Link
                  key={category.name}
                  to={`/catalogo?categoria=${category.name.toLowerCase()}`}
                  className={`group flex flex-col items-center rounded-xl border border-border bg-surface p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 dark:border-white/10 dark:hover:border-accent/30 ${
                    inView ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                  style={inView ? { animationDelay: `${200 + index * 100}ms` } : undefined}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg] group-hover:bg-accent group-hover:text-white">
                    {category.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-primary transition-colors duration-300 group-hover:text-accent dark:text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{category.description}</p>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
