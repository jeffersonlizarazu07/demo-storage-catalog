/**
 * HTTP fetching layer for the FakeStore API.
 * Single responsibility: fetch raw data from the API.
 */
const API_BASE = 'https://fakestoreapi.com';

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

/**
 * Fetch ALL products from FakeStore.
 */
export async function fetchRawProducts(): Promise<FakeStoreProduct[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error(`Error al obtener productos (${res.status})`);
  return res.json();
}

/**
 * Fetch a single product by ID.
 * Returns `null` when the product doesn't exist (404).
 */
export async function fetchRawProduct(id: number): Promise<FakeStoreProduct | null> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener producto #${id} (${res.status})`);
  return res.json();
}

/**
 * Fetch available category names from FakeStore.
 */
export async function fetchRawCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) throw new Error(`Error al obtener categorías (${res.status})`);
  return res.json();
}

/**
 * Fetch products filtered by an English category name.
 */
export async function fetchRawProductsByCategory(category: string): Promise<FakeStoreProduct[]> {
  const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error(`Error al filtrar por categoría (${res.status})`);
  return res.json();
}
