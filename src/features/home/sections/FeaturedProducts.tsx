import { useInView } from '../../../shared/hooks/useInView';
import { ProductCard } from '../../../shared/components/ProductCard';
import { Button } from '../../../shared/components/Button';
import type { Product } from '../../../shared/interfaces/product.interface';

interface FeaturedProductsProps {
  products: Product[];
  loading: boolean;
}

export function FeaturedProducts({ products, loading }: FeaturedProductsProps) {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="relative bg-bg px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      {/* Gradient top divider */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-3/4 bg-linear-to-r from-transparent via-accent-secondary/30 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <h2
              className={`text-3xl font-bold tracking-tight text-primary dark:text-white ${
                inView ? 'animate-fade-in-up' : 'opacity-0'
              }`}
            >
              Productos destacados
            </h2>
            <p
              className={`mt-2 text-muted ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}
            >
              Lo más popular de nuestro catálogo
            </p>
          </div>
          <Button
            as="router-link"
            to="/catalogo"
            variant="outline"
            className={`hidden sm:inline-flex ${inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}
          >
            Ver todos
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-white/10"
                />
              ))
            : products.map((product, index) => (
                <div
                  key={product.id}
                  className={inView ? 'animate-fade-in-up' : 'opacity-0'}
                  style={inView ? { animationDelay: `${300 + index * 100}ms` } : undefined}
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button as="router-link" to="/catalogo" variant="outline">
            Ver todos los productos
          </Button>
        </div>
      </div>
    </section>
  );
}
