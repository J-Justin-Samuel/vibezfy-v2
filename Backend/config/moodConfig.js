/**
 * Maps detected facial emotions → Spotify search queries,
 * audio feature targets, and ambient scene configs.
 */
export const MOOD_CONFIG = {
  happy: {
    label: "Happy",
    emoji: "😊",
    spotifyQuery: "happy lo-fi chill beats sunny afternoon",
    seeds: {
      seed_genres: "lo-fi,chill,indie-pop",
      target_valence: 0.8,
      target_energy: 0.6,
      target_tempo: 90,
      min_instrumentalness: 0.3,
    },
    ambient: {
      scene: "golden_hour",
      primaryColor: "#FFB347",
      secondaryColor: "#FF6B35",
      particles: "fireflies",
      description: "Golden Hour City",
    },
    gradient: "from-amber-400 via-orange-300 to-yellow-200",
    playlistName: "☀️ Sunny Afternoon Lo-Fi",
  },

  sad: {
    label: "Sad",
    emoji: "😢",
    spotifyQuery: "sad lo-fi rainy melancholic chill",
    seeds: {
      seed_genres: "lo-fi,ambient,sad",
      target_valence: 0.2,
      target_energy: 0.3,
      target_tempo: 70,
      min_instrumentalness: 0.5,
    },
    ambient: {
      scene: "rain_cafe",
      primaryColor: "#4A90B8",
      secondaryColor: "#2C5F7A",
      particles: "rain",
      description: "Rainy Café Window",
    },
    gradient: "from-blue-600 via-blue-400 to-slate-300",
    playlistName: "🌧️ Rainy Day Lo-Fi",
  },

  angry: {
    label: "Angry",
    emoji: "😠",
    spotifyQuery: "dark lo-fi trap beats aggressive chill",
    seeds: {
      seed_genres: "hip-hop,trap,dark",
      target_valence: 0.3,
      target_energy: 0.8,
      target_tempo: 110,
      min_instrumentalness: 0.2,
    },
    ambient: {
      scene: "stormy_night",
      primaryColor: "#8B0000",
      secondaryColor: "#FF4500",
      particles: "lightning",
      description: "Stormy Night Sky",
    },
    gradient: "from-red-800 via-red-600 to-orange-500",
    playlistName: "⚡ Dark Lo-Fi Storm",
  },

  fearful: {
    label: "Anxious",
    emoji: "😨",
    spotifyQuery: "calm forest ambient soothing meditation lo-fi",
    seeds: {
      seed_genres: "ambient,sleep,classical",
      target_valence: 0.4,
      target_energy: 0.2,
      target_tempo: 60,
      min_instrumentalness: 0.7,
    },
    ambient: {
      scene: "misty_forest",
      primaryColor: "#228B22",
      secondaryColor: "#90EE90",
      particles: "mist",
      description: "Misty Morning Forest",
    },
    gradient: "from-green-700 via-emerald-500 to-teal-300",
    playlistName: "🌿 Calm Forest Ambient",
  },

  disgusted: {
    label: "Mellow",
    emoji: "😒",
    spotifyQuery: "deep chill ocean waves lo-fi slow",
    seeds: {
      seed_genres: "lo-fi,chill,ambient",
      target_valence: 0.35,
      target_energy: 0.25,
      target_tempo: 65,
      min_instrumentalness: 0.6,
    },
    ambient: {
      scene: "ocean_waves",
      primaryColor: "#006994",
      secondaryColor: "#00CED1",
      particles: "bubbles",
      description: "Deep Ocean Drift",
    },
    gradient: "from-cyan-700 via-teal-500 to-sky-300",
    playlistName: "🌊 Ocean Chill Lo-Fi",
  },

  surprised: {
    label: "Surprised",
    emoji: "😲",
    spotifyQuery: "euphoric lo-fi uplifting electronic dreamy",
    seeds: {
      seed_genres: "lo-fi,electronic,dream-pop",
      target_valence: 0.75,
      target_energy: 0.7,
      target_tempo: 95,
      min_instrumentalness: 0.4,
    },
    ambient: {
      scene: "northern_lights",
      primaryColor: "#7B2FBE",
      secondaryColor: "#00FF88",
      particles: "aurora",
      description: "Northern Lights",
    },
    gradient: "from-purple-700 via-violet-500 to-pink-400",
    playlistName: "🌌 Euphoric Lo-Fi Aurora",
  },

  neutral: {
    label: "Focused",
    emoji: "😐",
    spotifyQuery: "lo-fi study beats focus concentration chill hop",
    seeds: {
      seed_genres: "lo-fi,study,chill",
      target_valence: 0.5,
      target_energy: 0.4,
      target_tempo: 80,
      min_instrumentalness: 0.5,
    },
    ambient: {
      scene: "cozy_library",
      primaryColor: "#8B6914",
      secondaryColor: "#D4A853",
      particles: "dust",
      description: "Cozy Library",
    },
    gradient: "from-amber-800 via-yellow-600 to-amber-300",
    playlistName: "📚 Study Beats Lo-Fi",
  },
};

export const getMoodConfig = (mood) => {
  return MOOD_CONFIG[mood] || MOOD_CONFIG.neutral;
};
