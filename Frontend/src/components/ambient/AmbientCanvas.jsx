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
    <div className="w-full h-full p-2 bg-[#FFDE4D] border-4 border-black shadow-[4px_4px_0px_0px_#000] relative overflow-hidden">
      {/* Brutalist Frame Label Badge */}
      <div className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border border-white">
        vibe_monitor // {ambientScene || "default"}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white border-2 border-black block image-render-pixelated"
      />
    </div>
  );
}

// ── Brutalist Scene Renderers ───────────────────────────────────────────────────

function renderGoldenHour(ctx, w, h, f, state) {
  // Flat layered background bands instead of smooth gradients
  ctx.fillStyle = "#FFB84D";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#FF8C00";
  ctx.fillRect(0, 0, w, h * 0.6);
  ctx.fillStyle = "#8B3700";
  ctx.fillRect(0, 0, w, h * 0.3);

  // Sharp Sun with concentric ring outlines
  const sunY = h * 0.55 + Math.sin(f * 0.005) * 5;
  ctx.beginPath();
  ctx.arc(w * 0.6, sunY, 50, 0, Math.PI * 2);
  ctx.fillStyle = "#FFF";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";
  ctx.fill();
  ctx.stroke();

  // Chunky Fireflies (Square blocks)
  if (!state.ff)
    state.ff = Array.from({ length: 15 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.7,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
    }));

  ctx.fillStyle = "#000";
  state.ff.forEach((ff) => {
    ff.x += ff.vx;
    ff.y += ff.vy;
    if (ff.x < 0) ff.x = w;
    if (ff.x > w) ff.x = 0;
    if (ff.y < 0) ff.y = h;
    if (ff.y > h * 0.7) ff.y = 0;

    // Hard square particles
    ctx.fillRect(ff.x, ff.y, 6, 6);
  });
}

function renderRainCafe(ctx, w, h, f, state) {
  // Deep base background blocks
  ctx.fillStyle = "#1a2840";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#0a1628";
  ctx.fillRect(0, 0, w, h * 0.4);

  // Thick heavy rain strokes
  if (!state.drops)
    state.drops = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 6 + Math.random() * 4,
      len: 15 + Math.random() * 15,
    }));

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  state.drops.forEach((d) => {
    d.y += d.speed;
    d.x -= 1.5;
    if (d.y > h) {
      d.y = -d.len;
      d.x = Math.random() * w;
    }
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + 3, d.y + d.len);
    ctx.stroke();
  });

  // Solid Window Mask Glow
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.fillStyle = "rgba(255,200,80,0.15)";
  ctx.beginPath();
  ctx.rect(w * 0.1, h * 0.2, 120, 160);
  ctx.fill();
  ctx.stroke();
}

function renderStormy(ctx, w, h, f, state) {
  // Split dark backdrop canvas
  ctx.fillStyle = "#1a0010";
  ctx.fillRect(0, 0, w, h);

  // Hard flashing screen trigger
  if (!state.lightningTimer) state.lightningTimer = 0;
  state.lightningTimer--;
  if (state.lightningTimer <= 0) {
    state.lightningTimer = 60 + Math.random() * 100;
    state.flash = 6;
  }
  if (state.flash > 0) {
    if (state.flash % 2 === 0) {
      ctx.fillStyle = "#FD49A0"; // Loud Pink flash instead of soft white transparency
      ctx.fillRect(0, 0, w, h);
    }
    state.flash--;
  }

  // Sharp interlocking cloud blocks
  if (!state.clouds)
    state.clouds = Array.from({ length: 4 }, (_, i) => ({
      x: (i / 4) * w,
      y: 30 + Math.random() * h * 0.2,
      w: 120 + Math.random() * 80,
      h: 60 + Math.random() * 40,
      speed: 0.4 + Math.random() * 0.4,
    }));

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  state.clouds.forEach((c) => {
    c.x += c.speed;
    if (c.x > w) c.x = -c.w;

    ctx.fillStyle = "#0d0005";
    ctx.fillRect(c.x, c.y, c.w, c.h);
    ctx.strokeRect(c.x, c.y, c.w, c.h);
  });
}

function renderForest(ctx, w, h, f, state) {
  ctx.fillStyle = "#1a3020";
  ctx.fillRect(0, 0, w, h);

  // Hard solid geometric step-bands acting as fog sheets
  for (let i = 0; i < 3; i++) {
    const mistY = h * (0.35 + i * 0.2) + Math.sin(f * 0.02 + i) * 6;
    ctx.fillStyle = "rgba(180,220,200,0.12)";
    ctx.fillRect(0, mistY, w, 25);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.strokeRect(0, mistY, w, 25);
  }

  // Large square pixel fragments floating up
  if (!state.pp)
    state.pp = Array.from({ length: 12 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: 5 + Math.random() * 4,
      speed: 0.3 + Math.random() * 0.5,
    }));

  ctx.fillStyle = "#00E676"; // Neo Green chunks
  state.pp.forEach((p) => {
    p.y -= p.speed;
    if (p.y < -10) p.y = h + 10;
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.strokeRect(p.x, p.y, p.size, p.size);
  });
}

function renderOcean(ctx, w, h, f, state) {
  ctx.fillStyle = "#001f3d";
  ctx.fillRect(0, 0, w, h);

  // Hard stair-stepped jagged vector waves
  for (let wave = 0; wave < 3; wave++) {
    ctx.beginPath();
    const waveY = h * (0.5 + wave * 0.15);
    ctx.moveTo(0, waveY);

    // Large, jagged line segments mimicking a low-res digital wave
    for (let x = 0; x <= w + 40; x += 40) {
      const y = waveY + Math.sin(x * 0.01 + f * 0.04 + wave) * 15;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();

    ctx.fillStyle = wave === 0 ? "#005f8d" : wave === 1 ? "#008dbd" : "#3D52D5";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.fill();
    ctx.stroke();
  }
}

function renderAurora(ctx, w, h, f, state) {
  ctx.fillStyle = "#000510";
  ctx.fillRect(0, 0, w, h);

  // Sharp crossbox stars
  if (!state.stars)
    state.stars = Array.from({ length: 20 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.5,
    }));

  ctx.fillStyle = "#FFF";
  state.stars.forEach((s) => {
    ctx.fillRect(s.x, s.y, 4, 4); // Square stars
  });

  // Solid stepping paths for auroras
  const colors = ["#00E676", "#3D52D5", "#FD49A0"];
  colors.forEach((col, i) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = 6;
    ctx.beginPath();
    const baseY = h * (0.25 + i * 0.12);

    for (let x = 0; x <= w; x += 30) {
      const y = baseY + Math.sin(x * 0.01 + f * 0.02 + i) * 35;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
}

function renderLibrary(ctx, w, h, f, state) {
  // Flat background splits
  ctx.fillStyle = "#1a1000";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#0d0800";
  ctx.fillRect(0, 0, w, h * 0.5);

  // Giant explicit hard circle vector for lamp light rings
  const lampY = h * 0.3;
  const lampX = w * 0.7;

  ctx.lineWidth = 3;
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "rgba(255,180,50,0.15)";
  ctx.beginPath();
  ctx.arc(lampX, lampY, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Falling block dust elements
  if (!state.dust)
    state.dust = Array.from({ length: 15 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0.4 + Math.random() * 0.4,
    }));

  ctx.fillStyle = "#FFDE4D";
  state.dust.forEach((d) => {
    d.y += d.speed;
    if (d.y > h) d.y = -5;
    ctx.fillRect(d.x, d.y, 5, 5);
  });
}
