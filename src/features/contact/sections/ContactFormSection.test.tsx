import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactFormSection } from './ContactFormSection';

describe('ContactFormSection', () => {
  function renderForm() {
    return render(<ContactFormSection />);
  }

  describe('initial form state', () => {
    it('should render the form with all required fields', () => {
      renderForm();
      expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
      expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
      expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
    });

    it('should render a submit button', () => {
      renderForm();
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });

    it('should have required attributes on all inputs', () => {
      renderForm();
      expect(screen.getByLabelText('Nombre completo')).toBeRequired();
      expect(screen.getByLabelText('Correo electrónico')).toBeRequired();
      expect(screen.getByLabelText('Mensaje')).toBeRequired();
    });
  });

  describe('interaction', () => {
    it('should allow typing in all fields', async () => {
      const user = userEvent.setup();
      renderForm();

      const nameInput = screen.getByLabelText('Nombre completo');
      const emailInput = screen.getByLabelText('Correo electrónico');
      const messageInput = screen.getByLabelText('Mensaje');

      await user.type(nameInput, 'Juan Pérez');
      await user.type(emailInput, 'juan@example.com');
      await user.type(messageInput, 'Quiero información sobre productos');

      expect(nameInput).toHaveValue('Juan Pérez');
      expect(emailInput).toHaveValue('juan@example.com');
      expect(messageInput).toHaveValue('Quiero información sobre productos');
    });
  });

  describe('submission', () => {
    it('should show success message after submitting the form', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText('Nombre completo'), 'Juan');
      await user.type(screen.getByLabelText('Correo electrónico'), 'juan@test.com');
      await user.type(screen.getByLabelText('Mensaje'), 'Hola, quiero información');

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('¡Mensaje enviado!')).toBeInTheDocument();
      expect(screen.getByText(/gracias por contactarnos/i)).toBeInTheDocument();
    });

    it('should show "Enviar otro mensaje" button after submit', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText('Nombre completo'), 'Juan');
      await user.type(screen.getByLabelText('Correo electrónico'), 'juan@test.com');
      await user.type(screen.getByLabelText('Mensaje'), 'Hola, quiero información');

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByRole('button', { name: /enviar otro mensaje/i })).toBeInTheDocument();
    });

    it('should reset to form when clicking "Enviar otro mensaje"', async () => {
      const user = userEvent.setup();
      renderForm();

      // Fill and submit
      await user.type(screen.getByLabelText('Nombre completo'), 'Juan');
      await user.type(screen.getByLabelText('Correo electrónico'), 'juan@test.com');
      await user.type(screen.getByLabelText('Mensaje'), 'Hola, quiero información');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      // Click "Enviar otro mensaje"
      await user.click(screen.getByRole('button', { name: /enviar otro mensaje/i }));

      // Form should be back
      expect(screen.getByLabelText('Nombre completo')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('should show all error messages when submitting empty form', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument();
    });

    it('should show error for invalid email', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText('Nombre completo'), 'Juan');
      await user.type(screen.getByLabelText('Correo electrónico'), 'not-an-email');
      await user.type(screen.getByLabelText('Mensaje'), 'Hola, quiero información');

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('Ingresa un correo electrónico válido.')).toBeInTheDocument();
    });

    it('should show error for short name (less than 2 characters)', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText('Nombre completo'), 'A');
      await user.type(screen.getByLabelText('Correo electrónico'), 'juan@test.com');
      await user.type(screen.getByLabelText('Mensaje'), 'Hola, quiero información');

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('El nombre debe tener al menos 2 caracteres.')).toBeInTheDocument();
    });

    it('should show error for short message (less than 10 characters)', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText('Nombre completo'), 'Juan');
      await user.type(screen.getByLabelText('Correo electrónico'), 'juan@test.com');
      await user.type(screen.getByLabelText('Mensaje'), 'Corto');

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('El mensaje debe tener al menos 10 caracteres.')).toBeInTheDocument();
    });

    it('should treat whitespace-only values as empty', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.type(screen.getByLabelText('Nombre completo'), '   ');
      await user.type(screen.getByLabelText('Correo electrónico'), '   ');
      await user.type(screen.getByLabelText('Mensaje'), '   ');

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument();
    });

    it('should clear error for a field when user starts typing in it', async () => {
      const user = userEvent.setup();
      renderForm();

      // Submit empty to trigger errors
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
      expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument();

      // Type in the name field — error should clear
      await user.type(screen.getByLabelText('Nombre completo'), 'J');
      expect(screen.queryByText('El nombre es obligatorio.')).not.toBeInTheDocument();
    });

    it('should set aria-invalid on fields with errors', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Correo electrónico')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Mensaje')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should link error messages with aria-describedby', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      const nameInput = screen.getByLabelText('Nombre completo');
      expect(nameInput).toHaveAttribute('aria-describedby', 'contact-name-error');
      expect(document.getElementById('contact-name-error')).toBeInTheDocument();
    });

    it('should not submit if there are validation errors', async () => {
      const user = userEvent.setup();
      renderForm();

      // Only fill one field
      await user.type(screen.getByLabelText('Nombre completo'), 'Juan');
      await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));

      // Should still show the form (not the success message)
      expect(screen.queryByText('¡Mensaje enviado!')).not.toBeInTheDocument();
      expect(screen.getByText('El correo electrónico es obligatorio.')).toBeInTheDocument();
      expect(screen.getByText('El mensaje es obligatorio.')).toBeInTheDocument();
    });
  });
});
