export interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  content: string;
  subtitle: string;
  href?: string;
}

const contactDetails = [
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
        />
      </svg>
    ),
    title: 'Dirección',
    content: 'Cra 45 # 23-12, Oficina 302',
    subtitle: 'Bogotá, Colombia',
    href: 'https://maps.google.com/?q=4.6793236,-74.1090964',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
    title: 'Correo Electrónico',
    content: 'contacto@techstore.com',
    subtitle: 'Respuesta en 24 horas',
    href: 'mailto:jeffersonlizarazu@hotmail.com',
  },
  {
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
        />
      </svg>
    ),
    title: 'Teléfono',
    content: '+57 320 952 0302',
    subtitle: 'Lun–Vie, 9:00 AM – 6:00 PM',
    href: 'tel:+573209520302',
  },
];

import { useInView } from '../../../shared/hooks/useInView';

export function ContactInfoSection() {
  const { ref, inView } = useInView();

  return (
    <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contactDetails.map((item, index) => (
        <div
          key={item.title}
          className={`flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-primary ${
            inView ? 'animate-fade-in-up' : 'opacity-0'
          }`}
          style={inView ? { animationDelay: `${index * 100}ms` } : undefined}
        >
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors hover:bg-accent/20"
              aria-label={`Abrir ${item.title}`}
            >
              {item.icon}
            </a>
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {item.icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground dark:text-white">{item.title}</h3>
            <p className="mt-1 text-sm text-foreground dark:text-white">{item.content}</p>
            <p className="text-xs text-muted">{item.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
