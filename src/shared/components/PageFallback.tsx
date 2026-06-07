/** Loading spinner shown while lazy-loaded route chunks are fetched. */
export function PageFallback() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-muted">Cargando...</p>
      </div>
    </div>
  );
}
