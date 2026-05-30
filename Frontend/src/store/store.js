import { create } from "zustand";

export const useStore = create((set, get) => ({
  // ── Auth ──────────────────────────────────────────────────────────────────
  user: null,
  userProfile: null,
  authLoading: true,
  setUser: (user) => set({ user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setAuthLoading: (loading) => set({ authLoading: loading }),

  // ── Spotify ───────────────────────────────────────────────────────────────
  spotifyTokens: null,
  spotifyProfile: null,
  spotifyPlayer: null,
  spotifyDeviceId: null,
  spotifyConnected: false,
  setSpotifyTokens: (tokens) =>
    set({ spotifyTokens: tokens, spotifyConnected: !!tokens }),
  setSpotifyProfile: (profile) => set({ spotifyProfile: profile }),
  setSpotifyPlayer: (player) => set({ spotifyPlayer: player }),
  setSpotifyDeviceId: (id) => set({ spotifyDeviceId: id }),
  clearSpotify: () =>
    set({ spotifyTokens: null, spotifyProfile: null, spotifyConnected: false }),

  // ── Mood ──────────────────────────────────────────────────────────────────
  currentMood: null,
  moodConfidence: 0,
  moodLocked: false, // true when user confirms mood
  moodHistory: [],
  detectionActive: false,
  setCurrentMood: (mood, confidence) =>
    set({ currentMood: mood, moodConfidence: confidence }),
  lockMood: (mood) => set({ moodLocked: true, currentMood: mood }),
  unlockMood: () => set({ moodLocked: false }),
  setDetectionActive: (v) => set({ detectionActive: v }),
  addToMoodHistory: (entry) =>
    set((s) => ({ moodHistory: [entry, ...s.moodHistory].slice(0, 100) })),
  setMoodHistory: (history) => set({ moodHistory: history }),

  // ── Player ────────────────────────────────────────────────────────────────
  currentPlaylist: null, // { mood, tracks, playlistName, ambientScene }
  currentTrackIndex: 0,
  isPlaying: false,
  volume: 70,
  trackProgress: 0, // 0-1
  setCurrentPlaylist: (playlist) =>
    set({ currentPlaylist: playlist, currentTrackIndex: 0 }),
  setCurrentTrackIndex: (i) => set({ currentTrackIndex: i }),
  setIsPlaying: (v) => set({ isPlaying: v }),
  setVolume: (v) => set({ volume: v }),
  setTrackProgress: (v) => set({ trackProgress: v }),

  // ── Ambient ───────────────────────────────────────────────────────────────
  ambientScene: "cozy_library",
  setAmbientScene: (scene) => set({ ambientScene: scene }),

  // ── UI ────────────────────────────────────────────────────────────────────
  activeTab: "home", // home | detect | history | insights
  setActiveTab: (tab) => set({ activeTab: tab }),

  // ── Insights ──────────────────────────────────────────────────────────────
  insights: null,
  setInsights: (data) => set({ insights: data }),
}));
