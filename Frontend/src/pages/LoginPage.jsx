import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "../services/firebase.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    try {
      setError("");
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (e) {
      setError(
        e.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : e.message,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen bg-[#FFDE4D] text-black flex items-center justify-center p-4 overflow-hidden selection:bg-black selection:text-[#FFDE4D]">
      <div className="w-full max-w-md flex flex-col justify-center h-full max-h-[640px]">
        {/* Brutalist Header / Logo */}
        <div className="bg-[#FD49A0] border-4 border-black p-3 mb-4 shadow-[4px_4px_0px_0px_#000] flex justify-between items-center transform -rotate-1 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#000]">
              V
            </div>
            <span className="font-black text-2xl uppercase tracking-wider">
              Vibzfy
            </span>
          </div>
          <span className="font-bold text-[10px] uppercase bg-black text-white px-2 py-0.5">
            login
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-white border-4 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_#000] space-y-4 flex flex-col justify-between overflow-y-auto max-h-full">
          <div className="border-b-4 border-black pb-2 shrink-0">
            <h1 className="font-black text-2xl uppercase tracking-tight">
              Welcome Back.
            </h1>
            <p className="text-xs font-bold text-gray-700 uppercase mt-0.5">
              Feel the vibe. Own the moment.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-[#FF6B6B] border-4 border-black font-bold p-2 text-xs shadow-[2px_2px_0px_0px_#000] shrink-0">
              ⚠️ {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#3D52D5] text-white border-4 border-black py-2.5 px-4 font-black uppercase tracking-wider text-xs shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-50 shrink-0"
          >
            <svg
              className="w-4 h-4 bg-white p-0.5 border border-black shrink-0"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex-1 h-[3px] bg-black" />
            <span className="font-black text-[10px] uppercase px-1.5 py-0.5 bg-black text-white">
              OR
            </span>
            <div className="flex-1 h-[3px] bg-black" />
          </div>

          {/* Credentials Form */}
          <form
            onSubmit={handleEmail}
            className="space-y-3 grow flex flex-col justify-center"
          >
            <div>
              <label className="block text-xs font-black uppercase tracking-wide mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white border-4 border-black p-2.5 font-bold text-sm placeholder-gray-500 shadow-[3px_3px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wide mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border-4 border-black p-2.5 font-bold text-sm placeholder-gray-500 shadow-[3px_3px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_0px_#000] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00E676] border-4 border-black py-2.5 font-black uppercase tracking-wider text-sm shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-50 mt-1"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Footer Router Link */}
          <div className="pt-2 text-center border-t-2 border-black shrink-0">
            <p className="font-bold text-xs uppercase">
              New to Vibzfy?{" "}
              <Link
                to="/signup"
                className="underline font-black text-[#3D52D5] bg-[#3D52D5]/10 px-1 hover:bg-black hover:text-white transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
