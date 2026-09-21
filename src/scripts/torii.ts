/**
 * A corridor of torii gates, rendered as actual 3D geometry on a 2D canvas.
 *
 * This replaces an earlier version made of flat SVG shapes scaled with CSS.
 * Flat planes cannot show you the inside face of a post, which is exactly what
 * you see walking the senbon torii at Fushimi Inari, so the gates never read
 * as objects you were passing through.
 *
 * Here each gate is real geometry: the two hashira are tapered octagonal
 * prisms (eight faces is enough to read as round at this size), and the nuki,
 * gakuzuka, shimaki and kasagi are boxes, with the kasagi split into segments
 * that sweep upward toward its tips. Faces are lit by their own normals,
 * back-faces are culled, everything is depth-sorted, and distance fog fades
 * the corridor out. The camera walks forward as you scroll.
 *
 * No dependencies and no WebGL — around 900 quads a frame, which Canvas 2D
 * handles comfortably.
 */

type V3 = { x: number; y: number; z: number };

interface Quad {
  /** world-space corners, wound counter-clockwise when seen from the front */
  p: [V3, V3, V3, V3];
  /** surface normal, used for shading and back-face culling */
  n: V3;
  /** 0 = deepest shadow tone, 1 = full vermilion */
  tone: number;
}

const sub = (a: V3, b: V3): V3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const cross = (a: V3, b: V3): V3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const norm = (v: V3): V3 => {
  const l = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / l, y: v.y / l, z: v.z / l };
};
const dot = (a: V3, b: V3) => a.x * b.x + a.y * b.y + a.z * b.z;

function quad(a: V3, b: V3, c: V3, d: V3, tone = 1): Quad {
  const n = norm(cross(sub(b, a), sub(d, a)));
  return { p: [a, b, c, d], n, tone };
}

/** An axis-aligned box, as six quads. */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, tone = 1): Quad[] {
  const v = (x: number, y: number, z: number): V3 => ({ x, y, z });
  return [
    quad(v(x0, y0, z1), v(x1, y0, z1), v(x1, y1, z1), v(x0, y1, z1), tone),       // front  +Z
    quad(v(x1, y0, z0), v(x0, y0, z0), v(x0, y1, z0), v(x1, y1, z0), tone),       // back   -Z
    quad(v(x0, y1, z1), v(x1, y1, z1), v(x1, y1, z0), v(x0, y1, z0), tone),       // top    +Y
    quad(v(x0, y0, z0), v(x1, y0, z0), v(x1, y0, z1), v(x0, y0, z1), tone),       // bottom -Y
    quad(v(x1, y0, z1), v(x1, y0, z0), v(x1, y1, z0), v(x1, y1, z1), tone),       // right  +X
    quad(v(x0, y0, z0), v(x0, y0, z1), v(x0, y1, z1), v(x0, y1, z0), tone),       // left   -X
  ];
}

/** A tapered prism — the hashira. Eight sides reads as round at this scale. */
function prism(
  bx: number, bz: number, tx: number, tz: number,
  y0: number, y1: number, r0: number, r1: number,
  sides = 8, tone = 1,
): Quad[] {
  const out: Quad[] = [];
  for (let i = 0; i < sides; i++) {
    const a0 = (i / sides) * Math.PI * 2;
    const a1 = ((i + 1) / sides) * Math.PI * 2;
    const p0: V3 = { x: bx + Math.cos(a0) * r0, y: y0, z: bz + Math.sin(a0) * r0 };
    const p1: V3 = { x: bx + Math.cos(a1) * r0, y: y0, z: bz + Math.sin(a1) * r0 };
    const p2: V3 = { x: tx + Math.cos(a1) * r1, y: y1, z: tz + Math.sin(a1) * r1 };
    const p3: V3 = { x: tx + Math.cos(a0) * r1, y: y1, z: tz + Math.sin(a0) * r1 };
    // Wound p0 -> p3 -> p2 -> p1 so the normal points OUT of the post.
    // The other winding sends it inward, which culls every face you should
    // actually see and leaves the posts looking hollow.
    out.push(quad(p0, p3, p2, p1, tone));
  }
  return out;
}

/**
 * One segment of a beam whose top and bottom edges differ at each end, so a
 * run of them forms a continuous curve. Building the kasagi out of plain
 * boxes instead produced a visible staircase along the top of every gate.
 */
function beamSegment(
  xa: number, xb: number,
  yaBot: number, yaTop: number, ybBot: number, ybTop: number,
  z0: number, z1: number, tone = 1,
): Quad[] {
  const v = (x: number, y: number, z: number): V3 => ({ x, y, z });
  const A0 = v(xa, yaBot, z1), A1 = v(xb, ybBot, z1), A2 = v(xb, ybTop, z1), A3 = v(xa, yaTop, z1);
  const B0 = v(xa, yaBot, z0), B1 = v(xb, ybBot, z0), B2 = v(xb, ybTop, z0), B3 = v(xa, yaTop, z0);
  return [
    quad(A0, A1, A2, A3, tone),   // front
    quad(B1, B0, B3, B2, tone),   // back
    quad(A3, A2, B2, B3, tone),   // top
    quad(B0, B1, A1, A0, tone),   // bottom
    quad(B0, A0, A3, B3, tone),   // left cap
    quad(A1, B1, B2, A2, tone),   // right cap
  ];
}

