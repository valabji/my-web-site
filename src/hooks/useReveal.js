import { useEffect, useRef } from 'react';

const mq = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)');
const REDUCED = !!(mq && mq.matches);

let io = null;
function getIO() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );
  return io;
}

/**
 * Reveal an element when it scrolls into view (adds `is-in`).
 * Above-the-fold elements reveal immediately on mount; reduced-motion
 * and no-IntersectionObserver environments jump straight to revealed.
 */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (REDUCED || typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-in');
      return;
    }
    const obs = getIO();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);
  return ref;
}
