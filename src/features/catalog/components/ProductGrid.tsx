import type { Product } from '../../../shared/interfaces/product.interface';
import { SearchIcon } from '../../../shared/components/Icons';
import { ProductCard } from '../../../shared/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
}

export function ProductGrid({ products, searchQuery }: ProductGridProps) {
  if (!products?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-16 text-center dark:border-white/10">
        <SearchIcon className="h-12 w-12 text-muted" />
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
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
