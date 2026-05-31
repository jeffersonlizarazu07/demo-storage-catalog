import { Link } from 'react-router-dom';
import { useInView } from '../../shared/hooks/useInView';
import { useProduct } from './hooks/useProduct';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfo } from './components/ProductInfo';
import { RelatedProducts } from './components/RelatedProducts';

export function ProductDetail() {
  const { product, relatedProducts } = useProduct();
  const { ref, inView } = useInView();

  if (!product) {
    return (
      <section
        ref={ref}
        className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8"
      >
        <h1
          className={`text-3xl font-bold text-primary dark:text-white ${
            inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Producto no encontrado
        </h1>
        <p
          className={`mt-2 text-muted ${
            inView ? 'motion-safe:animate-fade-in-up delay-100' : 'opacity-0'
          }`}
        >
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <Link
          to="/catalogo"
          className={`mt-6 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover ${
            inView ? 'motion-safe:animate-fade-in-up delay-200' : 'opacity-0'
          }`}
        >
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        to="/catalogo"
        className={`inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent ${
          inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver al catálogo
      </Link>

      {/* Product layout */}
      <div
        className={`mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 ${
          inView ? 'motion-safe:animate-fade-in-up delay-100' : 'opacity-0'
        }`}
      >
        <ProductGallery image={product.image} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      <div
        className={inView ? 'motion-safe:animate-fade-in-up delay-200' : 'opacity-0'}
      >
        <RelatedProducts products={relatedProducts} />
      </div>
    </section>
  );
}
