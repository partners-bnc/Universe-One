'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const CELL = 44; // grid square size (px)
const GRID = 'linear-gradient(rgba(18,87,192,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(18,87,192,.07) 1px, transparent 1px)';

/**
 * Light decorative backdrop behind the hero centre: a faded blueprint grid.
 * The grid square under the pointer lights up (soft blue fill + brighter edge) and fades out smoothly
 * once the pointer leaves it, so moving the mouse leaves a short fading trail. Mouse devices only.
 */
export default function HeroBackdrop() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const cellsRef = useRef(null);
  const fade = 'radial-gradient(ellipse 58% 52% at 50% 38%, #000 25%, transparent 78%)';

  useEffect(() => {
    const el = ref.current, layer = cellsRef.current;
    if (!el || !layer || reduce || !window.matchMedia('(hover: hover)').matches) return undefined;
    const lit = new Map(); // "col:row" → cell element (reused)
    let current = '', raf = 0;

    const cellAt = (key, x, y) => {
      let c = lit.get(key);
      if (!c) {
        c = document.createElement('span');
        c.className = 'ob-cell';
        c.style.left = `${x + 1}px`;
        c.style.top = `${y + 1}px`;
        c.style.width = c.style.height = `${CELL - 1}px`;
        layer.appendChild(c);
        lit.set(key, c);
      }
      return c;
    };
    const leave = () => {
      if (current) lit.get(current)?.classList.remove('is-on');
      current = '';
    };
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top;
        if (px < 0 || py < 0 || px > r.width || py > r.height) { leave(); return; }
        // the grid tile is centred horizontally ("center top"), so vertical lines sit at (W - CELL) / 2 + k·CELL
        const x0 = (r.width - CELL) / 2;
        const col = Math.floor((px - x0) / CELL), row = Math.floor(py / CELL);
        const key = `${col}:${row}`;
        if (key === current) return;
        leave();
        current = key;
        cellAt(key, x0 + col * CELL, row * CELL).classList.add('is-on');
      });
    };
    // the grid is re-centred when the width changes, so drop cells built for the old width
    const ro = new ResizeObserver(() => { lit.forEach((c) => c.remove()); lit.clear(); current = ''; });
    ro.observe(el);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', leave);
      lit.forEach((c) => c.remove());
    };
  }, [reduce]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-4 -right-4 overflow-hidden md:-left-8 md:-right-8">
      <div className="absolute inset-0" style={{ WebkitMaskImage: fade, maskImage: fade }}>
        <div className="absolute inset-0" style={{ backgroundImage: GRID, backgroundSize: `${CELL}px ${CELL}px`, backgroundPosition: 'center top' }} />
        {/* lit grid squares are added here */}
        <div ref={cellsRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
