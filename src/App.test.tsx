import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('should render without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
  });

  it('should render the main layout with navigation', () => {
    render(<App />);
    // MainLayout incluye un nav con los links de navegación
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render the home page by default', async () => {
    render(<App />);
    // HeroSection heading — la Home es lazy-loaded, esperamos que resuelva
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/descubre/i);
  });
});
