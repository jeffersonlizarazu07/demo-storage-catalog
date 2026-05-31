import { useInView } from '../../../shared/hooks/useInView';
import type { Product } from '../../../shared/interfaces/product.interface';
import { ProductCard } from '../../../shared/components/ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const { ref, inView } = useInView();

  if (products.length === 0) return null;

  return (
    <section ref={ref} className="mt-16 border-t border-border pt-12 dark:border-white/10">
      <h2
        className={`text-2xl font-bold tracking-tight text-primary dark:text-white ${
          inView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        Productos relacionados
      </h2>
      <p
        className={`mt-1 text-muted ${
          inView ? 'animate-fade-in-up delay-100' : 'opacity-0'
        }`}
      >
        Otros productos en la misma categoría
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={inView ? 'animate-fade-in-up' : 'opacity-0'}
            style={inView ? { animationDelay: `${200 + index * 100}ms` } : undefined}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
