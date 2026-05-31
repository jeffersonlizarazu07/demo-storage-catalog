/**
 * Genera un enlace de WhatsApp con mensaje predefinido.
 * @param productName - Nombre del producto para incluir en el mensaje
 * @param phone - Número de teléfono en formato internacional sin '+' (ej: 573209520302)
 * @returns URL completa de WhatsApp
 */
export function getWhatsAppLink(
  productName?: string,
  phone: string = import.meta.env.VITE_DEFAULT_PHONE,
): string {
  const message = productName
    ? `Hola, me interesa el producto: ${productName}`
    : 'Hola, me gustaría obtener más información.';

  const base = `https://wa.me/${phone}`;
  const params = new URLSearchParams({ text: message });

  return `${base}?${params.toString()}`;
}
