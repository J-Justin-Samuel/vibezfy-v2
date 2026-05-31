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

  // Init Spotify SDK player when tokens available
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

    return () => {
      player?.disconnect?.();
    };
  }, [spotifyTokens?.accessToken]);

  // Play on track change
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

  // Progress polling
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
    <div className="glass border-t border-vib-border px-6 py-3 flex items-center gap-4 z-30 relative">
      {/* Track info */}
      <div className="flex items-center gap-3 w-56 flex-shrink-0">
        {track?.albumArt ? (
          <div className="relative flex-shrink-0">
            <img
              src={track.albumArt}
              alt={track.album}
              className={`w-10 h-10 rounded-lg object-cover ${isPlaying ? "vinyl-spin" : "vinyl-spin paused"}`}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-vib-surface flex items-center justify-center text-vib-muted">
            🎵
          </div>
        )}
        {track ? (
          <div className="min-w-0">
            <div className="text-vib-text text-xs font-display font-medium truncate">
              {track.name}
            </div>
            <div className="text-vib-muted text-xs truncate">
              {track.artists?.join(", ")}
            </div>
          </div>
        ) : (
          <div className="text-vib-muted text-xs">No track selected</div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <ControlBtn onClick={prevTrack} title="Previous">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </ControlBtn>

          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-vib-accent flex items-center justify-center text-vib-bg hover:brightness-110 transition-all active:scale-95"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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

        {/* Progress */}
        <div className="flex items-center gap-2 w-full max-w-sm">
          <span className="text-vib-muted text-xs font-mono w-8 text-right">
            {formatDuration(currentPosition)}
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={trackProgress || 0}
            onChange={() => {}}
            className="progress-bar flex-1"
            style={{
              background: `linear-gradient(to right, #6ee7f7 ${(trackProgress || 0) * 100}%, #1e2d42 ${(trackProgress || 0) * 100}%)`,
            }}
          />
          <span className="text-vib-muted text-xs font-mono w-8">
            {track ? formatDuration(track.duration) : "0:00"}
          </span>
        </div>
      </div>

      {/* Volume + mood badge */}
      <div className="flex items-center gap-3 w-44 justify-end flex-shrink-0">
        {moodCfg && (
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-display ${moodCfg.accentClass} bg-opacity-10`}
          >
            {isPlaying && (
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="eq-bar"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
            <span>{moodCfg.emoji}</span>
          </div>
        )}
        <svg
          className="w-4 h-4 text-vib-muted flex-shrink-0"
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
          className="progress-bar w-20"
          style={{
            background: `linear-gradient(to right, #6ee7f7 ${volume}%, #1e2d42 ${volume}%)`,
          }}
        />
      </div>

      {playerError && (
        <div className="absolute bottom-full left-0 right-0 bg-red-900/80 text-red-200 text-xs px-4 py-2 text-center">
          {playerError} (Spotify Premium required for full playback)
        </div>
      )}
    </div>
  );
}

function ControlBtn({ onClick, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="text-vib-muted hover:text-vib-accent transition-colors active:scale-95"
    >
      {children}
    </button>
  );
}
