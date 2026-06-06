import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="h-screen w-screen bg-[#FFDE4D] text-black flex items-center justify-center p-4 overflow-hidden selection:bg-black selection:text-[#FFDE4D]">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 items-center justify-center h-full max-h-[600px]">
        {/* Left Side: Brand Concept & Copy Block */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
          <div className="space-y-4">
            <div className="inline-block bg-[#FD49A0] border-2 border-black px-3 py-1 text-xs font-mono font-black uppercase tracking-widest transform -rotate-2 shadow-[2px_2px_0px_0px_#000]">
              LIVE // EMOTION AUDIO ENGINE
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              SCAN YOUR FACE. <br />
              <span className="bg-[#00E676] px-1 border-2 border-black inline-block mt-1 transform rotate-1">
                GET THE VIBE.
              </span>
            </h1>
            <p className="font-bold text-sm text-gray-800 uppercase tracking-tight pt-2">
              Vibzfy cross-analyzes real-time facial expressions with computer
              vision to curate perfectly synced, authentic audio environments
              straight to your Spotify device session.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t-4 border-black font-mono text-xs font-bold uppercase shrink-0">
            <div className="bg-gray-100 p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              [✓] AI EXPRESSION SCAN
            </div>
            <div className="bg-gray-100 p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              [✓] SPOTIFY SYNC CORE
            </div>
          </div>
        </div>

        {/* Right Side: Primary CTA Route Navigation Deck */}
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full bg-[#3D52D5] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] text-white">
          <div className="text-center md:text-left space-y-2">
            <div className="text-3xl font-black uppercase tracking-widest bg-black text-[#00E676] px-3 py-1 inline-block shadow-[4px_4px_0px_0px_#FD49A0]">
              VIBZFY //
            </div>
            <p className="font-mono text-xs text-zinc-300 uppercase tracking-wider block pt-2">
              SYSTEM STATUS: ONLINE // v1.0.26
            </p>
          </div>

          {/* Large Explicit CTA Action Layout Container */}
          <div className="space-y-4 my-auto py-4">
            <Link
              to="/signup"
              className="w-full text-center block bg-[#00E676] text-black border-4 border-black py-4 font-black uppercase tracking-wider text-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              GET STARTED FREE ⚡
            </Link>

            <Link
              to="/login"
              className="w-full text-center block bg-white text-black border-4 border-black py-3 font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              EXISTING OPERATOR SIGN-IN →
            </Link>
          </div>

          <div className="text-center border-t-2 border-white/30 pt-3">
            <span className="font-mono text-[10px] uppercase text-zinc-300">
              SECURE FIREBASE AUTHENTICATION ENVIRONMENT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
