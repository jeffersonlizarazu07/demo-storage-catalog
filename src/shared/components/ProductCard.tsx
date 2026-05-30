import { Link } from 'react-router-dom';
import type { Product } from '../interfaces/product.interface';
import { getWhatsAppLink } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
}

const PLACEHOLDER_IMG = 'https://placehold.co/400x300/e4e4e7/71717a?text=Producto';

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md dark:border-white/10">
      {/* Image */}
      <Link to={`/producto/${product.id}`} className="overflow-hidden">
        <img
          src={product.image || PLACEHOLDER_IMG}
          alt={product.name}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category badge */}
        <span className="w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          {product.category}
        </span>

        {/* Name */}
        <Link
          to={`/producto/${product.id}`}
          className="text-base font-semibold text-primary transition-colors hover:text-accent dark:text-white dark:hover:text-accent"
        >
          {product.name}
        </Link>

        {/* Price */}
        <p className="mt-auto text-xl font-bold text-foreground dark:text-white">
          ${product.price.toFixed(2)}
        </p>

        {/* Actions */}
        <div className="mt-2 flex gap-2">
          <Link
            to={`/producto/${product.id}`}
            className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-border dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Ver más
          </Link>
          <a
            href={getWhatsAppLink(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
