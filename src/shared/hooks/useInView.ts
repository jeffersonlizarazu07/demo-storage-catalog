import { useCallback, useEffect, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Observa si un elemento entra en el viewport usando IntersectionObserver.
 * Usa callback ref para funcionar correctamente incluso cuando el elemento
 * se monta/desmonta condicionalmente (ej. skeleton → contenido real).
 *
 * Por defecto se dispara una sola vez (once=true).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
}: UseInViewOptions = {}) {
  const [inView, setInView] = useState(false);
  // Almacenamos el elemento actual para poder desobservarlo en el cleanup
  const [element, setElement] = useState<T | null>(null);

  // Callback ref — React lo llama cada vez que el elemento cambia
  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element, threshold, rootMargin, once]);

  return { ref, inView };
}
