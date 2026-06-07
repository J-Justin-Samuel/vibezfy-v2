import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const MOODS = [
  { label: "EUPHORIC", color: "#00CC66", bg: "#BFFFD9" }, // Saturated light green
  { label: "MELANCHOLIC", color: "#0066FF", bg: "#B3D1FF" }, // Saturated light blue
  { label: "RAGE", color: "#E60000", bg: "#FFA6A6" }, // Saturated light red
  { label: "SERENE", color: "#CC9900", bg: "#FFEFA6" }, // Saturated warm yellow-gold
  { label: "ANXIOUS", color: "#CC00CC", bg: "#FFA6FF" }, // Saturated light magenta
  { label: "ELECTRIC", color: "#0099AA", bg: "#A6F2FC" }, // Saturated light cyan
];

const TICKERS = [
  "FACIAL SCAN",
  "MOOD DETECT",
  "SPOTIFY SYNC",
  "AI ANALYSIS",
  "VIBE CHECK",
  "NEURAL READ",
  "EMOTION ENGINE",
  "AUDIO MATCH",
  "EXPRESSION MAP",
  "REAL-TIME FEED",
];

export default function LandingPage() {
  const [moodIdx, setMoodIdx] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanPct, setScanPct] = useState(0);
  const [tickerPos, setTickerPos] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setMoodIdx((i) => (i + 1) % MOODS.length);
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setTickerPos((p) => (p + 1) % (TICKERS.length * 2));
    }, 60);
    return () => clearInterval(iv);
  }, []);

  const handleScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanPct(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8 + 2;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => {
          setScanning(false);
          setScanPct(0);
        }, 800);
      }
      setScanPct(Math.min(p, 100));
    }, 80);
  };

  const mood = MOODS[moodIdx];

  return (
    <div
      className="min-h-screen w-full bg-[#E3FAF4] text-[#000000] overflow-x-hidden"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* TICKER TAPE */}
      <div className="w-full bg-[#FFDE4D] border-b-4 border-black overflow-hidden py-2">
        <div className="whitespace-nowrap text-black font-black text-xs tracking-widest uppercase animate-marquee">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <span key={i} className="mr-8">
                {TICKERS.join("  //  ")}
              </span>
            ))}
        </div>
      </div>

      {/* NAVBAR */}
      <header className="border-b-4 border-black px-4 md:px-8 py-4 flex items-center justify-between bg-[#A3E2F4]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#00CC66] border border-black animate-pulse" />
          <span className="font-black text-lg tracking-widest text-black">
            VIBZFY
          </span>
          <span className="text-black/50 text-xs font-bold">v1.0.26</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black/70">
          <span className="hidden md:inline">SYS STATUS:</span>
          <span className="text-[#00CC66] font-black bg-black px-2 py-0.5 rounded-sm">
            ● ONLINE
          </span>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="px-4 md:px-8 py-10 md:py-16 max-w-7xl mx-auto">
        {/* BIG HEADLINE */}
        <div className="mb-10 md:mb-14">
          <div
            className="inline-block text-[10px] font-black tracking-widest uppercase px-3 py-1 border-2 border-black mb-4 -rotate-1 shadow-[3px_3px_0_0_#000]"
            style={{ background: "#FD49A0", color: "#000" }}
          >
            // LIVE EMOTION AUDIO ENGINE //
          </div>
          <h1 className="text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.88] tracking-tighter mb-4">
            <span className="block text-black">SCAN YOUR</span>
            <span
              className="block transition-colors duration-700"
              style={{
                color: mood.color,
                WebkitTextStroke: "2.5px #000000",
              }}
            >
              FACE.
            </span>
            <span className="block text-black">FEEL THE</span>
            <span
              className="block transition-colors duration-700 relative"
              style={{ color: mood.color }}
            >
              MUSIC.
              <span
                className="absolute -bottom-2 left-0 h-2 w-full transition-all duration-700 border-t-2 border-b-2 border-black"
                style={{ background: mood.color }}
              />
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-sm md:text-base font-bold uppercase tracking-tight text-black leading-relaxed border-4 border-black bg-[#FFDE4D] p-4 shadow-[6px_6px_0_0_#000]">
            Vibzfy reads your real-time facial expressions with computer vision
            and curates a perfectly synced Spotify session — automatically. No
            skipping. No searching. Just vibes.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* MOOD SCANNER WIDGET — spans 5 cols */}
          <div className="lg:col-span-5 border-4 border-black bg-[#E8C5FF] p-6 flex flex-col gap-6 shadow-[8px_8px_0_0_#000]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-black/60">
                MOOD SCANNER
              </span>
              <span className="text-xs font-black bg-black text-[#00CC66] px-2 py-0.5 border border-black">
                ● READY
              </span>
            </div>

            {/* FACE SCAN AREA */}
            <div
              className="relative border-4 border-black flex items-center justify-center overflow-hidden shadow-[4px_4px_0_0_#000]"
              style={{
                aspectRatio: "1 / 1",
                maxHeight: 260,
                background: "#FFEBA6",
              }}
            >
              {/* Scan grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Corner brackets */}
              {[
                "top-2 left-2 border-t-4 border-l-4",
                "top-2 right-2 border-t-4 border-r-4",
                "bottom-2 left-2 border-b-4 border-l-4",
                "bottom-2 right-2 border-b-4 border-r-4",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-6 h-6 transition-colors duration-700 ${cls}`}
                  style={{ borderColor: mood.color }}
                />
              ))}

              {/* Scan line animation */}
              {scanning && (
                <div
                  className="absolute left-0 right-0 h-1 transition-all duration-75 border-b border-black"
                  style={{
                    top: `${scanPct}%`,
                    background: mood.color,
                    boxShadow: `0 0 12px ${mood.color}`,
                  }}
                />
              )}

              {/* Mood label */}
              <div className="flex flex-col items-center gap-2 z-10 bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#000]">
                <div
                  className="text-2xl font-black tracking-widest transition-all duration-700 uppercase"
                  style={{ color: mood.color }}
                >
                  {scanning
                    ? `SCANNING... ${Math.round(scanPct)}%`
                    : mood.label}
                </div>
                {!scanning && (
                  <div className="text-xs text-black/70 font-black uppercase tracking-widest">
                    DETECTED MOOD
                  </div>
                )}
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-black/60 mb-1">
                <span>EMOTION CONFIDENCE</span>
                <span>94%</span>
              </div>
              <div className="h-5 bg-white w-full border-4 border-black shadow-[2px_2px_0_0_#000]">
                <div
                  className="h-full transition-all duration-700 border-r-4 border-black"
                  style={{ width: "94%", background: mood.color }}
                />
              </div>
            </div>

            {/* MOOD CHIPS */}
            <div className="grid grid-cols-3 gap-2">
              {MOODS.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => setMoodIdx(i)}
                  className="text-[9px] font-black uppercase tracking-wider py-1.5 px-1 border-2 border-black transition-all duration-200 shadow-[3px_3px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[0px_0px_0_0_#000]"
                  style={{
                    color: "#000000",
                    background: moodIdx === i ? m.bg : "#FFFFFF",
                    borderColor: moodIdx === i ? mood.color : "#000000",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* SIMULATE BTN */}
            <button
              onClick={handleScan}
              disabled={scanning}
              className="w-full py-3 text-sm font-black uppercase tracking-widest border-4 border-black transition-all duration-150 disabled:opacity-50 shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0_0_#000]"
              style={{
                background: scanning ? "#FFFFFF" : mood.color,
                color: "#000",
              }}
            >
              {scanning
                ? `ANALYZING... ${Math.round(scanPct)}%`
                : "▶ SIMULATE SCAN"}
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6">
            {/* HOW IT WORKS — 3 steps */}
            <div className="border-4 border-black bg-[#FFC2DF] p-6 shadow-[8px_8px_0_0_#000]">
              <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-5">
                // HOW IT WORKS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    n: "01",
                    title: "FACE SCAN",
                    desc: "Computer vision maps 68 facial landmarks in real time",
                    color: "#00CC66",
                  },
                  {
                    n: "02",
                    title: "MOOD READ",
                    desc: "AI classifies emotion across 6 dimensions of affect",
                    color: "#FD49A0",
                  },
                  {
                    n: "03",
                    title: "VIBE SYNC",
                    desc: "Spotify session updates instantly — track by track",
                    color: "#FFDE4D",
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="flex flex-col gap-2 bg-white border-4 border-black p-3 shadow-[4px_4px_0_0_#000]"
                  >
                    <div
                      className="text-3xl font-black"
                      style={{
                        color: s.color,
                        WebkitTextStroke: "1.5px #000",
                      }}
                    >
                      {s.n}
                    </div>
                    <div className="text-sm font-black uppercase tracking-wide text-black">
                      {s.title}
                    </div>
                    <div className="text-xs text-black/80 font-bold leading-relaxed">
                      {s.desc}
                    </div>
                    <div
                      className="h-1.5 w-8 mt-auto border border-black"
                      style={{ background: s.color }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  val: "6",
                  label: "MOOD STATES",
                  color: "#00CC66",
                  cardBg: "#BFFFD9",
                },
                {
                  val: "68",
                  label: "FACIAL POINTS",
                  color: "#FD49A0",
                  cardBg: "#FFC2DF",
                },
                {
                  val: "<1s",
                  label: "RESPONSE TIME",
                  color: "#FFDE4D",
                  cardBg: "#FFEFA6",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="border-4 border-black p-4 flex flex-col gap-1 shadow-[4px_4px_0_0_#000]"
                  style={{ backgroundColor: s.cardBg }}
                >
                  <div
                    className="text-2xl md:text-3xl font-black text-black"
                    style={{
                      WebkitTextStroke: "1px " + s.color,
                    }}
                  >
                    {s.val}
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-black/60">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* FEATURE CHIPS */}
            <div className="grid grid-cols-2 gap-3">
              {[
                "[✓] AI EXPRESSION SCAN",
                "[✓] SPOTIFY SESSION SYNC",
                "[✓] REAL-TIME ANALYSIS",
                "[✓] ZERO MANUAL INPUT",
              ].map((f, index) => {
                const chipBgs = ["#B3D1FF", "#FFEFA6", "#BFFFD9", "#FFA6FF"];
                return (
                  <div
                    key={f}
                    className="text-xs font-black uppercase tracking-wide p-3 border-4 border-black text-black shadow-[3px_3px_0_0_#000]"
                    style={{ backgroundColor: chipBgs[index % chipBgs.length] }}
                  >
                    {f}
                  </div>
                );
              })}
            </div>

            {/* CTA BLOCK */}
            <div className="border-4 border-black p-6 bg-[#FFDE4D] shadow-[8px_8px_0_0_#000] mt-auto">
              <div className="text-xs font-black uppercase tracking-widest text-black/60 mb-4">
                // START NOW — FREE
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/signup"
                  className="flex-1 text-center block bg-black text-[#FFDE4D] border-4 border-black py-4 font-black uppercase tracking-widest text-base transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] active:translate-x-2 active:translate-y-2"
                >
                  GET STARTED FREE ⚡
                </Link>
                <Link
                  to="/login"
                  className="flex-1 text-center block bg-white text-black border-4 border-black py-4 font-black uppercase tracking-widest text-sm transition-all hover:translate-x-1 hover:translate-y-1 hover:bg-black hover:text-[#FFDE4D] active:translate-x-2 active:translate-y-2 shadow-[4px_4px_0_0_#000]"
                >
                  SIGN IN →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER TICKER */}
      <div className="mt-10 border-t-4 border-black bg-[#FFC2DF] py-3 overflow-hidden">
        <div className="whitespace-nowrap text-black font-black text-[10px] tracking-widest uppercase animate-marquee">
          {Array(6)
            .fill(null)
            .map((_, i) => (
              <span key={i} className="mr-8">
                VIBZFY // EMOTION ENGINE // SPOTIFY SYNC // COMPUTER VISION //
                MOOD DETECTION //
              </span>
            ))}
        </div>
      </div>

      {/* MARQUEE ANIMATION */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}
