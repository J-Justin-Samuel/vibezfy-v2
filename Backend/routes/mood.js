import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import * as moodController from "../controllers/moodController.js";

const router = Router();

// Save a mood detection entry
router.post("/save", verifyToken, moodController.saveMood);

// Get mood history
router.get("/history", verifyToken, moodController.getMoodHistory);

// Delete a mood entry
router.delete("/:entryId", verifyToken, moodController.deleteMoodEntry);

// Get mood config for all moods (public – for frontend reference)
router.get("/config", moodController.getMoodConfig);

export default router;
