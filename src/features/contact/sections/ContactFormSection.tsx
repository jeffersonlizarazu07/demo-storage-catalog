import { type FormEvent, useState } from 'react';
import { Button } from '../../../shared/components/Button';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const INITIAL_FORM: FormState = { name: '', email: '', message: '' };

export function ContactFormSection() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Simulación de envío — sin backend real
    setSubmitted(true);
    setForm(INITIAL_FORM);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center dark:border-white/10 dark:bg-primary">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg
            className="h-8 w-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground dark:text-white">
          ¡Mensaje enviado!
        </h3>
        <p className="mt-2 text-sm text-muted">
          Gracias por contactarnos. Te responderemos a la brevedad.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
          Enviar otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-6 sm:p-8 dark:border-white/10 dark:bg-primary"
    >
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-foreground dark:text-white"
          >
            Nombre completo
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none dark:border-white/10 dark:bg-primary dark:text-white dark:placeholder:text-white/40"
            placeholder="Tu nombre"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-foreground dark:text-white"
          >
            Correo electrónico
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none dark:border-white/10 dark:bg-primary dark:text-white dark:placeholder:text-white/40"
            placeholder="tu@correo.com"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-foreground dark:text-white"
          >
            Mensaje
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className="mt-1 block w-full resize-y rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none dark:border-white/10 dark:bg-primary dark:text-white dark:placeholder:text-white/40"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

        <Button type="submit" variant="accent" className="w-full sm:w-auto">
          Enviar mensaje
        </Button>
      </div>
    </form>
  );
}
