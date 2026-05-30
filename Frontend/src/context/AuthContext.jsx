import { createContext, useContext, useEffect } from "react";
import { auth, onAuthStateChanged } from "../services/firebase.js";
import { useStore } from "./store.js";
import { api } from "../services/api.js";
import { getStoredTokens } from "../services/spotify.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const {
    setUser,
    setAuthLoading,
    setUserProfile,
    setSpotifyTokens,
    setSpotifyProfile,
  } = useStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const profile = await api.user.getProfile();
          setUserProfile(profile);

          // Restore Spotify tokens from session
          const stored = getStoredTokens();
          if (stored?.accessToken) {
            setSpotifyTokens(stored);
            if (stored.profile) setSpotifyProfile(stored.profile);
          }
        } catch (err) {
          console.warn("Profile fetch failed:", err.message);
        }
      } else {
        setUserProfile(null);
        setSpotifyTokens(null);
      }

      setAuthLoading(false);
    });

    return unsub;
  }, []);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
