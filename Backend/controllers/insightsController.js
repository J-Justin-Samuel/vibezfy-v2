import * as insightsService from "../services/insightsService.js";
import * as moodService from "../services/moodService.js";

export async function getWeeklyInsights(req, res, next) {
  try {
    const insights = await insightsService.getWeeklyInsights(req.user.uid);
    res.json(insights);
  } catch (err) {
    next(err);
  }
}

export async function getMoodStats(req, res, next) {
  try {
    const stats = await moodService.getMoodStats(req.user.uid);
    res.json({ stats });
  } catch (err) {
    next(err);
  }
}
