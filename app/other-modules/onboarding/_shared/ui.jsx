'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';

const EASE = [0.2, 0.7, 0.1, 1];

/** Fades and lifts its children into view once, as the user scrolls. */
export function Reveal({ children, delay = 0, y = 26, className = '', as = 'div' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** Staggers direct <RevealItem> children. */
export function RevealGroup({ children, className = '', stagger = 0.07 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
    >
      {children}
    </motion.div>
  );
}

/** Headline whose words rise out of a mask, one after another. */
export function SplitHeading({ children, className = '', as = 'h2' }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.h2;
  const parts = [];
  // children may mix plain strings and <b>/<em> elements; split strings into words, keep elements whole
  const walk = (node) => {
    if (typeof node === 'string') node.split(/(\s+)/).forEach((w) => w && parts.push(w));
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node) parts.push(node);
  };
  walk(children);
  return (
    <Tag
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ show: { transition: { staggerChildren: 0.045 } } }}
    >
      {parts.map((p, i) =>
        typeof p === 'string' && /^\s+$/.test(p) ? (
          p
        ) : (
          <span key={i} className="inline-block overflow-hidden align-top pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: '110%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } }}
            >
              {p}
            </motion.span>
          </span>
        )
      )}
    </Tag>
  );
}

/** Counts up from 0 when scrolled into view. */
export function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

// light, glassy blue fill for small cards
const TINT_BG = 'linear-gradient(160deg, #f8fbff 0%, #eef4fe 55%, #e8f0fd 100%)';

/** Liquid-glass surface with soft colour inside it and a sheen that follows the pointer. */
export function Glass({ children, className = '', hover = false, tint = false, orbs = false, as = 'div', ...rest }) {
  const Tag = as;
  const onPointerMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <Tag
      className={`ob-glass ${tint ? 'ob-tint' : ''} ${hover ? 'is-hover' : ''} ${className}`}
      onPointerMove={onPointerMove}
      {...rest}
      // set inline as well as in CSS so a stale cached stylesheet can't bring back old backgrounds
      style={{ background: tint ? TINT_BG : '#FFFFFF', ...rest.style }}
    >
      {orbs ? (
        <span className="ob-glass-bg" aria-hidden="true">
          <i className="o1" />
          <i className="o2" />
          <i className="o3" />
        </span>
      ) : null}
      {children}
    </Tag>
  );
}

export function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export function Eyebrow({ children, className = '' }) {
  return <div className={`ob-eyebrow ${className}`}>{children}</div>;
}
