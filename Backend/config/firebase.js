import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

let firebaseApp;

function initFirebase() {
  if (firebaseApp) return firebaseApp;

  try {
    const keyPath = resolve(
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
        "./config/serviceAccountKey.json",
    );

    if (!existsSync(keyPath)) {
      console.warn(
        "⚠️  Firebase service account key not found. Firestore features disabled.",
      );
      return null;
    }

    const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin initialized");
    return firebaseApp;
  } catch (err) {
    console.error("❌ Firebase init error:", err.message);
    return null;
  }
}

initFirebase();

export { admin };
export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
