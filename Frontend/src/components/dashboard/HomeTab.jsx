import { useStore } from "../../context/store.js";
import { getMoodConfig } from "../../utils/moodConfig.js";
import SpotifyConnect from "../auth/SpotifyConnect.jsx";
import MoodCard from "../mood/MoodCard.jsx";

// Brutalist color palette — bright, clashing, intentional
const ACCENT = {
  yellow: "#FFDE4D",
  pink: "#FD49A0",
  green: "#00E676",
  orange: "#FF5C00",
  blue: "#3D52D5",
  cyan: "#00F0FF",
  lime: "#CCFF00",
  purple: "#B94FFF",
};

export default function HomeTab() {
  const {
    user,
    userProfile,
    spotifyConnected,
    currentMood,
    currentPlaylist,
    moodHistory,
  } = useStore();

  const displayName = userProfile?.displayName || user?.displayName || "USER";
  const firstName = displayName.split(" ")[0].toUpperCase();
  const moodCfg = currentMood ? getMoodConfig(currentMood) : null;

  return (
    <div
      className="min-h-screen w-full px-4 py-6 md:px-8 md:py-10 space-y-8"
      style={{
        background: "#FFFBEF",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* ── HEADER ────────────────────────────────────── */}
      <header
        className="relative border-4 border-black p-6 md:p-8 overflow-hidden"
        style={{ background: ACCENT.yellow, boxShadow: "8px 8px 0 0 #000" }}
      >
        {/* decorative stripe */}
        <div
          className="absolute top-0 right-0 w-24 h-full opacity-30"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              #000 0px, #000 4px,
              transparent 4px, transparent 14px
            )`,
          }}
        />
        <div className="relative z-10">
          <div
            className="inline-block text-[10px] font-black uppercase tracking-widest px-2 py-1 border-2 border-black mb-3"
            style={{ background: ACCENT.pink, color: "#fff" }}
          >
            // VIBZFY DASHBOARD //
          </div>
          <h1 className="font-black text-4xl md:text-6xl tracking-tighter uppercase leading-none">
            SALUTATIONS,
            <br />
            <span
              className="inline-block mt-1 px-2 border-4 border-black"
              style={{ background: ACCENT.blue, color: "#fff" }}
            >
              {firstName} ⚡
            </span>
          </h1>
          <p
            className="inline-block mt-4 px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black"
            style={{ background: "#000", color: ACCENT.cyan }}
          >
            {currentMood
              ? `METRIC STATUS: ${moodCfg.label.toUpperCase()}`
              : "STATUS: AWAITING MOOD MATRIX"}
          </p>
        </div>
      </header>

      {/* ── SPOTIFY CONNECT ───────────────────────────── */}
      {!spotifyConnected && (
        <div
          className="border-4 border-black"
          style={{ boxShadow: "6px 6px 0 0 " + ACCENT.green }}
        >
          <SpotifyConnect />
        </div>
      )}

      {/* ── ACTIVE MOOD HERO ──────────────────────────── */}
      {currentMood && (
        <div
          className="border-4 border-black p-5 md:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5 relative overflow-hidden"
          style={{
            background: ACCENT.lime,
            boxShadow: "8px 8px 0 0 " + ACCENT.pink,
          }}
        >
          {/* diagonal stripe accent */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                #000 0px, #000 2px,
                transparent 2px, transparent 18px
              )`,
            }}
          />
          <div
            className="text-6xl p-4 border-4 border-black flex-shrink-0 relative z-10"
            style={{ background: "#fff", boxShadow: "4px 4px 0 0 #000" }}
          >
            {moodCfg.emoji}
          </div>
          <div className="space-y-1 min-w-0 relative z-10">
            <span
              className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border-2 border-black"
              style={{ background: "#000", color: ACCENT.lime }}
            >
              CURRENT AUDIO EMITTANCE
            </span>
            <h2 className="font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none">
              {moodCfg.label}
            </h2>
            <p className="text-xs font-black text-black/60 uppercase tracking-wide">
              {moodCfg.ambientDesc} // {moodCfg.playlistName}
            </p>
          </div>
          {/* big number badge */}
          <div
            className="hidden md:flex ml-auto flex-shrink-0 w-20 h-20 border-4 border-black items-center justify-center flex-col"
            style={{ background: ACCENT.orange, boxShadow: "4px 4px 0 0 #000" }}
          >
            <span className="text-2xl font-black text-white">
              {moodHistory.length}
            </span>
            <span className="text-[8px] font-black uppercase text-white/80">
              SCANS
            </span>
          </div>
        </div>
      )}

      {/* ── QUICK ACTION ACTIONS AREA ─────────────────── */}
      <div className="space-y-4">
        {/* HERO ACTION ROW: START A SCAN */}
        <button
          onClick={() => useStore.getState().setActiveTab("detect")}
          className="group border-4 border-black p-6 md:p-8 text-left flex flex-col md:flex-row md:items-center justify-between min-h-36 w-full relative overflow-hidden transition-all hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2"
          style={{
            background: ACCENT.pink,
            color: "#fff",
            boxShadow: "10px 10px 0 0 #000",
          }}
        >
          {/* Animated background lines on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none duration-200"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                #fff 0px, #fff 10px,
                transparent 10px, transparent 20px
              )`,
            }}
          />

          <div className="space-y-2 max-w-xl relative z-10">
            <div
              className="text-xs font-black uppercase tracking-widest px-2 py-0.5 border-2 border-black w-fit flex items-center gap-1.5"
              style={{ background: ACCENT.cyan, color: "#000" }}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping" />
              SYSTEM CORE INIT // 01
            </div>
            <h3 className="font-black text-3xl md:text-5xl uppercase tracking-tighter leading-none group-hover:text-black transition-colors">
              START A LIVE SCAN →
            </h3>
            <p className="text-xs md:text-sm font-bold text-white/90 leading-snug font-mono">
              Boot up your local hardware imaging lens. Analyze real-time
              neurological clusters to isolate pop frequencies.
            </p>
          </div>

          <div className="mt-4 md:mt-0 font-black text-6xl md:text-8xl select-none opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all font-sans leading-none">
            📸
          </div>
        </button>

        {/* SECONDARY ROW: METRICS & HISTORY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickActionCard
            label="02"
            title="WEEKLY METRICS"
            desc="See how your mood has shifted over the last 7 days."
            bg={ACCENT.blue}
            textColor="#fff"
            shadowColor={ACCENT.yellow}
            onClick={() => useStore.getState().setActiveTab("insights")}
          />
          <QuickActionCard
            label="03"
            title="MOOD HISTORY"
            desc={`${moodHistory.length} structural captures in registry.`}
            bg={ACCENT.orange}
            textColor="#fff"
            shadowColor={ACCENT.pink}
            onClick={() => useStore.getState().setActiveTab("history")}
          />
        </div>
      </div>

      {/* ── PLAYLIST ──────────────────────────────────── */}
      {currentPlaylist && (
        <div
          className="border-4 border-black bg-white"
          style={{ boxShadow: "8px 8px 0 0 " + ACCENT.blue }}
        >
          {/* playlist header */}
          <div
            className="flex items-center justify-between border-b-4 border-black px-6 py-4"
            style={{ background: ACCENT.cyan }}
          >
            <h2 className="font-black text-xl uppercase tracking-tighter">
              DATA TRANSMISSION PLAYLIST
            </h2>
            <span
              className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black"
              style={{ background: "#000", color: ACCENT.cyan }}
            >
              {currentPlaylist.tracks?.length} TRACKS
            </span>
          </div>
          {/* track rows */}
          <div className="divide-y-4 divide-black">
            {currentPlaylist.tracks?.slice(0, 5).map((track, i) => (
              <div
                key={track.id}
                className="px-6 py-3 hover:bg-yellow-50 transition-colors"
              >
                <MoodCard track={track} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SYSTEM INFO GRID (onboarding fallback) ────── */}
      {!currentPlaylist && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SystemBlurb
            num="A"
            title="ENGINE: face-api.js"
            desc="Deterministic vision analysis running inside local sandboxed engine. Zero packet escape leaks."
            bg={ACCENT.green}
            shadowColor={ACCENT.blue}
          />
          <SystemBlurb
            num="B"
            title="TARGETING: Audio Matrix"
            desc="Raw Spotify audio feature recommendations mapping energy, acoustic frequency, and valence."
            bg={ACCENT.cyan}
            shadowColor={ACCENT.orange}
          />
          <SystemBlurb
            num="C"
            title="CANVAS: Dynamic Scenes"
            desc="7 hardware-accelerated graphic rendering canvases shifting ecosystem color codes automatically."
            bg={ACCENT.purple}
            shadowColor={ACCENT.lime}
            lightText
          />
          <SystemBlurb
            num="D"
            title="LOGIC: Pattern Clusters"
            desc="Structural diagnostic logging analyzing moving averages and stability indicators of your mind state."
            bg={ACCENT.lime}
            shadowColor={ACCENT.pink}
          />
        </div>
      )}

      {/* ── FOOTER STATUS BAR ─────────────────────────── */}
      <div
        className="border-4 border-black px-4 py-3 flex items-center justify-between text-[10px] font-black uppercase tracking-widest"
        style={{ background: "#000", color: ACCENT.yellow }}
      >
        <span>VIBZFY // v1.0.26</span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 animate-pulse"
            style={{ background: ACCENT.green }}
          />
          SYSTEM NOMINAL
        </span>
      </div>
    </div>
  );
}

/* ── SUB COMPONENTS ───────────────────────────────────── */

function QuickActionCard({
  label,
  title,
  desc,
  bg,
  textColor,
  shadowColor,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="border-4 border-black p-5 text-left flex flex-col justify-between h-44 w-full relative overflow-hidden transition-all hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2"
      style={{
        background: bg,
        color: textColor,
        boxShadow: `6px 6px 0 0 ${shadowColor}`,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "2px 2px 0 0 " + shadowColor)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = `6px 6px 0 0 ${shadowColor}`)
      }
    >
      {/* big number watermark */}
      <span
        className="absolute right-3 top-2 text-7xl font-black leading-none select-none pointer-events-none"
        style={{ color: "rgba(0,0,0,0.12)" }}
      >
        {label}
      </span>
      <div
        className="text-xs font-black uppercase tracking-widest px-2 py-0.5 border-2 border-black w-fit"
        style={{ background: "#000", color: bg }}
      >
        [{label}]
      </div>
      <div>
        <div className="font-black text-lg uppercase tracking-tighter leading-tight mb-1">
          {title}
        </div>
        <div className="text-xs font-bold opacity-80 leading-snug">{desc}</div>
      </div>
    </button>
  );
}

function SystemBlurb({ num, title, desc, bg, shadowColor, lightText }) {
  return (
    <div
      className="border-4 border-black p-5 flex gap-4 items-start"
      style={{
        background: bg,
        boxShadow: `6px 6px 0 0 ${shadowColor}`,
        color: lightText ? "#fff" : "#000",
      }}
    >
      <div
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center border-2 border-black font-black text-lg"
        style={{ background: "#000", color: bg }}
      >
        {num}
      </div>
      <div className="space-y-1">
        <h4 className="font-black text-sm uppercase tracking-wider">{title}</h4>
        <p className="text-xs font-bold opacity-70 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
