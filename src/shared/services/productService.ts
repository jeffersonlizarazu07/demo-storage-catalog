/**
 * Public API facade — composes raw API fetching with domain mappers.
 *
 * This file exists for backward compatibility. Consumers may also import
 * directly from the underlying modules:
 *   - src/shared/api/productApi.ts        — HTTP fetching (raw)
 *   - src/shared/mappers/productMapper.ts — FakeStoreProduct → Product
 *   - src/shared/mappers/categoryMapper.ts — EN ↔ ES translations
 */
import type { Product } from '../interfaces/product.interface';
import { mapProduct } from '../mappers/productMapper';
import { mapCategory, reverseCategory } from '../mappers/categoryMapper';
import {
  fetchRawProducts,
  fetchRawProduct,
  fetchRawCategories,
  fetchRawProductsByCategory,
} from '../api/productApi';

/**
 * Fetch ALL products from FakeStore and map them to our `Product` type.
 */
export async function fetchProducts(): Promise<Product[]> {
  const data = await fetchRawProducts();
  return data.map(mapProduct);
}

/**
 * Fetch a single product by ID.
 * Returns `null` when the product doesn't exist (404).
 */
export async function fetchProduct(id: number): Promise<Product | null> {
  const data = await fetchRawProduct(id);
  return data ? mapProduct(data) : null;
}

/**
 * Fetch available categories in Spanish.
 */
export async function fetchCategories(): Promise<string[]> {
  const data = await fetchRawCategories();
  return data.map(mapCategory).sort();
}

/**
 * Fetch products filtered by a Spanish category name.
 */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const en = reverseCategory(category);
  const data = await fetchRawProductsByCategory(en);
  return data.map(mapProduct);
}
