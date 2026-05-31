import { useInView } from '../../../shared/hooks/useInView';
import { ProductCard } from '../../../shared/components/ProductCard';
import { Button } from '../../../shared/components/Button';
import { products } from '../../../shared/data/products';

const featured = products.slice(0, 4);

export function FeaturedProducts() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="bg-bg px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <h2
              className={`text-3xl font-bold tracking-tight text-primary dark:text-white ${
                inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
              }`}
            >
              Productos destacados
            </h2>
            <p
              className={`mt-2 text-muted ${
                inView ? 'motion-safe:animate-fade-in-up delay-100' : 'opacity-0'
              }`}
            >
              Lo más popular de nuestro catálogo
            </p>
          </div>
          <Button as="router-link" to="/catalogo" variant="outline" className={`hidden sm:inline-flex ${inView ? 'motion-safe:animate-fade-in-up delay-200' : 'opacity-0'}`}>
            Ver todos
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className={inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'}
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
