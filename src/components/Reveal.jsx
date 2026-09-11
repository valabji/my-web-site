import { useReveal } from '../hooks/useReveal';

/**
 * Scroll-reveal wrapper. Renders `as` (default div) with the `.reveal`
 * class and an optional stagger via the `--rv-delay` custom property.
 */
export default function Reveal({ as: Tag = 'div', delay, className = '', style, children, ...rest }) {
  const ref = useReveal();
  const cls = ['reveal', className].filter(Boolean).join(' ');
  const mergedStyle = delay != null ? { '--rv-delay': delay, ...style } : style;
  return (
    <Tag ref={ref} className={cls} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}
