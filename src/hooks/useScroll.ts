import { useState, useEffect, useRef } from 'react';

interface UseScrollOptions {
  threshold?: number;
  delay?: number;
}

interface ScrollState {
  scrollY: number;
  scrollX: number;
  scrollDirection: 'up' | 'down' | null;
  isScrolled: boolean;
  isScrollingUp: boolean;
  isScrollingDown: boolean;
}

/**
 * Hook to track scroll position and direction
 */
export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { threshold = 50, delay = 100 } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollX: 0,
    scrollDirection: null,
    isScrolled: false,
    isScrollingUp: false,
    isScrollingDown: false,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';

      setScrollState({
        scrollY,
        scrollX,
        scrollDirection: direction,
        isScrolled: scrollY > threshold,
        isScrollingUp: direction === 'up',
        isScrollingDown: direction === 'down',
      });

      lastScrollY.current = scrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setTimeout(updateScrollState, delay);
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState(); // Initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, delay]);

  return scrollState;
}

/**
 * Hook to check if element is in viewport
 */
export function useInView(
  ref: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInView;
}

export default useScroll;
