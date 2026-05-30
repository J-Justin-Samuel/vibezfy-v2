import { useEffect, useState } from "react";
import { useStore } from "../../context/store.js";
import { api } from "../../services/api.js";
import { getMoodConfig } from "../../utils/moodConfig.js";

function formatDate(ts) {
  const d = ts?._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  if (isNaN(d)) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
    try {
      await api.mood.deleteEntry(id);
      setMoodHistory(moodHistory.filter((e) => e.id !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="font-display font-bold text-2xl text-vib-text">
          Mood Log
        </h1>
        <p className="text-vib-textDim font-body mt-1 text-sm">
          Your recent vibe sessions.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="card p-4 h-16 animate-pulse bg-vib-surface"
            />
          ))}
        </div>
      )}

      {!loading && moodHistory.length === 0 && (
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">🎭</div>
          <p className="text-vib-textDim font-body text-sm">
            No mood sessions yet. Head to Detect to get started!
          </p>
        </div>
      )}

      <div className="space-y-3 animate-slide-up">
        {moodHistory.map((entry) => {
          const cfg = getMoodConfig(entry.mood);
          return (
            <div
              key={entry.id}
              className={`card p-4 flex items-center gap-4 border ${cfg.borderClass} hover:scale-[1.01] transition-transform duration-150`}
            >
              <span className="text-2xl">{cfg.emoji}</span>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-display font-semibold text-sm ${cfg.accentClass}`}
                >
                  {cfg.label}
                </div>
                <div className="text-vib-muted text-xs font-body">
                  {formatDate(entry.timestamp)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-vib-textDim text-xs font-mono">
                  {entry.confidence
                    ? `${Math.round(entry.confidence * 100)}%`
                    : "—"}
                </div>
                <div className="text-vib-muted text-xs">
                  {entry.ambientScene?.replace("_", " ")}
                </div>
              </div>
              {entry.id && (
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-vib-muted hover:text-red-400 transition-colors p-1 ml-2"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
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
          );
        })}
      </div>
    </div>
  );
}
