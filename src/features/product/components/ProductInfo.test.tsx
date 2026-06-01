import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductInfo } from './ProductInfo';
import type { Product } from '../../../shared/interfaces/product.interface';

const baseProduct: Product = {
  id: 1,
  name: 'Laptop Gamer',
  price: 1500,
  category: 'Electrónica',
  image: 'https://example.com/laptop.jpg',
  description: 'Laptop gaming de alta gama con RTX 4060',
  brand: 'ASUS',
};

describe('ProductInfo', () => {
  it('should render product name, price and description', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.getByText('Laptop Gamer')).toBeInTheDocument();
    expect(screen.getByText('$1500.00')).toBeInTheDocument();
    expect(screen.getByText('Laptop gaming de alta gama con RTX 4060')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.getByText('Electrónica')).toBeInTheDocument();
  });

  it('should render brand when provided', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.getByText(/marca.*ASUS/i)).toBeInTheDocument();
  });

  it('should NOT render brand when brand is undefined', () => {
    const { brand, ...productWithoutBrand } = baseProduct;
    void brand;
    render(<ProductInfo product={productWithoutBrand as Product} />);
    expect(screen.queryByText(/marca/i)).not.toBeInTheDocument();
  });

  it('should render specs table when specs are present', () => {
    const productWithSpecs: Product = {
      ...baseProduct,
      specs: { Procesador: 'Intel i7', RAM: '16 GB DDR5', Almacenamiento: '512 GB SSD' },
    };
    render(<ProductInfo product={productWithSpecs} />);

    expect(screen.getByText('Especificaciones')).toBeInTheDocument();
    expect(screen.getByText('Procesador')).toBeInTheDocument();
    expect(screen.getByText('Intel i7')).toBeInTheDocument();
    expect(screen.getByText('RAM')).toBeInTheDocument();
    expect(screen.getByText('16 GB DDR5')).toBeInTheDocument();
  });

  it('should NOT render specs section when specs is undefined', () => {
    render(<ProductInfo product={baseProduct} />);
    expect(screen.queryByText('Especificaciones')).not.toBeInTheDocument();
  });

  it('should NOT render specs section when specs is empty', () => {
    const productWithEmptySpecs: Product = {
      ...baseProduct,
      specs: {},
    };
    render(<ProductInfo product={productWithEmptySpecs} />);
    expect(screen.queryByText('Especificaciones')).not.toBeInTheDocument();
  });

  it('should render WhatsApp link with target=_blank and rel=noopener', () => {
    render(<ProductInfo product={baseProduct} />);
    const link = screen.getByRole('link', { name: /whatsapp/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render WhatsApp link with href containing product name', () => {
    render(<ProductInfo product={baseProduct} />);
    const link = screen.getByRole('link', { name: /whatsapp/i });
    // URLSearchParams usa `+` para espacios, no `%20`
    expect(link).toHaveAttribute('href', expect.stringContaining('Laptop+Gamer'));
  });
});
