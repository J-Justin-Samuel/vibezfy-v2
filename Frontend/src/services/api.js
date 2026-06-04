import { auth } from "./firebase.js";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5173";

async function getAuthHeader() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request(path, options = {}) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data;
}

// ── User ─────────────────────────────────────────────────────────────────────
export const api = {
  user: {
    getProfile: () => request("/api/user/profile"),
    updateProfile: (body) =>
      request("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    getSpotifyStatus: () => request("/api/user/spotify-status"),
    disconnectSpotify: () => request("/api/user/spotify", { method: "DELETE" }),
  },

  // ── Spotify ────────────────────────────────────────────────────────────────
  spotify: {
    getAuthUrl: () => request("/api/spotify/auth-url"),
    exchangeToken: (code, redirectUri) =>
      request("/api/spotify/token", {
        method: "POST",
        body: JSON.stringify({ code, redirectUri }),
      }),
    refreshToken: (refreshToken) =>
      request("/api/spotify/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }),
    getRecommendations: (mood, accessToken) =>
      request(
        `/api/spotify/recommendations/${mood}?accessToken=${encodeURIComponent(accessToken)}`,
      ),
    createPlaylist: (body) =>
      request("/api/spotify/playlist", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  // ── Mood ──────────────────────────────────────────────────────────────────
  mood: {
    save: (mood, confidence, metadata) =>
      request("/api/mood/save", {
        method: "POST",
        body: JSON.stringify({ mood, confidence, metadata }),
      }),
    getHistory: (limit = 50) => request(`/api/mood/history?limit=${limit}`),
    deleteEntry: (entryId) =>
      request(`/api/mood/${entryId}`, { method: "DELETE" }),
    getConfig: () => request("/api/mood/config"),
  },

  // ── Insights ──────────────────────────────────────────────────────────────
  insights: {
    getWeekly: () => request("/api/insights/weekly"),
    getStats: () => request("/api/insights/stats"),
  },
};
