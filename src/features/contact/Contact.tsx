import { useInView } from '../../shared/hooks/useInView';
import { ContactInfoSection } from './sections/ContactInfoSection';
import { ContactFormSection } from './sections/ContactFormSection';
import { WhatsAppCTASection } from './sections/WhatsAppCTASection';
import { SocialLinksSection } from './sections/SocialLinksSection';

export function Contact() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="text-center">
        <h1
          className={`text-3xl font-bold tracking-tight text-foreground dark:text-white sm:text-4xl ${
            inView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Contacto
        </h1>
        <p
          className={`mt-2 text-muted ${
            inView ? 'animate-fade-in-up delay-100' : 'opacity-0'
          }`}
        >
          Estamos aquí para ayudarte. Cuéntanos cómo podemos ayudarte.
        </p>
      </div>

      {/* Contact Info Cards — animación propia dentro del componente */}
      <div className="mt-12">
        <ContactInfoSection />
      </div>

      {/* WhatsApp CTA */}
      <div
        className={`mt-8 ${
          inView ? 'animate-fade-in-up delay-300' : 'opacity-0'
        }`}
      >
        <WhatsAppCTASection />
      </div>

      {/* Two-column: Form + Social */}
      <div
        className={`mt-8 grid gap-8 lg:grid-cols-5 ${
          inView ? 'animate-fade-in-up delay-400' : 'opacity-0'
        }`}
      >
        <div className="lg:col-span-3">
          <ContactFormSection />
        </div>
        <div className="lg:col-span-2">
          <SocialLinksSection />
        </div>
      </div>
    </section>
  );
}
