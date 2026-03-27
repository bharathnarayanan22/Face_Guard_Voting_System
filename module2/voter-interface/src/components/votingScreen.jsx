import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://127.0.0.1:5000", {
  path: "/socket.io",
  transports: ["websocket"],
});

const C = { saffron: "#FF9933", saffronLight: "#FFB347", green: "#138808", greenLight: "#1aad0a", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };

const VotingScreen = () => {
  const [locked, setLocked] = useState(true);
  const [voter, setVoter] = useState(null);
  const [regionId, setRegionId] = useState(null);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingFor, setVotingFor] = useState(null);
  const [result, setResult] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => {
      setConnected(false);
      setResult("Failed to connect to server. Please try again.");
    });

    socket.on("verifiedVoter", (data) => {
      if (data?.voterId && data?.regionId) {
        setLocked(false);
        setVoter(data.voterId);
        setRegionId(data.regionId);
      } else {
        setResult("Invalid voter data received.");
      }
    });

    socket.on("lockVoting", () => {
      setLocked(true);
      setVoter(null);
      setRegionId(null);
      setParties([]);
      setResult("");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("verifiedVoter");
      socket.off("lockVoting");
    };
  }, []);

  useEffect(() => {
    if (!regionId || !/^[0-9a-fA-F]{24}$/.test(regionId)) return;
    axios.get(`http://127.0.0.1:3000/regions/${regionId}/parties`)
      .then(res => setParties(res.data || []))
      .catch(() => setResult("Error fetching parties. Please try again."));
  }, [regionId]);

  const castVote = async (partyId) => {
    if (!voter) { setResult("No voter selected. Please verify first."); return; }
    setLoading(true);
    setVotingFor(partyId);
    try {
      const response = await axios.post("http://127.0.0.1:5000/cast-vote", { voterId: voter, partyId });
      if (response.data.success) {
        socket.emit("lockVoting", { voterId: voter });
        setResult("Vote cast successfully!");
        setOpenDialog(true);
        setTimeout(() => { setOpenDialog(false); setResult(""); }, 3000);
      } else {
        setResult("Failed to cast vote. Please try again.");
      }
    } catch (err) {
      setResult(`Error casting vote: ${err.response ? err.response.data.message : err.message}`);
    } finally {
      setLoading(false);
      setVotingFor(null);
    }
  };

  const isError = result && (result.includes("Error") || result.includes("Failed") || result.includes("Invalid"));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f2e; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse2 { 0%,100%{box-shadow:0 0 0 0 rgba(255,153,51,0.35)} 50%{box-shadow:0 0 0 8px rgba(255,153,51,0)} }
        @keyframes lockPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes successPop { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .party-row { transition: background 0.15s, border-color 0.2s; }
        .party-row:hover { background: rgba(255,153,51,0.05) !important; border-color: rgba(255,153,51,0.25) !important; }
        .vote-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,153,51,0.3) !important; }
        .vote-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,153,51,0.25); border-radius: 3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.navy} 0%, #0d1535 50%, #0a1a10 100%)`, fontFamily: "'Outfit', sans-serif", color: C.white, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Background effects */}
        <div style={{ position: "fixed", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,153,51,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,153,51,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,51,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", width: "100%", padding: "36px 20px 48px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }} className="fade-up">
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
              {[C.saffron, C.white, C.green].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 12px ${c}` }} />
              ))}
            </div>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.saffron, marginBottom: 8, fontWeight: 700 }}>Election Commission of India</div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.02em", background: `linear-gradient(135deg, ${C.saffron}, ${C.white} 45%, ${C.greenLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6 }}>
              Voting Interface
            </h1>
            <p style={{ fontSize: 14, color: C.muted }}>Secure · Anonymous · Verified</p>

            {/* Socket connection status */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: "rgba(255,255,255,0.04)", border: `1px solid ${connected ? "rgba(19,136,8,0.3)" : "rgba(255,107,107,0.3)"}`, borderRadius: 100, padding: "5px 14px", fontSize: 11, color: connected ? "#4CAF50" : "#FF6B6B", fontWeight: 600 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: connected ? "#4CAF50" : "#FF6B6B", animation: connected ? "pulse2 2s infinite" : "none" }} />
              {connected ? "Server Connected" : "Connecting to server…"}
            </div>
          </div>

          {/* Main Card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", flex: 1 }} className="fade-up-2">
            <div style={{ height: 3, background: locked ? "linear-gradient(90deg, rgba(255,107,107,0.6), transparent)" : `linear-gradient(90deg, ${C.saffron}, transparent)` }} />

            <div style={{ padding: "28px" }}>

              {/* ── LOCKED STATE ── */}
              {locked ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 360, gap: 20 }}>
                  {/* Lock icon */}
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, animation: "lockPulse 2s ease-in-out infinite" }}>
                    🔒
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.white, marginBottom: 8 }}>Voting Interface Locked</div>
                    <div style={{ fontSize: 14, color: C.muted, maxWidth: 320, lineHeight: 1.6 }}>
                      Awaiting biometric verification from the Voter Verification System. Please complete face recognition to unlock.
                    </div>
                  </div>
                  {/* Steps */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 22px", width: "100%", maxWidth: 360 }}>
                    <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>To proceed</div>
                    {[
                      "Go to the Voter Verification kiosk",
                      "Complete face recognition scan",
                      "This screen will unlock automatically",
                    ].map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 13, color: C.muted, alignItems: "flex-start" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,153,51,0.12)", border: "1px solid rgba(255,153,51,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.saffron, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // ── UNLOCKED STATE ──
                <>
                  {/* Voter info banner */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(19,136,8,0.08)", border: "1px solid rgba(19,136,8,0.25)", borderRadius: 12, padding: "14px 18px", marginBottom: 28 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #138808, #1aad0a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✓</div>
                    <div>
                      <div style={{ fontSize: 12, color: "#4CAF50", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Identity Verified</div>
                      <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Cast your vote below. This action is final and cannot be undone.</div>
                    </div>
                    <div style={{ marginLeft: "auto", background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.25)", borderRadius: 100, padding: "4px 12px", fontSize: 11, color: C.saffron, fontWeight: 700, flexShrink: 0 }}>
                      1 VOTE
                    </div>
                  </div>

                  {/* Section heading */}
                  <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>⬡ Select a Party</div>

                  {/* Parties list */}
                  {parties.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "48px 20px", color: C.muted }}>
                      <div style={{ fontSize: 32 }}>🏛️</div>
                      <div style={{ fontSize: 14 }}>No parties available for this region.</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {parties.map((party, i) => (
                        <div
                          key={party._id}
                          className="party-row"
                          style={{ display: "flex", alignItems: "center", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", animationDelay: `${i * 0.06}s` }}
                        >
                          {/* Party icon */}
                          <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                            🏴
                          </div>

                          {/* Party details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 3, textTransform: "capitalize" }}>{party.partyName}</div>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 12, color: C.muted }}>
                                <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 4 }}>Leader:</span>
                                <span style={{ textTransform: "capitalize" }}>{party.partyLeader}</span>
                              </span>
                              <span style={{ fontSize: 12, color: C.muted }}>
                                <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 4 }}>Symbol:</span>
                                <span style={{ textTransform: "capitalize" }}>{party.partySymbol}</span>
                              </span>
                            </div>
                          </div>

                          {/* Vote button */}
                          <button
                            className="vote-btn"
                            onClick={() => castVote(party._id)}
                            disabled={loading}
                            style={{ background: votingFor === party._id ? "rgba(255,153,51,0.4)" : "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "10px 20px", color: C.navy, fontSize: 13, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(255,153,51,0.2)", transition: "transform 0.15s, box-shadow 0.15s", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, minWidth: 90 }}
                          >
                            {votingFor === party._id ? (
                              <>
                                <div style={{ width: 14, height: 14, border: "2px solid rgba(10,15,46,0.3)", borderTop: "2px solid #0a0f2e", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                                Voting…
                              </>
                            ) : (
                              <>🗳️ Vote</>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error result */}
                  {result && isError && (
                    <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 12, padding: "14px 16px", color: "#FF6B6B", fontSize: 14 }}>
                      ⚠️ {result}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 28, color: C.muted, fontSize: 12, letterSpacing: "0.05em" }}>
            🇮🇳 &nbsp; Election Commission of India · Your vote is secret & secure
          </div>
        </div>

        {/* ── Success Dialog ── */}
        {openDialog && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ background: "linear-gradient(145deg, #111936, #0d1a28)", border: "1px solid rgba(19,136,8,0.4)", borderRadius: 24, padding: "40px 32px", width: "100%", maxWidth: 380, textAlign: "center", animation: "successPop 0.4s ease both", boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(19,136,8,0.1)" }}>
              {/* Success icon */}
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(19,136,8,0.15)", border: "2px solid rgba(19,136,8,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 20px" }}>✓</div>
              <div style={{ fontSize: 11, color: "#4CAF50", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Vote Recorded</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.white, marginBottom: 10 }}>Thank You!</div>
              <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>Your vote has been cast successfully. The voting interface will lock automatically.</div>
              {/* Progress bar for auto-close */}
              <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #138808, #1aad0a)", borderRadius: 2, animation: "shrink 3s linear both" }} />
              </div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>Closing automatically…</div>
            </div>
          </div>
        )}

        <style>{`@keyframes shrink { from{width:100%} to{width:0%} }`}</style>
      </div>
    </>
  );
};

export default VotingScreen;