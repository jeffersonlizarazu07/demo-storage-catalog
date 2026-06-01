import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  const categories = ['Todas', 'Electrónica', 'Accesorios', 'Hogar'] as const;

  it('should render all categories as radio buttons', () => {
    render(<FilterBar categories={categories} selected="Todas" onSelect={vi.fn()} />);

    const radioGroup = screen.getByRole('radiogroup', { name: /filtrar por categoría/i });
    expect(radioGroup).toBeInTheDocument();

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    expect(radios[0]).toHaveAccessibleName('Todas');
    expect(radios[1]).toHaveAccessibleName('Electrónica');
  });

  it('should mark the selected category as checked', () => {
    render(<FilterBar categories={categories} selected="Accesorios" onSelect={vi.fn()} />);

    const selectedRadio = screen.getByRole('radio', { name: 'Accesorios' });
    expect(selectedRadio).toBeChecked();

    const unselectedRadio = screen.getByRole('radio', { name: 'Electrónica' });
    expect(unselectedRadio).not.toBeChecked();
  });

  it('should call onSelect with the category name when clicked', async () => {
    const handleSelect = vi.fn();
    render(<FilterBar categories={categories} selected="Todas" onSelect={handleSelect} />);

    await userEvent.click(screen.getByRole('radio', { name: 'Hogar' }));

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith('Hogar');
  });

  it('should have accessible aria-checked attribute on each radio button', () => {
    render(<FilterBar categories={categories} selected="Todas" onSelect={vi.fn()} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio, index) => {
      const isSelected = categories[index] === 'Todas';
      expect(radio).toHaveAttribute('aria-checked', String(isSelected));
    });
  });
});
