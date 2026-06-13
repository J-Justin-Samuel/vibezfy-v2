import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useStore } from "../context/store.js";
import { storeTokens } from "../services/spotify.js";

export default function SpotifyCallbackPage() {
  const navigate = useNavigate();
  const { setSpotifyTokens, setSpotifyProfile } = useStore();
  const [status, setStatus] = useState("Connecting Spotify…");
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

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
      .exchangeToken(code, "https://vibezfy-v2.vercel.app/callback")
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
    <div className="min-h-screen bg-[#1ED760] text-black flex items-center justify-center p-4 selection:bg-black selection:text-[#1ED760]">
      <div className="bg-white border-4 border-black p-8 text-center space-y-6 max-w-sm w-full shadow-[8px_8px_0px_0px_#000]">
        {error ? (
          <>
            <div className="inline-block bg-[#FF6B6B] text-black border-4 border-black font-black text-4xl p-4 transform -rotate-3 shadow-[4px_4px_0px_0px_#000]">
              ERR!
            </div>
            <p className="font-black text-sm uppercase tracking-wide text-red-600">
              {error}
            </p>
            <p className="bg-black text-white py-1 text-xs font-mono uppercase tracking-widest animate-pulse">
              Redirecting back…
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 border-4 border-black border-t-[#1ED760] bg-black animate-spin mx-auto shadow-[4px_4px_0px_0px_#000]" />
            <p className="text-black font-black text-xl uppercase tracking-tight bg-[#FFDE4D] py-2 border-2 border-black transform rotate-1">
              {status}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
