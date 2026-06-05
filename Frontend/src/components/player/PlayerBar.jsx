import { useEffect, useRef, useState } from "react";
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
  const [currentPosition, setCurrentPosition] = useState(0);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  const track = currentPlaylist?.tracks?.[currentTrackIndex] || null;
  const mood = currentPlaylist?.mood || null;
  const moodCfg = mood ? getMoodConfig(mood) : null;

  useEffect(() => {
    if (!spotifyTokens?.accessToken) return;
    const player = initSpotifyPlayer(
      spotifyTokens.accessToken,
      (deviceId, sdkPlayer) => {
        setSpotifyDeviceId(deviceId);
        setSpotifyPlayer(sdkPlayer);
        playerRef.current = sdkPlayer;
      },
      (err) => setPlayerError(err),
    );
    return () => player?.disconnect?.();
  }, [spotifyTokens?.accessToken]);

  useEffect(() => {
    if (!track || !spotifyDeviceId || !spotifyTokens?.accessToken) return;
    const uris = currentPlaylist.tracks.map((t) => t.uri).filter(Boolean);
    if (uris.length === 0) return;
    playTracks(
      spotifyDeviceId,
      uris.slice(currentTrackIndex),
      spotifyTokens.accessToken,
    )
      .then(() => setIsPlaying(true))
      .catch((e) => setPlayerError(e.message));
  }, [currentTrackIndex, spotifyDeviceId]);

  useEffect(() => {
    if (!playerRef.current) return;
    clearInterval(intervalRef.current);
    if (isPlaying) {
      intervalRef.current = setInterval(async () => {
        try {
          const state = await playerRef.current.getCurrentState();
          if (state) {
            setCurrentPosition(state.position);
            setTrackProgress(state.position / state.duration);
            if (state.paused) setIsPlaying(false);
          }
        } catch (_) {}
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, playerRef.current]);

  async function togglePlay() {
    if (!playerRef.current) return;
    await playerRef.current.togglePlay();
    setIsPlaying(!isPlaying);
  }

  function nextTrack() {
    if (!currentPlaylist) return;
    setCurrentTrackIndex(
      (currentTrackIndex + 1) % currentPlaylist.tracks.length,
    );
  }

  function prevTrack() {
    if (!currentPlaylist) return;
    setCurrentTrackIndex(
      currentTrackIndex === 0
        ? currentPlaylist.tracks.length - 1
        : currentTrackIndex - 1,
    );
  }

  async function handleVolumeChange(e) {
    const v = parseInt(e.target.value);
    setVolume(v);
    if (spotifyDeviceId && spotifyTokens?.accessToken) {
      await setSpotifyVolume(spotifyDeviceId, v, spotifyTokens.accessToken);
    }
  }

  if (!currentPlaylist && !playerError) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full relative">
      {/* Track Identity Card */}
      <div className="flex items-center gap-3 w-full md:w-64 flex-shrink-0 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000]">
        {track?.albumArt ? (
          <img
            src={track.albumArt}
            alt={track.album}
            className={`w-12 h-12 border-2 border-black object-cover flex-shrink-0 ${isPlaying ? "animate-spin [animation-duration:10s]" : ""}`}
          />
        ) : (
          <div className="w-12 h-12 border-2 border-black bg-zinc-200 font-black flex items-center justify-center flex-shrink-0">
            📻
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-black text-xs uppercase tracking-tight truncate text-black">
            {track ? track.name : "SYSTEM IDLE"}
          </div>
          <div className="font-mono text-[10px] text-zinc-600 font-bold truncate mt-0.5">
            {track ? track.artists?.join(", ").toUpperCase() : "NO FREQUENCY"}
          </div>
        </div>
      </div>

      {/* Mid Audio Controls Node */}
      <div className="flex-1 w-full max-w-xl flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <ControlBrutBtn onClick={prevTrack} title="REVERSE">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </ControlBrutBtn>

          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black border-4 border-black font-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all bg-yellow-300"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <ControlBrutBtn onClick={nextTrack} title="FORWARD">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zm2.5-6l5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z" />
            </svg>
          </ControlBrutBtn>
        </div>

        {/* Time Progress Scrub Bar */}
        <div className="flex items-center gap-3 w-full font-mono text-xxs font-black text-black">
          <span className="w-10 text-right">
            {formatDuration(currentPosition)}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={trackProgress || 0}
            onChange={() => {}}
            className="flex-1 h-4 bg-white border-2 border-black rounded-none appearance-none outline-none cursor-pointer accent-black"
            style={{
              background: `linear-gradient(to right, #FF007A ${(trackProgress || 0) * 100}%, #ffffff ${(trackProgress || 0) * 100}%)`,
            }}
          />
          <span className="w-10">
            {track ? formatDuration(track.duration) : "0:00"}
          </span>
        </div>
      </div>

      {/* Auxiliary Node & Badging */}
      <div className="w-full md:w-48 flex items-center justify-between md:justify-end gap-3 flex-shrink-0">
        {moodCfg && (
          <div className="font-black text-xs uppercase tracking-tighter bg-black text-white px-2 py-1 border border-black flex items-center gap-2">
            <span>{moodCfg.emoji}</span>
            <span className="font-mono text-[10px] tracking-normal">
              {moodCfg.label}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2 flex-1 md:flex-initial">
          <span className="font-mono text-xxs font-bold">VOL</span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={handleVolumeChange}
            className="h-3 bg-white border-2 border-black appearance-none rounded-none accent-black w-24"
            style={{
              background: `linear-gradient(to right, #A3E635 ${volume}%, #ffffff ${volume}%)`,
            }}
          />
        </div>
      </div>

      {playerError && (
        <div className="absolute bottom-full left-0 right-0 bg-red-400 border-2 border-black text-black font-mono font-bold text-xxs p-1 text-center">
          ⚠ FAULT: {playerError} (PREMIUM ACCOUNT CONTEXT MANDATORY)
        </div>
      )}
    </div>
  );
}

function ControlBrutBtn({ onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="bg-white text-black border-2 border-black p-2 shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:bg-zinc-100"
    >
      {children}
    </button>
  );
}
