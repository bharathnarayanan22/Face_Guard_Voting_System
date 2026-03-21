import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

// ─── Color Palette ───────────────────────────────────────────────
const C = {
  saffron: "#FF9933", saffronLight: "#FFB347",
  green: "#138808", greenLight: "#1aad0a",
  navy: "#0a0f2e", navyMid: "#111936", navyLight: "#1a2448",
  white: "#FFFFFF", offWhite: "#F0F2FF", muted: "#8892B0",
  border: "rgba(255,153,51,0.18)", glassBg: "rgba(255,255,255,0.04)",
};

// ─── Styles ───────────────────────────────────────────────────────
const styles = {
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 },
  statCard: (accent) => ({ background: C.glassBg, border: `1px solid ${accent}30`, borderRadius: 16, padding: "20px 24px", backdropFilter: "blur(10px)", position: "relative", overflow: "hidden" }),
  statCardAccent: (accent) => ({ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent}, transparent)`, borderRadius: "16px 16px 0 0" }),
  statLabel: { fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: 6, fontWeight: 600 },
  statValue: (color) => ({ fontSize: 30, fontWeight: 800, color: color || C.white, lineHeight: 1, letterSpacing: "-0.02em" }),
  statSub: { fontSize: 12, color: C.muted, marginTop: 4 },
  filterSection: { background: C.glassBg, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px", marginBottom: 24, backdropFilter: "blur(10px)" },
  filterLabel: { fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.saffron, marginBottom: 14, fontWeight: 700 },
  filterGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 },
  selectWrap: { display: "flex", flexDirection: "column", gap: 6 },
  selectInnerLabel: { fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 },
  select: { background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 10, padding: "10px 36px 10px 14px", color: C.white, fontSize: 14, fontFamily: "'Outfit', sans-serif", cursor: "pointer", outline: "none", transition: "border-color 0.2s", WebkitAppearance: "none", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", width: "100%" },
  locationBadge: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,153,51,0.1)", border: `1px solid rgba(255,153,51,0.3)`, borderRadius: 100, padding: "6px 16px", fontSize: 13, color: C.saffron, fontWeight: 600, marginBottom: 24 },
  tableSection: { background: C.glassBg, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden", backdropFilter: "blur(10px)" },
  tableHeader: (isMobile) => ({ display: "grid", gridTemplateColumns: isMobile ? "1fr 80px" : "1fr 80px 130px 110px", padding: isMobile ? "14px 20px" : "14px 24px", background: "rgba(255,153,51,0.08)", borderBottom: `1px solid ${C.border}`, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.saffron, fontWeight: 700 }),
  tableRow: (rank, isMobile) => ({ display: "grid", gridTemplateColumns: isMobile ? "1fr 80px" : "1fr 80px 130px 110px", padding: isMobile ? "16px 20px" : "18px 24px", borderBottom: `1px solid rgba(255,255,255,0.04)`, alignItems: "center", transition: "background 0.2s", background: rank === 0 ? "rgba(255,153,51,0.04)" : "transparent", cursor: "default" }),
  rankBadge: (rank) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginRight: 12, background: rank === 0 ? `linear-gradient(135deg, ${C.saffron}, #f5c518)` : rank === 1 ? "rgba(180,180,180,0.2)" : "rgba(255,255,255,0.06)", color: rank === 0 ? C.navy : C.muted, fontSize: 11, fontWeight: 800 }),
  partyNameCell: { display: "flex", alignItems: "center" },
  partyName: { fontSize: 15, fontWeight: 600, color: C.white },
  progressBar: { height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" },
  progressFill: (pct, rank) => ({ height: "100%", width: `${pct}%`, background: rank === 0 ? `linear-gradient(90deg, ${C.saffron}, ${C.saffronLight})` : `linear-gradient(90deg, ${C.green}, ${C.greenLight})`, borderRadius: 100, transition: "width 1s ease" }),
  skeleton: { height: 60, background: "rgba(255,255,255,0.04)", borderRadius: 8, animation: "pulse 1.5s ease-in-out infinite", marginBottom: 2 },
  turnoutBtn: { display: "flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg, ${C.green}, ${C.greenLight})`, border: "none", borderRadius: 12, padding: "12px 22px", color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", transition: "transform 0.15s, box-shadow 0.15s", boxShadow: `0 4px 20px rgba(19,136,8,0.3)`, fontFamily: "'Outfit', sans-serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal: { background: `linear-gradient(145deg, #111936, #0d1a28)`, border: `1px solid rgba(255,153,51,0.2)`, borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 420, textAlign: "center", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", position: "relative", overflow: "hidden" },
  modalGlow: { position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)", pointerEvents: "none" },
  alert: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,153,51,0.08)", border: `1px solid rgba(255,153,51,0.25)`, borderRadius: 12, padding: "14px 18px", color: C.saffron, fontSize: 14, marginBottom: 20 },
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
};

