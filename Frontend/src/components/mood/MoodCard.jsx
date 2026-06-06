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
      className={`w-full flex items-center gap-4 p-3 border-4 border-black text-left transition-all duration-100 ${
        isActive
          ? "bg-[#00E676] shadow-[2px_2px_0px_0px_#000] translate-x-[2px] translate-y-[2px]"
          : "bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-[#FFDE4D] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]"
      }`}
    >
      {/* Index or Album Art Container */}
      <div className="relative flex-shrink-0 w-12 h-12 bg-black border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_#000]">
        {track.albumArt ? (
          <img
            src={track.albumArt}
            alt={track.album}
            className="w-full h-full object-cover filter contrast-125"
          />
        ) : (
          <div className="w-full h-full bg-white flex items-center justify-center font-black text-lg">
            📻
          </div>
        )}

        {/* Audio active state overlay */}
        {isActive && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black border border-black p-1">
            <div className="flex gap-0.5 items-end h-full w-full justify-center">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-[#00E676] border border-black animate-equalizer"
                  style={{ animationDelay: `${i * 0.15}s`, height: "4px" }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Meta Text details */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black uppercase tracking-tight truncate text-black">
          {track.name}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-gray-700 truncate mt-0.5">
          {track.artists?.join(", ")}
        </div>
      </div>

      {/* Timestamp Duration Badge */}
      <div className="bg-black text-white text-[11px] font-mono px-2 py-1 border-2 border-black shadow-[1px_1px_0px_0px_#fff] flex-shrink-0">
        {formatDuration(track.duration)}
      </div>
    </button>
  );
}
