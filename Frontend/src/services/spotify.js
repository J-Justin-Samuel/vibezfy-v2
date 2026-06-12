const REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5173/callback";
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(" ");

const STORAGE_KEY = "vibezfy_spotify";

export function getStoredTokens() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeTokens(tokens) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isTokenExpired(tokens) {
  if (!tokens?.expiresAt) return true;
  return Date.now() > tokens.expiresAt - 60_000;
}

export function buildSpotifyAuthUrl(state) {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: state || Math.random().toString(36).substring(7),
  });
  return "https://accounts.spotify.com/authorize?" + params.toString();
}

// ── SDK ───────────────────────────────────────────────────────────────────────
let sdkPlayer = null;
let sdkReadyCallbacks = [];
let sdkLoaded = false;

export function loadSpotifySDK() {
  if (sdkLoaded) return;
  sdkLoaded = true;
  window.onSpotifyWebPlaybackSDKReady = () => {
    sdkReadyCallbacks.forEach((cb) => cb());
    sdkReadyCallbacks = [];
  };
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;
  document.head.appendChild(script);
}

export function initSpotifyPlayer(accessToken, onReady, onError) {
  const init = () => {
    if (sdkPlayer) sdkPlayer.disconnect();

    sdkPlayer = new window.Spotify.Player({
      name: "Vibezfy Player",
      getOAuthToken: (cb) => cb(accessToken),
      volume: 0.7,
    });

    sdkPlayer.addListener("ready", ({ device_id }) => {
      console.log("✅ Spotify SDK ready. Device:", device_id);
      onReady?.(device_id, sdkPlayer);
    });

    sdkPlayer.addListener("not_ready", ({ device_id }) => {
      console.warn("Spotify offline:", device_id);
    });

    sdkPlayer.addListener("initialization_error", ({ message }) => {
      onError?.("Initialization error: " + message);
    });

    sdkPlayer.addListener("authentication_error", ({ message }) => {
      onError?.("Auth error: " + message);
    });

    sdkPlayer.addListener("account_error", ({ message }) => {
      onError?.("Premium required: " + message);
    });

    sdkPlayer.connect();
    return sdkPlayer;
  };

  if (window.Spotify) return init();
  sdkReadyCallbacks.push(init);
  loadSpotifySDK();
}

export function getPlayer() {
  return sdkPlayer;
}

export async function playTracks(deviceId, uris, accessToken) {
  // Step 1: Transfer playback to Vibezfy SDK device
  await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ device_ids: [deviceId], play: false }),
  });

  // Step 2: Wait for transfer
  await new Promise((res) => setTimeout(res, 800));

  // Step 3: Play URIs
  const playRes = await fetch(
    "https://api.spotify.com/v1/me/player/play?device_id=" + deviceId,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    },
  );

  if (!playRes.ok && playRes.status !== 204) {
    const err = await playRes.json().catch(() => ({}));
    throw new Error(err.error?.message || "Playback failed: " + playRes.status);
  }
}

export async function setVolume(deviceId, volumePercent, accessToken) {
  await fetch(
    "https://api.spotify.com/v1/me/player/volume?volume_percent=" +
      volumePercent +
      "&device_id=" +
      deviceId,
    { method: "PUT", headers: { Authorization: "Bearer " + accessToken } },
  );
}

export function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min + ":" + sec.toString().padStart(2, "0");
}
