import { type FormEvent, useState } from 'react';

import { CheckIcon } from '../../../shared/components/Icons';
import { Button } from '../../../shared/components/Button';

interface FormState {
  name: string;
  email: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = { name: '', email: '', message: '' };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  } else if (name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  }

  if (!email) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (!message) {
    errors.message = 'El mensaje es obligatorio.';
  } else if (message.length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres.';
  }

  return errors;
}

function inputClasses(hasError: boolean): string {
  const base =
    'mt-1 block w-full rounded-lg border px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 dark:text-white dark:placeholder:text-white/40';
  const normal =
    'border-border bg-bg focus:border-accent focus:ring-accent/30 dark:border-white/10 dark:bg-primary';
  const error =
    'border-error bg-error/5 focus:border-error focus:ring-error/30 dark:border-red-400 dark:bg-error/10';
  return `${base} ${hasError ? error : normal}`;
}

export function ContactFormSection() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field when the user starts fixing it
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // Simulación de envío — sin backend real
    setSubmitted(true);
    setForm(INITIAL_FORM);
    setErrors({});
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center dark:border-white/10 dark:bg-primary">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckIcon className="h-8 w-8 text-success" />
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
      noValidate
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
            className={inputClasses(!!errors.name)}
            placeholder="Tu nombre"
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-sm text-error" role="alert">
              {errors.name}
            </p>
          )}
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
            className={inputClasses(!!errors.email)}
            placeholder="tu@correo.com"
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-sm text-error" role="alert">
              {errors.email}
            </p>
          )}
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
            className={inputClasses(!!errors.message)}
            placeholder="¿En qué podemos ayudarte?"
            aria-invalid={!!errors.message || undefined}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-1.5 text-sm text-error" role="alert">
              {errors.message}
            </p>
          )}
        </div>

        <Button type="submit" variant="accent" className="w-full sm:w-auto">
          Enviar mensaje
        </Button>
      </div>
    </form>
  );
}
