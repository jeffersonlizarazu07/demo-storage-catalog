import { type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary, DefaultErrorFallback } from './ErrorBoundary';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Component that throws during render. Error boundaries catch errors
 * thrown during the render phase (not in effects or event handlers).
 */
function BuggyComponent({ message = 'Test error' }: { message?: string }): ReactNode {
  throw new Error(message);
}

/**
 * Safe component used to verify normal rendering through the boundary.
 */
function SafeComponent({ label = 'Contenido normal' }: { label?: string }) {
  return <div>{label}</div>;
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('DefaultErrorFallback', () => {
  it('should render the error heading', () => {
    render(<DefaultErrorFallback error={null} onReset={() => {}} />);
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
  });

  it('should render a description message', () => {
    render(<DefaultErrorFallback error={null} onReset={() => {}} />);
    expect(screen.getByText(/ocurrió un error inesperado/i)).toBeInTheDocument();
  });

  it('should render a reload button', () => {
    render(<DefaultErrorFallback error={null} onReset={() => {}} />);
    expect(screen.getByRole('button', { name: /recargar página/i })).toBeInTheDocument();
  });

  it('should display the error message when error is provided', () => {
    render(<DefaultErrorFallback error={new Error('Algo explotó')} onReset={() => {}} />);
    expect(screen.getByText('Algo explotó')).toBeInTheDocument();
  });

  it('should NOT display an error message when error is null', () => {
    render(<DefaultErrorFallback error={null} onReset={() => {}} />);
    // The pre tag should not be present
    expect(screen.queryByRole('button', { name: /recargar página/i })).toBeInTheDocument();
    // Only one button exists; no error details
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('should call onReset when the reload button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<DefaultErrorFallback error={null} onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: /recargar página/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // React logs caught errors to console.error even when caught by error boundary.
    // We suppress this in tests to keep output clean.
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });

  it('should render default fallback when a child throws during render', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recargar página/i })).toBeInTheDocument();
  });

  it('should show the error message in the default fallback', () => {
    render(
      <ErrorBoundary>
        <BuggyComponent message="Custom error message" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should render custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback personalizado</div>}>
        <BuggyComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Fallback personalizado')).toBeInTheDocument();
    // Default fallback should NOT be rendered
    expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument();
  });

  it('should call onError when a child throws', () => {
    const onError = vi.fn();

    render(
      <ErrorBoundary onError={onError}>
        <BuggyComponent message="Error for callback" />
      </ErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Error for callback' }),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });

  it('should call window.location.reload when the reload button is clicked', async () => {
    const user = userEvent.setup();
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /recargar página/i }));
    expect(reloadSpy).toHaveBeenCalledTimes(1);

    reloadSpy.mockRestore();
  });

  it('should allow normal child updates after mounting without error', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <SafeComponent label="Primer render" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Primer render')).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <SafeComponent label="Segundo render" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Segundo render')).toBeInTheDocument();
  });

  it('should NOT interfere with sibling components outside the boundary', () => {
    render(
      <div>
        <p>Fuera del boundary</p>
        <ErrorBoundary>
          <SafeComponent label="Dentro del boundary" />
        </ErrorBoundary>
      </div>,
    );

    expect(screen.getByText('Fuera del boundary')).toBeInTheDocument();
    expect(screen.getByText('Dentro del boundary')).toBeInTheDocument();
  });
});
