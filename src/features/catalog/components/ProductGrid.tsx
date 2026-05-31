import type { Product } from '../../../shared/interfaces/product.interface';
import { ProductCard } from '../../../shared/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
}

export function ProductGrid({ products, searchQuery }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-16 text-center dark:border-white/10">
        <svg
          className="h-12 w-12 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-primary dark:text-white">
          {searchQuery.trim() ? 'Sin resultados' : 'No hay productos'}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {searchQuery.trim()
            ? `No encontramos productos para "${searchQuery.trim()}". Intenta con otro término.`
            : 'No hay productos disponibles en esta categoría.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
