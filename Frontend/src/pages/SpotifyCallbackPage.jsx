import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useStore } from "../context/store.js";
import { storeTokens } from "../services/spotify.js";

export default function SpotifyCallbackPage() {
  const navigate = useNavigate();
  const { setSpotifyTokens, setSpotifyProfile } = useStore();
  const [status, setStatus] = useState("Connecting Spotify…");
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const errorParam = params.get("error");

    if (errorParam) {
      setError(`Spotify denied access: ${errorParam}`);
      setTimeout(() => navigate("/dashboard"), 3000);
      return;
    }

    if (!code) {
      setError("No authorization code received.");
      setTimeout(() => navigate("/dashboard"), 3000);
      return;
    }

    api.spotify
      .exchangeToken(code, window.location.origin + "/callback")
      .then((data) => {
        const tokens = {
          accessToken: data.accessToken,
          expiresAt: data.expiresAt,
          profile: data.profile,
        };
        storeTokens(tokens);
        setSpotifyTokens(tokens);
        if (data.profile) setSpotifyProfile(data.profile);
        setStatus("Spotify connected! Redirecting…");
        setTimeout(() => navigate("/dashboard"), 1200);
      })
      .catch((err) => {
        setError(err.message);
        setTimeout(() => navigate("/dashboard"), 3000);
      });
  }, []);

  return (
    <div className="min-h-screen bg-vib-bg flex items-center justify-center">
      <div className="card p-10 text-center space-y-4 max-w-sm w-full mx-4">
        {error ? (
          <>
            <div className="text-4xl">❌</div>
            <p className="text-red-400 font-body">{error}</p>
            <p className="text-vib-muted text-sm">Redirecting back…</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full border-2 border-vib-accent border-t-transparent animate-spin mx-auto" />
            <p className="text-vib-text font-display font-medium">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}
