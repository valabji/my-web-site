import { lazy, Suspense, useEffect, useRef, useState } from 'react';

/* The three.js scene lives in its own chunk — code-split so it never
   touches first paint. Only loaded once we know WebGL is available. */
const HeroScene = lazy(() => import('./hero3d/HeroScene'));

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function isMobileClass() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 640px), (pointer: coarse)').matches
  );
}

/**
 * Decorative WebGL hero. The caller guarantees WebGL support (see hasWebGL);
 * this component owns the runtime concerns: lazy chunk, suspense placeholder,
 * reduced-motion freeze, mobile DPR/bloom trimming, and pausing the render
 * loop entirely when the hero is scrolled out of view.
 */
export default function Hero3D() {
  const [reduced] = useState(prefersReducedMotion);
  const [mobile] = useState(isMobileClass);
  const [inView, setInView] = useState(true);
  const hostRef = useRef(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion → render a single static frame (demand). Otherwise run the
  // loop only while visible; stop it completely when scrolled away.
  const frameloop = reduced ? 'demand' : inView ? 'always' : 'never';

  return (
    <div className="hero3d" ref={hostRef} aria-hidden="true">
      <Suspense fallback={<div className="hero3d__loading" />}>
        <HeroScene
          reduced={reduced}
          frameloop={frameloop}
          dpr={[1, mobile ? 1.5 : 2]}
          bloom={!mobile}
        />
      </Suspense>
    </div>
  );
}
