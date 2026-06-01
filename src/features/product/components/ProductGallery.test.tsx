import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductGallery } from './ProductGallery';

describe('ProductGallery', () => {
  it('should render image with correct src and alt text', () => {
    render(<ProductGallery image="https://example.com/product.jpg" name="Teclado RGB" />);
    const img = screen.getByRole('img', { name: /teclado rgb/i });
    expect(img).toHaveAttribute('src', 'https://example.com/product.jpg');
  });

  it('should render placeholder when image is empty string', () => {
    render(<ProductGallery image="" name="Producto Sin Imagen" />);
    const img = screen.getByRole('img', { name: /producto sin imagen/i });
    expect(img).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });
});
