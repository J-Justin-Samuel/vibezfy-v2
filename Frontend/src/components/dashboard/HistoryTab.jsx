import { useEffect, useState } from "react";
import { useStore } from "../../context/store.js";
import { api } from "../../services/api.js";
import { getMoodConfig } from "../../utils/moodConfig.js";

function formatDate(ts) {
  const d = ts?._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  if (isNaN(d)) return "—";
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .toUpperCase();
}

export default function HistoryTab() {
  const { moodHistory, setMoodHistory } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.mood
      .getHistory(50)
      .then((d) => setMoodHistory(d.history || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("DELETE LOG ENTRY?")) return;
    try {
      await api.mood.deleteEntry(id);
      setMoodHistory(moodHistory.filter((e) => e.id !== id));
    } catch (e) {
      alert("FATAL ERROR ON DELETE: " + e.message);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Title block */}
      <div className="bg-[#FF007A] text-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          VIBE LEDGER
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-white/80 mt-1">
          Archive of recorded emotional assets
        </p>
      </div>

      {error && (
        <div className="bg-red-400 border-4 border-black p-4 font-bold shadow-[4px_4px_0px_0px_#000]">
          ⚠ LEDGER ACCESS ERROR: {error}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border-4 border-black h-20 w-full animate-pulse shadow-[4px_4px_0px_0px_#000]"
            />
          ))}
        </div>
      )}

      {!loading && moodHistory.length === 0 && (
        <div className="bg-white border-4 border-black p-12 text-center shadow-[6px_6px_0px_0px_#000]">
          <div className="text-6xl mb-4 animate-bounce">🎭</div>
          <p className="font-black text-xl uppercase tracking-tighter">
            THE LEDGER IS VACANT
          </p>
          <p className="font-mono text-xs text-zinc-500 mt-2">
            Initialize mood detection components to store logs.
          </p>
        </div>
      )}

      {/* Grid Stack Layout */}
      <div className="space-y-4">
        {moodHistory.map((entry) => {
          const cfg = getMoodConfig(entry.mood);
          return (
            <div
              key={entry.id}
              className="bg-white border-4 border-black p-4 flex items-center justify-between gap-4 shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-3xl p-2 bg-yellow-300 border-2 border-black flex-shrink-0">
                  {cfg.emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-black text-lg uppercase tracking-tight truncate">
                    {cfg.label}
                  </div>
                  <div className="font-mono text-xs font-bold text-zinc-500">
                    {formatDate(entry.timestamp)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <div className="font-black text-sm bg-black text-[#A3E635] px-1.5 py-0.5 inline-block font-mono">
                    {entry.confidence
                      ? `${Math.round(entry.confidence * 100)}%`
                      : "N/A"}
                  </div>
                  <div className="font-mono text-xxs uppercase tracking-wider text-zinc-500 mt-1">
                    {entry.ambientScene?.replace("_", " ")}
                  </div>
                </div>

                {entry.id && (
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="border-2 border-black bg-white text-black p-2 hover:bg-red-400 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_#000] hover:shadow-none"
                    title="Purge Entry"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
