<div align="center">

# 🎵 Vibzfy

### *Your face. Your mood. Your soundtrack.*

**Vibzfy detects your facial emotion in real time using on-device AI, then generates a curated playlist and animated ambient visual scene — all matched to how you actually feel.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vibezfy--v2.vercel.app-6ee7f7?style=for-the-badge&logo=vercel&logoColor=black)](https://vibezfy-v2.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Spotify](https://img.shields.io/badge/Spotify-API-1ED760?style=for-the-badge&logo=spotify&logoColor=black)](https://developer.spotify.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

</div>

---

## 🧠 What is Vibzfy?

Most music apps ask you to *choose* your mood. Vibzfy **reads it**.

Point your camera at your face — Vibzfy's on-device AI analyzes your facial expressions, detects your dominant emotion, and instantly generates a matching playlist of popular English songs alongside a reactive animated ambient scene. No typing. No searching. Just vibes.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎭 **Real-Time Mood Detection** | face-api.js runs TinyFaceDetector + expression recognition entirely in your browser — zero data sent to any server |
| 🎵 **Mood-Matched Playlists** | Spotify Search API returns curated popular songs mapped to 7 emotional states |
| 🌌 **Animated Ambient Scenes** | 7 unique canvas-rendered scenes (rain, aurora, golden hour, ocean, storm, forest, library) that shift with your mood |
| 🔒 **Secure Auth** | Firebase Authentication with Google Sign-In and Email/Password |
| 📊 **Mood History & Insights** | Weekly mood analytics, streak tracking, and emotional pattern breakdowns saved to Firestore |
| 🎚️ **Full Playback Controls** | Spotify Web Playback SDK for Premium users; 30-second previews for free users |
| 🖐️ **Manual Override** | Don't want to use the camera? Pick your mood manually from 7 options |

---

## 🗺️ Mood → Vibe Mapping

| Detected Mood | Playlist Theme | Ambient Scene | Artists |
|---|---|---|---|
| 😊 Happy | Sunny Anthems | Golden Hour City | Dua Lipa, Bruno Mars, Pharrell |
| 😢 Sad | Melancholic Ballads | Rainy Café Window | Billie Eilish, Olivia Rodrigo, XXXTentacion |
| 😠 Angry | Rage Hits | Stormy Night Sky | Eminem, Linkin Park, NF |
| 😨 Anxious | Calm & Peaceful | Misty Morning Forest | Bon Iver, Lana Del Rey, James Blake |
| 😒 Mellow | R&B Chill | Deep Ocean Drift | Frank Ocean, SZA, Daniel Caesar |
| 😲 Surprised | Euphoric Bangers | Northern Lights | The Weeknd, Harry Styles, Coldplay |
| 😐 Focused | Study & Flow | Cozy Library | Childish Gambino, J. Cole, Kendrick |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** — fast, modern SPA
- **Tailwind CSS** — utility-first styling with custom design tokens
- **face-api.js** — on-device facial emotion detection (TinyFaceDetector + FaceExpressionNet)
- **Spotify Web Playback SDK** — in-browser music playback
- **Zustand** — lightweight global state management
- **React Router v6** — client-side routing
- **Canvas API** — animated ambient scene rendering

### Backend
- **Node.js** + **Express** — REST API
- **Firebase Admin SDK** — server-side auth token verification
- **Spotify Web API** — search and playlist management

### Infrastructure
- **Firebase Authentication** — Google + Email/Password sign-in
- **Firebase Firestore** — mood history, user profiles, weekly stats
- **Vercel** — frontend deployment
- **Render** — backend deployment

---

## 🏗️ Architecture

```
Browser (React)
├── face-api.js     → on-device emotion detection (no server)
├── Canvas API      → animated ambient scenes
├── Spotify SDK     → in-browser playback
└── Zustand Store   → global state

         ↕ REST API

Express Backend (Render)
├── Firebase Admin  → verify auth tokens
├── Firestore       → mood history + insights
└── Spotify API     → OAuth token exchange

Direct from Browser
└── Spotify Search API → track fetching (bypasses backend)
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Firebase project
- Spotify Developer App

### 1. Clone
```bash
git clone https://github.com/yourusername/vibzfy.git
cd vibzfy
```

### 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## 🔒 Privacy

All facial analysis runs **entirely on-device**. Your camera feed is never transmitted to any server. Only the detected mood label is saved (with your consent) to Firestore for the insights dashboard.

---

## 📄 License

MIT

---

<div align="center">
Built with ❤️ by <strong>Justin Samuel</strong>
</div>
