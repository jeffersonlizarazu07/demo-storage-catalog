import { useMemo } from 'react';
import type { Product } from '../../../shared/interfaces/product.interface';
import { useProducts } from './useProducts';
import { useCategoryFilter } from './useCategoryFilter';
import { useSearchFilter } from './useSearchFilter';

export function useProductFilters() {
  const { products, categories, loading, error } = useProducts();
  const { selectedCategory, setCategory } = useCategoryFilter(categories);

  /* ── Apply category filter before passing to search ── */
  const categoryFiltered = useMemo<Product[]>(() => {
    if (selectedCategory === 'Todas') return products;
    return products.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  const { searchQuery, setSearchQuery, filteredProducts } = useSearchFilter(categoryFiltered);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory,
    categories,
    filteredProducts,
    totalCount: products.length,
    loading,
    error,
  } as const;
}
