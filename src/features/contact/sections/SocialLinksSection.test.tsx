import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialLinksSection } from './SocialLinksSection';

describe('SocialLinksSection', () => {
  function renderSection() {
    return render(<SocialLinksSection />);
  }

  it('should render the heading', () => {
    renderSection();
    expect(screen.getByText('Síguenos en redes')).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    renderSection();
    expect(screen.getByText(/entérate de las últimas novedades/i)).toBeInTheDocument();
  });

  it('should render all 4 social media links', () => {
    renderSection();
    expect(screen.getByRole('link', { name: 'Ir a Facebook' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir a Instagram' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir a Twitter / X' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir a TikTok' })).toBeInTheDocument();
  });

  it('should open all links in a new tab with security attributes', () => {
    renderSection();
    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should have social names visible on desktop (hidden on mobile via sm:inline)', () => {
    renderSection();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Twitter / X')).toBeInTheDocument();
    expect(screen.getByText('TikTok')).toBeInTheDocument();
  });
});