/* ---- proportions of one gate, in metres ------------------------------- */
// Proportioned after the senbon torii at Fushimi Inari, which are noticeably
// taller than they are wide — roughly a 1:1 ratio of kasagi span to overall
// height. Earlier values made a gate that read as squat.
const POST_X = 1.06;       // half-span at the base
const POST_LEAN = 0.07;    // how far each post leans in by the top
const POST_H = 3.90;
const R_BOT = 0.155;
const R_TOP = 0.132;
const NUKI_Y0 = 2.16, NUKI_Y1 = 2.42, NUKI_X = 1.44, NUKI_Z = 0.10;
const GAKU_Y1 = 3.38;
const SHIMAKI_Y0 = 3.38, SHIMAKI_Y1 = 3.60, SHIMAKI_X = 1.64, SHIMAKI_Z = 0.19;
const KASAGI_Y0 = 3.60, KASAGI_Y1 = 3.90, KASAGI_X = 1.86, KASAGI_Z = 0.25;
const KASAGI_SWEEP = 0.30; // how much the tips rise
const KASAGI_SEGS = 16;

/** Builds one gate's geometry, offset to a given z. */
function buildGate(z: number): Quad[] {
  const q: Quad[] = [];

  // hashira, leaning inward as they rise
  q.push(...prism(-POST_X, z, -POST_X + POST_LEAN, z, 0, POST_H, R_BOT, R_TOP, 8, 1));
  q.push(...prism(POST_X, z, POST_X - POST_LEAN, z, 0, POST_H, R_BOT, R_TOP, 8, 1));

  // nuki, protruding past both posts, with the kusabi wedges
  q.push(...box(-NUKI_X, NUKI_X, NUKI_Y0, NUKI_Y1, z - NUKI_Z, z + NUKI_Z, 0.92));
  q.push(...box(-1.10, -0.92, NUKI_Y0 - 0.07, NUKI_Y1 + 0.07, z - NUKI_Z - 0.02, z + NUKI_Z + 0.02, 0.78));
  q.push(...box(0.92, 1.10, NUKI_Y0 - 0.07, NUKI_Y1 + 0.07, z - NUKI_Z - 0.02, z + NUKI_Z + 0.02, 0.78));

  // gakuzuka, the central strut
  q.push(...box(-0.12, 0.12, NUKI_Y1, GAKU_Y1, z - 0.11, z + 0.11, 0.86));

  // shimaki and kasagi, both sweeping up toward their tips. Heights are
  // evaluated at each segment boundary and shared between neighbours, so the
  // curve is continuous rather than stepped.
  const riseS = (x: number) => Math.pow(Math.abs(x) / SHIMAKI_X, 2.1) * KASAGI_SWEEP;
  const riseK = (x: number) => Math.pow(Math.abs(x) / KASAGI_X, 2.1) * KASAGI_SWEEP;
  for (let i = 0; i < KASAGI_SEGS; i++) {
    const t0 = i / KASAGI_SEGS, t1 = (i + 1) / KASAGI_SEGS;

    const sa = -SHIMAKI_X + t0 * SHIMAKI_X * 2;
    const sb = -SHIMAKI_X + t1 * SHIMAKI_X * 2;
    const sra = riseS(sa), srb = riseS(sb);
    q.push(...beamSegment(sa, sb,
      SHIMAKI_Y0 + sra, SHIMAKI_Y1 + sra,
      SHIMAKI_Y0 + srb, SHIMAKI_Y1 + srb,
      z - SHIMAKI_Z, z + SHIMAKI_Z, 0.86));

    const ka = -KASAGI_X + t0 * KASAGI_X * 2;
    const kb = -KASAGI_X + t1 * KASAGI_X * 2;
    const kra = riseK(ka), krb = riseK(kb);
    q.push(...beamSegment(ka, kb,
      KASAGI_Y0 + kra, KASAGI_Y1 + kra,
      KASAGI_Y0 + krb, KASAGI_Y1 + krb,
      z - KASAGI_Z, z + KASAGI_Z, 1));
  }

  return q;
}

const GATE_SPACING = 1.40;
const FIRST_GATE_Z = -4.2;
const WALK = 2.6; // metres of camera travel across the section
const GATE_COUNT = 16;
const FOG_START = 5;
const FOG_END = 17;

