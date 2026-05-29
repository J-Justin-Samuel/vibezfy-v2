import { db } from "../config/firebase.js";
import { getMoodConfig } from "../config/moodConfig.js";

/**
 * Save a mood detection entry to Firestore
 */
export async function saveMoodEntry(userId, mood, confidence, metadata = {}) {
  if (!db) {
    console.warn("Firestore not available – mood not saved");
    return { id: "mock-id", mood, confidence, timestamp: new Date() };
  }

  const config = getMoodConfig(mood);
  const entry = {
    userId,
    mood,
    moodLabel: config.label,
    emoji: config.emoji,
    confidence: Math.round(confidence * 100) / 100,
    ambientScene: config.ambient.scene,
    playlistName: config.playlistName,
    timestamp: new Date(),
    ...metadata,
  };

  const docRef = await db
    .collection("users")
    .doc(userId)
    .collection("moodHistory")
    .add(entry);

  // Update user's mood stats
  await updateMoodStats(userId, mood);

  return { id: docRef.id, ...entry };
}

/**
 * Get mood history for a user (latest 50 entries)
 */
export async function getMoodHistory(userId, limit = 50) {
  if (!db) return [];

  const snapshot = await db
    .collection("users")
    .doc(userId)
    .collection("moodHistory")
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get mood history for the past N days
 */
export async function getMoodHistoryByDays(userId, days = 7) {
  if (!db) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const snapshot = await db
    .collection("users")
    .doc(userId)
    .collection("moodHistory")
    .where("timestamp", ">=", since)
    .orderBy("timestamp", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Maintain aggregate mood stats in a dedicated doc
 */
async function updateMoodStats(userId, mood) {
  if (!db) return;

  const statsRef = db
    .collection("users")
    .doc(userId)
    .collection("stats")
    .doc("moodCounts");

  await db.runTransaction(async (t) => {
    const doc = await t.get(statsRef);
    const data = doc.exists ? doc.data() : {};
    const current = data[mood] || 0;
    t.set(
      statsRef,
      { ...data, [mood]: current + 1, lastUpdated: new Date() },
      { merge: true },
    );
  });
}

/**
 * Get mood stats (counts per mood)
 */
export async function getMoodStats(userId) {
  if (!db) return {};

  const doc = await db
    .collection("users")
    .doc(userId)
    .collection("stats")
    .doc("moodCounts")
    .get();

  return doc.exists ? doc.data() : {};
}

/**
 * Delete a mood history entry
 */
export async function deleteMoodEntry(userId, entryId) {
  if (!db) return;

  await db
    .collection("users")
    .doc(userId)
    .collection("moodHistory")
    .doc(entryId)
    .delete();
}
