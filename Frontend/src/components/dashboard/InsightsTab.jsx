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
      <div className="space-y-4 max-w-3xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border-4 border-black h-24 animate-pulse shadow-[4px_4px_0px_0px_#000]"
          />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto border-4 border-black bg-red-400 p-6 font-black text-center shadow-[6px_6px_0px_0px_#000]">
        INSIGHT DATA ARCHIVE FAILURE: {error}
      </div>
    );

  if (!insights) return null;

  if (!insights.hasData)
    return (
      <div className="max-w-3xl mx-auto bg-white border-4 border-black p-12 text-center shadow-[6px_6px_0px_0px_#000]">
        <div className="text-6xl mb-4">📊</div>
        <p className="font-black text-xl uppercase tracking-tighter">
          METRIC RECORD INSUFFICIENT
        </p>
        <p className="font-mono text-xs text-zinc-500 mt-2">
          {insights.message}
        </p>
      </div>
    );

  const topMoodCfg = getMoodConfig(insights.dominantMood);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Section Head */}
      <div className="bg-[#A3E635] border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          VIBE METRICS
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-black/70 mt-1">
          7-Day analytic cluster breakdown
        </p>
      </div>

      {/* Grid Block Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricStatCard
          label="VERIFIED SESSIONS"
          value={insights.totalSessions}
          icon="🎯"
          color="bg-white"
        />
        <MetricStatCard
          label="TEMPORAL STREAK"
          value={`${insights.streak} DAYS`}
          icon="🔥"
          color="bg-yellow-300"
        />
        <MetricStatCard
          label="DIVERSITY INDEX"
          value={`${insights.diversityScore}%`}
          icon="🌈"
          color="bg-[#00F0FF]"
        />
      </div>

      {/* Dominant Block Card */}
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] relative">
        <span className="absolute -top-3.5 left-4 bg-black text-white font-mono text-xxs font-black px-2 py-0.5 tracking-widest uppercase">
          DOMINANT STRUCTURAL ACCUMULATION
        </span>
        <div className="flex items-center gap-6 mt-2">
          <span className="text-6xl p-3 bg-purple-400 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
            {topMoodCfg.emoji}
          </span>
          <div>
            <h3 className="font-black text-3xl uppercase tracking-tight text-black">
              {topMoodCfg.label}
            </h3>
            <p className="font-mono text-sm text-zinc-600 font-bold uppercase mt-1">
              // Configuration: {topMoodCfg.ambientDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Linear Percent Stack Chart */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000] space-y-4">
        <h2 className="font-black text-xl uppercase tracking-tighter border-b-2 border-black pb-2">
          PROPORTIONAL SPECTRUM ALLOCATION
        </h2>
        <div className="space-y-3">
          {insights.moodBreakdown?.map((item) => {
            return (
              <div key={item.mood} className="space-y-1">
                <div className="flex justify-between font-mono text-xs font-bold uppercase">
                  <span className="flex items-center gap-1">
                    <span>{item.emoji}</span>{" "}
                    <span className="font-black">{item.label}</span>
                  </span>
                  <span>
                    {item.percentage}% ({item.count}X)
                  </span>
                </div>
                {/* Custom Block Progress Bar */}
                <div className="h-5 bg-zinc-100 border-2 border-black p-0.5 rounded-none">
                  <div
                    className="h-full bg-black border border-black transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: "#FF007A",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Chrono Block Graph */}
      <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] space-y-4">
        <h2 className="font-black text-xl uppercase tracking-tighter border-b-2 border-black pb-2">
          DAILY VOLUME PROFILE
        </h2>
        <div className="flex items-end gap-3 h-32 pt-6 px-2">
          {insights.chartData?.map((day) => (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
            >
              <span className="text-sm scale-0 group-hover:scale-100 transition-transform font-bold">
                {day.emoji || "•"}
              </span>
              <div
                className="w-full border-2 border-black transition-all duration-300 relative shadow-[2px_2px_0px_0px_#000]"
                style={{
                  height:
                    day.sessions > 0
                      ? `${Math.max(20, (day.sessions / (insights.totalSessions || 1)) * 100)}%`
                      : "8px",
                  backgroundColor: day.color || "#000000",
                }}
              />
              <span className="font-mono text-xxs font-black uppercase text-zinc-500 tracking-tighter border-t border-zinc-200 w-full text-center pt-1">
                {day.label.split(",")[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricStatCard({ label, value, icon, color }) {
  return (
    <div
      className={`${color} border-4 border-black p-4 text-center shadow-[4px_4px_0px_0px_#000]`}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <div className="font-black text-2xl uppercase tracking-tighter">
        {value}
      </div>
      <div className="font-mono text-xxs font-bold text-zinc-500 tracking-wider mt-1 uppercase">
        {label}
      </div>
    </div>
  );
}
