import { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "../../context/store.js";
import { getMoodConfig } from "../../utils/moodConfig.js";
import {
  initSpotifyPlayer,
  playTracks,
  setVolume as setSpotifyVolume,
  formatDuration,
} from "../../services/spotify.js";

export default function PlayerBar() {
  const {
    currentPlaylist,
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    trackProgress,
    setTrackProgress,
    spotifyTokens,
    spotifyDeviceId,
    setSpotifyPlayer,
    setSpotifyDeviceId,
  } = useStore();

  const [playerError, setPlayerError] = useState(null);
  const [isPremium, setIsPremium] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const playerRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const hasInitialized = useRef(false);

  const track = currentPlaylist?.tracks?.[currentTrackIndex] || null;
  const mood = currentPlaylist?.mood || null;
  const moodCfg = mood ? getMoodConfig(mood) : null;

  // ── Init Spotify SDK ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!spotifyTokens?.accessToken || hasInitialized.current) return;
    hasInitialized.current = true;

    initSpotifyPlayer(
      spotifyTokens.accessToken,
      (deviceId, sdkPlayer) => {
        setSpotifyDeviceId(deviceId);
        setSpotifyPlayer(sdkPlayer);
        playerRef.current = sdkPlayer;
        setPlayerError(null);
        setIsPremium(true);
        setPreviewMode(false);

        sdkPlayer.addListener("player_state_changed", (state) => {
          if (!state) return;
          setIsPlaying(!state.paused);
          setCurrentPosition(state.position);
          if (state.duration > 0)
            setTrackProgress(state.position / state.duration);
        });
      },
      (err) => {
        console.warn("SDK error:", err);
        setIsPremium(false);
        setPreviewMode(true);
        setPlayerError(null);
      },
    );
  }, [spotifyTokens?.accessToken]);

  // ── Find next track with preview ────────────────────────────────────────────
  const findNextWithPreview = useCallback(
    (startIndex) => {
      if (!currentPlaylist?.tracks) return -1;
      const tracks = currentPlaylist.tracks;
      for (let i = startIndex; i < tracks.length; i++) {
        if (tracks[i].previewUrl) return i;
      }
      for (let i = 0; i < startIndex; i++) {
        if (tracks[i].previewUrl) return i;
      }
      return -1;
    },
    [currentPlaylist],
  );

  // ── Play audio preview ──────────────────────────────────────────────────────
  const playPreview = useCallback(
    (t) => {
      if (!audioRef.current) return;

      if (!t?.previewUrl) {
        const nextIdx = findNextWithPreview(currentTrackIndex + 1);
        if (nextIdx !== -1) {
          console.log("No preview for this track, skipping to index:", nextIdx);
          setCurrentTrackIndex(nextIdx);
        } else {
          setPlayerError(
            "NO PREVIEWS AVAILABLE IN THIS PLAYLIST. SPOTIFY PREMIUM REQUIRED FOR FULL PLAYBACK.",
          );
        }
        return;
      }

      const audio = audioRef.current;
      audio.pause();
      audio.src = t.previewUrl;
      audio.volume = volume / 100;
      audio.load();
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setPlayerError(null);
        })
        .catch((e) => {
          console.error("Preview play error:", e);
          setPlayerError("PREVIEW PLAYBACK FAILED. TRY CLICKING PLAY AGAIN.");
        });
    },
    [volume, currentTrackIndex, findNextWithPreview],
  );

  // ── Handle track change ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!track || !currentPlaylist) return;
    setCurrentPosition(0);
    setTrackProgress(0);

    if (
      isPremium &&
      !previewMode &&
      spotifyDeviceId &&
      spotifyTokens?.accessToken
    ) {
      const uris = currentPlaylist.tracks.map((t) => t.uri).filter(Boolean);
      if (uris.length === 0) return;

      playTracks(
        spotifyDeviceId,
        uris.slice(currentTrackIndex),
        spotifyTokens.accessToken,
      )
        .then(() => {
          setIsPlaying(true);
          setPlayerError(null);
        })
        .catch((e) => {
          console.warn(
            "Premium playback failed, switching to preview:",
            e.message,
          );
          setIsPremium(false);
          setPreviewMode(true);
          playPreview(track);
        });
    } else {
      playPreview(track);
    }
  }, [currentTrackIndex, currentPlaylist?.mood]);

  // ── Audio element event listeners ───────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setCurrentPosition(audio.currentTime * 1000);
        setTrackProgress(audio.currentTime / audio.duration);
      }
    };

    const onEnded = () => {
      if (currentPlaylist) {
        const next = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
        setCurrentTrackIndex(next);
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      if (currentPlaylist) {
        const next = findNextWithPreview(currentTrackIndex + 1);
        if (next !== -1) setCurrentTrackIndex(next);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [currentTrackIndex, currentPlaylist, findNextWithPreview]);

  // ── Premium progress polling ─────────────────────────────────────────────────
  useEffect(() => {
    if (!playerRef.current || !isPremium || previewMode) return;
    clearInterval(intervalRef.current);

    if (isPlaying) {
      intervalRef.current = setInterval(async () => {
        try {
          const state = await playerRef.current.getCurrentState();
          if (state) {
            setCurrentPosition(state.position);
            if (state.duration > 0)
              setTrackProgress(state.position / state.duration);
          }
        } catch (_) {}
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, isPremium, previewMode]);

  // ── Toggle play/pause ────────────────────────────────────────────────────────
  async function togglePlay() {
    if (isPremium && !previewMode && playerRef.current) {
      await playerRef.current.togglePlay();
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        if (audioRef.current.src) {
          audioRef.current.play().catch(() => playPreview(track));
        } else {
          playPreview(track);
        }
      }
    }
  }

  function nextTrack() {
    if (!currentPlaylist) return;
    const next = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrackIndex(next);
  }

  function prevTrack() {
    if (!currentPlaylist) return;
    const prev =
      currentTrackIndex === 0
        ? currentPlaylist.tracks.length - 1
        : currentTrackIndex - 1;
    setCurrentTrackIndex(prev);
  }

  async function handleVolumeChange(e) {
    const v = parseInt(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
    if (
      isPremium &&
      !previewMode &&
      spotifyDeviceId &&
      spotifyTokens?.accessToken
    ) {
      await setSpotifyVolume(spotifyDeviceId, v, spotifyTokens.accessToken);
    }
  }

  if (!currentPlaylist) return null;

  const isPreviewTrack = !isPremium || previewMode;
  const trackDuration =
    isPreviewTrack && track?.previewUrl ? 30000 : track?.duration || 0;

  return (
    <>
      <audio ref={audioRef} preload="none" />

      <div className="w-full bg-[#FFFDF6] border-t-4 border-black px-4 py-4 md:py-3 flex flex-col md:flex-row items-center gap-4 z-30 relative selection:bg-black selection:text-[#FFDE4D]">
        {/* Track info block */}
        <div className="flex items-center gap-3 w-full md:w-60 shrink-0 border-b-2 md:border-b-0 pb-3 md:pb-0 border-black">
          {track?.albumArt ? (
            <img
              src={track.albumArt}
              alt={track?.album}
              className={`w-12 h-12 border-2 border-black object-cover shrink-0 rounded-none shadow-[2px_2px_0px_0px_#000] ${isPlaying ? "animate-spin [animation-duration:10s]" : ""}`}
            />
          ) : (
            <div className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center text-xl shrink-0 rounded-none shadow-[2px_2px_0px_0px_#000]">
              📻
            </div>
          )}
          {track ? (
            <div className="min-w-0 flex-1">
              <div className="text-black text-sm font-black uppercase tracking-tight truncate">
                {track.name}
              </div>
              <div className="text-gray-700 text-xs font-bold uppercase truncate mt-0.5">
                {track.artists?.join(", ")}
              </div>
              {isPreviewTrack && (
                <span className="inline-block bg-[#FFDE4D] text-[10px] font-black border border-black px-1 mt-1 uppercase tracking-wider shadow-[1px_1px_0px_0px_#000]">
                  {track.previewUrl ? "30s preview" : "no preview"}
                </span>
              )}
            </div>
          ) : (
            <div className="text-gray-500 font-bold uppercase text-xs tracking-tight">
              // No track selected
            </div>
          )}
        </div>

        {/* Playback Controls & Progress System */}
        <div className="flex-1 w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <ControlBtn onClick={prevTrack} title="Previous">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </ControlBtn>

            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-[#00E676] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all shrink-0"
            >
              {isPlaying ? (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <ControlBtn onClick={nextTrack} title="Next">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zm2.5-6l5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z" />
              </svg>
            </ControlBtn>
          </div>

          {/* Timeline Tracking Bar */}
          <div className="flex items-center gap-3 w-full max-w-xl">
            <span className="text-black text-xs font-mono font-black bg-white px-1 border border-black min-w-[42px] text-center shadow-[1px_1px_0px_0px_#000]">
              {formatDuration(currentPosition)}
            </span>
            <div className="flex-1 relative h-5 flex items-center">
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={trackProgress || 0}
                onChange={() => {}}
                disabled
                className="w-full absolute appearance-none h-3 border-2 border-black bg-white cursor-not-allowed"
                style={{
                  background: `linear-gradient(to right, #3D52D5 ${(trackProgress || 0) * 100}%, #FFFFFF ${(trackProgress || 0) * 100}%)`,
                }}
              />
            </div>
            <span className="text-black text-xs font-mono font-black bg-white px-1 border border-black min-w-[42px] text-center shadow-[1px_1px_0px_0px_#000]">
              {formatDuration(trackDuration)}
            </span>
          </div>
        </div>

        {/* Volume Level & Mood Metadata */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-56 shrink-0 border-t-2 md:border-t-0 pt-3 md:pt-0 border-black">
          {moodCfg && (
            <div className="flex items-center gap-2 px-2 py-1 border-2 border-black text-xs font-black uppercase tracking-tight bg-white shadow-[2px_2px_0px_0px_#000]">
              <span>{moodCfg.emoji}</span>
              <span className="hidden sm:inline">{moodCfg.label}</span>
              {isPlaying && (
                <div className="flex gap-0.5 items-end h-3 px-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-black border border-black animate-equalizer"
                      style={{ animationDelay: i * 0.15 + "s", height: "4px" }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-black shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 appearance-none border-2 border-black h-3 accent-black"
              style={{
                background: `linear-gradient(to right, #FD49A0 ${volume}%, #FFFFFF ${volume}%)`,
              }}
            />
          </div>
        </div>

        {/* Notices */}
        {isPreviewTrack && !playerError && (
          <div className="absolute bottom-full left-0 right-0 bg-[#FFDE4D] text-black border-y-2 border-black font-black text-xs px-4 py-1.5 text-center uppercase tracking-tight">
            ⚡ PLAYING 30S PREVIEWS —
            <a
              href="https://www.spotify.com/premium"
              target="_blank"
              rel="noreferrer"
              className="underline font-black bg-black text-[#00E676] px-1 ml-1 hover:text-white transition-colors"
            >
              UPGRADE TO SPOTIFY PREMIUM
            </a>{" "}
            FOR FULL SONGS
          </div>
        )}

        {playerError && (
          <div className="absolute bottom-full left-0 right-0 bg-[#FF6B6B] text-black border-y-2 border-black font-black text-xs px-4 py-1.5 text-center uppercase tracking-wide animate-pulse">
            ⚠️ SYSTEM ERROR: {playerError}
          </div>
        )}
      </div>
    </>
  );
}

function ControlBtn({ onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="bg-white border-2 border-black text-black p-2 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[0.5px] hover:translate-y-[0.5px] hover:shadow-[1.5px_1.5px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all shrink-0"
    >
      {children}
    </button>
  );
}
