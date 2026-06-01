/**
 * Data fetching hook: loads products and categories from the API.
 * Single responsibility: fetch initial catalog data.
 */
import { useState, useEffect } from 'react';
import type { Product } from '../../../shared/interfaces/product.interface';
import { fetchProducts, fetchCategories } from '../../../shared/services/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { products, categories, loading, error } as const;
}
