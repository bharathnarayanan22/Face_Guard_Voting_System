import React, { useState } from "react";
import EnrollVoterForm from "../pages/VoterForm";
import EnrollPartyForm from "../pages/PartyForm";
import ViewPartyPage from "../pages/ViewParties";
import ViewVoterPage from "../pages/ViewVoters";
import RegionForm from "../pages/RegionForm";
import ViewRegions from "../pages/ViewRegions";
import ViewLiveResultPage from "../pages/ResultPage";

// ─── Design Tokens ────────────────────────────────────────────────
const C = {
  saffron: "#FF9933", saffronLight: "#FFB347",
  green: "#138808", greenLight: "#1aad0a",
  navy: "#0a0f2e", navyMid: "#111936",
  white: "#FFFFFF", muted: "#8892B0",
  border: "rgba(255,153,51,0.15)",
  glass: "rgba(255,255,255,0.04)",
};

const NAV_ITEMS = [
  { view: "CreateRegion",  label: "Create Region",  icon: "🗺️",  accent: C.saffron },
  { view: "EnrollVoter",   label: "Enroll Voter",   icon: "👤",  accent: C.green },
  { view: "EnrollParty",   label: "Enroll Party",   icon: "🏛️",  accent: "#4A90D9" },
  { view: "ViewRegions",   label: "View Regions",   icon: "📍",  accent: C.saffron },
  { view: "ViewVoters",    label: "View Voters",    icon: "👥",  accent: C.green },
  { view: "ViewParties",   label: "View Parties",   icon: "🎯",  accent: "#4A90D9" },
  { view: "LiveResults",   label: "Live Results",   icon: "📡",  accent: "#E040FB" },
];

const CARD_DESCS = {
  CreateRegion: "Add new electoral regions with state, district, taluk & ward details.",
  EnrollVoter:  "Register new voters with biometric capture and region assignment.",
  EnrollParty:  "Register political parties and assign them to electoral regions.",
  ViewRegions:  "Browse and search all electoral regions, view voters & parties.",
  ViewVoters:   "Manage voter database, view profiles, and download records.",
  ViewParties:  "Manage registered parties, edit details, and filter by region.",
  LiveResults:  "Real-time vote counts, turnout stats, and regional result filters.",
};

