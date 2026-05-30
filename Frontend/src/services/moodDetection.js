/**
 * Mood detection using face-api.js (TinyFaceDetector + Expression Recognition)
 * Models are loaded from the public CDN – no server needed.
 */

let faceapi = null;
let modelsLoaded = false;
let loadingPromise = null;

// CDN path for face-api models
const MODEL_URL =
  "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model";

export async function loadFaceApiModels() {
  if (modelsLoaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    faceapi = await import("face-api.js");

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);

    modelsLoaded = true;
    console.log("✅ face-api models loaded");
  })();

  return loadingPromise;
}

/**
 * Detect emotion from a video element.
 * Returns { mood, confidence, allExpressions } or null.
 */
export async function detectMoodFromVideo(videoElement) {
  if (!modelsLoaded || !faceapi) return null;

  try {
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 224,
      scoreThreshold: 0.5,
    });

    const result = await faceapi
      .detectSingleFace(videoElement, options)
      .withFaceExpressions();

    if (!result) return null;

    const expressions = result.expressions;
    // face-api returns: neutral, happy, sad, angry, fearful, disgusted, surprised
    const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
    const [topMood, confidence] = sorted[0];

    return {
      mood: topMood,
      confidence,
      allExpressions: Object.fromEntries(sorted),
      boundingBox: result.detection.box,
    };
  } catch (err) {
    console.warn("Face detection error:", err.message);
    return null;
  }
}

/**
 * Smooth mood over multiple frames to avoid flickering.
 */
export class MoodSmoother {
  constructor(windowSize = 10) {
    this.windowSize = windowSize;
    this.history = [];
  }

  add(detection) {
    if (!detection) return;
    this.history.push(detection);
    if (this.history.length > this.windowSize) {
      this.history.shift();
    }
  }

  getSmoothed() {
    if (this.history.length === 0) return null;

    // Count mood votes
    const votes = {};
    let totalConfidence = 0;

    for (const d of this.history) {
      votes[d.mood] = (votes[d.mood] || 0) + d.confidence;
      totalConfidence += d.confidence;
    }

    const [dominantMood, score] = Object.entries(votes).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return {
      mood: dominantMood,
      confidence: score / this.history.length,
      stability:
        this.history.filter((d) => d.mood === dominantMood).length /
        this.history.length,
    };
  }

  reset() {
    this.history = [];
  }
}

/**
 * Start a detection loop on a video element.
 * Calls onDetection(result) at ~2fps.
 */
export function startDetectionLoop(videoElement, onDetection) {
  let running = true;
  const smoother = new MoodSmoother(8);

  const loop = async () => {
    if (!running) return;

    const raw = await detectMoodFromVideo(videoElement);
    smoother.add(raw);

    const smoothed = smoother.getSmoothed();
    if (smoothed) onDetection(smoothed, raw);

    // ~2 fps to save CPU
    setTimeout(() => {
      if (running) requestAnimationFrame(loop);
    }, 500);
  };

  requestAnimationFrame(loop);

  return () => {
    running = false;
    smoother.reset();
  };
}
