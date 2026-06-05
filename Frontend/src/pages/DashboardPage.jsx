import { useState } from "react";
import { useStore } from "../context/store.js";
import Sidebar from "../components/dashboard/Sidebar.jsx";
import HomeTab from "../components/dashboard/HomeTab.jsx";
import DetectTab from "../components/dashboard/DetectTab.jsx";
import HistoryTab from "../components/dashboard/HistoryTab.jsx";
import InsightsTab from "../components/dashboard/InsightsTab.jsx";
import AmbientCanvas from "../components/ambient/AmbientCanvas.jsx";
import PlayerBar from "../components/player/PlayerBar.jsx";

export default function DashboardPage() {
  const { activeTab } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = {
    home: <HomeTab />,
    detect: <DetectTab />,
    history: <HistoryTab />,
    insights: <InsightsTab />,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FFFDF6] text-black font-mono selection:bg-yellow-300 antialiased overflow-x-hidden">
      {/* Background Ambient Engine (Kept subtle behind the brutal layers) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply">
        <AmbientCanvas />
      </div>

      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#FF5C00] border-b-4 border-black sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white px-2 py-1 font-black text-xl border border-white">
            V
          </span>
          <span className="font-black text-xl uppercase tracking-tighter">
            VIBZFY
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-yellow-300 border-2 border-black p-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_#000] font-bold text-xs uppercase"
        >
          {mobileMenuOpen ? "Close Menu" : "Open Menu"}
        </button>
      </div>

      {/* Sidebar Overlay/Drawer Logic for Mobile, Persistent for Desktop */}
      <div
        className={`fixed lg:sticky top-[68px] lg:top-0 h-[calc(100vh-68px)] lg:h-screen z-40 transition-transform duration-300 lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0 w-full" : "-translate-x-full lg:w-64"}`}
      >
        <Sidebar closeMobileMenu={() => setMobileMenuOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-[calc(100vh-68px)] lg:h-screen relative z-10 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32">
          <div className="max-w-5xl mx-auto" key={activeTab}>
            {tabs[activeTab]}
          </div>
        </div>

        {/* Sticky Fixed Player Bottom Deck */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 bg-[#00F0FF] border-t-4 border-black p-4">
          <PlayerBar />
        </div>
      </main>
    </div>
  );
}
