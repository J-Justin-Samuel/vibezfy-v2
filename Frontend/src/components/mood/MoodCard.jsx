import { useStore } from "../../context/store.js";
import { formatDuration } from "../../services/spotify.js";

export default function MoodCard({ track, index }) {
  const {
    currentTrackIndex,
    setCurrentTrackIndex,
    isPlaying,
    currentPlaylist,
  } = useStore();
  const isActive = currentTrackIndex === index && currentPlaylist;

  return (
    <button
      onClick={() => setCurrentTrackIndex(index)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 text-left ${
        isActive
          ? "bg-vib-accent/10 border border-vib-accent/20"
          : "hover:bg-vib-surface"
      }`}
    >
      <div className="relative flex-shrink-0">
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt={track.album}
            className="w-10 h-10 rounded-lg object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-vib-surface flex items-center justify-center text-vib-muted text-lg">
            🎵
          </div>
        )}
        {isActive && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
            <div className="flex gap-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="eq-bar"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-lg transition-opacity">
          <span className="text-white text-xs">{index + 1}</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-display font-medium truncate ${isActive ? "text-vib-accent" : "text-vib-text"}`}
        >
          {track.name}
        </div>
        <div className="text-vib-muted text-xs truncate">
          {track.artists?.join(", ")}
        </div>
      </div>
      <div className="text-vib-muted text-xs font-mono flex-shrink-0">
        {formatDuration(track.duration)}
      </div>
    </button>
  );
}
