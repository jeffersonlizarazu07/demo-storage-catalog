import { useInView } from '../../../shared/hooks/useInView';
import { Button } from '../../../shared/components/Button';

export function HeroSection() {
  const { ref, inView } = useInView({ threshold: 0 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-bg to-accent/5 px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className={`absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent/5 blur-3xl transition-all duration-1000 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-3xl transition-all duration-1000 delay-300 dark:bg-white/5 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className={`text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl dark:text-white ${
              inView ? 'motion-safe:animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Descubre la{' '}
            <span className="text-accent">tecnología</span>
            {' '}que necesitas
          </h1>

          <p
            className={`mt-6 text-lg leading-relaxed text-zinc-700 ${
              inView ? 'motion-safe:animate-fade-in-up delay-100' : 'opacity-0'
            }`}
          >
            Explora nuestro catálogo con los mejores productos en gaming, audio,
            computadores y accesorios. Encuentra lo que buscas al mejor precio.
          </p>

          <div
            className={`mt-10 flex items-center justify-center gap-4 ${
              inView ? 'motion-safe:animate-fade-in-up delay-200' : 'opacity-0'
            }`}
          >
            <Button as="router-link" to="/catalogo" variant="accent">
              Explorar catálogo
            </Button>
            <Button as="router-link" to="/contacto" variant="ghost" className="bg-primary text-white hover:bg-primary-hover dark:bg-primary dark:text-white dark:hover:bg-primary-hover">
              Contáctanos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
