export const MOOD_CONFIG = {
  happy: {
    label: "Happy",
    emoji: "😊",
    artistIds: [
      "0du5cEVh5yTK9QJze8zA0C", // Bruno Mars
      "6qqNVTkY89Bg98b67X2bZ4", // Dua Lipa
      "2RdwBSPQiwcmiDo9kixcl8", // Pharrell Williams
      "31TPClRtHm23RisEwkvFuBm", // Justin Timberlake
      "6jJ0s89eD6GaHleKKya26X", // Katy Perry
    ],
    ambient: {
      scene: "golden_hour",
      primaryColor: "#FFB347",
      secondaryColor: "#FF6B35",
      description: "Golden Hour City",
    },
    gradient: "from-amber-400 via-orange-300 to-yellow-200",
    playlistName: "☀️ Happy Hits",
  },
  sad: {
    label: "Sad",
    emoji: "😢",
    artistIds: [
      "6qqNVTkY89Bg98b67X2bZ4", // Billie Eilish
      "1McMsnEElThX1knmY4oliG", // Olivia Rodrigo
      "4G79vY9cr9gU86wK6v9vE1", // Lewis Capaldi
      "1Xyo4w8uXC1snmM6Zg7Xmg", // The Weeknd
      "15UsOTVnJzReFVN1VCnxy4", // XXXTentacion
    ],
    ambient: {
      scene: "rain_cafe",
      primaryColor: "#4A90B8",
      secondaryColor: "#2C5F7A",
      description: "Rainy Café Window",
    },
    gradient: "from-blue-600 via-blue-400 to-slate-300",
    playlistName: "🌧️ Sad Songs",
  },
  angry: {
    label: "Angry",
    emoji: "😠",
    artistIds: [
      "7dGJo4pcD2V6oG8kP0tJRR", // Eminem
      "6XyY86QOPPrYVGvF9ch6wz", // Linkin Park
      "6fOMl44jA4Sp5b9PpYCkzz", // NF
      "0Y5tJX1MQlPlqiwlOH1tJY", // Travis Scott
      "5K4W6rqBFWDnAN6FQUkS6x", // Kanye West
    ],
    ambient: {
      scene: "stormy_night",
      primaryColor: "#8B0000",
      secondaryColor: "#FF4500",
      description: "Stormy Night Sky",
    },
    gradient: "from-red-800 via-red-600 to-orange-500",
    playlistName: "⚡ Rage Hits",
  },
  fearful: {
    label: "Anxious",
    emoji: "😨",
    artistIds: [
      "4MXUO7sVCaFgFjoTI5ox5c", // Bon Iver
      "1r1uxoy19fzMxunt3ONAkG", // Phoebe Bridgers
      "00FQb4jTyendYWaN8pK0wa", // Lana Del Rey
      "246dkjvS1zLTtiykXe5h60", // Post Malone
      "31VBn3KHKW6a7MDnkEI2gN", // James Blake
    ],
    ambient: {
      scene: "misty_forest",
      primaryColor: "#228B22",
      secondaryColor: "#90EE90",
      description: "Misty Morning Forest",
    },
    gradient: "from-green-700 via-emerald-500 to-teal-300",
    playlistName: "🌿 Calm Down",
  },
  disgusted: {
    label: "Mellow",
    emoji: "😒",
    artistIds: [
      "2h93pZq0e7k5yf4dywlkpM", // Frank Ocean
      "20wkVLutqVOYrc0kxFs7rA", // Daniel Caesar
      "7tYKF4w9nC0nq9CsPZTHyP", // SZA
      "4LLpKhyESBHFHPJuhF1eu7", // Mac Miller
      "0BHP0cxmDyAnV5y6HEBYqp", // H.E.R.
    ],
    ambient: {
      scene: "ocean_waves",
      primaryColor: "#006994",
      secondaryColor: "#00CED1",
      description: "Deep Ocean Drift",
    },
    gradient: "from-cyan-700 via-teal-500 to-sky-300",
    playlistName: "🌊 Mellow R&B",
  },
  surprised: {
    label: "Surprised",
    emoji: "😲",
    artistIds: [
      "1Xyo4w8uXC1snmM6Zg7Xmg", // The Weeknd
      "6KImCVD70vtIoJWnq6nGn3", // Harry Styles
      "06HL4z0CvFAxygxt6gG28a", // Taylor Swift
      "4gzpq5DumFaEbqQQVlcMZD", // Coldplay
      "3TVXtAsR1Inumwj472S9r4", // Drake
    ],
    ambient: {
      scene: "northern_lights",
      primaryColor: "#7B2FBE",
      secondaryColor: "#00FF88",
      description: "Northern Lights",
    },
    gradient: "from-purple-700 via-violet-500 to-pink-400",
    playlistName: "🌌 Euphoric Hits",
  },
  neutral: {
    label: "Focused",
    emoji: "😐",
    artistIds: [
      "6l3HvQ5sa6mXTsMTB19rO5", // J. Cole
      "2YZyLoL8N0Wb9xBt1NhZWg", // Kendrick Lamar
      "3TVXtAsR1Inumwj472S9r4", // Drake
      "5f7VJjfbwm532GiveGC0ZK", // Childish Gambino
      "4evdBjvHKEhKpyMq6DmSUA", // Logic
    ],
    ambient: {
      scene: "cozy_library",
      primaryColor: "#8B6914",
      secondaryColor: "#D4A853",
      description: "Cozy Library",
    },
    gradient: "from-amber-800 via-yellow-600 to-amber-300",
    playlistName: "📚 Focus Mode",
  },
};

export const getMoodConfig = (mood) => MOOD_CONFIG[mood] || MOOD_CONFIG.neutral;
