import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../../../shared/interfaces/product.interface';
import { fetchProducts, fetchCategories } from '../../../shared/services/productService';

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('categoria') ?? '';

  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch products & categories on mount ── */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        if (cancelled) return;

        setProducts(fetchedProducts);
        setCategories(['Todas', ...fetchedCategories]);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar productos');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── Derive selected category from URL ── */
  const selectedCategory = useMemo(() => {
    if (!categoryParam) return 'Todas';
    const match = categories.find(
      (c) => c.localeCompare(categoryParam, 'es', { sensitivity: 'base' }) === 0,
    );
    return match ?? 'Todas';
  }, [categoryParam, categories]);

  const setCategory = (category: string) => {
    if (category === 'Todas') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: category.toLowerCase() });
    }
  };

  /* ── Client-side filtering ── */
  const filteredProducts = useMemo<Product[]>(() => {
    let result = products;

    if (selectedCategory !== 'Todas') {
      result = result.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.brand && p.brand.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [products, selectedCategory, searchQuery]);

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
