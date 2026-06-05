import * as spotifyService from "../services/spotifyService.js";
import { db } from "../config/firebase.js";
import { getMoodConfig } from "../config/moodConfig.js";

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(" ");

export async function getAuthUrl(req, res, next) {
  try {
    const state = Math.random().toString(36).substring(7);
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: SCOPES,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state,
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params}`;
    res.json({ authUrl, state });
  } catch (err) {
    next(err);
  }
}

export async function exchangeToken(req, res, next) {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Authorization code required" });
    }

    const tokens = await spotifyService.exchangeCode(code, redirectUri);
    const profile = await spotifyService.getSpotifyProfile(tokens.accessToken);

    // Save tokens to Firestore if available
    if (db) {
      await db
        .collection("users")
        .doc(req.user.uid)
        .set(
          {
            spotifyTokens: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              expiresAt: tokens.expiresAt,
              scope: tokens.scope,
            },
            spotifyProfile: {
              id: profile.id,
              displayName: profile.display_name,
              email: profile.email,
              imageUrl: profile.images?.[0]?.url || null,
              country: profile.country,
              product: profile.product,
            },
            spotifyConnectedAt: new Date(),
          },
          { merge: true },
        );
    }

    res.json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      expiresAt: tokens.expiresAt,
      profile: {
        id: profile.id,
        displayName: profile.display_name,
        email: profile.email,
        imageUrl: profile.images?.[0]?.url || null,
        isPremium: profile.product === "premium",
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    const tokens = await spotifyService.refreshAccessToken(refreshToken);

    // Update stored tokens
    if (db) {
      await db
        .collection("users")
        .doc(req.user.uid)
        .set(
          {
            spotifyTokens: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              expiresAt: tokens.expiresAt,
            },
          },
          { merge: true },
        );
    }

    res.json({
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      expiresAt: tokens.expiresAt,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMoodRecommendations(req, res, next) {
  try {
    const { mood } = req.params;
    const { accessToken, limit } = req.query;
    console.log(
      "👉 RAW LIMIT RECEIVED FROM FRONTEND:",
      typeof limit,
      `"${limit}"`,
    );
    if (!accessToken) {
      return res.status(400).json({ error: "Spotify access token required" });
    }

    const validMoods = [
      "happy",
      "sad",
      "angry",
      "fearful",
      "disgusted",
      "surprised",
      "neutral",
    ];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({
        error: `Invalid mood. Must be one of: ${validMoods.join(", ")}`,
      });
    }

    // Force an evaluation check here before passing to the core service layer
    const checkedLimit = limit && limit.trim() !== "" ? limit : 20;

    const tracks = await spotifyService.getRecommendationsByMood(
      mood,
      accessToken,
      checkedLimit,
    );
    const config = getMoodConfig(mood);

    res.json({
      mood,
      moodLabel: config.label,
      emoji: config.emoji,
      playlistName: config.playlistName,
      ambientScene: config.ambient,
      gradient: config.gradient,
      tracks: tracks.map((t) => ({
        id: t.id,
        uri: t.uri,
        name: t.name,
        artists: t.artists.map((a) => a.name),
        album: t.album.name,
        albumArt: t.album.images?.[0]?.url || null,
        duration: t.duration_ms,
        previewUrl: t.preview_url,
        spotifyUrl: t.external_urls?.spotify,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function createPlaylist(req, res, next) {
  try {
    const { mood, trackUris, accessToken, spotifyUserId } = req.body;

    if (!accessToken || !trackUris?.length || !spotifyUserId) {
      return res
        .status(400)
        .json({ error: "accessToken, trackUris, and spotifyUserId required" });
    }

    const config = getMoodConfig(mood || "neutral");
    const playlist = await spotifyService.createSpotifyPlaylist(
      spotifyUserId,
      config.playlistName,
      trackUris,
      accessToken,
    );

    res.json({
      playlistId: playlist.id,
      playlistUrl: playlist.external_urls?.spotify,
      name: playlist.name,
    });
  } catch (err) {
    next(err);
  }
}
