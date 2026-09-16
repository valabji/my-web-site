import { useEffect, useRef } from 'react';

const mq = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)');
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Counts a numeric value up from 0 when it enters the viewport.
 * Preserves any non-digit prefix/suffix (e.g. "13+", "500+").
 * Returns a ref to attach to the element whose textContent it drives.
 */
export function useCountUp(raw, { duration = 1100 } = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const m = String(raw).match(/^(\D*)(\d[\d,]*)(\D*)$/);
    if (!m) {
      el.textContent = String(raw);
      return;
    }
    const [, pre, numStr, suf] = m;
    const target = parseInt(numStr.replace(/,/g, ''), 10);
    // Keep final values stable for prerenderers, browser automation, and
    // reduced-motion visitors so crawlers never index temporary zeroes.
    if ((typeof navigator !== 'undefined' && navigator.webdriver) || (mq && mq.matches)) {
      el.textContent = pre + target + suf;
      return;
    }
    el.textContent = pre + '0' + suf;
    let raf = 0;
    let t0 = 0;
    let killed = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const step = (ts) => {
          if (killed) return;
          if (!t0) t0 = ts;
          const p = Math.min(1, (ts - t0) / duration);
          el.textContent = pre + Math.round(easeOut(p) * target) + suf;
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => {
      killed = true;
      obs.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [raw, duration]);
  return ref;
}
