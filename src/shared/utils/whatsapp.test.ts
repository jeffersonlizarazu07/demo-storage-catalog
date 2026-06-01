import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getWhatsAppLink } from './whatsapp';

describe('getWhatsAppLink', () => {
  const MOCK_DEFAULT_PHONE = '573001234567';

  beforeEach(() => {
    // Inyectamos un valor controlado para la variable de entorno por defecto
    vi.stubEnv('VITE_DEFAULT_PHONE', MOCK_DEFAULT_PHONE);
  });

  afterEach(() => {
    // Restauramos el entorno original después de cada test
    vi.unstubAllEnvs();
  });

  it('should generate a generic link when no parameters are provided', () => {
    const link = getWhatsAppLink();
    const url = new URL(link);

    // Verificamos el host y el path (teléfono)
    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe(`/${MOCK_DEFAULT_PHONE}`);

    // Verificamos los parámetros semánticamente
    // Esto es mucho más robusto que comparar strings directos porque URLSearchParams
    // codifica espacios como '+' en lugar de '%20', lo cual es semánticamente idéntico para la web.
    expect(url.searchParams.get('text')).toBe('Hola, me gustaría obtener más información.');
  });

  it('should generate a product-specific link when product name is provided', () => {
    const productName = 'Monitor Gamer 4K';
    const link = getWhatsAppLink(productName);
    const url = new URL(link);

    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe(`/${MOCK_DEFAULT_PHONE}`);
    expect(url.searchParams.get('text')).toBe(`Hola, me interesa el producto: ${productName}`);
  });

  it('should use a custom phone number when explicitly provided', () => {
    const customPhone = '1234567890';
    const link = getWhatsAppLink('Mouse', customPhone);
    const url = new URL(link);

    expect(url.pathname).toBe(`/${customPhone}`);
    expect(url.pathname).not.toBe(`/${MOCK_DEFAULT_PHONE}`);
    expect(url.searchParams.get('text')).toBe('Hola, me interesa el producto: Mouse');
  });

  it('should correctly handle special characters in the product name', () => {
    const productName = 'Cafetera Espresso (¡Edición Especial!) & Capuchino';
    const link = getWhatsAppLink(productName);
    const url = new URL(link);

    // Comprobamos que el parser decodifica exactamente el mismo string de entrada,
    // demostrando que los caracteres especiales viajan sin corromper la URL.
    expect(url.searchParams.get('text')).toBe(`Hola, me interesa el producto: ${productName}`);
  });
});
