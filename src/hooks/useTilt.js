import { useEffect, useRef } from 'react';

const mqReduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)');
const mqFine = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)');

/**
 * Pointer-driven 3D tilt. Writes --rx/--ry (and --gx/--gy when glare)
 * to the element; the CSS `.tilt-3d` rule turns those into a transform.
 * No-ops on touch/coarse pointers and under reduced-motion.
 */
export function useTilt({ max = 6.5, glare = false } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if ((mqReduce && mqReduce.matches) || !(mqFine && mqFine.matches)) return;

    let raf = 0;
    let rect = null;
    let px = 0.5;
    let py = 0.5;

    const apply = () => {
      raf = 0;
      el.style.setProperty('--rx', ((0.5 - py) * 2 * max).toFixed(2) + 'deg');
      el.style.setProperty('--ry', ((px - 0.5) * 2 * max).toFixed(2) + 'deg');
      if (glare) {
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      }
    };
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      px = (e.clientX - rect.left) / rect.width;
      py = (e.clientY - rect.top) / rect.height;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => {
      rect = el.getBoundingClientRect();
      el.dataset.tilt = 'on';
      el.style.willChange = 'transform';
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      rect = null;
      el.dataset.tilt = 'off';
      el.style.willChange = '';
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max, glare]);
  return ref;
}
