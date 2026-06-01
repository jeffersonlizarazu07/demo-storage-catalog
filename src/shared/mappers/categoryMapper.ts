/**
 * Category mapper: translates category names between English (FakeStore API) and Spanish.
 * Single responsibility: EN ↔ ES category translation.
 */
const CATEGORY_MAP: Record<string, string> = {
  electronics: 'Electrónica',
  jewelery: 'Joyería',
  "men's clothing": 'Ropa Hombre',
  "women's clothing": 'Ropa Mujer',
};

const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([en, es]) => [es.toLowerCase(), en]),
);

export function mapCategory(es: string): string {
  return CATEGORY_MAP[es] ?? es;
}

/** Reverse-map a Spanish category back to the FakeStore English value (for API queries). */
export function reverseCategory(esCategory: string): string {
  return REVERSE_MAP[esCategory.toLowerCase()] ?? esCategory;
}
