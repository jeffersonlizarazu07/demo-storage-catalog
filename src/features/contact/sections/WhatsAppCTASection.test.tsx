import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WhatsAppCTASection } from './WhatsAppCTASection';

const MOCK_PHONE = '573001234567';

describe('WhatsAppCTASection', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DEFAULT_PHONE', MOCK_PHONE);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function renderSection() {
    return render(<WhatsAppCTASection />);
  }

  it('should render the heading', () => {
    renderSection();
    expect(screen.getByText(/¿prefieres escribirnos por whatsapp\?/i)).toBeInTheDocument();
  });

  it('should render the description', () => {
    renderSection();
    expect(screen.getByText(/respuesta rápida y directa/i)).toBeInTheDocument();
  });

  it('should render a WhatsApp link to the default phone number', () => {
    renderSection();
    const link = screen.getByRole('link', { name: /escríbenos por whatsapp/i });
    const url = new URL(link.getAttribute('href')!);

    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe(`/${MOCK_PHONE}`);
    expect(url.searchParams.get('text')).toBe('Hola, me gustaría obtener más información.');
  });

  it('should open WhatsApp in a new tab with security attributes', () => {
    renderSection();
    const link = screen.getByRole('link', { name: /escríbenos por whatsapp/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
