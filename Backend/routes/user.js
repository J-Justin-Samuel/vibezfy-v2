import { Router } from "express";
import { verifyToken } from "../middleware/auth.js";
import * as userController from "../controllers/userController.js";

const router = Router();

// Get or create user profile
router.get("/profile", verifyToken, userController.getProfile);

// Update user profile (display name, preferences)
router.put("/profile", verifyToken, userController.updateProfile);

// Save Spotify tokens for user
router.post("/spotify-tokens", verifyToken, userController.saveSpotifyTokens);

// Get user's Spotify connection status
router.get("/spotify-status", verifyToken, userController.getSpotifyStatus);

// Disconnect Spotify
router.delete("/spotify", verifyToken, userController.disconnectSpotify);

export default router;
