import { useRef, useEffect } from "react";
import { useStore } from "../../context/store.js";

// Scene renderers
const SCENES = {
  golden_hour: renderGoldenHour,
  rain_cafe: renderRainCafe,
  stormy_night: renderStormy,
  misty_forest: renderForest,
  ocean_waves: renderOcean,
  northern_lights: renderAurora,
  cozy_library: renderLibrary,
};

export default function AmbientCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { ambientScene, isPlaying } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const renderer = SCENES[ambientScene] || SCENES.cozy_library;
    const state = {};
    let frame = 0;

    function tick() {
      if (!canvas.width || !canvas.height) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      renderer(ctx, canvas.width, canvas.height, frame, state, isPlaying);
      frame++;
      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [ambientScene, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-canvas opacity-30"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ── Scene Renderers ───────────────────────────────────────────────────────────

function renderGoldenHour(ctx, w, h, f, state) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#1a0a00");
  sky.addColorStop(0.4, "#8B3700");
  sky.addColorStop(0.7, "#FF8C00");
  sky.addColorStop(1, "#FFB84D");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Sun
  const sunY = h * 0.55 + Math.sin(f * 0.005) * 5;
  const grd = ctx.createRadialGradient(w * 0.6, sunY, 0, w * 0.6, sunY, 80);
  grd.addColorStop(0, "rgba(255,255,200,0.9)");
  grd.addColorStop(0.3, "rgba(255,180,50,0.5)");
  grd.addColorStop(1, "rgba(255,100,0,0)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(w * 0.6, sunY, 80, 0, Math.PI * 2);
  ctx.fill();

  // Fireflies
  if (!state.ff)
    state.ff = Array.from({ length: 25 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.7,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
    }));
  state.ff.forEach((ff) => {
    ff.x += ff.vx;
    ff.y += ff.vy;
    if (ff.x < 0) ff.x = w;
    if (ff.x > w) ff.x = 0;
    if (ff.y < 0) ff.y = h;
    if (ff.y > h * 0.7) ff.y = 0;
    const alpha = (Math.sin(f * 0.05 + ff.phase) + 1) / 2;
    ctx.beginPath();
    ctx.arc(ff.x, ff.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,150,${alpha * 0.8})`;
    ctx.fill();
  });
}

function renderRainCafe(ctx, w, h, f, state) {
  // Dark rainy bg
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#0a1628");
  sky.addColorStop(1, "#1a2840");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Rain drops
  if (!state.drops)
    state.drops = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 4 + Math.random() * 6,
      len: 10 + Math.random() * 20,
      alpha: 0.1 + Math.random() * 0.3,
    }));
  ctx.strokeStyle = "rgba(150,200,255,0.25)";
  ctx.lineWidth = 1;
  state.drops.forEach((d) => {
    d.y += d.speed;
    d.x -= 1;
    if (d.y > h) {
      d.y = -d.len;
      d.x = Math.random() * w;
    }
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + 2, d.y + d.len);
    ctx.globalAlpha = d.alpha;
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Window glow
  ctx.fillStyle = "rgba(255,200,80,0.05)";
  ctx.beginPath();
  ctx.ellipse(w * 0.3, h * 0.4, 150, 200, 0, 0, Math.PI * 2);
  ctx.fill();
}

function renderStormy(ctx, w, h, f, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#0d0005");
  sky.addColorStop(1, "#1a0010");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Lightning flash
  if (!state.lightningTimer) state.lightningTimer = 0;
  state.lightningTimer--;
  if (state.lightningTimer <= 0) {
    state.lightningTimer = 80 + Math.random() * 120;
    state.flash = 8;
  }
  if (state.flash > 0) {
    ctx.fillStyle = `rgba(200,180,255,${state.flash * 0.02})`;
    ctx.fillRect(0, 0, w, h);
    state.flash--;
  }

  // Moving clouds (dark blobs)
  if (!state.clouds)
    state.clouds = Array.from({ length: 5 }, (_, i) => ({
      x: (i / 5) * w,
      y: Math.random() * h * 0.4,
      r: 100 + Math.random() * 100,
      speed: 0.2 + Math.random() * 0.3,
    }));
  state.clouds.forEach((c) => {
    c.x += c.speed;
    if (c.x - c.r > w) c.x = -c.r;
    const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
    g.addColorStop(0, "rgba(40,0,20,0.6)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderForest(ctx, w, h, f, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#0a1a0a");
  sky.addColorStop(1, "#1a3020");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Mist layers
  for (let i = 0; i < 3; i++) {
    const mistY = h * (0.4 + i * 0.2) + Math.sin(f * 0.01 + i) * 10;
    const g = ctx.createLinearGradient(0, mistY - 40, 0, mistY + 40);
    g.addColorStop(0, "rgba(180,220,200,0)");
    g.addColorStop(0.5, `rgba(180,220,200,${0.06 - i * 0.01})`);
    g.addColorStop(1, "rgba(180,220,200,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, mistY - 40, w, 80);
  }

  // Firefly-like particles
  if (!state.pp)
    state.pp = Array.from({ length: 20 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      phase: Math.random() * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.4,
    }));
  state.pp.forEach((p) => {
    p.x += Math.sin(f * 0.02 + p.phase) * p.speed;
    p.y += Math.cos(f * 0.015 + p.phase) * p.speed;
    const a = (Math.sin(f * 0.04 + p.phase) + 1) / 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(150,255,180,${a * 0.7})`;
    ctx.fill();
  });
}

function renderOcean(ctx, w, h, f, state) {
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, "#000d1a");
  sky.addColorStop(1, "#001f3d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Waves
  for (let wave = 0; wave < 4; wave++) {
    ctx.beginPath();
    const waveY = h * (0.4 + wave * 0.15);
    ctx.moveTo(0, waveY);
    for (let x = 0; x <= w; x += 4) {
      const y =
        waveY + Math.sin(x * 0.015 + f * 0.03 + wave * 0.8) * (8 + wave * 4);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = `rgba(0,100,150,${0.08 + wave * 0.04})`;
    ctx.fill();
  }

  // Bubbles
  if (!state.bubbles)
    state.bubbles = Array.from({ length: 30 }, () => ({
      x: Math.random() * w,
      y: h + Math.random() * 100,
      r: 1 + Math.random() * 4,
      speed: 0.3 + Math.random() * 0.7,
    }));
  state.bubbles.forEach((b) => {
    b.y -= b.speed;
    b.x += Math.sin(f * 0.02 + b.r) * 0.5;
    if (b.y < -10) {
      b.y = h + 10;
      b.x = Math.random() * w;
    }
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(100,200,255,0.3)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  });
}

function renderAurora(ctx, w, h, f, state) {
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, w, h);

  // Stars
  if (!state.stars)
    state.stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.6,
      r: Math.random() * 1.5,
    }));
  state.stars.forEach((s) => {
    const a = 0.4 + Math.sin(f * 0.02 + s.x) * 0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  });

  // Aurora bands
  const colors = ["rgba(0,255,150,", "rgba(100,100,255,", "rgba(200,50,200,"];
  colors.forEach((col, i) => {
    ctx.beginPath();
    const baseY = h * (0.2 + i * 0.1);
    ctx.moveTo(0, baseY);
    for (let x = 0; x <= w; x += 6) {
      const y = baseY + Math.sin(x * 0.008 + f * 0.015 + i * 2) * 60;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const alpha = 0.04 + Math.sin(f * 0.02 + i) * 0.02;
    ctx.fillStyle = `${col}${alpha})`;
    ctx.fill();
  });
}

function renderLibrary(ctx, w, h, f, state) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#0d0800");
  g.addColorStop(1, "#1a1000");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Warm lamp glow
  const lamp = ctx.createRadialGradient(
    w * 0.7,
    h * 0.3,
    0,
    w * 0.7,
    h * 0.3,
    250,
  );
  lamp.addColorStop(0, `rgba(255,180,50,${0.06 + Math.sin(f * 0.02) * 0.01})`);
  lamp.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = lamp;
  ctx.fillRect(0, 0, w, h);

  // Dust motes
  if (!state.dust)
    state.dust = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.1 - Math.random() * 0.2,
      r: 0.5 + Math.random() * 1,
    }));
  state.dust.forEach((d) => {
    d.x += d.vx + Math.sin(f * 0.01) * 0.1;
    d.y += d.vy;
    if (d.y < 0) d.y = h;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,220,150,0.2)`;
    ctx.fill();
  });
}
