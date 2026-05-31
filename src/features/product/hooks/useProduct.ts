import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../../shared/interfaces/product.interface';
import { fetchProduct, fetchProducts } from '../../../shared/services/productService';

export function useProduct() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const productId = Number(id);
        if (Number.isNaN(productId)) {
          if (!cancelled) {
            setProduct(null);
            setRelatedProducts([]);
          }
          return;
        }

        const [fetchedProduct, allProducts] = await Promise.all([
          fetchProduct(productId),
          fetchProducts(),
        ]);

        if (cancelled) return;

        if (!fetchedProduct) {
          setProduct(null);
          setRelatedProducts([]);
          return;
        }

        setProduct(fetchedProduct);

        // Derive related from same category (max 4)
        const related = allProducts
          .filter((p) => p.category === fetchedProduct.category && p.id !== fetchedProduct.id)
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar el producto');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, relatedProducts, loading, error } as const;
}
