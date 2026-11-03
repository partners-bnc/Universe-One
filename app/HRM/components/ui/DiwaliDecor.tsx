'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

// Controlled by HR via Admin > Home Screen Settings (no date logic here).

// All lanterns are crisp and full-size; alternating drops give a natural, layered look.
const LANTERNS = [
  { left: 8, drop: 34, size: 40, c1: '#fcd34d', c2: '#d97706', dur: 4.6, delay: 0.2 },
  { left: 15, drop: 10, size: 36, c1: '#fb7185', c2: '#be123c', dur: 5.2, delay: 0.8 },
  { left: 23, drop: 40, size: 42, c1: '#fb923c', c2: '#c2410c', dur: 4.8, delay: 1.2 },
  { left: 31, drop: 12, size: 36, c1: '#f472b6', c2: '#9d174d', dur: 5.4, delay: 0.4 },
  { left: 39, drop: 44, size: 42, c1: '#fbbf24', c2: '#b45309', dur: 4.4, delay: 0.1 },
  { left: 47, drop: 14, size: 36, c1: '#fb7185', c2: '#9f1239', dur: 5.0, delay: 0.7 },
  { left: 55, drop: 52, size: 44, c1: '#fb923c', c2: '#c2410c', dur: 4.7, delay: 1.1 },
  { left: 63, drop: 14, size: 36, c1: '#fcd34d', c2: '#b45309', dur: 5.3, delay: 0.5 },
  { left: 71, drop: 56, size: 44, c1: '#f472b6', c2: '#9d174d', dur: 4.5, delay: 0.9 },
  { left: 79, drop: 16, size: 38, c1: '#fbbf24', c2: '#d97706', dur: 5.1, delay: 0.3 },
  { left: 86, drop: 50, size: 44, c1: '#fb7185', c2: '#be123c', dur: 4.9, delay: 1.0 },
  { left: 93, drop: 22, size: 40, c1: '#fb923c', c2: '#c2410c', dur: 5.2, delay: 0.6 },
];

