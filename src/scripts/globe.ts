/**
 * Holographic dot-matrix globe — Canvas 2D, no dependencies.
 *
 * Land coordinates come from `src/data/land.ts`, generated at build time from
 * Natural Earth 1:110m public-domain polygons. Rendering is orthographic:
 * lat/lon -> unit vector -> yaw/pitch rotation -> drop the z axis.
 *
 * Honours prefers-reduced-motion (renders one static frame), pauses when
 * scrolled out of view or the tab is hidden, and supports drag-to-spin.
 */
import { LAND } from '../data/land';

const DEG = Math.PI / 180;
type Vec3 = readonly [number, number, number];

const toVec = (lat: number, lon: number): Vec3 => {
  const la = lat * DEG;
  const lo = lon * DEG;
  const cl = Math.cos(la);
  return [cl * Math.cos(lo), Math.sin(la), cl * Math.sin(lo)];
};

const dot3 = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Spherical interpolation — gives a true great-circle path. */
function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const d = Math.min(1, Math.max(-1, dot3(a, b)));
  const omega = Math.acos(d);
  if (omega < 1e-6) return a;
  const so = Math.sin(omega);
  const k0 = Math.sin((1 - t) * omega) / so;
  const k1 = Math.sin(t * omega) / so;
  return [a[0] * k0 + b[0] * k1, a[1] * k0 + b[1] * k1, a[2] * k0 + b[2] * k1];
}

interface Marker { lat: number; lon: number; label: string; kind: 'origin' | 'destination' }

const MARKERS: Marker[] = [
  { lat: 42.331, lon: -83.046, label: 'Detroit', kind: 'origin' },
  { lat: 35.676, lon: 139.65, label: 'Tokyo', kind: 'destination' },
];

