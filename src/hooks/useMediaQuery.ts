import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

/**
 * Hook to track window dimensions
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook to check if viewport is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const { width } = useWindowSize();
  return width < breakpoint;
}

/**
 * Hook to check if viewport is tablet
 */
export function useIsTablet(minBreakpoint: number = 768, maxBreakpoint: number = 1024): boolean {
  const { width } = useWindowSize();
  return width >= minBreakpoint && width < maxBreakpoint;
}

/**
 * Hook to check if viewport is desktop
 */
export function useIsDesktop(breakpoint: number = 1024): boolean {
  const { width } = useWindowSize();
  return width >= breakpoint;
}