function Lantern({ c1, c2, size, drop, id }: { c1: string; c2: string; size: number; drop: number; id: number }) {
  const w = size;
  const h = size * 1.3;
  const cx = w / 2;
  const top = drop;
  const tail = 34;
  const u = (n: number) => `${n}-${id}`; // unique gradient ids per lantern

  const bodyTop = top + 13; // below the crown
  const bodyH = h - 13;
  const mid = bodyTop + bodyH / 2;
  const bodyBottom = bodyTop + bodyH;

  // barrel outline: bulges in the middle, pinches at both ends
  const barrel = `M${w * 0.26} ${bodyTop}
    C${-w * 0.1} ${bodyTop + bodyH * 0.22} ${-w * 0.1} ${bodyTop + bodyH * 0.78} ${w * 0.26} ${bodyBottom}
    L${w * 0.74} ${bodyBottom}
    C${w * 1.1} ${bodyTop + bodyH * 0.78} ${w * 1.1} ${bodyTop + bodyH * 0.22} ${w * 0.74} ${bodyTop} Z`;

  return (
    <svg width={w} height={top + h + tail} viewBox={`0 0 ${w} ${top + h + tail}`} className="overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={u(1)} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c2} />
          <stop offset="30%" stopColor={c1} />
          <stop offset="50%" stopColor="#fff0b8" />
          <stop offset="70%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <radialGradient id={u(2)} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffbe0" stopOpacity="1" />
          <stop offset="35%" stopColor="#ffe08a" stopOpacity="0.85" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={u(3)} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd45a" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#ff9f1c" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ff7a00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={u(4)} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff1a8" />
          <stop offset="50%" stopColor="#e0a21a" />
          <stop offset="100%" stopColor="#8a5a08" />
        </linearGradient>
      </defs>

      {/* wide, soft outer glow */}
      <ellipse className="dv-glow" cx={cx} cy={mid} rx={w * 1.15} ry={bodyH * 0.82} fill={`url(#${u(3)})`} />

      {/* crown: ring, finial and dome */}
      <circle cx={cx} cy={top + 3} r="2.6" fill="none" stroke={`url(#${u(4)})`} strokeWidth="1.3" />
      <path d={`M${cx} ${top + 5} l-2.2 4 h4.4 z`} fill={`url(#${u(4)})`} />
      <path d={`M${w * 0.3} ${top + 13} Q${cx} ${top + 4} ${w * 0.7} ${top + 13} Z`} fill={`url(#${u(4)})`} />
      <rect x={w * 0.26} y={top + 12} width={w * 0.48} height="3.2" rx="1.6" fill={`url(#${u(4)})`} />

      {/* body */}
      <path d={barrel} fill={`url(#${u(1)})`} />

      {/* light glowing from inside */}
      <ellipse className="dv-flame" cx={cx} cy={mid} rx={w * 0.3} ry={bodyH * 0.36} fill={`url(#${u(2)})`} />

      {/* carved panels (glowing cut-outs) */}
      <g fill="#fff7d0" fillOpacity="0.88">
        <path d={`M${cx} ${mid - bodyH * 0.27} L${cx + w * 0.1} ${mid} L${cx} ${mid + bodyH * 0.27} L${cx - w * 0.1} ${mid} Z`} />
        <path d={`M${w * 0.2} ${mid - bodyH * 0.1} L${w * 0.27} ${mid} L${w * 0.2} ${mid + bodyH * 0.1} L${w * 0.13} ${mid} Z`} fillOpacity="0.7" />
        <path d={`M${w * 0.8} ${mid - bodyH * 0.1} L${w * 0.87} ${mid} L${w * 0.8} ${mid + bodyH * 0.1} L${w * 0.73} ${mid} Z`} fillOpacity="0.7" />
        <circle cx={cx} cy={mid - bodyH * 0.36} r={w * 0.028} />
        <circle cx={cx} cy={mid + bodyH * 0.36} r={w * 0.028} />
      </g>

      {/* gold ribs */}
      <g stroke="#ffe08a" strokeOpacity="0.9" strokeWidth="1" fill="none" strokeLinecap="round">
        <path d={`M${w * 0.36} ${bodyTop} Q${w * 0.02} ${mid} ${w * 0.36} ${bodyBottom}`} />
        <path d={`M${w * 0.64} ${bodyTop} Q${w * 0.98} ${mid} ${w * 0.64} ${bodyBottom}`} />
        <path d={`M${cx} ${bodyTop} L${cx} ${bodyBottom}`} strokeOpacity="0.35" />
      </g>

      {/* top & bottom bands with a row of tiny beads */}
      {[bodyTop, bodyBottom - 3.2].map((y, k) => (
        <g key={k}>
          <rect x={w * 0.24} y={y} width={w * 0.52} height="3.2" rx="1.6" fill={`url(#${u(4)})`} />
          {Array.from({ length: 5 }).map((_, q) => (
            <circle key={q} cx={w * 0.3 + q * w * 0.1} cy={y + 1.6} r="0.7" fill="#fff6c9" />
          ))}
        </g>
      ))}

      {/* bottom cone, bell and beaded tassel */}
      <path d={`M${w * 0.3} ${bodyBottom + 3} L${cx} ${bodyBottom + 9} L${w * 0.7} ${bodyBottom + 3} Z`} fill={`url(#${u(4)})`} />
      <line x1={cx} y1={bodyBottom + 9} x2={cx} y2={bodyBottom + 15} stroke="#d4a017" strokeWidth="1" />
      <path d={`M${cx - 3.2} ${bodyBottom + 20} Q${cx} ${bodyBottom + 13} ${cx + 3.2} ${bodyBottom + 20} Z`} fill={`url(#${u(4)})`} />
      <circle cx={cx} cy={bodyBottom + 21} r="1.2" fill="#fff1a8" />
      <g stroke="#e0a21a" strokeWidth="0.9" strokeLinecap="round">
        <line x1={cx - 3} y1={bodyBottom + 20} x2={cx - 5.5} y2={bodyBottom + 28} />
        <line x1={cx} y1={bodyBottom + 21} x2={cx} y2={bodyBottom + 30} />
        <line x1={cx + 3} y1={bodyBottom + 20} x2={cx + 5.5} y2={bodyBottom + 28} />
      </g>
      <circle cx={cx - 5.5} cy={bodyBottom + 29} r="1.5" fill="#ffcf4a" />
      <circle cx={cx} cy={bodyBottom + 31} r="1.8" fill="#ffb02e" />
      <circle cx={cx + 5.5} cy={bodyBottom + 29} r="1.5" fill="#ffcf4a" />
    </svg>
  );
}

type Particle = {
  x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number; trail: boolean;
};

