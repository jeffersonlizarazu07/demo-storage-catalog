import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './Button';

describe('Button', () => {
  it('should render a standard button with children and primary classes by default', () => {
    render(<Button>Click me</Button>);

    // Buscamos el elemento por su rol accesible y texto
    const buttonElement = screen.getByRole('button', { name: /click me/i });

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.tagName).toBe('BUTTON');

    // Verificamos que tenga las clases bases y la variante primary por defecto
    expect(buttonElement.className).toContain('inline-flex');
    expect(buttonElement.className).toContain('bg-primary');
  });

  it('should apply variant classes correctly', () => {
    const { rerender } = render(<Button variant="accent">Accent</Button>);
    let buttonElement = screen.getByRole('button', { name: /accent/i });
    expect(buttonElement.className).toContain('bg-accent');

    rerender(<Button variant="outline">Outline</Button>);
    buttonElement = screen.getByRole('button', { name: /outline/i });
    expect(buttonElement.className).toContain('border-border');

    rerender(<Button variant="ghost">Ghost</Button>);
    buttonElement = screen.getByRole('button', { name: /ghost/i });
    expect(buttonElement.className).toContain('text-muted');
  });

  it('should merge and apply custom classNames passed via props', () => {
    const customClass = 'mt-4 uppercase tracking-widest';
    render(<Button className={customClass}>Custom</Button>);

    const buttonElement = screen.getByRole('button', { name: /custom/i });
    expect(buttonElement.className).toContain(customClass);
    expect(buttonElement.className).toContain('bg-primary'); // Conserva base + variante
  });

  it('should call onClick handler when clicked by user', async () => {
    const onClickMock = vi.fn();
    render(<Button onClick={onClickMock}>Click me</Button>);

    const buttonElement = screen.getByRole('button', { name: /click me/i });

    // Simulación realista de click
    await userEvent.click(buttonElement);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick handler and have disabled attribute when disabled is true', async () => {
    const onClickMock = vi.fn();
    render(
      <Button onClick={onClickMock} disabled>
        Disabled
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: /disabled/i });

    expect(buttonElement).toBeDisabled();

    // Intentamos clickear y verificamos que no se ejecute el handler
    await userEvent.click(buttonElement);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it('should render an "a" anchor tag when as="a" is passed', () => {
    const testHref = 'https://google.com';
    render(
      <Button as="a" href={testHref} target="_blank" rel="noopener noreferrer">
        Link Google
      </Button>,
    );

    // No debe ser rol "button" si es un tag "a" con href
    const linkElement = screen.getByRole('link', { name: /link google/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
    expect(linkElement).toHaveAttribute('href', testHref);
    expect(linkElement).toHaveAttribute('target', '_blank');
  });

  it('should render a Router Link when as="router-link" is passed', () => {
    const testTo = '/catalogo';

    // Envolvemos con MemoryRouter para proveer el contexto de React Router
    render(
      <MemoryRouter>
        <Button as="router-link" to={testTo}>
          Ir al catálogo
        </Button>
      </MemoryRouter>,
    );

    const linkElement = screen.getByRole('link', { name: /ir al catálogo/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A'); // En el DOM real se compila como un <a>
    expect(linkElement).toHaveAttribute('href', testTo);
  });
});
