import { useStore } from "../../context/store.js";
import { getMoodConfig } from "../../utils/moodConfig.js";
import SpotifyConnect from "../auth/SpotifyConnect.jsx";
import MoodCard from "../mood/MoodCard.jsx";

export default function HomeTab() {
  const {
    user,
    userProfile,
    spotifyConnected,
    currentMood,
    currentPlaylist,
    moodHistory,
  } = useStore();
  const displayName = userProfile?.displayName || user?.displayName || "there";
  const firstName = displayName.split(" ")[0];

  const moodCfg = currentMood ? getMoodConfig(currentMood) : null;

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Greeting */}
      <div className="animate-slide-up">
        <h1 className="font-display font-bold text-3xl text-vib-text">
          Hey, {firstName} 👋
        </h1>
        <p className="text-vib-textDim font-body mt-1">
          {currentMood
            ? `You're feeling ${moodCfg.label.toLowerCase()} right now.`
            : "Let's detect your mood and set the perfect vibe."}
        </p>
      </div>

      {/* Spotify connect banner */}
      {!spotifyConnected && (
        <div className="animate-slide-up">
          <SpotifyConnect />
        </div>
      )}

      {/* Current mood hero */}
      {currentMood && (
        <div
          className={`card p-6 bg-gradient-to-br ${moodCfg.bgClass} border ${moodCfg.borderClass} animate-scale-in`}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{moodCfg.emoji}</div>
            <div>
              <div className="text-vib-muted text-xs font-body uppercase tracking-widest mb-1">
                Current Vibe
              </div>
              <div
                className={`font-display font-bold text-2xl ${moodCfg.accentClass}`}
              >
                {moodCfg.label}
              </div>
              <div className="text-vib-textDim text-sm font-body">
                {moodCfg.ambientDesc} · {moodCfg.playlistName}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
        <QuickAction
          emoji="🎭"
          title="Detect Mood"
          desc="Use your camera for instant detection"
          accent="text-vib-accent"
          onClick={() => useStore.getState().setActiveTab("detect")}
        />
        <QuickAction
          emoji="📊"
          title="Weekly Insights"
          desc="See your mood patterns this week"
          accent="text-vib-purple"
          onClick={() => useStore.getState().setActiveTab("insights")}
        />
        <QuickAction
          emoji="⏱️"
          title="Mood Log"
          desc={`${moodHistory.length} sessions recorded`}
          accent="text-vib-green"
          onClick={() => useStore.getState().setActiveTab("history")}
        />
      </div>

      {/* Current playlist */}
      {currentPlaylist && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg text-vib-text">
              Now Playing
            </h2>
            <span className="text-vib-muted text-sm font-body">
              {currentPlaylist.tracks?.length} tracks
            </span>
          </div>
          <div className="space-y-2">
            {currentPlaylist.tracks?.slice(0, 5).map((track, i) => (
              <MoodCard key={track.id} track={track} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Feature blurbs if nothing loaded yet */}
      {!currentPlaylist && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
          <FeatureBlurb
            emoji="🤖"
            title="AI Mood Detection"
            desc="face-api.js analyzes your expression in real time — everything runs locally, nothing is sent to a server."
          />
          <FeatureBlurb
            emoji="🎵"
            title="Curated Lo-Fi Playlists"
            desc="Spotify recommendations tuned to your exact emotional state via audio feature targeting."
          />
          <FeatureBlurb
            emoji="🌌"
            title="Animated Ambient Scenes"
            desc="7 unique canvas scenes — rain, aurora, golden hour, and more — shift dynamically with your mood."
          />
          <FeatureBlurb
            emoji="📈"
            title="Mood Insights"
            desc="Track your emotional patterns over time with beautiful weekly breakdowns and streak counters."
          />
        </div>
      )}
    </div>
  );
}

function QuickAction({ emoji, title, desc, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-5 text-left hover:border-vib-accent/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
    >
      <div className="text-2xl mb-3">{emoji}</div>
      <div className={`font-display font-semibold text-sm ${accent} mb-1`}>
        {title}
      </div>
      <div className="text-vib-muted text-xs font-body leading-relaxed">
        {desc}
      </div>
    </button>
  );
}

function FeatureBlurb({ emoji, title, desc }) {
  return (
    <div className="card p-5 space-y-2">
      <div className="text-2xl">{emoji}</div>
      <div className="font-display font-semibold text-sm text-vib-text">
        {title}
      </div>
      <div className="text-vib-muted text-xs font-body leading-relaxed">
        {desc}
      </div>
    </div>
  );
}
