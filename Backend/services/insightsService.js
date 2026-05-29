import { getMoodHistoryByDays, getMoodStats } from "./moodService.js";
import { getMoodConfig } from "../config/moodConfig.js";

/**
 * Generate weekly mood insights for a user
 */
export async function getWeeklyInsights(userId) {
  const [history, stats] = await Promise.all([
    getMoodHistoryByDays(userId, 7),
    getMoodStats(userId),
  ]);

  if (history.length === 0) {
    return {
      hasData: false,
      message: "No mood data for this week yet. Start detecting your mood!",
    };
  }

  // Count moods this week
  const moodCounts = {};
  const dailyMoods = {}; // day → [moods]

  for (const entry of history) {
    const mood = entry.mood;
    moodCounts[mood] = (moodCounts[mood] || 0) + 1;

    const day = new Date(
      entry.timestamp._seconds * 1000 || entry.timestamp,
    ).toLocaleDateString("en-US", { weekday: "short" });
    if (!dailyMoods[day]) dailyMoods[day] = [];
    dailyMoods[day].push(mood);
  }

  // Dominant mood this week
  const dominantMood =
    Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
  const dominantConfig = getMoodConfig(dominantMood);

  // Mood diversity score (0–100)
  const uniqueMoods = Object.keys(moodCounts).length;
  const diversityScore = Math.round((uniqueMoods / 7) * 100);

  // Most productive day (neutral = most focused)
  const focusDays = Object.entries(dailyMoods)
    .map(([day, moods]) => ({
      day,
      focusScore:
        moods.filter((m) => m === "neutral" || m === "happy").length /
        moods.length,
    }))
    .sort((a, b) => b.focusScore - a.focusScore);

  // Streak calculation
  const streak = calculateStreak(history);

  // Chart data – past 7 days with mood
  const chartData = buildChartData(history);

  return {
    hasData: true,
    totalSessions: history.length,
    dominantMood,
    dominantMoodLabel: dominantConfig.label,
    dominantMoodEmoji: dominantConfig.emoji,
    dominantMoodGradient: dominantConfig.gradient,
    moodCounts,
    moodBreakdown: Object.entries(moodCounts)
      .map(([mood, count]) => {
        const cfg = getMoodConfig(mood);
        return {
          mood,
          label: cfg.label,
          emoji: cfg.emoji,
          count,
          percentage: Math.round((count / history.length) * 100),
        };
      })
      .sort((a, b) => b.count - a.count),
    diversityScore,
    streak,
    bestFocusDay: focusDays[0]?.day || null,
    chartData,
    allTimeStats: stats,
    generatedAt: new Date().toISOString(),
  };
}

function calculateStreak(history) {
  if (history.length === 0) return 0;

  const days = new Set(
    history.map((e) => {
      const d = new Date(e.timestamp._seconds * 1000 || e.timestamp);
      return d.toDateString();
    }),
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

function buildChartData(history) {
  const last7Days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toDateString();
    const label = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    const dayEntries = history.filter((e) => {
      const entryDate = new Date(e.timestamp._seconds * 1000 || e.timestamp);
      return entryDate.toDateString() === dateStr;
    });

    // Most frequent mood for the day
    const counts = {};
    dayEntries.forEach((e) => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    const topMood =
      Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const config = topMood ? getMoodConfig(topMood) : null;

    last7Days.push({
      label,
      date: d.toISOString().split("T")[0],
      sessions: dayEntries.length,
      dominantMood: topMood,
      emoji: config?.emoji || "—",
      color: config?.ambient.primaryColor || "#555",
    });
  }

  return last7Days;
}
