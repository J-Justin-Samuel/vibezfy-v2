import { db } from "../config/firebase.js";

/**
 * Get or create user profile in Firestore
 */
export async function getProfile(req, res, next) {
  try {
    const { uid, email, name, picture } = req.user;

    if (!db) {
      return res.json({
        uid,
        email,
        displayName: name || email?.split("@")[0] || "Vibezfy User",
        photoURL: picture || null,
        spotifyConnected: false,
        createdAt: new Date().toISOString(),
      });
    }

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // First time – create profile
      const newProfile = {
        uid,
        email: email || null,
        displayName: name || email?.split("@")[0] || "Vibezfy User",
        photoURL: picture || null,
        preferences: {
          defaultAmbient: "cozy_library",
          autoDetect: false,
          theme: "dark",
        },
        spotifyConnected: false,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };
      await userRef.set(newProfile);
      return res
        .status(201)
        .json({ ...newProfile, createdAt: newProfile.createdAt.toISOString() });
    }

    // Update last login
    await userRef.update({ lastLoginAt: new Date() });

    const data = userDoc.data();
    res.json({
      ...data,
      spotifyConnected: !!data.spotifyTokens?.accessToken,
      // Never expose raw tokens to the client
      spotifyTokens: undefined,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update user profile (displayName, preferences)
 */
export async function updateProfile(req, res, next) {
  try {
    const { displayName, preferences } = req.body;
    const { uid } = req.user;

    if (!db) {
      return res.json({ success: true });
    }

    const updates = { updatedAt: new Date() };
    if (displayName) updates.displayName = displayName;
    if (preferences) updates.preferences = preferences;

    await db.collection("users").doc(uid).update(updates);

    res.json({ success: true, updates });
  } catch (err) {
    next(err);
  }
}

/**
 * Save Spotify tokens (called after OAuth exchange on the server)
 */
export async function saveSpotifyTokens(req, res, next) {
  try {
    const { accessToken, refreshToken, expiresAt, spotifyProfile } = req.body;
    const { uid } = req.user;

    if (!accessToken || !refreshToken) {
      return res
        .status(400)
        .json({ error: "accessToken and refreshToken required" });
    }

    if (!db) {
      return res.json({ success: true });
    }

    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          spotifyTokens: { accessToken, refreshToken, expiresAt },
          spotifyConnected: true,
          spotifyConnectedAt: new Date(),
          ...(spotifyProfile && { spotifyProfile }),
        },
        { merge: true },
      );

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

/**
 * Check if user has Spotify connected (and return non-sensitive info)
 */
export async function getSpotifyStatus(req, res, next) {
  try {
    const { uid } = req.user;

    if (!db) {
      return res.json({ connected: false });
    }

    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.json({ connected: false });
    }

    const data = userDoc.data();
    const tokens = data.spotifyTokens;

    if (!tokens?.accessToken) {
      return res.json({ connected: false });
    }

    const isExpired = tokens.expiresAt && Date.now() > tokens.expiresAt;

    res.json({
      connected: true,
      expired: isExpired,
      profile: data.spotifyProfile || null,
      connectedAt: data.spotifyConnectedAt?.toDate?.()?.toISOString() || null,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Disconnect Spotify – removes tokens from Firestore
 */
export async function disconnectSpotify(req, res, next) {
  try {
    const { uid } = req.user;

    if (!db) {
      return res.json({ success: true });
    }

    const { FieldValue } =
      (await import("firebase-admin/firestore")).default || {};

    await db.collection("users").doc(uid).update({
      spotifyTokens: null,
      spotifyProfile: null,
      spotifyConnected: false,
      spotifyDisconnectedAt: new Date(),
    });

    res.json({ success: true, message: "Spotify disconnected" });
  } catch (err) {
    next(err);
  }
}
