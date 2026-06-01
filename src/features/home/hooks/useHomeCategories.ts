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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchCategories()
      .then((names) => {
        if (!cancelled) {
          setCategories(names);
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('No pudimos cargar las categorías. Intenta de nuevo.');
          setCategories([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const onRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((c) => c + 1);
  }, []);

  return { categories, loading, error, onRetry } as const;
}
