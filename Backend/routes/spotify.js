import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import * as spotifyController from "../controllers/spotifyController.js";

const router = Router();

// Exchange auth code for tokens (called after Spotify OAuth redirect)
router.post("/token", verifyToken, spotifyController.exchangeToken);

// Refresh an access token
router.post("/refresh", verifyToken, spotifyController.refreshToken);

// Get mood-based recommendations
router.get(
  "/recommendations/:mood",
  verifyToken,
  spotifyController.getMoodRecommendations,
);

// Create a playlist from mood tracks
router.post("/playlist", verifyToken, spotifyController.createPlaylist);

// Get Spotify auth URL
router.get("/auth-url", verifyToken, spotifyController.getAuthUrl);

export default router;
