import type { Product } from '../../../shared/interfaces/product.interface';
import { ProductCard } from '../../../shared/components/ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-12 dark:border-white/10">
      <h2 className="text-2xl font-bold tracking-tight text-primary dark:text-white">
        Productos relacionados
      </h2>
      <p className="mt-1 text-muted">
        Otros productos en la misma categoría
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
