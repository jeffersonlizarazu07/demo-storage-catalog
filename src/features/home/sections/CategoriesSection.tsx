import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Gaming',
    description: 'Teclados, mice, monitores y más',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.253.596.57.636 4.193.541 7.473.171 7.479-.477.01-1.224-.654-2.405-1.8-3.415a24.1 24.1 0 0 1-1.554-1.634"
        />
      </svg>
    ),
  },
  {
    name: 'Audio',
    description: 'Audífonos, parlantes y accesorios de sonido',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
        />
      </svg>
    ),
  },
  {
    name: 'Computadores',
    description: 'Laptops y equipos de alto rendimiento',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
        />
      </svg>
    ),
  },
  {
    name: 'Accesorios',
    description: 'Sillas, webcams y complementos',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.087 4.113"
        />
      </svg>
    ),
  },
];

import { useInView } from '../../../shared/hooks/useInView';

export function CategoriesSection() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2
            className={`text-3xl font-bold tracking-tight text-primary dark:text-white ${
              inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Categorías
          </h2>
          <p
            className={`mt-2 text-muted ${
              inView ? 'motion-safe:animate-fade-in-up delay-100' : 'opacity-0'
            }`}
          >
            Explora nuestros productos por categoría
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/catalogo?categoria=${category.name.toLowerCase()}`}
              className={`group flex flex-col items-center rounded-xl border border-border bg-surface p-8 text-center transition-all hover:border-accent/30 hover:shadow-md dark:border-white/10 dark:hover:border-accent/30 ${
                inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
              }`}
              style={inView ? { animationDelay: `${200 + index * 100}ms` } : undefined}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                {category.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary dark:text-white">
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
