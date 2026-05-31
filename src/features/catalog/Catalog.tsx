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

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
          Catálogo
        </h1>
        <p className="mt-1 text-muted">
          {filteredProducts.length} de {totalCount} productos
        </p>
      </div>

      {/* Search */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        totalCount={totalCount}
        filteredCount={filteredProducts.length}
      />

      {/* Filters */}
      <FilterBar
        categories={categories}
        selected={selectedCategory}
        onSelect={setCategory}
      />

      {/* Grid */}
      <ProductGrid products={filteredProducts} searchQuery={searchQuery} />
    </section>
  );
}
