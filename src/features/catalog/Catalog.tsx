import { WarningIcon } from '../../shared/components/Icons';
import { useInView } from '../../shared/hooks/useInView';
import { useProductFilters } from './hooks/useProductFilters';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';

/** Skeleton pulse while products are loading */
function CatalogSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-9 w-40 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      <div className="h-10 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-white/10" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-white/10" />
        ))}
      </div>
    </div>
  );
}

/** Error state with retry */
function CatalogError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
        <WarningIcon className="h-7 w-7 text-red-500" />
      </div>
      <h2 className="text-xl font-semibold text-primary dark:text-white">
        Error al cargar productos
      </h2>
      <p className="mt-1 text-sm text-muted">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Intentar de nuevo
      </button>
    </section>
  );
}

export function Catalog() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory,
    categories,
    filteredProducts,
    totalCount,
    loading,
    error,
  } = useProductFilters();

  const { ref, inView } = useInView();

  /* ── Loading state ── */
  if (loading) return <CatalogSkeleton />;

  /* ── Error state ── */
  if (error) return <CatalogError message={error} onRetry={() => window.location.reload()} />;

  return (
    <section
      ref={ref}
      className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold tracking-tight text-primary dark:text-white ${
            inView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Catálogo
        </h1>
        <p className={`mt-1 text-muted ${inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
          {filteredProducts.length} de {totalCount} productos
        </p>
      </div>

      {/* Search */}
      <div className={inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          totalCount={totalCount}
          filteredCount={filteredProducts.length}
        />
      </div>

      {/* Filters */}
      <div className={inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}>
        <FilterBar categories={categories} selected={selectedCategory} onSelect={setCategory} />
      </div>

      {/* Grid */}
      <div className={inView ? 'animate-fade-in-up delay-300' : 'opacity-0'}>
        <ProductGrid products={filteredProducts} searchQuery={searchQuery} />
      </div>
    </section>
  );
}