export default function DashBoard() {
  const [selectedView, setSelectedView] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const active = NAV_ITEMS.find(n => n.view === selectedView);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f2e; font-family: 'Outfit', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{transform:translateX(-100%)} to{transform:translateX(0)} }
        .fade-up { animation: fadeUp 0.45s ease both; }
        .card-item { transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s; cursor: pointer; }
        .card-item:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.35) !important; }
        .nav-btn { transition: background 0.15s, transform 0.1s; cursor: pointer; border: none; }
        .nav-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .nav-btn.active { background: rgba(255,153,51,0.12) !important; border-left: 3px solid #FF9933 !important; }
        .icon-btn { background: none; border: none; cursor: pointer; display:flex; align-items:center; justify-content:center; border-radius:8px; transition: background 0.15s; }
        .icon-btn:hover { background: rgba(255,255,255,0.08); }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,153,51,0.25); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.navy} 0%, #0d1535 50%, #0a1a10 100%)`, fontFamily: "'Outfit', sans-serif", color: C.white, display: "flex", flexDirection: "column" }}>

        {/* Background orbs */}
        <div style={{ position: "fixed", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,153,51,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,153,51,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,51,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

        {/* Topbar */}
        <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,15,46,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,153,51,0.12)", height: 64, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
          <button className="icon-btn" style={{ width: 40, height: 40, color: C.white }} onClick={() => setSidebarOpen(v => !v)}>
            {sidebarOpen ? "✕" : "☰"}
          </button>

          {/* Tricolor divider */}
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            {[C.saffron, C.white, C.green].map((c, i) => (
              <div key={i} style={{ width: 4, height: 28, background: c, borderRadius: 2, opacity: 0.9 }} />
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: C.saffron, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700 }}>Election Commission of India</div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em" }}>Organizer Dashboard</div>
          </div>

          {selectedView && (
            <button className="icon-btn" style={{ padding: "8px 14px", color: C.muted, fontSize: 13, fontFamily: "'Outfit', sans-serif" }} onClick={() => setSelectedView(null)}>
              ← Back
            </button>
          )}
        </header>

        {/* Sidebar */}
        {sidebarOpen && (
          <>
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99, backdropFilter: "blur(4px)" }} onClick={() => setSidebarOpen(false)} />
            <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 260, background: "rgba(10,15,46,0.97)", backdropFilter: "blur(16px)", borderRight: "1px solid rgba(255,153,51,0.12)", zIndex: 200, animation: "slideIn 0.25s ease", display: "flex", flexDirection: "column" }}>
              {/* Sidebar header */}
              <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[C.saffron, C.white, C.green].map((c, i) => <div key={i} style={{ width: 4, height: 32, background: c, borderRadius: 2 }} />)}
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>ECI</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Navigation</div>
                </div>
                <button className="icon-btn" style={{ marginLeft: "auto", color: C.muted, width: 32, height: 32 }} onClick={() => setSidebarOpen(false)}>✕</button>
              </div>

              {/* Nav items */}
              <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.view}
                    className={`nav-btn ${selectedView === item.view ? "active" : ""}`}
                    style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "13px 20px", color: selectedView === item.view ? C.saffron : C.white, background: "transparent", borderLeft: selectedView === item.view ? `3px solid ${C.saffron}` : "3px solid transparent", textAlign: "left", fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: selectedView === item.view ? 700 : 500 }}
                    onClick={() => { setSelectedView(item.view); setSidebarOpen(false); }}
                  >
                    <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Sidebar footer */}
              <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: C.muted, textAlign: "center", letterSpacing: "0.05em" }}>
                🇮🇳 Election Commission of India
              </div>
            </aside>
          </>
        )}

        {/* Main content */}
        <main style={{ flex: 1, paddingTop: 64, position: "relative", zIndex: 1 }}>
          {!selectedView ? (
            // ── Dashboard Home ──
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
              {/* Hero */}
              <div style={{ textAlign: "center", marginBottom: 48 }} className="fade-up">
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
                  {[C.saffron, C.white, C.green].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 12px ${c}` }} />)}
                </div>
                <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.saffron, marginBottom: 8, fontWeight: 700 }}>Election Commission of India</div>
                <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.02em", background: `linear-gradient(135deg, ${C.saffron}, ${C.white} 45%, ${C.greenLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
                  Organizer Dashboard
                </h1>
                <p style={{ fontSize: 15, color: C.muted }}>Manage elections, voters, parties and regions</p>
              </div>

              {/* Cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {NAV_ITEMS.map((item, i) => (
                  <div
                    key={item.view}
                    className="card-item fade-up"
                    style={{ background: C.glass, border: `1px solid rgba(255,255,255,0.07)`, borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.2)", animationDelay: `${i * 0.06}s` }}
                    onClick={() => setSelectedView(item.view)}
                  >
                    {/* Card top accent */}
                    <div style={{ height: 3, background: `linear-gradient(90deg, ${item.accent}, transparent)` }} />
                    <div style={{ padding: "24px" }}>
                      {/* Icon area */}
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.accent}18`, border: `1px solid ${item.accent}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>
                        {item.icon}
                      </div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: C.white, marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{CARD_DESCS[item.view]}</div>
                      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: item.accent, fontWeight: 600 }}>
                        Open <span style={{ fontSize: 14 }}>→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // ── Sub-page view ──
            <div style={{ maxWidth: selectedView.startsWith("View") ? "100%" : 960, margin: "0 auto", padding: "28px 20px" }} className="fade-up">
              {/* Page header */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${active?.accent || C.saffron}18`, border: `1px solid ${active?.accent || C.saffron}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                  {active?.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>Election Commission</div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: C.white, letterSpacing: "-0.01em" }}>{active?.label}</h2>
                </div>
              </div>

              {/* Content card */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ borderTop: `3px solid ${active?.accent || C.saffron}` }} />
                <div style={{ padding: "28px" }}>
                  {selectedView === "CreateRegion"  && <RegionForm />}
                  {selectedView === "EnrollVoter"   && <EnrollVoterForm />}
                  {selectedView === "EnrollParty"   && <EnrollPartyForm />}
                  {selectedView === "ViewRegions"   && <ViewRegions />}
                  {selectedView === "ViewVoters"    && <ViewVoterPage />}
                  {selectedView === "ViewParties"   && <ViewPartyPage />}
                  {selectedView === "LiveResults"   && <ViewLiveResultPage />}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}