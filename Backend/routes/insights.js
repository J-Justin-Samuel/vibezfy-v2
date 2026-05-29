import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import * as insightsController from "../controllers/insightsController.js";

const router = Router();

// Weekly mood insights
router.get("/weekly", verifyToken, insightsController.getWeeklyInsights);

// All-time mood stats
router.get("/stats", verifyToken, insightsController.getMoodStats);

export default router;
