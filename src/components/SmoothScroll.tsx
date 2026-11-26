import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const setSmoothScroll = (enabled: boolean) => {
  if (lenisInstance) {
    if (enabled) lenisInstance.start();
    else lenisInstance.stop();
  }
};

export const SmoothScroll: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const prevScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });
    lenisInstance = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Intercept in-page hash anchors for smooth gliding
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.button !== 0) return;
      const target = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;
      const element = document.querySelector(href);
      if (element) {
        e.preventDefault();
        lenis.scrollTo(element as HTMLElement, { offset: -70, duration: 1.2 });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
      document.documentElement.style.scrollBehavior = prevScrollBehavior;
    };
  }, []);

  return null;
};
