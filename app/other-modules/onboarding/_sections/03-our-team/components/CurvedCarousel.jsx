'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Avatar from './Avatar';

/*
 * 3D curved photo carousel (matches the reference design).
 * The photos sit on the inside of a cylinder and the camera is at the cylinder's centre
 * (CSS perspective = radius). So we see one front arc of a turning circle: the middle cards are
 * the smallest, and cards grow wider, taller and more tilted towards the left and right edges.
 * The circle turns continuously from left to right; hover pauses it and it can be dragged.
 */

const STEP = 0.32; // angle between neighbouring cards on the circle (radians)
const GAP = 0.03; // gap between cards, as a share of card width
const SPEED = 0.06; // radians per second, positive = moves to the right
const ASPECT = 1.45; // card height / width (centre card)
const GROW = 0.18; // cards get up to 18% taller towards the left and right edges (width unchanged)
const MAX_GAP = 0.12; // on short screens the cards get narrower and the gap may grow up to this share
const PAD = 28; // extra room above and below so card shadows are never cut off (less on short screens)

/** Height taken by everything in the hero section except this strip (so the strip can fill the rest). */
function otherHeroHeight(el) {
  const section = el.closest('section');
  const strip = el.parentElement;
  if (!section || !strip) return 0;
  const cs = getComputedStyle(section);
  const kids = [...section.children].filter((c) => c !== strip && getComputedStyle(c).position !== 'absolute');
  const gaps = (parseFloat(cs.rowGap) || 0) * kids.length; // gaps between all blocks, the strip included
  const pads = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
  return kids.reduce((sum, c) => sum + c.getBoundingClientRect().height, gaps + pads);
}

