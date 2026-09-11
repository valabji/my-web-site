import { useEffect } from 'react';

/**
 * Publishes pointer + scroll signal on :root as custom properties:
 *   --ptr-x / --ptr-y  (normalized -1..1, fine pointers only)
 *   --scroll-y         (px) and --scroll-p (0..1 page progress)
 * Consumed by the fixed parallax scene layers and the hero depth.
 */
export function usePointerScene() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ptr-x', '0');
    root.style.setProperty('--ptr-y', '0');
    root.style.setProperty('--scroll-p', '0');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

    let raf = 0;
    let px = 0;
    let py = 0;
    let sy = 0;

    const write = () => {
      raf = 0;
      root.style.setProperty('--ptr-x', px.toFixed(3));
      root.style.setProperty('--ptr-y', py.toFixed(3));
      root.style.setProperty('--scroll-y', sy.toFixed(1) + 'px');
      const max = document.documentElement.scrollHeight - innerHeight || 1;
      root.style.setProperty('--scroll-p', Math.min(1, sy / max).toFixed(4));
    };
    const onMove = (e) => {
      if (!fine) return;
      px = (e.clientX / innerWidth) * 2 - 1;
      py = (e.clientY / innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(write);
    };
    const onScroll = () => {
      sy = window.scrollY;
      if (!raf) raf = requestAnimationFrame(write);
    };

    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    onScroll();
    return () => {
      removeEventListener('pointermove', onMove);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}
