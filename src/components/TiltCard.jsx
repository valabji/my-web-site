import { useMemo } from 'react';
import { useTilt } from '../hooks/useTilt';
import { useReveal } from '../hooks/useReveal';

function mergeRefs(refs) {
  return (node) => {
    for (const r of refs) {
      if (!r) continue;
      if (typeof r === 'function') r(node);
      else r.current = node;
    }
  };
}

/**
 * Pointer-tilt card. Optionally also acts as a scroll-reveal element
 * (`reveal`) and shows a pointer-tracking glare sheen (`glare`).
 * Tilt + reveal can live on the same node — refs are merged.
 */
export default function TiltCard({
  as: Tag = 'article',
  reveal = false,
  glare = false,
  max = 5,
  delay,
  className = '',
  style,
  children,
  ...rest
}) {
  const tiltRef = useTilt({ max, glare });
  const revealRef = useReveal();
  const setRef = useMemo(
    () => (reveal ? mergeRefs([tiltRef, revealRef]) : tiltRef),
    [reveal, tiltRef, revealRef]
  );
  const cls = ['tilt-3d', glare && 'glare', reveal && 'reveal', className]
    .filter(Boolean)
    .join(' ');
  const mergedStyle = delay != null ? { '--rv-delay': delay, ...style } : style;
  return (
    <Tag ref={setRef} className={cls} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}