export function initTorii(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Geometry is built once; only the camera moves.
  const gates: Quad[][] = [];
  // The first gate sits far enough ahead that the whole thing fits the frame.
  // Any closer and the camera is standing inside it, which just fills the
  // canvas with a dark blur.
  for (let i = 0; i < GATE_COUNT; i++) gates.push(buildGate(FIRST_GATE_Z - i * GATE_SPACING));
  const all: Quad[] = gates.flat();

  let w = 0, h = 0, cx = 0, cy = 0, dpr = 1, f = 600;
  let camZ = 0;
  let targetZ = 0;
  let raf = 0;
  let running = false;
  let onScreen = true;

  const EYE_Y = 1.58;
  const LIGHT = norm({ x: -0.35, y: 0.82, z: 0.45 });

  function readColour(name: string, fallback: string) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  let base = { r: 214, g: 66, b: 34 };
  let fog = { r: 8, g: 9, b: 13 };
  function refreshColours() {
    const bg = readColour('--void', '#08090d');
    const m = bg.match(/^#([0-9a-f]{6})$/i);
    if (m) {
      const n = parseInt(m[1], 16);
      fog = { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    // The gates stay vermilion in both themes; only the fog colour changes.
    base = document.documentElement.dataset.theme === 'light'
      ? { r: 196, g: 62, b: 32 }
      : { r: 214, g: 66, b: 34 };
  }
  refreshColours();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h * 0.58;
    // ~58° vertical field of view
    f = h / (2 * Math.tan((58 * Math.PI) / 180 / 2));
  }

  /** Perspective projection. Returns null for anything at or behind the eye. */
  function project(p: V3, dz: number) {
    const d = -(p.z - dz); // distance in front of the camera
    if (d < 0.35) return null;
    return { x: cx + (f * p.x) / d, y: cy - (f * (p.y - EYE_Y)) / d, d };
  }

  function render() {
    const c = ctx!;
    c.clearRect(0, 0, w, h);

    // depth-sorted, far to near
    const visible: { q: Quad; d: number; pts: { x: number; y: number }[] }[] = [];
    for (const q of all) {
      const zc = (q.p[0].z + q.p[2].z) / 2;
      const d = -(zc - camZ);
      if (d < 0.4 || d > FOG_END + 3) continue;

      // back-face cull: the vector from the eye to the face against its normal
      const mid = {
        x: (q.p[0].x + q.p[2].x) / 2,
        y: (q.p[0].y + q.p[2].y) / 2,
        z: zc,
      };
      const view = norm({ x: mid.x, y: mid.y - EYE_Y, z: mid.z - camZ });
      if (dot(view, q.n) > 0.02) continue;

      const pts: { x: number; y: number }[] = [];
      let ok = true;
      for (const v of q.p) {
        const s = project(v, camZ);
        if (!s) { ok = false; break; }
        pts.push(s);
      }
      if (!ok) continue;
      visible.push({ q, d, pts });
    }
    visible.sort((a, b) => b.d - a.d);

    for (const { q, d, pts } of visible) {
      // lambert, with a generous ambient so nothing goes fully black
      const lambert = Math.max(0, dot(q.n, LIGHT));
      const shade = (0.20 + 0.95 * lambert) * q.tone;
      let r = base.r * shade, g = base.g * shade, b = base.b * shade;

      // distance fog
      const t = Math.min(1, Math.max(0, (d - FOG_START) / (FOG_END - FOG_START)));
      const k = t * t;
      r = r + (fog.r - r) * k;
      g = g + (fog.g - g) * k;
      b = b + (fog.b - b) * k;

      c.beginPath();
      c.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y);
      c.closePath();
      c.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
      c.fill();
      // a hairline of the same colour closes the seams between adjacent quads
      c.strokeStyle = c.fillStyle;
      c.lineWidth = 0.6;
      c.stroke();
    }
  }

  function frame() {
    // ease toward the scroll-driven target so the walk feels weighted
    camZ += (targetZ - camZ) * 0.08;
    render();
    if (running) raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || document.hidden || !onScreen) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  /** Scroll position maps to how far down the corridor the camera has walked. */
  function updateTarget() {
    const rect = canvas.getBoundingClientRect();
    const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
    targetZ = -progress * WALK;
    // If the animation loop is not running — reduced motion, a background
    // tab, an off-screen pause — nothing else will ever repaint, so snap the
    // camera and draw it here. Without this the corridor keeps whatever
    // camera position it had when the loop last stopped, which is usually
    // wherever the section happened to be on first load.
    if (!running) { camZ = targetZ; render(); }
  }

  let ticking = false;
  const onScroll = () => {
    // When the loop is idle there is no animation frame coming, so throttling
    // through requestAnimationFrame would drop the update entirely. Handle it
    // synchronously in that case and throttle only when the loop is live.
    if (!running) { updateTarget(); return; }
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; updateTarget(); });
  };

  const ro = new ResizeObserver(() => { resize(); updateTarget(); render(); });
  ro.observe(canvas);

  const io = new IntersectionObserver(
    ([e]) => { onScreen = e.isIntersecting; if (onScreen) start(); else stop(); },
    { threshold: 0.01 },
  );
  io.observe(canvas);

  const onVisibility = () => { if (document.hidden) stop(); else start(); };
  const onTheme = () => { refreshColours(); render(); };
  const onMotion = () => { stop(); updateTarget(); render(); if (!reduced.matches) start(); };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('themechange', onTheme);
  reduced.addEventListener('change', onMotion);

  resize();
  updateTarget();
  camZ = targetZ;
  render();
  if (!reduced.matches) start();

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('themechange', onTheme);
    reduced.removeEventListener('change', onMotion);
  };
}
