export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#3D52D5] text-white flex flex-col items-center justify-center gap-8 p-4 selection:bg-white selection:text-[#3D52D5]">
      <div className="relative">
        <div className="w-20 h-20 bg-[#FFDE4D] border-4 border-black flex items-center justify-center text-black font-black text-4xl shadow-[6px_6px_0px_0px_#000] transform -rotate-3 z-10 relative">
          V
        </div>
        {/* Brutalist offset duplicate instead of a soft ping */}
        <div className="absolute inset-0 bg-[#FD49A0] border-4 border-black translate-x-3 translate-y-3 shadow-[4px_4px_0px_0px_#000]" />
      </div>

      <div className="space-y-2 text-center bg-black border-4 border-white p-4 max-w-xs shadow-[6px_6px_0px_0px_#FD49A0]">
        <div className="font-black text-3xl uppercase tracking-widest text-[#00E676]">
          Vibezfy
        </div>
        <div className="text-white text-xs font-mono uppercase tracking-wider animate-pulse">
          // Loading your vibe…
        </div>
      </div>

      {/* Brutalist Blocks Equalizer */}
      <div className="flex gap-1.5 items-end h-10 bg-white border-2 border-black p-1.5 shadow-[3px_3px_0px_0px_#000]">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-3 bg-black border border-black animate-equalizer"
            style={{
              animationDelay: `${i * 0.12}s`,
              height: "8px",
              animationDuration: "0.6s" /* Snappier tracking style */,
            }}
          />
        ))}
      </div>
    </div>
  );
}
