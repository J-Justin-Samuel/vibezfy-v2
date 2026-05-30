import { useEffect, useState } from "react";
import { useStore } from "../../context/store.js";
import { api } from "../../services/api.js";
import { getMoodConfig } from "../../utils/moodConfig.js";

export default function InsightsTab() {
  const { insights, setInsights } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (insights) return;
    setLoading(true);
    api.insights
      .getWeekly()
      .then((d) => setInsights(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card h-24 animate-pulse bg-vib-surface" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="card p-6 text-center text-red-400">{error}</div>
      </div>
    );

  if (!insights) return null;

  if (!insights.hasData)
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="card p-10 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-vib-textDim font-body text-sm">
            {insights.message}
          </p>
        </div>
      </div>
    );

  const topMoodCfg = getMoodConfig(insights.dominantMood);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="font-display font-bold text-2xl text-vib-text">
          Weekly Insights
        </h1>
        <p className="text-vib-textDim font-body mt-1 text-sm">
          Your mood patterns from the past 7 days.
        </p>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-3 gap-4 animate-slide-up">
        <StatCard label="Sessions" value={insights.totalSessions} icon="🎯" />
        <StatCard label="Day Streak" value={`${insights.streak}d`} icon="🔥" />
        <StatCard
          label="Mood Variety"
          value={`${insights.diversityScore}%`}
          icon="🌈"
        />
      </div>

      {/* Dominant mood */}
      <div
        className={`card p-6 bg-gradient-to-br ${topMoodCfg.bgClass} border ${topMoodCfg.borderClass} animate-scale-in`}
      >
        <div className="text-vib-muted text-xs font-body uppercase tracking-widest mb-3">
          Dominant Vibe This Week
        </div>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{topMoodCfg.emoji}</span>
          <div>
            <div
              className={`font-display font-bold text-2xl ${topMoodCfg.accentClass}`}
            >
              {topMoodCfg.label}
            </div>
            <div className="text-vib-textDim text-sm font-body">
              {topMoodCfg.ambientDesc}
            </div>
          </div>
        </div>
      </div>

      {/* Mood breakdown */}
      <div className="card p-6 space-y-4 animate-slide-up">
        <h2 className="font-display font-semibold text-vib-text">
          Mood Breakdown
        </h2>
        {insights.moodBreakdown?.map((item) => {
          const cfg = getMoodConfig(item.mood);
          return (
            <div key={item.mood} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.emoji}</span>
                  <span
                    className={`text-sm font-display font-medium ${cfg.accentClass}`}
                  >
                    {item.label}
                  </span>
                </div>
                <span className="text-vib-muted text-xs font-mono">
                  {item.percentage}% · {item.count}x
                </span>
              </div>
              <div className="h-2 bg-vib-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} transition-all duration-700`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-day chart */}
      <div className="card p-6 space-y-4 animate-slide-up">
        <h2 className="font-display font-semibold text-vib-text">
          Daily Activity
        </h2>
        <div className="flex items-end gap-2 h-24">
          {insights.chartData?.map((day) => (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-sm">{day.emoji}</span>
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height:
                    day.sessions > 0
                      ? `${Math.max(20, (day.sessions / (insights.totalSessions || 1)) * 80)}px`
                      : "4px",
                  backgroundColor: day.color || "#1e2d42",
                  opacity: day.sessions > 0 ? 1 : 0.3,
                }}
              />
              <span className="text-vib-muted text-xs font-mono">
                {day.label.split(",")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {insights.bestFocusDay && (
        <div className="card p-4 flex items-center gap-3 animate-fade-in">
          <span className="text-2xl">🏆</span>
          <div>
            <div className="font-display font-semibold text-sm text-vib-text">
              Best Focus Day
            </div>
            <div className="text-vib-muted text-xs font-body">
              {insights.bestFocusDay} had your highest concentration of positive
              vibes.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-display font-bold text-xl text-vib-text">
        {value}
      </div>
      <div className="text-vib-muted text-xs font-body">{label}</div>
    </div>
  );
}