export function initGlobe(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return () => {};

  const css = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  let COL = {
    land: read('--ink-2', '#b6b2a8'),
    grid: read('--hairline-2', '#39404f'),
    accent: read('--torii', '#ff6a4d'),
    gold: read('--gold', '#e8c07a'),
    surface: read('--surface-1', '#0f1117'),
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let w = 0, h = 0, R = 0, cx = 0, cy = 0, dpr = 1;
  // Centre the disc on ~152°W so the whole Detroit->Tokyo great circle, which
  // crosses the north Pacific, sits on the near face. Positive pitch tips the
  // north pole toward the viewer.
  let yaw = 2.06;
  const pitch = 0.42;
  let spin = 0.00042;       // radians per ms
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  let running = false;
  let raf = 0;
  let t0 = 0;
  let arcPhase = 0;

  const A = toVec(MARKERS[0].lat, MARKERS[0].lon);
  const B = toVec(MARKERS[1].lat, MARKERS[1].lon);
  const ARC_STEPS = 128;
  const arcPts: Vec3[] = [];
  for (let i = 0; i <= ARC_STEPS; i++) {
    const t = i / ARC_STEPS;
    const p = slerp(A, B, t);
    const lift = 1 + 0.17 * Math.sin(Math.PI * t);
    arcPts.push([p[0] * lift, p[1] * lift, p[2] * lift]);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = Math.min(w, h) * 0.42;
    cx = w / 2;
    cy = h / 2;
  }

  function rotate(v: Vec3): Vec3 {
    const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
    const x1 = v[0] * cyaw + v[2] * syaw;
    const z1 = -v[0] * syaw + v[2] * cyaw;
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    return [x1, v[1] * cp - z1 * sp, v[1] * sp + z1 * cp];
  }

  /** Dots are bucketed by depth so we set globalAlpha six times, not 3,600. */
  const BUCKETS = 6;
  const bucketX: Float32Array[] = Array.from({ length: BUCKETS }, () => new Float32Array(LAND.length / 2));
  const bucketY: Float32Array[] = Array.from({ length: BUCKETS }, () => new Float32Array(LAND.length / 2));
  const bucketN = new Int32Array(BUCKETS);

  function drawLand() {
    bucketN.fill(0);
    const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
    const cp = Math.cos(pitch), sp = Math.sin(pitch);

    for (let i = 0; i < LAND.length; i += 2) {
      const lat = LAND[i] / 100;
      const lon = LAND[i + 1] / 100;
      const la = lat * DEG, lo = lon * DEG;
      const cl = Math.cos(la);
      const vx = cl * Math.cos(lo), vy = Math.sin(la), vz = cl * Math.sin(lo);

      const x1 = vx * cyaw + vz * syaw;
      const z1 = -vx * syaw + vz * cyaw;
      const y2 = vy * cp - z1 * sp;
      const z2 = vy * sp + z1 * cp;

      // z2 > 0 faces the viewer. Back-face dots are kept but heavily dimmed.
      const front = z2 > 0;
      const depth = front ? z2 : -z2 * 0.34;
      const b = Math.min(BUCKETS - 1, Math.max(0, Math.floor(depth * BUCKETS)));
      const n = bucketN[b]++;
      bucketX[b][n] = cx + x1 * R;
      bucketY[b][n] = cy - y2 * R;
    }

    const c = ctx!;
    c.fillStyle = COL.land;
    for (let b = 0; b < BUCKETS; b++) {
      const n = bucketN[b];
      if (!n) continue;
      const alpha = 0.055 + (b / (BUCKETS - 1)) * 0.62;
      const size = b >= BUCKETS - 2 ? 1.7 : 1.3;
      c.globalAlpha = alpha;
      const xs = bucketX[b], ys = bucketY[b];
      for (let i = 0; i < n; i++) c.fillRect(xs[i] - size / 2, ys[i] - size / 2, size, size);
    }
    c.globalAlpha = 1;
  }

  function drawGraticule() {
    const c = ctx!;
    c.strokeStyle = COL.grid;
    c.lineWidth = 1;
    c.globalAlpha = 0.5;

    // latitude rings
    for (let lat = -60; lat <= 60; lat += 30) {
      c.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = rotate(toVec(lat, lon));
        if (p[2] <= 0) { started = false; continue; }
        const sx = cx + p[0] * R, sy = cy - p[1] * R;
        if (!started) { c.moveTo(sx, sy); started = true; } else c.lineTo(sx, sy);
      }
      c.stroke();
    }
    // meridians
    for (let lon = -180; lon < 180; lon += 30) {
      c.beginPath();
      let started = false;
      for (let lat = -90; lat <= 90; lat += 3) {
        const p = rotate(toVec(lat, lon));
        if (p[2] <= 0) { started = false; continue; }
        const sx = cx + p[0] * R, sy = cy - p[1] * R;
        if (!started) { c.moveTo(sx, sy); started = true; } else c.lineTo(sx, sy);
      }
      c.stroke();
    }
    c.globalAlpha = 1;
  }

  function drawSphereBody() {
    const c = ctx!;
    const g = c.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    g.addColorStop(0, 'rgba(120,150,200,0.10)');
    g.addColorStop(0.65, 'rgba(40,60,100,0.05)');
    g.addColorStop(1, 'rgba(0,0,0,0.22)');
    c.beginPath();
    c.arc(cx, cy, R, 0, Math.PI * 2);
    c.fillStyle = g;
    c.fill();
  }

  function drawRim() {
    const c = ctx!;
    c.beginPath();
    c.arc(cx, cy, R, 0, Math.PI * 2);
    c.strokeStyle = COL.accent;
    c.globalAlpha = 0.28;
    c.lineWidth = 1;
    c.stroke();
    c.globalAlpha = 1;

    const g = c.createRadialGradient(cx, cy, R * 0.93, cx, cy, R * 1.16);
    g.addColorStop(0, `rgba(255,106,77,0)`);
    g.addColorStop(0.45, `rgba(255,106,77,0.10)`);
    g.addColorStop(1, `rgba(255,106,77,0)`);
    c.beginPath();
    c.arc(cx, cy, R * 1.16, 0, Math.PI * 2);
    c.fillStyle = g;
    c.fill();
  }

  function drawArc() {
    const c = ctx!;
    // The arc is drawn in segments so it can fade where it passes behind the globe.
    for (let i = 0; i < arcPts.length - 1; i++) {
      const p = rotate(arcPts[i]);
      const q = rotate(arcPts[i + 1]);
      const behind = p[2] < 0 && q[2] < 0;
      const t = i / (arcPts.length - 1);

      c.beginPath();
      c.moveTo(cx + p[0] * R, cy - p[1] * R);
      c.lineTo(cx + q[0] * R, cy - q[1] * R);
      c.strokeStyle = t < 0.5 ? COL.accent : COL.gold;
      c.globalAlpha = behind ? 0.1 : 0.75;
      c.lineWidth = behind ? 1 : 1.6;
      c.stroke();
    }

    // A pulse travelling Detroit -> Tokyo.
    const idx = Math.floor(arcPhase * (arcPts.length - 1));
    for (let k = 0; k < 10; k++) {
      const j = idx - k;
      if (j < 0) continue;
      const p = rotate(arcPts[j]);
      if (p[2] < 0) continue;
      c.beginPath();
      c.arc(cx + p[0] * R, cy - p[1] * R, 2.4 - k * 0.16, 0, Math.PI * 2);
      c.fillStyle = COL.gold;
      c.globalAlpha = (1 - k / 10) * 0.9;
      c.fill();
    }
    c.globalAlpha = 1;
  }

  function drawMarkers(now: number) {
    const c = ctx!;
    for (const m of MARKERS) {
      const p = rotate(toVec(m.lat, m.lon));
      if (p[2] <= 0.02) continue;
      const sx = cx + p[0] * R;
      const sy = cy - p[1] * R;
      const col = m.kind === 'destination' ? COL.gold : COL.accent;

      if (m.kind === 'destination') {
        const pulse = (now % 2200) / 2200;
        c.beginPath();
        c.arc(sx, sy, 4 + pulse * 16, 0, Math.PI * 2);
        c.strokeStyle = col;
        c.globalAlpha = (1 - pulse) * 0.5;
        c.lineWidth = 1.2;
        c.stroke();
      }

      c.beginPath();
      c.arc(sx, sy, 3.4, 0, Math.PI * 2);
      c.fillStyle = col;
      c.globalAlpha = 1;
      c.fill();
      c.beginPath();
      c.arc(sx, sy, 3.4, 0, Math.PI * 2);
      c.strokeStyle = COL.surface;
      c.lineWidth = 1.6;
      c.stroke();

      c.font = '500 11px ui-monospace, "JetBrains Mono Variable", Menlo, monospace';
      c.fillStyle = col;
      c.globalAlpha = 0.95;
      c.textAlign = p[0] > 0 ? 'right' : 'left';
      c.fillText(m.label.toUpperCase(), sx + (p[0] > 0 ? -10 : 10), sy + 4);
      c.globalAlpha = 1;
      c.textAlign = 'left';
    }
  }

  function frame(now: number) {
    if (!t0) t0 = now;
    const dt = Math.min(48, now - t0);
    t0 = now;

    if (!dragging) {
      yaw += spin * dt + velocity * dt;
      velocity *= 0.94;
      if (Math.abs(velocity) < 1e-6) velocity = 0;
    }
    arcPhase = (arcPhase + dt / 4200) % 1.35;

    render(now);
    if (running) raf = requestAnimationFrame(frame);
  }

  function render(now: number) {
    const c = ctx!;
    c.clearRect(0, 0, w, h);
    drawSphereBody();
    drawLand();
    drawGraticule();
    drawRim();
    drawArc();
    drawMarkers(now);
  }

  function start() {
    if (running || reduced.matches) return;
    running = true;
    t0 = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // --- interaction -------------------------------------------------------
  const onDown = (e: PointerEvent) => {
    dragging = true;
    lastX = e.clientX;
    velocity = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    yaw += dx * 0.006;
    velocity = dx * 0.00035;
    if (reduced.matches) render(performance.now());
  };
  const onUp = (e: PointerEvent) => {
    dragging = false;
    canvas.style.cursor = 'grab';
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
  };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.style.cursor = 'grab';
  canvas.style.touchAction = 'pan-y';

  // --- lifecycle ---------------------------------------------------------
  const ro = new ResizeObserver(() => { resize(); render(performance.now()); });
  ro.observe(canvas);

  const io = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0.01 },
  );
  io.observe(canvas);

  const onVisibility = () => (document.hidden ? stop() : io.takeRecords(), !document.hidden && start());
  document.addEventListener('visibilitychange', onVisibility);

  const onTheme = () => {
    COL = {
      land: read('--ink-2', '#b6b2a8'),
      grid: read('--hairline-2', '#39404f'),
      accent: read('--torii', '#ff6a4d'),
      gold: read('--gold', '#e8c07a'),
      surface: read('--surface-1', '#0f1117'),
    };
    render(performance.now());
  };
  window.addEventListener('themechange', onTheme);

  const onMotionPref = () => { stop(); resize(); render(performance.now()); if (!reduced.matches) start(); };
  reduced.addEventListener('change', onMotionPref);

  resize();
  render(performance.now());
  if (!reduced.matches) start();

  return () => {
    stop();
    ro.disconnect();
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('themechange', onTheme);
    reduced.removeEventListener('change', onMotionPref);
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onUp);
  };
}
