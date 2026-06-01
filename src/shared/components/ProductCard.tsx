import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Badge } from './Badge';
import type { Product } from '../interfaces/product.interface';
import { getWhatsAppLink } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  showActions?: boolean;
  actionSlot?: React.ReactNode;
}

const PLACEHOLDER_IMG = 'https://placehold.co/400x300/e4e4e7/71717a?text=Producto';

export function ProductCard({
  product,
  variant = 'default',
  showActions = true,
  actionSlot,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 dark:border-white/10 dark:bg-primary dark:hover:border-accent/30 ${
        variant === 'compact' ? 'h-auto' : 'min-h-[400px] sm:h-[400px]'
      }`}
    >
      {/* Image — hidden in compact variant */}
      {variant !== 'compact' && (
        <Link to={`/producto/${product.id}`} className="overflow-hidden">
          <img
            src={imgError ? PLACEHOLDER_IMG : product.image || PLACEHOLDER_IMG}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        </Link>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category badge */}
        <Badge size="sm">{product.category}</Badge>

        {/* Name — max 2 líneas para mantener cards uniformes */}
        <Link
          to={`/producto/${product.id}`}
          className="line-clamp-2 font-display text-base leading-snug font-semibold text-primary dark:text-white"
        >
          {product.name}
        </Link>

        {/* Price */}
        <p className="mt-auto text-xl font-bold text-foreground dark:text-white">
          ${product.price.toFixed(2)}
        </p>

        {/* Actions */}
        {showActions && (
          <div className="mt-2 flex gap-2">
            {actionSlot ?? (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
