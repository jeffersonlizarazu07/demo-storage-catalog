import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../../../shared/interfaces/product.interface';
import { products } from '../../../shared/data/products';

const CATEGORIES = ['Todas', 'Gaming', 'Audio', 'Computadores', 'Accesorios'] as const;

export type Category = (typeof CATEGORIES)[number];

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('categoria') ?? '';

  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory: Category = categoryParam
    ? CATEGORIES.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase(),
      ) ?? 'Todas'
    : 'Todas';

  const setCategory = (category: Category) => {
    if (category === 'Todas') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: category.toLowerCase() });
    }
  };

  const filteredProducts = useMemo<Product[]>(() => {
    let result = products;

    if (selectedCategory !== 'Todas') {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [selectedCategory, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setCategory,
    categories: CATEGORIES,
    filteredProducts,
    totalCount: products.length,
  };
}
