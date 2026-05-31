import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../../../shared/data/products';

export function useProduct() {
  const { id } = useParams<{ id: string }>();

  return useMemo(() => {
    const productId = Number(id);
    if (Number.isNaN(productId)) return { product: null, relatedProducts: [] };

    const product = products.find((p) => p.id === productId) ?? null;

    const relatedProducts = product
      ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
      : [];

    return { product, relatedProducts };
  }, [id]);
}
