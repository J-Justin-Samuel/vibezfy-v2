import * as moodService from "../services/moodService.js";
import { MOOD_CONFIG } from "../config/moodConfig.js";

export async function saveMood(req, res, next) {
  try {
    const { mood, confidence, metadata } = req.body;

    if (!mood) {
      return res.status(400).json({ error: "mood is required" });
    }

    const validMoods = Object.keys(MOOD_CONFIG);
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ error: `Invalid mood: ${mood}` });
    }

    const entry = await moodService.saveMoodEntry(
      req.user.uid,
      mood,
      confidence || 0,
      metadata || {},
    );

    res.status(201).json({ success: true, entry });
  } catch (err) {
    next(err);
  }
}

export async function getMoodHistory(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await moodService.getMoodHistory(req.user.uid, limit);
    res.json({ history, count: history.length });
  } catch (err) {
    next(err);
  }
}

export async function deleteMoodEntry(req, res, next) {
  try {
    const { entryId } = req.params;
    await moodService.deleteMoodEntry(req.user.uid, entryId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getMoodConfig(req, res, next) {
  try {
    // Return public-safe config (no internal seeds)
    const config = Object.fromEntries(
      Object.entries(MOOD_CONFIG).map(([key, val]) => [
        key,
        {
          label: val.label,
          emoji: val.emoji,
          ambient: val.ambient,
          gradient: val.gradient,
          playlistName: val.playlistName,
        },
      ]),
    );
    res.json(config);
  } catch (err) {
    next(err);
  }
}
