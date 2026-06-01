/**
 * Featured products hook: fetches products and returns the first 4.
 * Single responsibility: data fetching for the FeaturedProducts section.
 */
import { useState, useEffect } from 'react';
import type { Product } from '../../../shared/interfaces/product.interface';
import { fetchProducts } from '../../../shared/services/productService';

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const allProducts = await fetchProducts();
        if (!cancelled) {
          setProducts(allProducts.slice(0, 4));
        }
      } catch {
        // Silently fail — this section is decorative
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading } as const;
}