const BURST_COLORS = ['#fbbf24', '#fb923c', '#f472b6', '#fde68a', '#f87171', '#a78bfa', '#34d399', '#ffffff'];

function Crackers({ reduced }: { reduced: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = [];
    const rockets: { x: number; y: number; vy: number; tx: number; ty: number; color: string }[] = [];

    const burst = (x: number, y: number, color: string) => {
      const count = 46 + Math.floor(Math.random() * 20);
      const ring = Math.random() > 0.5;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.1;
        const speed = ring ? 2.6 + Math.random() * 0.4 : 1 + Math.random() * 3;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          max: 55 + Math.random() * 30,
          color: Math.random() > 0.78 ? '#ffffff' : color,
          size: 1.4 + Math.random() * 1.4,
          trail: true,
        });
      }
    };

    const launch = () => {
      const x = w * (0.08 + Math.random() * 0.84);
      rockets.push({
        x,
        y: h,
        vy: -(5.5 + Math.random() * 2),
        tx: x + (Math.random() - 0.5) * 30,
        ty: h * (0.2 + Math.random() * 0.3),
        color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
      });
    };

    let raf = 0;
    let last = performance.now();
    let sinceLaunch = 0;
    let nextLaunch = 500;

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      sinceLaunch += dt;

      if (!document.hidden && sinceLaunch > nextLaunch) {
        launch();
        if (Math.random() > 0.55) setTimeout(launch, 180);
        sinceLaunch = 0;
        nextLaunch = 900 + Math.random() * 1300;
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.985;
        ctx.beginPath();
        ctx.fillStyle = '#fde68a';
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(253,230,138,0.5)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + 10);
        ctx.stroke();
        if (r.y <= r.ty || r.vy > -1.2) {
          burst(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 + 0.04;
        p.x += p.vx;
        p.y += p.vy;
        const alpha = Math.max(0, 1 - p.life / p.max);
        if (alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      // Static, calm burst for reduced-motion users.
      burst(w * 0.25, h * 0.4, '#fbbf24');
      burst(w * 0.75, h * 0.35, '#f472b6');
      for (let i = 0; i < 30; i++) particles.forEach((p) => { p.x += p.vx * 2; p.y += p.vy * 2; p.life = 10; });
      particles.forEach((p) => {
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

// ---------- Soft rope physics: every thread/vine is a chain of linked points ----------
type Pt = { x: number; y: number; px: number; py: number };

const mouse = { x: -9999, y: -9999, lastX: 0, lastT: 0, hasLast: false, rawVx: 0, vx: 0 };

function onPointerMove(e: PointerEvent) {
  const now = performance.now();
  if (mouse.hasLast) {
    const dt = Math.max((now - mouse.lastT) / 1000, 0.004);
    mouse.rawVx = (e.clientX - mouse.lastX) / dt;
  }
  mouse.lastX = e.clientX;
  mouse.lastT = now;
  mouse.hasLast = true;
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

const GRAVITY = 520; // px/s^2  (low => slow, floaty, premium)
const DAMP = 0.982; // air drag per step
const REACH = 140; // px around the cursor that reacts
const MOUSE_GAIN = 0.9; // how strongly mouse speed becomes a gentle breeze
const MAX_BREEZE = 760;
const STEP = 1 / 60;

type Rope = {
  kind: 'lantern' | 'vine';
  pts: Pt[];
  seg: number;
  ax: number;
  phase: number;
  dir: number; // vine curve direction
  idx: number; // lantern index
  ang: number; // smoothed lantern angle
};

function makeRope(kind: Rope['kind'], ax: number, ay: number, n: number, length: number, phase: number, dir = 1, idx = 0): Rope {
  const seg = length / n;
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => ({ x: ax, y: ay + i * seg, px: ax, py: ay + i * seg }));
  return { kind, pts, seg, ax, phase, dir, idx, ang: 0 };
}

function stepRope(r: Rope, t: number, originX: number, originY: number, boost = 0) {
  const n = r.pts.length - 1;
  for (let i = 1; i <= n; i++) {
    const p = r.pts[i];
    const k = i / n; // free end moves more than the top, like a real rope
    const vx = (p.x - p.px) * DAMP;
    const vy = (p.y - p.py) * DAMP;
    p.px = p.x;
    p.py = p.y;

    // calm, ever-present breeze
    let ax = (Math.sin(t * 0.9 + r.phase) * 55 * k + Math.sin(t * 0.37 + r.phase * 2) * 30 * k) * (1 + 2.4 * boost);

    // mouse: a soft, smoothed push in the direction the cursor travels
    const dist = Math.hypot(mouse.x - (originX + p.x), mouse.y - (originY + p.y));
    const f = Math.max(0, 1 - dist / REACH);
    const fall = f * f * (3 - 2 * f);
    ax += Math.max(-MAX_BREEZE, Math.min(MAX_BREEZE, mouse.vx * MOUSE_GAIN)) * fall * k * (1 + boost);

    // vines keep a gentle S-shape, but stay flexible
    if (r.kind === 'vine') {
      const target = r.ax + r.dir * 11 * Math.sin(((p.y - r.pts[0].y) / (n * r.seg)) * Math.PI * 5);
      ax += (target - p.x) * 20;
    }

    p.x += vx + ax * STEP * STEP;
    p.y += vy + GRAVITY * STEP * STEP;
  }
  // keep segment lengths (this is what makes it behave like a rope)
  for (let it = 0; it < 8; it++) {
    for (let i = 0; i < n; i++) {
      const a = r.pts[i];
      const b = r.pts[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      const diff = (d - r.seg) / d;
      if (i === 0) {
        b.x -= dx * diff;
        b.y -= dy * diff;
      } else {
        a.x += dx * diff * 0.5;
        a.y += dy * diff * 0.5;
        b.x -= dx * diff * 0.5;
        b.y -= dy * diff * 0.5;
      }
    }
    r.pts[0].x = r.ax;
    r.pts[0].y = r.pts[0].py;
  }
}

function ropePath(pts: Pt[]) {
  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
}

const LEAF_PATH = 'M0 0 C 3 -8.5 15 -10 24 0 C 15 7.5 4 8 0 0 Z';
const PETALS = Array.from({ length: 8 });
const VINE_NODES = 7;
const VINE_POINTS = 14;
const VINE_LENGTH = 160;

function RopeLayer({ reduced }: { reduced: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const lanternRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lanternPathRefs = useRef<Array<SVGPathElement | null>>([]);
  const vinePathRefs = useRef<Array<SVGPathElement | null>>([]);
  const nodeRefs = useRef<Array<Array<SVGGElement | null>>>([[], []]);
  const runnerRefs = useRef<Array<SVGCircleElement | null>>([]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fewer, smaller pieces on small screens so it never feels crowded.
  const compact = width > 0 && width < 768;
  const items = useMemo(() => {
    const count = width < 480 ? 4 : width < 768 ? 6 : width < 1100 ? 9 : LANTERNS.length;
    const scale = width < 480 ? 0.72 : width < 768 ? 0.85 : 1;
    const picked = Array.from({ length: count }, (_, k) => LANTERNS[Math.round((k * (LANTERNS.length - 1)) / Math.max(count - 1, 1))]);
    return picked.map((l, k) => ({
      ...l,
      left: count === LANTERNS.length ? l.left : 10 + (k * 80) / Math.max(count - 1, 1),
      size: Math.round(l.size * scale),
      drop: Math.round(l.drop * scale),
    }));
  }, [width]);

  useEffect(() => {
    if (!width) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const lanternRopes = items.map((l, i) => makeRope('lantern', (width * l.left) / 100, 2, 6, l.drop + 20, l.delay * 2.3, 1, i));
    const vineRopes = compact
      ? []
      : [
          makeRope('vine', 36, 2, VINE_POINTS, VINE_LENGTH, 0.4, 1),
          makeRope('vine', width - 36, 2, VINE_POINTS, VINE_LENGTH, 2.1, -1),
        ];

    const render = (t: number) => {
      lanternRopes.forEach((r, i) => {
        const pts = r.pts;
        const last = pts[pts.length - 1];
        const prev = pts[pts.length - 2];
        lanternPathRefs.current[i]?.setAttribute('d', ropePath(pts));
        const target = -Math.atan2(last.x - prev.x, last.y - prev.y) * (180 / Math.PI);
        r.ang += (target - r.ang) * 0.12; // extra easing on the body
        const body = lanternRefs.current[i];
        if (body) {
          body.style.transform = `translate(${(last.x - items[i].size / 2).toFixed(2)}px, ${last.y.toFixed(2)}px) rotate(${r.ang.toFixed(2)}deg)`;
        }
      });

      vineRopes.forEach((r, v) => {
        vinePathRefs.current[v]?.setAttribute('d', ropePath(r.pts));
        for (let k = 0; k < VINE_NODES; k++) {
          const idx = 1 + k * 2;
          const p = r.pts[idx];
          const a = r.pts[Math.max(idx - 1, 0)];
          const b = r.pts[Math.min(idx + 1, r.pts.length - 1)];
          const tangent = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          nodeRefs.current[v][k]?.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${tangent.toFixed(1)})`);
        }
        const u = ((t / 3.6) % 1) * (r.pts.length - 1);
        const i0 = Math.min(Math.floor(u), r.pts.length - 2);
        const fr = u - i0;
        const rc = runnerRefs.current[v];
        if (rc) {
          rc.setAttribute('cx', (r.pts[i0].x + (r.pts[i0 + 1].x - r.pts[i0].x) * fr).toFixed(2));
          rc.setAttribute('cy', (r.pts[i0].y + (r.pts[i0 + 1].y - r.pts[i0].y) * fr).toFixed(2));
        }
      });
    };

    // settle into rest pose first so nothing "drops in" on load
    const originOf = () => {
      const r = wrap.getBoundingClientRect();
      return { x: r.left, y: r.top };
    };
    let t = 0;
    const warm = originOf();
    for (let i = 0; i < 90; i++) {
      t += STEP;
      lanternRopes.forEach((r) => stepRope(r, t, warm.x, warm.y));
      vineRopes.forEach((r) => stepRope(r, t, warm.x, warm.y));
    }
    render(t);

    if (reduced) return;

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let sway = t;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      acc += dt;

      // mouse speed fades when the mouse stops, and is smoothed so nothing jerks
      mouse.rawVx *= Math.exp(-dt * 3.5);
      mouse.vx += (mouse.rawVx - mouse.vx) * (1 - Math.exp(-dt * 9));

      const o = originOf();
      let guard = 0;
      while (acc >= STEP && guard++ < 4) {
        t += STEP;
        sway += STEP;
        acc -= STEP;
        lanternRopes.forEach((r) => stepRope(r, sway, o.x, o.y));
        vineRopes.forEach((r) => stepRope(r, sway, o.x, o.y));
      }
      render(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [width, reduced, items, compact]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {width > 0 && (
        <>
          <svg width={width} height={300} className="absolute left-0 top-0 overflow-visible">
            <defs>
              <linearGradient id="dvLeafA" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2f6b0f" />
                <stop offset="55%" stopColor="#58a31a" />
                <stop offset="100%" stopColor="#9bd23c" />
              </linearGradient>
              <linearGradient id="dvLeafB" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3d7d12" />
                <stop offset="55%" stopColor="#6fb81f" />
                <stop offset="100%" stopColor="#b4e052" />
              </linearGradient>
            </defs>
            {items.map((_, i) => (
              <path
                key={i}
                ref={(el) => {
                  lanternPathRefs.current[i] = el;
                }}
                fill="none"
                stroke="#c99a1a"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            ))}
            {(compact ? [] : [0, 1]).map((v) => (
              <g key={v}>
                <path
                  ref={(el) => {
                    vinePathRefs.current[v] = el;
                  }}
                  fill="none"
                  stroke="#a3730a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {Array.from({ length: VINE_NODES }).map((_, k) => (
                  <g
                    key={k}
                    ref={(el) => {
                      nodeRefs.current[v][k] = el;
                    }}
                  >
                    {k % 2 === 1 ? (
                      <g className="dv-flower" style={{ animationDelay: `${k * 0.4}s` }}>
                        {PETALS.map((_, q) => (
                          <ellipse
                            key={q}
                            cx="0"
                            cy="-5.2"
                            rx="2.6"
                            ry="4.4"
                            fill={q % 2 === 0 ? '#f59e0b' : '#fb923c'}
                            stroke="#fff1a8"
                            strokeWidth="0.4"
                            transform={`rotate(${q * 45})`}
                          />
                        ))}
                        <circle r="2.6" fill="#b45309" />
                        <circle r="1.1" fill="#fde68a" />
                      </g>
                    ) : (
                      <g>
                        {[-62, 62].map((ang, q) => (
                          <g key={q} transform={`rotate(${ang})`}>
                            <g className="dv-leaf" style={{ animationDelay: `${k * 0.35 + q * 0.6}s` }}>
                              <path d={LEAF_PATH} fill={q === 0 ? 'url(#dvLeafA)' : 'url(#dvLeafB)'} />
                              <path d="M0 0 C 7 -1.4 16 -1.2 23 0" fill="none" stroke="#e4fbb0" strokeOpacity="0.85" strokeWidth="0.7" strokeLinecap="round" />
                              <path d="M7 -0.8 L12 -5 M12 -1 L17 -5.5 M7 0.4 L11 4.2 M12 0.5 L16.5 4" fill="none" stroke="#e4fbb0" strokeOpacity="0.5" strokeWidth="0.45" strokeLinecap="round" />
                              <path d="M3 -1 C 8 -5.5 15 -6 21 -1.4" fill="none" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2" strokeLinecap="round" />
                            </g>
                          </g>
                        ))}
                      </g>
                    )}
                  </g>
                ))}
                {!reduced && (
                  <circle
                    r="2.4"
                    fill="#fff7cc"
                    className="dv-run"
                    ref={(el) => {
                      runnerRefs.current[v] = el;
                    }}
                  />
                )}
              </g>
            ))}
          </svg>

          {items.map((l, i) => (
            <div
              key={i}
              ref={(el) => {
                lanternRefs.current[i] = el;
              }}
              className="absolute left-0 top-0"
              style={{ transformOrigin: '50% 0', filter: 'drop-shadow(0 6px 8px rgba(120,53,15,0.28))', willChange: 'transform' }}
            >
              <Lantern id={i} c1={l.c1} c2={l.c2} size={l.size} drop={0} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default function DiwaliDecor() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[210px] select-none md:h-[300px]" aria-hidden="true">
      <style>{`
        .dv-flower{transform-box:fill-box;transform-origin:center;animation:dv-bloom 4.5s ease-in-out infinite}
        .dv-leaf{transform-box:fill-box;transform-origin:0% 50%;animation:dv-leaf 3.4s ease-in-out infinite}
        .dv-run{filter:drop-shadow(0 0 4px #fbbf24) drop-shadow(0 0 8px #fbbf24)}
        .dv-glow{animation:dv-pulse 2.6s ease-in-out infinite}
        .dv-flame{animation:dv-flick 1.6s ease-in-out infinite}
        .dv-twinkle{animation:dv-tw 2.4s ease-in-out infinite}
        @keyframes dv-leaf{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(8deg)}}
        @keyframes dv-bloom{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.18) rotate(18deg)}}
        @keyframes dv-pulse{0%,100%{opacity:.75}50%{opacity:1}}
        @keyframes dv-flick{0%,100%{opacity:.7}40%{opacity:1}70%{opacity:.8}}
        @keyframes dv-tw{0%,100%{opacity:.2;transform:scale(.6)}50%{opacity:1;transform:scale(1)}}
        @media (prefers-reduced-motion:reduce){.dv-flower,.dv-leaf,.dv-glow,.dv-flame,.dv-twinkle{animation:none}}
      `}</style>

      {/* warm light wash from the top */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-200/40 via-amber-100/15 to-transparent" />

      <Crackers reduced={reduced} />

      {/* gold rope with beads */}
      <svg viewBox="0 0 1000 24" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-5 w-full">
        <path d="M0 2 Q 62 20 125 2 T 250 2 T 375 2 T 500 2 T 625 2 T 750 2 T 875 2 T 1000 2" fill="none" stroke="#b8860b" strokeWidth="2.4" />
        <path d="M0 2 Q 62 20 125 2 T 250 2 T 375 2 T 500 2 T 625 2 T 750 2 T 875 2 T 1000 2" fill="none" stroke="#fff1a8" strokeWidth="1.2" strokeDasharray="0.5 9" strokeLinecap="round" />
      </svg>

      {/* twinkling gold stars */}
      {[12, 24, 36, 49, 61, 72, 83, 93].map((left, i) => (
        <span
          key={left}
          className="dv-twinkle absolute h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_2px_rgba(251,191,36,0.8)]"
          style={{ left: `${left}%`, top: `${14 + (i % 3) * 18}px`, animationDelay: `${i * 0.35}s` }}
        />
      ))}

      {/* soft rope-hung lanterns and vine garlands */}
      <RopeLayer reduced={reduced} />
    </div>
  );
}
