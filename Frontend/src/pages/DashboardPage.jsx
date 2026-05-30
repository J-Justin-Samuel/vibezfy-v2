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

  const tabs = {
    home: <HomeTab />,
    detect: <DetectTab />,
    history: <HistoryTab />,
    insights: <InsightsTab />,
  };

  return (
    <div className="flex h-screen bg-vib-bg overflow-hidden relative">
      {/* Full-screen ambient scene behind everything */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AmbientCanvas />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto">
          <div className="animate-fade-in" key={activeTab}>
            {tabs[activeTab]}
          </div>
        </div>

        {/* Sticky player bar */}
        <PlayerBar />
      </main>
    </div>
  );
}
