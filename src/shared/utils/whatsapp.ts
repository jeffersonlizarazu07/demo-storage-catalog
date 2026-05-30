const DEFAULT_PHONE = '573001112233';

/**
 * Genera un enlace de WhatsApp con mensaje predefinido.
 * @param productName - Nombre del producto para incluir en el mensaje
 * @param phone - Número de teléfono (por defecto el del negocio)
 * @returns URL completa de WhatsApp
 */
export function getWhatsAppLink(
  productName?: string,
  phone: string = DEFAULT_PHONE,
): string {
  const message = productName
    ? `Hola, me interesa el producto: ${productName}`
    : 'Hola, me gustaría obtener más información.';

  const base = `https://wa.me/${phone}`;
  const params = new URLSearchParams({ text: message });

  return `${base}?${params.toString()}`;
}
