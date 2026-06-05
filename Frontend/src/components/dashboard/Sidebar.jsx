import { useStore } from "../../context/store.js";
import { auth, signOut } from "../../services/firebase.js";
import { clearTokens } from "../../services/spotify.js";

const NAV = [
  { id: "home", label: "HOME CORE", emoji: "🏠" },
  { id: "detect", label: "SCANNER", emoji: "🎭", live: true },
  { id: "history", label: "LOG ARCHIVE", emoji: "⏱️" },
  { id: "insights", label: "METRICS", emoji: "📊" },
];

export default function Sidebar({ closeMobileMenu }) {
  const { activeTab, setActiveTab, user, userProfile, spotifyConnected } =
    useStore();

  async function handleSignOut() {
    if (confirm("TERMINATE ACTIVE USER SESSION?")) {
      clearTokens();
      await signOut(auth);
    }
  }

  const displayName =
    userProfile?.displayName || user?.displayName || "ANONYMOUS";
  const avatar = user?.photoURL;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside className="w-full lg:w-64 h-full bg-[#FFFDF6] border-b-4 lg:border-b-0 lg:border-r-4 border-black flex flex-col p-4 z-50">
      {/* Brand Deck */}
      <div className="hidden lg:block border-4 border-black bg-black text-white p-4 text-center shadow-[4px_4px_0px_0px_#FF5C00] mb-6">
        <span className="font-black text-3xl tracking-tighter block uppercase">
          VIBZFY
        </span>
        <span className="font-mono text-xxs font-bold text-[#00F0FF] uppercase tracking-widest mt-1 block">
          // FEEL THE VIBE CONTEXT
        </span>
      </div>

      {/* Primary Navigation System */}
      <nav className="flex-1 space-y-2">
        {NAV.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (closeMobileMenu) closeMobileMenu();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 border-2 border-black font-black uppercase text-sm tracking-tight shadow-[3px_3px_0px_0px_#000] transition-all ${
                isActive
                  ? "bg-yellow-300 translate-x-0.5 translate-y-0.5 shadow-none"
                  : "bg-white hover:bg-zinc-50 hover:translate-x-0.5 hover:translate-y-0.5"
              }`}
            >
              <span className="text-xl p-1 border border-black bg-white">
                {item.emoji}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.live && (
                <span className="w-2.5 h-2.5 rounded-none bg-[#A3E635] border border-black animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Token Link Status Panel */}
      <div className="mt-4 pt-4 border-t-2 border-black">
        <div
          className={`border-2 border-black px-3 py-2 text-xs font-mono font-bold uppercase tracking-tight flex items-center gap-2 shadow-[2px_2px_0px_0px_#000] ${
            spotifyConnected ? "bg-[#A3E635]" : "bg-red-300"
          }`}
        >
          <div className="w-3 h-3 bg-black border border-white rounded-full flex-shrink-0" />
          {spotifyConnected ? "SPOTIFY LINK: ONLINE" : "SPOTIFY LINK: NULL"}
        </div>
      </div>

      {/* User Session Profile Foot */}
      <div className="mt-4 pt-4 border-t-4 border-black bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex items-center gap-3">
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="w-10 h-10 border-2 border-black object-cover rounded-none flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 border-2 border-black bg-purple-400 font-black flex items-center justify-center text-sm flex-shrink-0">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-black text-xs uppercase tracking-tight truncate">
            {displayName}
          </div>
          <div className="font-mono text-[10px] text-zinc-500 font-bold truncate leading-none mt-0.5">
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          title="KILL USER SESSION"
          className="border-2 border-black bg-white hover:bg-red-400 p-1.5 shadow-[2px_2px_0px_0px_#000] hover:shadow-none transition-all active:translate-y-0.5"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}
