export function Home() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Tu tienda de tecnología
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Descubre los mejores productos en gaming, audio, computadores y accesorios.
        </p>
        <div className="mt-8">
          <a
            href="/catalogo"
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Explorar catálogo
          </a>
        </div>
      </div>
    </section>
  );
}
