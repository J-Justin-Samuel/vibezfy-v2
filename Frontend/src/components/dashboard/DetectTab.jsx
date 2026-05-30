import { useRef, useState, useEffect, useCallback } from "react";
import { useStore } from "../../context/store.js";
import {
  loadFaceApiModels,
  startDetectionLoop,
} from "../../services/moodDetection.js";
import { api } from "../../services/api.js";
import { getMoodConfig, ALL_MOODS } from "../../utils/moodConfig.js";
import MoodMeter from "../mood/MoodMeter.jsx";

const MODEL_STATES = {
  idle: "idle",
  loading: "loading",
  ready: "ready",
  error: "error",
};

export default function DetectTab() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const stopLoopRef = useRef(null);

  const [modelState, setModelState] = useState(MODEL_STATES.idle);
  const [cameraOn, setCameraOn] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [rawDetection, setRawDetection] = useState(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [error, setError] = useState(null);

  const {
    currentMood,
    moodConfidence,
    setCurrentMood,
    lockMood,
    unlockMood,
    moodLocked,
    spotifyConnected,
    spotifyTokens,
    setCurrentPlaylist,
    setAmbientScene,
    setActiveTab,
    addToMoodHistory,
  } = useStore();

  // Load models on mount
  useEffect(() => {
    setModelState(MODEL_STATES.loading);
    loadFaceApiModels()
      .then(() => setModelState(MODEL_STATES.ready))
      .catch((e) => {
        setModelState(MODEL_STATES.error);
        setError("Failed to load AI models: " + e.message);
      });
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (e) {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }

  function stopCamera() {
    stopDetection();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }

  function startDetection() {
    if (!videoRef.current || !cameraOn) return;
    setDetecting(true);
    unlockMood();
    stopLoopRef.current = startDetectionLoop(
      videoRef.current,
      (smoothed, raw) => {
        setCurrentMood(smoothed.mood, smoothed.confidence);
        setRawDetection(raw);
      },
    );
  }

  function stopDetection() {
    stopLoopRef.current?.();
    stopLoopRef.current = null;
    setDetecting(false);
  }

  const confirmMood = useCallback(async () => {
    if (!currentMood) return;
    lockMood(currentMood);
    stopDetection();

    const cfg = getMoodConfig(currentMood);
    setAmbientScene(cfg.ambientScene);

    // Save mood to backend
    try {
      const entry = await api.mood.save(currentMood, moodConfidence, {
        detectedVia: "camera",
      });
      addToMoodHistory(
        entry.entry || {
          mood: currentMood,
          confidence: moodConfidence,
          timestamp: new Date(),
        },
      );
    } catch (_) {}

    // Fetch Spotify playlist
    if (spotifyConnected && spotifyTokens?.accessToken) {
      setLoadingPlaylist(true);
      try {
        const data = await api.spotify.getRecommendations(
          currentMood,
          spotifyTokens.accessToken,
        );
        setCurrentPlaylist(data);
        setActiveTab("home");
      } catch (e) {
        setError("Spotify fetch failed: " + e.message);
      } finally {
        setLoadingPlaylist(false);
      }
    } else {
      // No Spotify – still navigate with mood
      setActiveTab("home");
    }
  }, [currentMood, moodConfidence, spotifyConnected, spotifyTokens]);

  const moodCfg = currentMood ? getMoodConfig(currentMood) : null;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="animate-slide-up">
        <h1 className="font-display font-bold text-2xl text-vib-text">
          Detect Your Mood
        </h1>
        <p className="text-vib-textDim font-body mt-1 text-sm">
          Point your camera at your face. AI runs locally — no data leaves your
          device.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl animate-fade-in">
          {error}
        </div>
      )}

      {/* Model loading indicator */}
      {modelState === MODEL_STATES.loading && (
        <div className="card p-4 flex items-center gap-3 animate-fade-in">
          <div className="w-5 h-5 border-2 border-vib-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-vib-textDim text-sm font-body">
            Loading AI models…
          </span>
        </div>
      )}

      {/* Camera view */}
      <div className="card overflow-hidden relative aspect-video animate-scale-in">
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-x-[-1]"
          muted
          playsInline
          style={{ display: cameraOn ? "block" : "none" }}
        />

        {!cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-vib-surface">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-vib-border flex items-center justify-center">
              <svg
                className="w-8 h-8 text-vib-muted"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10l4.553-2.069A1 1 0 0121 8.876V15a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                />
              </svg>
            </div>
            <p className="text-vib-muted font-body text-sm">Camera inactive</p>
          </div>
        )}

        {/* Live mood overlay */}
        {detecting && currentMood && (
          <div className="absolute top-3 left-3 glass px-3 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
            <span className="text-lg">{moodCfg?.emoji}</span>
            <div>
              <div
                className={`font-display font-semibold text-sm ${moodCfg?.accentClass}`}
              >
                {moodCfg?.label}
              </div>
              <div className="text-vib-muted text-xs">
                {Math.round(moodConfidence * 100)}% confidence
              </div>
            </div>
            <div className="ml-1 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="eq-bar"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3 animate-slide-up">
        {!cameraOn ? (
          <button
            onClick={startCamera}
            disabled={modelState !== MODEL_STATES.ready}
            className="btn-primary flex-1 disabled:opacity-40"
          >
            Turn On Camera
          </button>
        ) : (
          <>
            {!detecting ? (
              <button onClick={startDetection} className="btn-primary flex-1">
                Start Detection
              </button>
            ) : (
              <button onClick={stopDetection} className="btn-ghost flex-1">
                Pause Detection
              </button>
            )}
            <button onClick={stopCamera} className="btn-ghost px-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Mood meter */}
      {rawDetection && <MoodMeter detection={rawDetection} />}

      {/* Confirm + generate */}
      {currentMood && detecting && (
        <div
          className={`card p-5 bg-gradient-to-br ${moodCfg.bgClass} border ${moodCfg.borderClass} animate-scale-in`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{moodCfg.emoji}</span>
              <div>
                <div
                  className={`font-display font-semibold ${moodCfg.accentClass}`}
                >
                  Feeling {moodCfg.label}
                </div>
                <div className="text-vib-muted text-sm font-body">
                  {moodCfg.playlistName}
                </div>
              </div>
            </div>
            <button
              onClick={confirmMood}
              disabled={loadingPlaylist}
              className="btn-primary disabled:opacity-50"
            >
              {loadingPlaylist ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-vib-bg border-t-transparent rounded-full animate-spin" />
                  Building…
                </span>
              ) : (
                "Set My Vibe →"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Manual override */}
      <div className="animate-slide-up">
        <p className="text-vib-muted text-xs font-body mb-3">
          Or choose your mood manually:
        </p>
        <div className="flex flex-wrap gap-2">
          {ALL_MOODS.map((mood) => {
            const c = getMoodConfig(mood);
            return (
              <button
                key={mood}
                onClick={() => {
                  setCurrentMood(mood, 1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-medium border transition-all duration-150 ${
                  currentMood === mood
                    ? `${c.accentClass} ${c.borderClass} bg-opacity-10`
                    : "text-vib-muted border-vib-border hover:border-vib-accent/30 hover:text-vib-text"
                }`}
              >
                {c.emoji} {c.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