export default function CurvedCarousel({ people, loading }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef(null);
  const cardRefs = useRef([]);
  const state = useRef({ offset: 0, paused: false, dragging: false, lastX: 0, visible: true });
  const [geo, setGeo] = useState({ w: 130, h: 189, R: 515, limit: 0.95, view: 0.9, step: STEP, height: 330 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const measure = () => {
      const W = el.clientWidth;
      const vh = window.innerHeight;
      // how many cards fill the frame: the centre card plus 3 / 2 / 1 on each side
      const across = W >= 1100 ? 7 : W >= 640 ? 5 : 3;
      const pad = Math.round(Math.min(PAD, vh * 0.025));
      // keep the whole hero on one screen: the strip may use whatever height is left after the other
      // blocks in the hero (heading, stats, paddings and gaps)
      const budget = Math.max(170, vh - otherHeroHeight(el) - 8);
      // camera at the circle's centre: a card at angle a appears at x = R·tan(a). `half` is the angle
      // from the centre to the screen edge; `across` cards (each `step` apart) span it, so R follows.
      const shape = (half, wMax) => {
        const step = (2 * half) / across;
        const R = W / 2 / Math.tan(half);
        const w = Math.round(Math.min(220, wMax, (R * step) / (1 + GAP)));
        const view = Math.min(1.3, Math.atan((W / 2 + w) / R));
        return { w, h: Math.round(w * ASPECT), R, view, step };
      };
      const tall = ({ h, view }) => (h * (1 + GROW)) / Math.cos(view * 0.9) + 24 + 2 * pad;
      // too tall? first flatten the curve a little (edge cards grow less, so the centre card can stay
      // big); if still too tall, make the cards narrower and close up the spacing only partly, so
      // the frame still holds few cards (the gaps grow to at most 12% of a card)
      let geoNow = shape((across * STEP) / 2, 220);
      for (let half = (across * STEP) / 2; half >= 0.9 && tall(geoNow) > budget; half -= 0.01) geoNow = shape(half, 220);
      const half = Math.atan(W / 2 / geoNow.R);
      for (let wMax = geoNow.w; wMax >= 60 && tall(geoNow) > budget; wMax -= 2) {
        const g = shape(half, wMax);
        geoNow = { ...g, step: Math.min(g.step, (g.w * (1 + MAX_GAP)) / g.R) };
      }
      const { w, h, R, view, step } = geoNow;
      // only hide a card once its inner edge is past the screen edge, so cards scroll in and out
      // instead of popping (half a card on the circle is w / 2R radians, plus a small margin)
      const limit = Math.min(1.45, Math.atan(W / 2 / R) + (0.6 * w) / R + 0.05);
      setGeo({ w, h, R, limit, view, pad, step, height: Math.round(tall(geoNow)) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const section = el.closest('section');
    if (section) [...section.children].forEach((c) => { if (c !== el.parentElement) ro.observe(c); });
    window.addEventListener('resize', measure);
    const io = new IntersectionObserver(([e]) => { state.current.visible = e.isIntersecting; });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // only people with a photo go on the circle; repeat them so the visible arc is always full
  const items = useMemo(() => {
    const withPhoto = people.filter((p) => p.photo);
    if (!withPhoto.length) return [];
    const needed = Math.ceil((2 * geo.limit) / geo.step) + 4;
    const reps = Math.max(1, Math.ceil(needed / withPhoto.length));
    return Array.from({ length: reps }).flatMap((_, r) => withPhoto.map((p) => ({ ...p, key: `${r}-${p.id}` })));
  }, [people, geo.limit, geo.step]);

  // position of a card at angle a on the circle (camera at the centre, so perspective = R)
  const pose = (a) => `translate3d(${geo.R * Math.sin(a)}px,0,${geo.R * (1 - Math.cos(a))}px) rotateY(${-a}rad)`;

  useEffect(() => {
    if (!items.length) return undefined;
    let raf = 0, last = performance.now();
    const total = items.length * geo.step;
    const place = () => {
      const s = state.current;
      items.forEach((_, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        let a = ((i * geo.step + s.offset) % total + total) % total;
        if (a > total / 2) a -= total;
        if (Math.abs(a) > geo.limit) {
          card.style.visibility = 'hidden';
          return;
        }
        // grow the card's real height (not a scale, so photos are not stretched) from the centre outwards
        const t = Math.min(1, Math.abs(a) / geo.view);
        const ch = geo.h * (1 + GROW * t * t * (3 - 2 * t));
        card.style.visibility = 'visible';
        card.style.height = `${ch}px`;
        card.style.top = `${-ch / 2}px`;
        card.style.transform = pose(a);
      });
    };
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = state.current;
      if (!s.visible || document.hidden) return;
      if (!reduce && !s.paused && !s.dragging) s.offset += SPEED * dt;
      place();
    };
    place();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // pose depends only on geo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, geo, reduce]);

  const onPointerDown = (e) => {
    state.current.dragging = true;
    state.current.lastX = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const s = state.current;
    if (!s.dragging) return;
    // convert screen movement at the centre into an angle on the circle
    s.offset += (e.clientX - s.lastX) / geo.R;
    s.lastX = e.clientX;
  };
  const endDrag = () => { state.current.dragging = false; };

  const fadeX = 'linear-gradient(90deg, transparent 0%, #000 7%, #000 93%, transparent 100%)';
  const fadeY = `linear-gradient(180deg, transparent 0, #000 ${geo.pad ?? PAD}px, #000 calc(100% - ${geo.pad ?? PAD}px), transparent 100%)`;
  const box = { width: geo.w, height: geo.h, left: -geo.w / 2, top: -geo.h / 2 };

  return (
    <div
      ref={wrapRef}
      className="relative w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
      style={{
        height: geo.height,
        perspective: `${geo.R}px`,
        WebkitMaskImage: `${fadeX}, ${fadeY}`,
        WebkitMaskComposite: 'source-in',
        maskImage: `${fadeX}, ${fadeY}`,
        maskComposite: 'intersect',
      }}
      onMouseEnter={() => { state.current.paused = true; }}
      onMouseLeave={() => { state.current.paused = false; endDrag(); }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      aria-label="Team photos"
      role="region"
    >
      <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d' }}>
        {loading
          ? [-3, -2, -1, 0, 1, 2, 3].map((k) => (
              <div key={k} className="absolute animate-pulse rounded-[16px] bg-[#eef3fb]" style={{ ...box, transform: pose(k * geo.step) }} />
            ))
          : items.map((p, i) => (
              <figure
                key={p.key}
                ref={(node) => { cardRefs.current[i] = node; }}
                className="group absolute m-0 overflow-hidden rounded-[16px] bg-[#eef3fb] shadow-[0_14px_30px_-16px_rgba(13,27,61,.45)] will-change-transform"
                style={{ ...box, visibility: 'hidden', backfaceVisibility: 'hidden' }}
              >
                <Avatar person={p} className="pointer-events-none h-full w-full" textClass="text-[26px]" />
                <figcaption className="pointer-events-none absolute inset-x-1.5 bottom-1.5 translate-y-2 rounded-lg bg-white/92 px-2 py-1.5 opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="block truncate text-[11.5px] font-bold text-[var(--ob-ink)]">{p.name}</span>
                  {p.role ? <span className="block truncate text-[10.5px] text-[var(--ob-muted)]">{p.role}</span> : null}
                </figcaption>
              </figure>
            ))}
      </div>
    </div>
  );
}
