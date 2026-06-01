/**
 * Category filter hook: synchronises selected category with URL search params.
 * Single responsibility: read/write `categoria` from URL search params.
 */
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useCategoryFilter(categories: string[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('categoria') ?? '';

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

  return { selectedCategory, setCategory } as const;
}
