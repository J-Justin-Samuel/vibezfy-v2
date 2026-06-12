import { auth } from "../config/firebase.js";

/**
 * Verifies Firebase ID token from Authorization header.
 * Attaches decoded user to req.user.
 */
export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid Authorization header" });
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!auth) {
      // Firebase not configured – allow in dev with mock user
      if (process.env.NODE_ENV === "development") {
        req.user = { uid: "dev-user", email: "dev@vibezfy.app" };
        return next();
      }
      return res.status(503).json({ error: "Auth service unavailable" });
    }

    const decoded = await auth.verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Optional auth – attaches user if token present, continues regardless.
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ") && auth) {
      const token = authHeader.split("Bearer ")[1];
      req.user = await auth.verifyIdToken(token);
    }
  } catch (_) {
    // ignore
  }
  next();
}
