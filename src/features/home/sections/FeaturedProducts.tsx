import { ProductCard } from '../../../shared/components/ProductCard';
import { Button } from '../../../shared/components/Button';
import { products } from '../../../shared/data/products';

const featured = products.slice(0, 4);

export function FeaturedProducts() {
  return (
    <section className="bg-bg px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
              Productos destacados
            </h2>
            <p className="mt-2 text-muted">
              Lo más popular de nuestro catálogo
            </p>
          </div>
          <Button as="router-link" to="/catalogo" variant="outline" className="hidden sm:inline-flex">
            Ver todos
          </Button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
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
