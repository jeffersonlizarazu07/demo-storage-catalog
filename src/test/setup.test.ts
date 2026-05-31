import { describe, it, expect } from 'vitest';

describe('Vitest setup', () => {
  it('should work with basic assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('should support DOM matchers from jest-dom', () => {
    const element = document.createElement('button');
    element.textContent = 'Click me';
    document.body.appendChild(element);

    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Click me');
  });
});
