/**
 * Home categories hook: fetches category names from the API.
 * Single responsibility: data fetching for the CategoriesSection.
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchCategories } from '../../../shared/services/productService';

export function useHomeCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const names = await fetchCategories();
      setCategories(names);
    } catch {
      setError('No pudimos cargar las categorías. Intenta de nuevo.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { categories, loading, error, onRetry: load } as const;
}
