import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-[#FF6B6B] text-black flex items-center justify-center p-4 overflow-hidden selection:bg-black selection:text-[#FF6B6B]">
      <div className="w-full max-w-sm bg-white border-4 border-black p-6 text-center space-y-6 shadow-[8px_8px_0px_0px_#000] transform -rotate-1">
        <div className="inline-block bg-black text-white font-black text-5xl p-4 shadow-[4px_4px_0px_0px_#FD49A0]">
          BYE!
        </div>

        <div className="space-y-2">
          <h1 className="font-black text-2xl uppercase tracking-tight">
            Session Terminated.
          </h1>
          <p className="text-xs font-bold text-gray-700 uppercase">
            Clearing local token storage keys...
          </p>
        </div>

        <div className="bg-[#FFDE4D] text-black font-mono text-xs font-black uppercase tracking-widest py-2 border-2 border-black shadow-[3px_3px_0px_0px_#000] animate-pulse">
          SHUTTING DOWN SYSTEM CONTEXT
        </div>
      </div>
    </div>
  );
}
