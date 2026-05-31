export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-vib-bg flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vib-accent to-vib-purple flex items-center justify-center text-vib-bg font-display font-bold text-2xl">
          V
        </div>
        <div className="absolute -inset-2 rounded-2xl border-2 border-vib-accent/30 animate-ping" />
      </div>
      <div className="space-y-1 text-center">
        <div className="font-display font-bold text-xl gradient-text">
          Vibzfy
        </div>
        <div className="text-vib-muted text-sm font-body">
          Loading your vibe…
        </div>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-vib-accent rounded-full animate-equalizer"
            style={{ animationDelay: `${i * 0.15}s`, height: "8px" }}
          />
        ))}
      </div>
    </div>
  );
}
