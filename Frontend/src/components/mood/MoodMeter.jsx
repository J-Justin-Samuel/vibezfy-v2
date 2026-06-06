import { getMoodConfig } from "../../utils/moodConfig.js";

export default function MoodMeter({ detection }) {
  if (!detection?.allExpressions) return null;

  const sorted = Object.entries(detection.allExpressions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="bg-white border-4 border-black p-5 space-y-4 shadow-[6px_6px_0px_0px_#000]">
      <div className="bg-black text-white text-xs font-black uppercase tracking-widest px-2 py-1 inline-block transform -rotate-1">
        Expression Breakdown //
      </div>

      <div className="space-y-3">
        {sorted.map(([mood, val]) => {
          const cfg = getMoodConfig(mood);
          const pct = Math.round(val * 100);

          return (
            <div
              key={mood}
              className="space-y-1 bg-gray-50 border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base bg-white border border-black p-0.5 shadow-[1px_1px_0px_0px_#000]">
                    {cfg.emoji}
                  </span>
                  <span className="text-xs font-black uppercase tracking-wide text-black">
                    {cfg.label}
                  </span>
                </div>
                <span className="bg-black text-white font-mono text-[11px] px-1.5 font-bold">
                  {pct}%
                </span>
              </div>

              {/* Progress Channel Track Layout */}
              <div className="h-4 bg-white border-2 border-black p-0.5 overflow-hidden">
                <div
                  className="h-full bg-[#FD49A0] border-r-2 border-black transition-all duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor:
                      mood === "happy"
                        ? "#00E676"
                        : mood === "sad"
                          ? "#3D52D5"
                          : "#FD49A0",
                    /* Overrode smooth subtle gradients with solid loud color bands */
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
