import { useStore } from "../../context/store.js";
import { auth, signOut } from "../../services/firebase.js";
import { clearTokens } from "../../services/spotify.js";

const NAV = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: "detect",
    label: "Detect Mood",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
        />
      </svg>
    ),
  },
  {
    id: "history",
    label: "Mood Log",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "insights",
    label: "Insights",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, user, userProfile, spotifyConnected } =
    useStore();

  async function handleSignOut() {
    clearTokens();
    await signOut(auth);
  }

  const displayName =
    userProfile?.displayName || user?.displayName || "Vibzfy User";
  const avatar = user?.photoURL;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside className="w-64 flex flex-col glass border-r border-vib-border z-20 relative flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-vib-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-vib-accent to-vib-purple flex items-center justify-center text-vib-bg font-display font-bold">
            V
          </div>
          <div>
            <div className="font-display font-bold text-lg gradient-text leading-none">
              Vibzfy
            </div>
            <div className="text-vib-muted text-xs font-body mt-0.5">
              Feel the vibe
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-display font-medium transition-all duration-200 ${
                active
                  ? "bg-vib-accent/10 text-vib-accent border border-vib-accent/20"
                  : "text-vib-textDim hover:bg-vib-surface hover:text-vib-text"
              }`}
            >
              {item.icon}
              {item.label}
              {item.id === "detect" && (
                <span className="ml-auto w-2 h-2 rounded-full bg-vib-green animate-pulse-slow" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Spotify status */}
      <div className="px-4 pb-3">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-body ${
            spotifyConnected
              ? "bg-green-900/20 text-green-400"
              : "bg-vib-surface text-vib-muted"
          }`}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          {spotifyConnected ? "Spotify Connected" : "Spotify not linked"}
        </div>
      </div>

      {/* User */}
      <div className="px-4 pb-6 border-t border-vib-border pt-4">
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-vib-border"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-vib-accent/30 to-vib-purple/30 flex items-center justify-center text-vib-accent font-display font-semibold text-sm">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-vib-text text-sm font-display font-medium truncate">
              {displayName}
            </div>
            <div className="text-vib-muted text-xs truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out"
            className="text-vib-muted hover:text-red-400 transition-colors p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
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
      </div>
    </aside>
  );
}
