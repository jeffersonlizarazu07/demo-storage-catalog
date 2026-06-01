import { Link } from 'react-router-dom';

import { WarningIcon, ArrowLeftIcon } from '../../shared/components/Icons';
import { useInView } from '../../shared/hooks/useInView';
import { useProduct } from './hooks/useProduct';
import { ProductGallery } from './components/ProductGallery';
import { ProductInfo } from './components/ProductInfo';
import { RelatedProducts } from './components/RelatedProducts';

/** Skeleton pulse while product is loading */
function DetailSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-36 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-gray-200 dark:bg-white/10" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="mt-4 h-20 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="mt-4 h-40 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </section>
  );
}

/** Error state */
function DetailError({ message }: { message: string }) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <WarningIcon className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-primary dark:text-white">
        Error al cargar el producto
      </h2>
      <p className="mt-1 text-sm text-muted">{message}</p>
      <Link
        to="/catalogo"
        className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Volver al catálogo
      </Link>
    </section>
  );
}

export function ProductDetail() {
  const { product, relatedProducts, loading, error } = useProduct();
  const { ref, inView } = useInView();

  /* ── Loading ── */
  if (loading) return <DetailSkeleton />;

  /* ── Error ── */
  if (error) return <DetailError message={error} />;

  /* ── Not found ── */
  if (!product) {
    return (
      <section
        ref={ref}
        className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8"
      >
        <h1
          className={`text-3xl font-bold text-primary dark:text-white ${
            inView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Producto no encontrado
        </h1>
        <p className={`mt-2 text-muted ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <Link
          to="/catalogo"
          className={`mt-6 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover ${
            inView ? 'animate-fade-in-up delay-200' : 'opacity-0'
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
          inView ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Volver al catálogo
      </Link>

      {/* Product layout */}
      <div
        className={`mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2 ${
          inView ? 'animate-fade-in-up delay-100' : 'opacity-0'
        }`}
      >
        <ProductGallery image={product.image} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      <div className={inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}>
        <RelatedProducts products={relatedProducts} />
      </div>
    </section>
  );
}
