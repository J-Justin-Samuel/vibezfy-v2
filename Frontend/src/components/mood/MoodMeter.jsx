import { getMoodConfig } from "../../utils/moodConfig.js";

export default function MoodMeter({ detection }) {
  if (!detection?.allExpressions) return null;

  const sorted = Object.entries(detection.allExpressions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="card p-4 space-y-3 animate-slide-up">
      <div className="text-vib-muted text-xs font-body uppercase tracking-widest">
        Expression Breakdown
      </div>
      {sorted.map(([mood, val]) => {
        const cfg = getMoodConfig(mood);
        const pct = Math.round(val * 100);
        return (
          <div key={mood} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{cfg.emoji}</span>
                <span
                  className={`text-xs font-display font-medium ${cfg.accentClass}`}
                >
                  {cfg.label}
                </span>
              </div>
              <span className="text-vib-muted text-xs font-mono">{pct}%</span>
            </div>
            <div className="h-1.5 bg-vib-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