// ─── Main Component (embeddable — no page shell) ──────────────────
const ViewLiveResultPage = () => {
  const [parties, setParties] = useState([]);
  const [filteredParties, setFilteredParties] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [visibleVoters, setVisibleVoters] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const isMobile = useIsMobile();
  const activeRegionFilterId = selectedWard || "";

  useEffect(() => { fetchAllData(); }, []);
  useEffect(() => { applyRegionFilter(); }, [activeRegionFilterId, parties]);

  useEffect(() => {
    if (!regions.length) { setVisibleVoters(0); return; }
    let count = 0;
    if (!selectedState) count = regions.reduce((s, r) => s + (r.voters?.length || 0), 0);
    else if (selectedWard) { const r = regions.find(r => r._id === selectedWard); count = r?.voters?.length || 0; }
    else if (selectedTaluk) count = regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.taluk === selectedTaluk).reduce((s, r) => s + (r.voters?.length || 0), 0);
    else if (selectedDistrict) count = regions.filter(r => r.state === selectedState && r.district === selectedDistrict).reduce((s, r) => s + (r.voters?.length || 0), 0);
    else count = regions.filter(r => r.state === selectedState).reduce((s, r) => s + (r.voters?.length || 0), 0);
    setVisibleVoters(Math.max(0, Number(count) || 0));
  }, [selectedState, selectedDistrict, selectedTaluk, selectedWard, regions]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [regRes, , resultsRes] = await Promise.all([
        axios.get("http://127.0.0.1:3000/regions"),
        axios.get("http://127.0.0.1:3000/voters"),
        axios.get("http://127.0.0.1:5000/results"),
      ]);
      setRegions(regRes.data.regions || []);
      setParties(resultsRes.data.parties || []);
      setTotalVotes(resultsRes.data.parties.reduce((s, p) => s + Number(p.VoteCount || 0), 0));
    } catch (err) { console.error("Data fetch error:", err); }
    finally { setLoading(false); }
  };

  const applyRegionFilter = () => {
    const filtered = activeRegionFilterId ? parties.filter(p => p.regionId === activeRegionFilterId) : parties;
    setFilteredParties(filtered);
    setTotalVotes(filtered.reduce((s, p) => s + Number(p.VoteCount || 0), 0));
  };

  const resetLowerFilters = (level) => {
    if (level <= 1) setSelectedDistrict("");
    if (level <= 2) setSelectedTaluk("");
    if (level <= 3) setSelectedWard("");
  };

  const votePercentage = visibleVoters > 0 ? Math.min(100, Math.max(0, (totalVotes / visibleVoters) * 100)) : 0;
  const maxVotes = filteredParties.length ? Math.max(...filteredParties.map(p => Number(p.VoteCount || 0))) : 1;
  const sortedParties = [...filteredParties].sort((a, b) => Number(b.VoteCount || 0) - Number(a.VoteCount || 0));

  const getCurrentRegionName = () => {
    if (selectedWard) { const r = regions.find(reg => reg._id === selectedWard); return `Ward ${r?.wardNo || ""} · ${r?.pincode || ""}`; }
    if (selectedTaluk) return `${selectedTaluk} Taluk`;
    if (selectedDistrict) return `${selectedDistrict} District`;
    if (selectedState) return selectedState;
    return "All Regions · National Overview";
  };

  const uniqueStates = [...new Set(regions.map(r => r.state))].sort();
  const uniqueDistricts = selectedState ? [...new Set(regions.filter(r => r.state === selectedState).map(r => r.district))].sort() : [];
  const uniqueTaluks = selectedDistrict ? [...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict).map(r => r.taluk))].sort() : [];
  const wards = selectedTaluk ? regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.taluk === selectedTaluk).map(r => ({ _id: r._id, wardNo: r.wardNo, pincode: r.pincode })) : [];

  const filterConfigs = [
    { label: "State", value: selectedState, onChange: v => { setSelectedState(v); resetLowerFilters(1); }, options: uniqueStates.map(s => ({ val: s, label: s })), placeholder: "All States", disabled: false },
    { label: "District", value: selectedDistrict, onChange: v => { setSelectedDistrict(v); resetLowerFilters(2); }, options: uniqueDistricts.map(d => ({ val: d, label: d })), placeholder: "All Districts", disabled: !selectedState },
    { label: "Taluk", value: selectedTaluk, onChange: v => { setSelectedTaluk(v); resetLowerFilters(3); }, options: uniqueTaluks.map(t => ({ val: t, label: t })), placeholder: "All Taluks", disabled: !selectedDistrict },
    { label: "Ward", value: selectedWard, onChange: v => setSelectedWard(v), options: wards.map(w => ({ val: w._id, label: `Ward ${w.wardNo}${w.pincode ? ` (${w.pincode})` : ""}` })), placeholder: "All Wards", disabled: !selectedTaluk },
  ];

  return (
    // ✅ No page-level shell — renders cleanly inside Dashboard's content card
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fadeIn 0.55s ease forwards; }
        .table-row:hover { background: rgba(255,255,255,0.03) !important; }
        select option { background: #111936; color: white; }
        select:focus { border-color: rgba(255,153,51,0.5) !important; outline: none; }
        .turnout-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(19,136,8,0.45) !important; }
        .close-btn:hover { background: rgba(255,153,51,0.2) !important; }
      `}</style>

      {/* Stat Cards */}
      <div style={styles.statsRow} className="fade-in">
        {[
          { accent: C.saffron, label: "Total Votes Cast", value: totalVotes.toLocaleString(), color: C.white, sub: "across selected region" },
          { accent: C.green, label: "Voter Turnout", value: `${votePercentage.toFixed(1)}%`, color: C.greenLight, sub: `${visibleVoters.toLocaleString()} eligible` },
          { accent: "#4A90D9", label: "Parties in Race", value: filteredParties.length, color: "#90C8F7", sub: "registered & competing" },
          { accent: C.saffronLight, label: "Leading Party", value: sortedParties[0]?.partyName || "—", color: C.saffron, sub: `${(sortedParties[0]?.VoteCount || 0).toLocaleString()} votes`, small: true },
        ].map(({ accent, label, value, color, sub, small }) => (
          <div key={label} style={styles.statCard(accent)}>
            <div style={styles.statCardAccent(accent)} />
            <div style={styles.statLabel}>{label}</div>
            <div style={{ ...styles.statValue(color), fontSize: small ? 20 : 30, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
            <div style={styles.statSub}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.filterLabel}>⬡ Filter by Region</div>
        <div style={styles.filterGrid}>
          {filterConfigs.map(({ label, value, onChange, options, placeholder, disabled }) => (
            <div key={label} style={styles.selectWrap}>
              <div style={styles.selectInnerLabel}>{label}</div>
              <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
                style={{ ...styles.select, opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Region badge + Turnout button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={styles.locationBadge}>
          <span>📍</span><span>{getCurrentRegionName()}</span>
        </div>
        <button style={styles.turnoutBtn} className="turnout-btn" onClick={() => setOpen(true)}>
          <span>📊</span> View Turnout
        </button>
      </div>

      {/* Alert */}
      {activeRegionFilterId && filteredParties.length === 0 && !loading && (
        <div style={styles.alert}><span>ℹ️</span> No votes have been recorded in this ward yet.</div>
      )}

      {/* Results Table */}
      <div style={styles.tableSection}>
        <div style={styles.tableHeader(isMobile)}>
          <span>Party</span>
          {!isMobile && <span style={{ textAlign: "center" }}>Symbol</span>}
          <span style={{ textAlign: "right" }}>Votes</span>
          {!isMobile && <span style={{ paddingLeft: 16 }}>Share</span>}
        </div>

        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ padding: "12px 24px" }}><div style={styles.skeleton} /></div>
          ))
        ) : sortedParties.length === 0 ? (
          <div style={{ padding: "52px 24px", textAlign: "center", color: C.muted, fontSize: 15 }}>
            No results available for this region.
          </div>
        ) : (
          sortedParties.map((party, rank) => {
            const count = Number(party.VoteCount || 0);
            const pct = maxVotes > 0 ? (count / maxVotes) * 100 : 0;
            const totalPct = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : "0.0";
            return (
              <div key={party._id} style={styles.tableRow(rank, isMobile)} className="table-row">
                <div style={styles.partyNameCell}>
                  <div style={styles.rankBadge(rank)}>{rank + 1}</div>
                  <div>
                    <div style={styles.partyName}>{party.partyName}</div>
                    {isMobile && (
                      <>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{party.partySymbol || "—"} · {totalPct}% share</div>
                        <div style={{ ...styles.progressBar, marginTop: 6, width: "100%" }}>
                          <div style={styles.progressFill(pct, rank)} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {!isMobile && <div style={{ fontSize: 22, textAlign: "center" }}>{party.partySymbol || "—"}</div>}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{count.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{totalPct}%</div>
                </div>
                {!isMobile && (
                  <div style={{ paddingLeft: 16 }}>
                    <div style={styles.progressBar}><div style={styles.progressFill(pct, rank)} /></div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Turnout Modal */}
      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalGlow} />
            <div style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: C.saffron, marginBottom: 8, fontWeight: 700 }}>Voter Turnout</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 24 }}>{getCurrentRegionName()}</div>
            <div style={{ fontSize: 64, fontWeight: 900, color: C.greenLight, lineHeight: 1, letterSpacing: "-0.03em" }}>{votePercentage.toFixed(1)}%</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 24, marginTop: 4 }}>{totalVotes.toLocaleString()} of {visibleVoters.toLocaleString()} voters</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[{ name: "Voted", value: Math.max(votePercentage, 0.01) }, { name: "Not Voted", value: Math.max(100 - votePercentage, 0.01) }]}
                  dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} startAngle={90} endAngle={-270}>
                  <Cell fill={C.green} /><Cell fill="rgba(255,255,255,0.06)" />
                </Pie>
                <Tooltip contentStyle={{ background: C.navyMid, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white, fontSize: 13 }} formatter={v => [`${Number(v).toFixed(1)}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 8 }}>
              {[{ color: C.green, label: "Voted" }, { color: "rgba(255,255,255,0.15)", label: "Not Voted" }].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.muted }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />{label}
                </div>
              ))}
            </div>
            <button style={{ marginTop: 24, background: "rgba(255,153,51,0.12)", border: `1px solid rgba(255,153,51,0.3)`, borderRadius: 10, padding: "11px 28px", color: C.saffron, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background 0.2s", letterSpacing: "0.05em" }}
              className="close-btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLiveResultPage;