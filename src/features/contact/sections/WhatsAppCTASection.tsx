import { WhatsAppIcon } from '../../../shared/components/Icons';
import { getWhatsAppLink } from '../../../shared/utils/whatsapp';
import { Button } from '../../../shared/components/Button';

export function WhatsAppCTASection() {
  const whatsappUrl = getWhatsAppLink();

  return (
    <section className="rounded-xl border border-border bg-surface p-6 sm:p-8 dark:border-white/10 dark:bg-primary">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        {/* Icon */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-success/10">
          <WhatsAppIcon className="h-8 w-8 text-success" />
        </div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground dark:text-white">
            ¿Prefieres escribirnos por WhatsApp?
          </h3>
          <p className="mt-1 text-sm text-muted">
            Respuesta rápida y directa. Estamos listos para ayudarte.
          </p>
        </div>

        {/* CTA */}
        <Button
          as="a"
          variant="accent"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <WhatsAppIcon className="mr-2 -ml-1 h-5 w-5" />
          Escríbenos por WhatsApp
        </Button>
      </div>
    </section>
  );
}
