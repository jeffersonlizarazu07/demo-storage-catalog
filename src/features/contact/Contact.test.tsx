import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Contact } from './Contact';

// Mockeamos useInView para evitar dependencia de IntersectionObserver
// y poder controlar el estado de animación
vi.mock('../../shared/hooks/useInView', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

describe('Contact page', () => {
  beforeEach(() => {
    // Los mocks de vi.mock persisten, no necesitamos setup especial
  });

  function renderContact() {
    return render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );
  }

  it('should render the page title', () => {
    renderContact();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Contacto');
  });

  it('should render the page description', () => {
    renderContact();
    expect(screen.getByText(/estamos aquí para ayudarte/i)).toBeInTheDocument();
  });

  it('should render ContactInfoSection with contact details', () => {
    renderContact();
    // ContactInfoSection tiene 3 tarjetas: Dirección, Correo, Teléfono
    expect(screen.getByText('Dirección')).toBeInTheDocument();
    expect(screen.getByText('Cra 45 # 23-12, Oficina 302')).toBeInTheDocument();
    expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByText('contacto@techstore.com')).toBeInTheDocument();
    expect(screen.getByText('Teléfono')).toBeInTheDocument();
    expect(screen.getByText('+57 320 952 0302')).toBeInTheDocument();
  });

  it('should render WhatsAppCTASection', () => {
    renderContact();
    expect(screen.getByRole('link', { name: /escríbenos por whatsapp/i })).toBeInTheDocument();
  });

  it('should render ContactFormSection with form fields', () => {
    renderContact();
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /correo electrónico/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  });

  it('should render SocialLinksSection with social media links', () => {
    renderContact();
    expect(screen.getByRole('link', { name: /facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument();
  });

  it('should render the sections inside a <section> element', () => {
    renderContact();
    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('mx-auto');
  });

  /* ── Form interactions ── */

  describe('form interactions', () => {
    it('should allow typing in the name field', async () => {
      const user = userEvent.setup();
      renderContact();

      const nameInput = screen.getByLabelText(/nombre completo/i);
      await user.type(nameInput, 'Juan Pérez');

      expect(nameInput).toHaveValue('Juan Pérez');
    });

    it('should allow typing in the email field', async () => {
      const user = userEvent.setup();
      renderContact();

      const emailInput = screen.getByRole('textbox', { name: /correo electrónico/i });
      await user.type(emailInput, 'juan@example.com');

      expect(emailInput).toHaveValue('juan@example.com');
    });

    it('should allow typing in the message field', async () => {
      const user = userEvent.setup();
      renderContact();

      const messageInput = screen.getByLabelText(/mensaje/i);
      await user.type(messageInput, 'Hola, me interesa un producto.');

      expect(messageInput).toHaveValue('Hola, me interesa un producto.');
    });

    it('should show success message after form submission', async () => {
      const user = userEvent.setup();
      renderContact();

      await user.type(screen.getByLabelText(/nombre completo/i), 'Juan Pérez');
      await user.type(
        screen.getByRole('textbox', { name: /correo electrónico/i }),
        'juan@example.com',
      );
      await user.type(screen.getByLabelText(/mensaje/i), 'Quiero información');

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('¡Mensaje enviado!')).toBeInTheDocument();
      expect(screen.getByText(/gracias por contactarnos/i)).toBeInTheDocument();
    });

    it('should reset the form when clicking "Enviar otro mensaje"', async () => {
      const user = userEvent.setup();
      renderContact();

      // Submit first
      await user.type(screen.getByLabelText(/nombre completo/i), 'Juan');
      await user.type(
        screen.getByRole('textbox', { name: /correo electrónico/i }),
        'juan@test.com',
      );
      await user.type(screen.getByLabelText(/mensaje/i), 'Test, quiero info');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      // Verify success
      expect(screen.getByText('¡Mensaje enviado!')).toBeInTheDocument();

      // Click reset
      await user.click(screen.getByRole('button', { name: /enviar otro mensaje/i }));

      // Form should be back
      expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
      expect(screen.queryByText('¡Mensaje enviado!')).not.toBeInTheDocument();
    });
  });
});
