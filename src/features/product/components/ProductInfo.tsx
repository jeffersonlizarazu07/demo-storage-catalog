import type { Product } from '../../../shared/interfaces/product.interface';
import { Badge } from '../../../shared/components/Badge';
import { WhatsAppIcon } from '../../../shared/components/Icons';
import { getWhatsAppLink } from '../../../shared/utils/whatsapp';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Category badge */}
      <Badge size="md">{product.category}</Badge>

      {/* Name + Brand */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">
          {product.name}
        </h1>
        {product.brand && <p className="mt-1 text-sm text-muted">Marca: {product.brand}</p>}
      </div>

      {/* Price */}
      <p className="text-4xl font-bold text-foreground dark:text-white">
        ${product.price.toFixed(2)}
      </p>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-primary dark:text-white">Descripción</h2>
        <p className="mt-1 leading-relaxed text-muted">{product.description}</p>
      </div>

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white">Especificaciones</h2>
          <dl className="mt-2 divide-y divide-border rounded-xl border border-border dark:divide-white/10 dark:border-white/10">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="flex justify-between px-4 py-3 text-sm">
                <dt className="font-medium text-primary dark:text-white">{key}</dt>
                <dd className="text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* WhatsApp CTA */}
      <a
        href={getWhatsAppLink(product.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-accent-hover"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Consultar por WhatsApp
      </a>
    </div>
  );
}
