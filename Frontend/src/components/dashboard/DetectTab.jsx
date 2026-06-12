import { useRef, useState, useEffect, useCallback } from "react";
import { useStore } from "../../context/store.js";
import {
  loadFaceApiModels,
  startDetectionLoop,
} from "../../services/moodDetection.js";
import { api } from "../../services/api.js";
import { getTracksByMood } from "../../services/spotifyDirect.js";
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
    spotifyConnected,
    spotifyTokens,
    setCurrentPlaylist,
    setAmbientScene,
    setActiveTab,
    addToMoodHistory,
  } = useStore();

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
    } catch {
      setError("Camera access denied. Please allow camera permissions.");
    }
  }

  // Refactored slightly to accept argument just to perfectly safety-match your exact execution definitions
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

  const confirmMood = useCallback(
    async (moodOverride) => {
      const mood = moodOverride || currentMood;
      if (!mood) return;

      lockMood(mood);
      stopDetection();
      stopCamera();

      const cfg = getMoodConfig(mood);
      setAmbientScene(cfg.ambientScene);

      // Save mood entry
      try {
        const entry = await api.mood.save(mood, moodConfidence, {
          detectedVia: moodOverride ? "manual" : "camera",
        });
        addToMoodHistory(
          entry?.entry || {
            mood,
            confidence: moodConfidence,
            timestamp: new Date(),
          },
        );
      } catch (e) {
        console.warn("Mood save failed:", e.message);
      }

      // Fetch tracks directly from Spotify
      if (spotifyConnected && spotifyTokens?.accessToken) {
        setLoadingPlaylist(true);
        setError(null);
        try {
          const data = await getTracksByMood(
            mood,
            spotifyTokens.accessToken,
            20,
          );

          if (!data?.tracks?.length) {
            setError(
              "No tracks found. Make sure Spotify is open and your account is active.",
            );
            setActiveTab("home");
            return;
          }

          setCurrentPlaylist(data);
          setActiveTab("home");
        } catch (e) {
          console.error("Track fetch error:", e);
          setError("Could not load tracks: " + e.message);
          setActiveTab("home");
        } finally {
          setLoadingPlaylist(false);
        }
      } else {
        setActiveTab("home");
      }
    },
    [currentMood, moodConfidence, spotifyConnected, spotifyTokens],
  );

  const moodCfg = currentMood ? getMoodConfig(currentMood) : null;

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto space-y-6 text-black selection:bg-black selection:text-[#FFDE4D]">
      {/* Dynamic Header Block Banner Component layout */}
      <div className="bg-yellow-300 border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          MOOD SCANNER
        </h1>
        <p className="font-bold text-sm bg-black text-white inline-block px-2 py-1 mt-2 uppercase tracking-wide">
          LOCAL PROCESSING ENGINE — NO PRIVACY LEAKS
        </p>
      </div>

      {error && (
        <div className="bg-red-400 border-4 border-black p-4 font-bold text-sm shadow-[4px_4px_0px_0px_#000]">
          ⚠️ ERROR: {error}
        </div>
      )}

      {modelState === MODEL_STATES.loading && (
        <div className="bg-purple-400 border-4 border-black p-4 flex items-center gap-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="w-6 h-6 border-4 border-black border-t-transparent animate-spin bg-white" />
          <span className="font-black uppercase tracking-wider">
            BOOTING COGNITIVE FACE-MODELS...
          </span>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="border-4 border-black bg-white p-2 shadow-[8px_8px_0px_0px_#000] relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover border-2 border-black scale-x-[-1]"
          muted
          playsInline
          style={{ display: cameraOn ? "block" : "none" }}
        />

        {!cameraOn && (
          <div className="absolute inset-2 bg-zinc-100 border-2 border-dashed border-zinc-400 flex flex-col items-center justify-center p-4">
            <span className="text-6xl mb-4">📹</span>
            <p className="font-black text-xl uppercase tracking-tighter text-zinc-500">
              Lens Offline
            </p>
          </div>
        )}

        {/* Floating Brutalist Badge inside view container */}
        {detecting && currentMood && (
          <div className="absolute top-6 left-6 bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
            <span className="text-3xl p-1 bg-yellow-300 border-2 border-black">
              {moodCfg?.emoji}
            </span>
            <div>
              <div className="font-black uppercase text-base tracking-tight">
                {moodCfg?.label}
              </div>
              <div className="font-mono text-xs font-bold text-zinc-600">
                CONFIDENCE: {Math.round(moodConfidence * 100)}%
              </div>
            </div>
            <div className="ml-1 flex gap-0.5 items-end h-5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-black border border-black animate-equalizer"
                  style={{ animationDelay: `${i * 0.15}s`, height: "4px" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Operational Controls Switches Bar layout */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {!cameraOn ? (
            <button
              onClick={startCamera}
              disabled={modelState !== MODEL_STATES.ready}
              className="bg-[#00F0FF] border-4 border-black p-4 text-xl font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-cyan-400 transition-all disabled:opacity-40 w-full"
            >
              ACTIVATE CAMERA
            </button>
          ) : (
            <>
              {!detecting ? (
                <button
                  onClick={startDetection}
                  className="bg-[#FF007A] text-white border-4 border-black p-4 text-xl font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-full"
                >
                  INITIALIZE CAPTURE
                </button>
              ) : (
                <button
                  onClick={stopDetection}
                  className="bg-yellow-300 border-4 border-black p-4 text-xl font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-full"
                >
                  HALT DETECTOR
                </button>
              )}
              <button
                onClick={stopCamera}
                className="bg-white border-4 border-black p-4 font-black shadow-[4px_4px_0px_0px_#000] hover:bg-red-400 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 shrink-0"
              >
                KILL FEED
              </button>
            </>
          )}
        </div>

        {/* Target Confirmation Card block fixed below primary trigger buttons */}
        {currentMood && detecting && (
          <div className="bg-[#A3E635] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-4">
              <span className="text-5xl p-2 bg-white border-4 border-black shadow-[3px_3px_0px_0px_#000]">
                {moodCfg.emoji}
              </span>
              <div>
                <h3 className="font-black text-2xl uppercase tracking-tighter">
                  STATE LOCKED: {moodCfg.label}
                </h3>
                <p className="font-mono text-sm uppercase text-black/70 mt-0.5">
                  {moodCfg.playlistName}
                </p>
              </div>
            </div>
            <button
              onClick={() => confirmMood()}
              disabled={loadingPlaylist}
              className="w-full md:w-auto bg-black text-white font-black uppercase text-lg tracking-wider px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              {loadingPlaylist ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  LOCKING VIBE...
                </span>
              ) : (
                "DEPLOY VIBE SYSTEM →"
              )}
            </button>
          </div>
        )}
      </div>

      {rawDetection && <MoodMeter detection={rawDetection} />}

      {/* Manual Override Deck Matrix Panel */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000]">
        <p className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-4">
          // CORE MANUAL OVERRIDE DECK
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ALL_MOODS.map((mood) => {
            const c = getMoodConfig(mood);
            const isSelected = currentMood === mood;
            return (
              <button
                key={mood}
                onClick={() => confirmMood(mood)}
                disabled={loadingPlaylist}
                className={`p-3 border-2 border-black font-black uppercase text-xs tracking-tight transition-all text-left flex flex-col justify-between h-20 disabled:opacity-50 ${
                  isSelected
                    ? "bg-[#00F0FF] shadow-none translate-x-1 translate-y-1"
                    : "bg-white shadow-[3px_3px_0px_0px_#000] hover:bg-zinc-50 hover:translate-x-0.5 hover:translate-y-0.5"
                }`}
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="truncate w-full">{c.label}</span>
              </button>
            );
          })}
        </div>

        {loadingPlaylist && (
          <div className="flex items-center gap-2 mt-3 text-[#3D52D5] text-xs font-black uppercase tracking-wider animate-pulse">
            <div className="w-3 h-3 border-2 border-[#3D52D5] border-t-transparent rounded-full animate-spin" />
            Downloading Spotify manifest package streams...
          </div>
        )}
      </div>
    </div>
  );
}
