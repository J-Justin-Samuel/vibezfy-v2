import { useStore } from "../../context/store.js";
import { getMoodConfig } from "../../utils/moodConfig.js";
import SpotifyConnect from "../auth/SpotifyConnect.jsx";
import MoodCard from "../mood/MoodCard.jsx";

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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Heavy Header */}
      <div className="bg-[#00F0FF] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] relative overflow-hidden">
        <h1 className="font-black text-4xl md:text-6xl tracking-tighter uppercase">
          SALUTATIONS, {firstName} ⚡
        </h1>
        <p className="font-black text-sm uppercase bg-black text-white inline-block px-2 py-0.5 mt-2 tracking-wide">
          {currentMood
            ? `METRIC STATUS: ${moodCfg.label.toUpperCase()}`
            : "STATUS: UNRESOLVED MOOD MATRIX"}
        </p>
      </div>

      {!spotifyConnected && (
        <div className="border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          <SpotifyConnect />
        </div>
      )}

      {/* Hero Display of Active Vibe */}
      {currentMood && (
        <div className="bg-yellow-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="text-7xl p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] flex-shrink-0">
            {moodCfg.emoji}
          </div>
          <div className="space-y-1 min-w-0">
            <span className="bg-black text-white px-2 py-0.5 text-xs font-mono uppercase font-black">
              CURRENT AUDIO EMITTANCE
            </span>
            <h2 className="font-black text-3xl md:text-4xl uppercase tracking-tight truncate">
              {moodCfg.label}
            </h2>
            <p className="font-mono text-sm font-bold text-black/70">
              {moodCfg.ambientDesc} // {moodCfg.playlistName}
            </p>
          </div>
        </div>
      )}

      {/* Brutalist Matrix Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickActionCard
          emoji="🎭"
          title="RUN MATRIX SCAN"
          desc="Initialize localized algorithmic edge mapping."
          color="bg-[#A3E635]"
          onClick={() => useStore.getState().setActiveTab("detect")}
        />
        <QuickActionCard
          emoji="📊"
          title="WEEKLY METRICS"
          desc="Analyze temporal pattern clusters over 7 days."
          color="bg-purple-400"
          onClick={() => useStore.getState().setActiveTab("insights")}
        />
        <QuickActionCard
          emoji="⏱️"
          title="TEMPORAL LOGS"
          desc={`${moodHistory.length} structural captures verified in registry.`}
          color="bg-[#FF5C00]"
          onClick={() => useStore.getState().setActiveTab("history")}
        />
      </div>

      {/* Track Layout Array */}
      {currentPlaylist && (
        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] space-y-4">
          <div className="flex justify-between items-end border-b-4 border-black pb-3">
            <h2 className="font-black text-2xl uppercase tracking-tighter">
              DATA TRANSMISSION PLAYLIST
            </h2>
            <span className="font-mono bg-black text-[#00F0FF] px-2 py-0.5 text-xs font-bold">
              {currentPlaylist.tracks?.length} BUFFERS
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {currentPlaylist.tracks?.slice(0, 5).map((track, i) => (
              <div
                key={track.id}
                className="border-2 border-black p-1 bg-white hover:bg-zinc-50"
              >
                <MoodCard track={track} index={i} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Onboarding Blocks fallback */}
      {!currentPlaylist && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SystemBlurb
            emoji="🤖"
            title="ENGINE: face-api.js"
            desc="Deterministic vision analysis running inside local sandboxed engine context. Zero packet escape leaks."
          />
          <SystemBlurb
            emoji="🎵"
            title="TARGETING: Audio Matrix"
            desc="Raw Spotify audio feature recommendations mapping energy levels, acoustic frequency, and valence structures."
          />
          <SystemBlurb
            emoji="🌌"
            title="CANVAS: Dynamic Scenes"
            desc="7 modular hardware accelerated graphic rendering canvases shifting ecosystem color codes automatically."
          />
          <SystemBlurb
            emoji="📈"
            title="LOGIC: Pattern Clusters"
            desc="Structural diagnostic logging analyzing moving averages and stability indicators of your mind state."
          />
        </div>
      )}
    </div>
  );
}

function QuickActionCard({ emoji, title, desc, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} border-4 border-black p-5 text-left shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition-all flex flex-col justify-between h-48`}
    >
      <div className="text-3xl p-1 bg-white border-2 border-black inline-block">
        {emoji}
      </div>
      <div>
        <div className="font-black text-base uppercase tracking-tighter leading-none mb-1">
          {title}
        </div>
        <div className="font-mono text-xs font-bold text-black/80 leading-tight">
          {desc}
        </div>
      </div>
    </button>
  );
}

function SystemBlurb({ emoji, title, desc }) {
  return (
    <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_#000] flex gap-4 items-start">
      <div className="text-3xl p-2 bg-zinc-100 border-2 border-black flex-shrink-0">
        {emoji}
      </div>
      <div className="space-y-1">
        <h4 className="font-black text-sm uppercase tracking-wider">{title}</h4>
        <p className="font-mono text-xs font-bold text-zinc-600 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
