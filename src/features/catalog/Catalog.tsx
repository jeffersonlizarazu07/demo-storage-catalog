export function Catalog() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-primary dark:text-white">Catálogo</h1>
      <p className="mt-2 text-muted">
        Explora nuestros productos por categoría.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Los productos se renderizarán aquí en Fase 4 */}
        <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-border dark:border-white/20">
          <p className="text-muted">Productos próximamente</p>
        </div>
      </div>
    </section>
  );
}
