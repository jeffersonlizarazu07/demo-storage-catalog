import { useInView } from '../../shared/hooks/useInView';
import { useProductFilters } from './hooks/useProductFilters';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';

export function Catalog() {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory,
    categories,
    filteredProducts,
    totalCount,
  } = useProductFilters();

  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold tracking-tight text-primary dark:text-white ${
            inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Catálogo
        </h1>
        <p
          className={`mt-1 text-muted ${
            inView ? 'motion-safe:animate-fade-in-up delay-100' : 'opacity-0'
          }`}
        >
          {filteredProducts.length} de {totalCount} productos
        </p>
      </div>

      {/* Search */}
      <div className={inView ? 'motion-safe:animate-fade-in-up delay-100' : 'opacity-0'}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          totalCount={totalCount}
          filteredCount={filteredProducts.length}
        />
      </div>

      {/* Filters */}
      <div className={inView ? 'motion-safe:animate-fade-in-up delay-200' : 'opacity-0'}>
        <FilterBar
          categories={categories}
          selected={selectedCategory}
          onSelect={setCategory}
        />
      </div>

      {/* Grid */}
      <div className={inView ? 'motion-safe:animate-fade-in-up delay-300' : 'opacity-0'}>
        <ProductGrid products={filteredProducts} searchQuery={searchQuery} />
      </div>
    </section>
  );
}
