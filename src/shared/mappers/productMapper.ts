/**
 * Product mapper: transforms FakeStore API format to the app's Product model.
 * Single responsibility: map raw API products to the domain Product type.
 */
import type { Product } from '../interfaces/product.interface';
import type { FakeStoreProduct } from '../api/productApi';
import { mapCategory } from './categoryMapper';

export function mapProduct(fs: FakeStoreProduct): Product {
  return {
    id: fs.id,
    name: fs.title,
    price: fs.price,
    category: mapCategory(fs.category),
    image: fs.image,
    description: fs.description,
  };
}
