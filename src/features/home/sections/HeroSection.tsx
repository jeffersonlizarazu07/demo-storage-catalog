import { useInView } from '../../../shared/hooks/useInView';
import { Button } from '../../../shared/components/Button';

export function HeroSection() {
  const { ref, inView } = useInView({ threshold: 0 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-aura-accent px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 dark:bg-aura-cyan"
    >
      {/* Background decoration — dramatic mesh blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* Amber glow — top right */}
        <div
          className={`absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[120px] transition-all duration-1000 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Cyan glow — bottom left */}
        <div
          className={`absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-accent-secondary/10 blur-[120px] transition-all duration-1000 delay-300 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Subtle center glow */}
        <div
          className={`absolute inset-x-0 top-1/3 mx-auto h-64 w-3/4 rounded-full bg-accent/5 blur-[100px] transition-all duration-1000 delay-500 ${
            inView ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className={`text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl dark:text-white ${
              inView ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            Descubre los{' '}
            <span className="text-accent">productos</span>
            {' '}que necesitas
          </h1>

          <p
            className={`mt-6 text-lg leading-relaxed text-muted ${
              inView ? 'animate-fade-in-up delay-100' : 'opacity-0'
            }`}
          >
            Explora nuestro catálogo con los mejores productos en tecnología, joyería,
            vestimenta para toda ocasión y accesorios. Encuentra lo que buscas al mejor precio.
          </p>

          <div
            className={`mt-10 flex items-center justify-center gap-4 ${
              inView ? 'animate-fade-in-up delay-200' : 'opacity-0'
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
