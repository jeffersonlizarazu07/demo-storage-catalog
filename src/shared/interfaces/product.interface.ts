export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  brand?: string;
  specs?: Record<string, string>;
}
