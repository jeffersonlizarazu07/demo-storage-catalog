const PLACEHOLDER_IMG = 'https://placehold.co/600x500/e4e4e7/71717a?text=Producto';

interface ProductGalleryProps {
  image: string;
  name: string;
}

export function ProductGallery({ image, name }: ProductGalleryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface dark:border-white/10 dark:bg-primary">
      <img
        src={image || PLACEHOLDER_IMG}
        alt={name}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
