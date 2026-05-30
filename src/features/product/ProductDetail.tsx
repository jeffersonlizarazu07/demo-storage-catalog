import { useParams, Link } from 'react-router-dom';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        to="/catalogo"
        className="inline-flex items-center text-sm text-blue-600 transition-colors hover:text-blue-700"
      >
        &larr; Volver al catálogo
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Producto #{id}
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          La información del producto se cargará en Fase 5.
        </p>
      </div>
    </section>
  );
}
