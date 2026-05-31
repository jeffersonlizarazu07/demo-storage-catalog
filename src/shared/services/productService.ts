import type { Product } from '../interfaces/product.interface';

const API_BASE = 'https://fakestoreapi.com';

/* ── FakeStore API types ─────────────────────────────── */

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

/* ── Category mapping EN → ES ────────────────────────── */

const CATEGORY_MAP: Record<string, string> = {
  electronics: 'Electrónica',
  jewelery: 'Joyería',
  "men's clothing": 'Ropa Hombre',
  "women's clothing": 'Ropa Mujer',
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([en, es]) => [es.toLowerCase(), en]),
);

/* ── Mapper ──────────────────────────────────────────── */

function mapProduct(fs: FakeStoreProduct): Product {
  return {
    id: fs.id,
    name: fs.title,
    price: fs.price,
    category: CATEGORY_MAP[fs.category] ?? fs.category,
    image: fs.image,
    description: fs.description,
  };
}

function mapCategory(es: string): string {
  return CATEGORY_MAP[es] ?? es;
}

/** Reverse-map a Spanish category back to the FakeStore English value (for API queries). */
function reverseCategory(esCategory: string): string {
  return REVERSE_MAP[esCategory.toLowerCase()] ?? esCategory;
}

/* ── Public API ──────────────────────────────────────── */

/**
 * Fetch ALL products from FakeStore and map them to our `Product` type.
 */
export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error(`Error al obtener productos (${res.status})`);
  const data: FakeStoreProduct[] = await res.json();
  return data.map(mapProduct);
}

/**
 * Fetch a single product by ID.
 * Returns `null` when the product doesn't exist (404).
 */
export async function fetchProduct(id: number): Promise<Product | null> {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error al obtener producto #${id} (${res.status})`);
  const data: FakeStoreProduct = await res.json();
  return mapProduct(data);
}

/**
 * Fetch available categories in Spanish.
 */
export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/products/categories`);
  if (!res.ok) throw new Error(`Error al obtener categorías (${res.status})`);
  const data: string[] = await res.json();
  return data.map(mapCategory).sort();
}

/**
 * Fetch products filtered by a Spanish category name.
 */
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  const en = reverseCategory(category);
  const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(en)}`);
  if (!res.ok) throw new Error(`Error al filtrar por categoría (${res.status})`);
  const data: FakeStoreProduct[] = await res.json();
  return data.map(mapProduct);
}
