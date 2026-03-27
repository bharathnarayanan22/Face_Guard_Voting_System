import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000", { path: "/socket.io", transports: ["websocket"] });

const C = {
  saffron: "#FF9933", saffronLight: "#FFB347",
  green: "#138808", greenLight: "#1aad0a",
  navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0",
  red: "#FF6B6B", amber: "#FFB347",
};

const Lbl = ({ children }) => (
  <span style={{ fontSize: 11, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6, display: "block" }}>
    {children}
  </span>
);

const SelectField = ({ label, value, onChange, options, disabled }) => (
  <div>
    <Lbl>{label}</Lbl>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 36px 11px 14px", color: "#fff", fontSize: 14, fontFamily: "'Outfit',sans-serif", width: "100%", outline: "none", opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", WebkitAppearance: "none", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}>
      <option value="">Select {label}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

/* ─── OTP 6-box input ────────────────────────────────────────────────────── */
const OtpInput = ({ value, onChange, hasError, refs, onEnter }) => {
  const handleChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...value]; n[i] = v; onChange(n);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "Enter" && value.every(d => d)) onEnter?.();
  };
  const handlePaste = e => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p.length === 6) { onChange(p.split("")); refs.current[5]?.focus(); }
  };
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }} onPaste={handlePaste}>
      {value.map((d, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          className={`otp-box${d ? " filled" : ""}${hasError ? " err" : ""}`} />
      ))}
    </div>
  );
};

const Dots = ({ left, max = 3 }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
    {[...Array(max)].map((_, i) => (
      <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", transition: "background .3s", background: i < left ? "rgba(255,153,51,.7)" : "rgba(255,107,107,.4)", border: `1px solid ${i < left ? "rgba(255,153,51,.4)" : "rgba(255,107,107,.3)"}` }} />
    ))}
    <span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>{left} attempt{left !== 1 ? "s" : ""} left</span>
  </div>
);

const Msg = ({ text, err }) => !text ? null : (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: err ? "rgba(255,107,107,.1)" : "rgba(19,136,8,.1)", border: `1px solid ${err ? "rgba(255,107,107,.3)" : "rgba(19,136,8,.3)"}`, borderRadius: 10, padding: "11px 14px", color: err ? C.red : "#4CAF50", fontSize: 13 }}>
    <span style={{ flexShrink: 0 }}>{err ? "⚠️" : "✓"}</span><span>{text}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   OTP POPUP MODAL
   ═══════════════════════════════════════════════════════════════════════════ */
const OtpModal = ({ voterData, onSuccess, onClose }) => {
  const [mode, setMode]             = useState(voterData?.smsSent ? "sms" : "slip");
  const [otp, setOtp]               = useState(["", "", "", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpMsg, setOtpMsg]         = useState(voterData?.smsSent ? `OTP sent to ${voterData.maskedPhone}` : "SMS unavailable — use printed slip");
  const [otpErr, setOtpErr]         = useState(!voterData?.smsSent);
  const [otpLeft, setOtpLeft]       = useState(3);
  const [countdown, setCountdown]   = useState(300);
  const [resendCD, setResendCD]     = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  const [slipCode, setSlipCode]     = useState("");
  const [supPin, setSupPin]         = useState("");
  const [showPin, setShowPin]       = useState(false);
  const [slipLoading, setSlipLoading] = useState(false);
  const [slipMsg, setSlipMsg]       = useState("");
  const [slipErr, setSlipErr]       = useState(false);
  const [slipLeft, setSlipLeft]     = useState(3);

  const otpRefs   = useRef([]);
  const cdRef     = useRef(null);
  const resendRef = useRef(null);

  useEffect(() => {
    if (mode !== "sms" || !voterData?.smsSent) return;
    cdRef.current = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(cdRef.current); setOtpMsg("OTP expired. Please resend."); setOtpErr(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(cdRef.current);
  }, [mode]);

  useEffect(() => {
    if (mode === "sms") setTimeout(() => otpRefs.current[0]?.focus(), 80);
  }, [mode]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startResendCD = () => {
    setResendCD(30);
    resendRef.current = setInterval(() => setResendCD(p => { if (p <= 1) { clearInterval(resendRef.current); return 0; } return p - 1; }), 1000);
  };

  /* ── SMS verify ── */
  const handleOtpVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setOtpLoading(true); setOtpMsg(""); setOtpErr(false);
    try {
      await axios.post("http://127.0.0.1:5000/verify-otp", { voterId: voterData.voterId, otp: code });
      setOtpMsg("✓ OTP verified! Unlocking…"); setOtpErr(false);
      setTimeout(onSuccess, 900);
    } catch (err) {
      const e = err.response?.data;
      setOtpMsg(e?.message || e?.error || "Verification failed."); setOtpErr(true);
      if (e?.remaining !== undefined) setOtpLeft(e.remaining);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 60);
    } finally { setOtpLoading(false); }
  };

  /* ── Resend ── */
  const handleResend = async () => {
    if (resendCD > 0) return;
    setResendLoading(true); setOtpMsg("");
    try {
      const res = await axios.post("http://127.0.0.1:5000/resend-otp", { voterId: voterData.voterId });
      setOtpMsg(res.data.smsSent ? `New OTP sent to ${voterData.maskedPhone}` : "SMS failed again. Switch to slip mode.");
      setOtpErr(!res.data.smsSent);
      setOtp(["", "", "", "", "", ""]); setOtpLeft(3); setCountdown(300);
      startResendCD(); setTimeout(() => otpRefs.current[0]?.focus(), 60);
    } catch { setOtpMsg("Failed to resend."); setOtpErr(true); }
    finally { setResendLoading(false); }
  };

  /* ── Slip verify ── */
  const handleSlipVerify = async () => {
    if (!slipCode.trim() || !supPin.trim()) { setSlipMsg("Both fields are required."); setSlipErr(true); return; }
    setSlipLoading(true); setSlipMsg(""); setSlipErr(false);
    try {
      await axios.post("http://127.0.0.1:5000/verify-slip", {
        voterId:       voterData.voterId,
        supervisorPin: supPin.trim(),
        // send as-is — backend strips dashes automatically
        slipCode:      slipCode.trim(),
      });
      setSlipMsg("✓ Slip verified! Unlocking…"); setSlipErr(false);
      setTimeout(onSuccess, 900);
    } catch (err) {
      const e = err.response?.data;
      setSlipMsg(e?.error || "Verification failed."); setSlipErr(true);
      if (e?.remaining !== undefined) setSlipLeft(e.remaining);
      setSlipCode("");
    } finally { setSlipLoading(false); }
  };

  const otpFilled = otp.every(d => d);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(4,8,28,.85)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={e => e.target === e.currentTarget && onClose?.()}>

      <div className="modal-pop" style={{ width: "100%", maxWidth: 440, background: "linear-gradient(145deg,#0d1535,#0a1220)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,153,51,.08)" }}>
        <div style={{ height: 3, background: mode === "sms" ? `linear-gradient(90deg,${C.saffron},${C.saffronLight},transparent)` : `linear-gradient(90deg,${C.amber},transparent)` }} />

        <div style={{ padding: "26px 28px 30px" }}>

          {/* Voter chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,153,51,.07)", border: "1px solid rgba(255,153,51,.18)", borderRadius: 12, padding: "12px 16px", marginBottom: 22 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#FF9933,#FFB347)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>✓</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.white, textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{voterData?.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>Face verified · Second factor required</div>
            </div>
            {mode === "sms" && voterData?.smsSent && (
              <div style={{ background: countdown < 60 ? "rgba(255,107,107,.15)" : "rgba(255,255,255,.05)", border: `1px solid ${countdown < 60 ? "rgba(255,107,107,.3)" : "rgba(255,255,255,.1)"}`, borderRadius: 8, padding: "4px 10px", textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: countdown < 60 ? C.red : C.saffron, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{fmt(countdown)}</div>
                <div style={{ fontSize: 8, color: C.muted, textTransform: "uppercase", letterSpacing: ".08em" }}>expires</div>
              </div>
            )}
          </div>

          {/* Mode tabs */}
          <div style={{ display: "flex", background: "rgba(255,255,255,.04)", borderRadius: 10, padding: 3, marginBottom: 22, gap: 3 }}>
            {[{ key: "sms", icon: "📱", label: "SMS OTP" }, { key: "slip", icon: "🪪", label: "Printed Slip" }].map(tab => (
              <button key={tab.key} onClick={() => setMode(tab.key)}
                style={{ flex: 1, border: "none", borderRadius: 8, padding: "9px 0", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, transition: "all .2s", background: mode === tab.key ? (tab.key === "sms" ? "rgba(255,153,51,.18)" : "rgba(255,183,71,.15)") : "transparent", color: mode === tab.key ? (tab.key === "sms" ? C.saffron : C.amber) : C.muted, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* ── SMS OTP PANEL ── */}
          {mode === "sms" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Enter the 6-digit OTP</div>
                <div style={{ fontSize: 13, color: C.muted }}>{voterData?.smsSent ? `Sent to ${voterData.maskedPhone}` : "SMS could not be delivered"}</div>
              </div>
              <OtpInput value={otp} onChange={setOtp} hasError={otpErr} refs={otpRefs} onEnter={handleOtpVerify} />
              <Dots left={otpLeft} />
              <Msg text={otpMsg} err={otpErr} />
              <button onClick={handleOtpVerify} disabled={!otpFilled || otpLoading} className="primary-btn"
                style={{ width: "100%", border: "none", borderRadius: 11, padding: "13px", background: (!otpFilled || otpLoading) ? "rgba(255,153,51,.3)" : "linear-gradient(135deg,#FF9933,#FFB347)", color: C.navy, fontSize: 15, fontWeight: 800, cursor: (!otpFilled || otpLoading) ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {otpLoading ? <><div className="spin" />Verifying…</> : "🔐 Verify OTP"}
              </button>
              <div style={{ textAlign: "center", fontSize: 13 }}>
                <span style={{ color: C.muted }}>Didn't receive it? </span>
                <button onClick={handleResend} disabled={resendCD > 0 || resendLoading}
                  style={{ background: "none", border: "none", cursor: resendCD > 0 ? "not-allowed" : "pointer", color: resendCD > 0 ? C.muted : C.saffron, fontWeight: 600, fontFamily: "'Outfit',sans-serif", fontSize: 13, padding: 0 }}>
                  {resendLoading ? "Sending…" : resendCD > 0 ? `Resend in ${resendCD}s` : "Resend OTP"}
                </button>
              </div>
              <div style={{ textAlign: "center", fontSize: 12, color: C.muted }}>
                SIM changed or no signal?{" "}
                <button onClick={() => setMode("slip")} style={{ background: "none", border: "none", cursor: "pointer", color: C.amber, fontWeight: 600, fontFamily: "'Outfit',sans-serif", fontSize: 12, padding: 0, textDecoration: "underline dotted" }}>
                  Use printed slip instead
                </button>
              </div>
            </div>
          )}

          {/* ── SLIP CODE PANEL ── */}
          {mode === "slip" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "rgba(255,183,71,.07)", border: "1px solid rgba(255,183,71,.22)", borderRadius: 10, padding: "11px 14px", fontSize: 12, color: C.amber, lineHeight: 1.6 }}>
                📋 Voter presents the <strong>printed registration slip</strong>. Supervisor must enter their PIN to authorise this fallback.
              </div>

              {/* Slip code input */}
              <div>
                <Lbl>Slip Code (from printed slip)</Lbl>
                <input
                  type="text" maxLength={13}
                  placeholder="e.g. AWLBBAM9KX or AWLB-BA-M9KX"
                  value={slipCode}
                  onChange={e => setSlipCode(e.target.value.toUpperCase())}
                  style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", outline: "none", letterSpacing: "0.12em", textTransform: "uppercase" }}
                  onFocus={e => e.target.style.borderColor = "rgba(255,183,71,.6)"}
                  onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
                {/* ── hint about dashes ── */}
                <div style={{ fontSize: 11, color: C.muted, marginTop: 5 }}>
                  Dashes are optional — type with or without them
                </div>
              </div>

              {/* Supervisor PIN */}
              <div>
                <Lbl>Supervisor PIN</Lbl>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPin ? "text" : "password"}
                    placeholder="Enter supervisor PIN"
                    value={supPin}
                    onChange={e => setSupPin(e.target.value)}
                    style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "12px 44px 12px 14px", color: "#fff", fontSize: 15, fontFamily: "'Outfit',sans-serif", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,107,107,.5)"}
                    onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,.1)"} />
                  <button onClick={() => setShowPin(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.muted, padding: 0, lineHeight: 1 }}>
                    {showPin ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <Dots left={slipLeft} />
              <Msg text={slipMsg} err={slipErr} />

              <button onClick={handleSlipVerify} disabled={!slipCode.trim() || !supPin.trim() || slipLoading} className="primary-btn"
                style={{ width: "100%", border: "none", borderRadius: 11, padding: "13px", background: (!slipCode.trim() || !supPin.trim() || slipLoading) ? "rgba(255,183,71,.3)" : "linear-gradient(135deg,#FFB347,#FF9933)", color: C.navy, fontSize: 15, fontWeight: 800, cursor: (!slipCode.trim() || !supPin.trim() || slipLoading) ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {slipLoading ? <><div className="spin" />Verifying…</> : "🔏 Verify Slip Code"}
              </button>

              {voterData?.smsSent && (
                <div style={{ textAlign: "center" }}>
                  <button onClick={() => setMode("sms")} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontFamily: "'Outfit',sans-serif", fontSize: 12, textDecoration: "underline", padding: 0 }}>
                    ← Back to SMS OTP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN VERIFICATION SCREEN
   ═══════════════════════════════════════════════════════════════════════════ */
const VerificationScreen = () => {
  const webcamRef = useRef(null);

  const [regions, setRegions]                   = useState([]);
  const [states, setStates]                     = useState([]);
  const [districts, setDistricts]               = useState([]);
  const [zones, setZones]                       = useState([]);
  const [taluks, setTaluks]                     = useState([]);
  const [wards, setWards]                       = useState([]);
  const [pincodes, setPincodes]                 = useState([]);
  const [selectedState, setSelectedState]       = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedZone, setSelectedZone]         = useState("");
  const [selectedTaluk, setSelectedTaluk]       = useState("");
  const [selectedWard, setSelectedWard]         = useState("");
  const [selectedPincode, setSelectedPincode]   = useState("");

  const [cameraReady, setCameraReady]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [faceResult, setFaceResult]     = useState("");
  const [faceErr, setFaceErr]           = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [voterData, setVoterData]       = useState(null);
  const [verifySuccess, setVerifySuccess] = useState(false);

  /* ── Load regions ── */
  useEffect(() => {
    axios.get("http://127.0.0.1:3000/regions").then(res => {
      const r = res.data.regions || [];
      setRegions(r);
      setStates([...new Set(r.map(x => x.state))].sort().map(v => ({ value: v, label: v })));
    }).catch(() => {});
  }, []);

  /* ── Type-safe cascading filter ── */
  const filtered = (key, filters) => {
    const result = regions.filter(r =>
      filters.every(([field, selected]) => !selected || String(r[field]) === String(selected))
    );
    const unique = [...new Set(result.map(r => r[key]))].sort((a, b) =>
      isNaN(a) ? String(a).localeCompare(String(b)) : Number(a) - Number(b)
    );
    return unique.map(v => ({ value: String(v), label: String(v) }));
  };

  useEffect(() => { setDistricts(filtered("district", [["state", selectedState]])); setSelectedDistrict(""); }, [selectedState, regions]);
  useEffect(() => { setZones(filtered("zone", [["state", selectedState], ["district", selectedDistrict]])); setSelectedZone(""); }, [selectedDistrict, regions]);
  useEffect(() => { setTaluks(filtered("taluk", [["state", selectedState], ["district", selectedDistrict], ["zone", selectedZone]])); setSelectedTaluk(""); }, [selectedZone, regions]);
  useEffect(() => { setWards(filtered("wardNo", [["state", selectedState], ["district", selectedDistrict], ["zone", selectedZone], ["taluk", selectedTaluk]])); setSelectedWard(""); }, [selectedTaluk, regions]);
  useEffect(() => { setPincodes(filtered("pincode", [["state", selectedState], ["district", selectedDistrict], ["zone", selectedZone], ["taluk", selectedTaluk], ["wardNo", selectedWard]])); setSelectedPincode(""); }, [selectedWard, regions]);

  /* ── Socket events ── */
  useEffect(() => {
    socket.on("faceVerified", data => {
      setVoterData(data);
      setShowModal(true);
      setFaceResult(`Face recognised: ${data.name}. Enter the OTP to proceed.`);
      setFaceErr(false);
    });
    socket.on("verifiedVoter", () => {
      setShowModal(false);
      setVerifySuccess(true);
      setFaceResult("Identity fully verified. Voting interface is now unlocked.");
      setFaceErr(false);
    });
    socket.on("lockVoting", () => {
      setVerifySuccess(false);
      setVoterData(null);
      setFaceResult("");
    });
    return () => { socket.off("faceVerified"); socket.off("verifiedVoter"); socket.off("lockVoting"); };
  }, []);

  /* ── Face verify ── */
  const verifyFace = async () => {
    const img = webcamRef.current?.getScreenshot();
    if (!img) { setFaceResult("Camera not ready."); setFaceErr(true); return; }
    setLoading(true); setFaceResult(""); setFaceErr(false); setVerifySuccess(false);
    try {
      const res = await axios.post("http://127.0.0.1:5000/recognize", {
        image: img.split(",")[1],
        region: {
          state:    selectedState    || undefined,
          district: selectedDistrict || undefined,
          zone:     selectedZone     || undefined,
          taluk:    selectedTaluk    || undefined,
          wardNo:   selectedWard    ? Number(selectedWard)   : undefined,
          pincode:  selectedPincode  || undefined,
        },
      });
      if (res.data.message === "Already voted") { setFaceResult("You have already cast your vote."); setFaceErr(true); }
      else if (res.data.message === "Region mismatch") { setFaceResult("Voter does not belong to the selected region."); setFaceErr(true); }
    } catch (err) {
      setFaceResult(err.response?.data?.error || "Face not recognised. Please try again."); setFaceErr(true);
    } finally { setLoading(false); }
  };

  /* ── Render ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f2e; }

        @keyframes fadeUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalPop    { 0%{opacity:0;transform:scale(.93) translateY(12px)} 60%{transform:scale(1.01)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes pulse2      { 0%,100%{box-shadow:0 0 0 0 rgba(255,153,51,.35)} 50%{box-shadow:0 0 0 8px rgba(255,153,51,0)} }
        @keyframes scanline    { 0%{top:-10%} 100%{top:110%} }
        @keyframes spin        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shake       { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
        @keyframes successGlow { 0%,100%{box-shadow:0 0 0 0 rgba(19,136,8,.4)} 50%{box-shadow:0 0 24px 4px rgba(19,136,8,.2)} }

        .fade-up  { animation: fadeUp .5s ease both; }
        .fade-up2 { animation: fadeUp .5s .1s ease both; }
        .fade-up3 { animation: fadeUp .5s .2s ease both; }

        .otp-box {
          width: 48px; height: 58px; border-radius: 11px;
          background: rgba(255,255,255,.05); border: 2px solid rgba(255,255,255,.12);
          color: #fff; font-size: 24px; font-weight: 800; text-align: center;
          font-family: 'Outfit',sans-serif; outline: none; caret-color: #FF9933;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .otp-box:focus  { border-color: rgba(255,153,51,.7); box-shadow: 0 0 0 3px rgba(255,153,51,.12); }
        .otp-box.filled { border-color: rgba(255,153,51,.4); background: rgba(255,153,51,.08); }
        .otp-box.err    { animation: shake .35s ease; border-color: rgba(255,107,107,.6); }

        .modal-pop { animation: modalPop .35s cubic-bezier(.34,1.56,.64,1) both; }

        .primary-btn { transition: transform .15s, box-shadow .15s; }
        .primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(255,153,51,.35) !important; }
        .primary-btn:disabled { opacity: .5; }

        .verify-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,153,51,.35) !important; }
        .verify-btn:disabled { opacity: .5; cursor: not-allowed; }

        .spin { width:17px; height:17px; border:2px solid rgba(10,15,46,.3); border-top:2px solid #0a0f2e; border-radius:50%; animation:spin .8s linear infinite; flex-shrink:0; }

        select option { background:#111936; color:#fff; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,153,51,.25); border-radius:3px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.navy} 0%,#0d1535 50%,#0a1a10 100%)`, fontFamily: "'Outfit',sans-serif", color: C.white, position: "relative", overflow: "hidden" }}>

        {/* BG blobs */}
        <div style={{ position: "fixed", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,153,51,.07) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(19,136,8,.06) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,153,51,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,153,51,.025) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "32px 20px 48px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }} className="fade-up">
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
              {[C.saffron, C.white, C.green].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 12px ${c}` }} />)}
            </div>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.saffron, marginBottom: 8, fontWeight: 700 }}>Election Commission of India</div>
            <h1 style={{ fontSize: "clamp(24px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.02em", background: `linear-gradient(135deg,${C.saffron},${C.white} 45%,${C.greenLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6 }}>
              Voter Verification System
            </h1>
            <p style={{ fontSize: 14, color: C.muted }}>Biometric face recognition · OTP second-factor · Region authentication</p>
          </div>

          {/* Two-panel grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24, alignItems: "start" }}>

            {/* Camera panel */}
            <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, overflow: "hidden", ...(verifySuccess ? { animation: "successGlow 2s ease-in-out infinite" } : {}) }} className="fade-up2">
              <div style={{ height: 3, background: verifySuccess ? `linear-gradient(90deg,${C.green},transparent)` : `linear-gradient(90deg,${C.saffron},transparent)` }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,153,51,.12)", border: "1px solid rgba(255,153,51,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📷</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Live Camera Feed</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Position face within frame</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.green, fontWeight: 600 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse2 2s infinite" }} />
                    LIVE
                  </div>
                </div>

                <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: `2px solid ${verifySuccess ? "rgba(19,136,8,.6)" : "rgba(255,153,51,.3)"}`, background: "#000", aspectRatio: "4/3", transition: "border-color .4s" }}>
                  <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" onUserMedia={() => setCameraReady(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {["top-left","top-right","bottom-left","bottom-right"].map(corner => {
                    const t = corner.includes("top"), l = corner.includes("left"), col = verifySuccess ? C.green : C.saffron;
                    return <div key={corner} style={{ position: "absolute", [t?"top":"bottom"]: 12, [l?"left":"right"]: 12, width: 20, height: 20, borderTop: t ? `2px solid ${col}` : "none", borderBottom: !t ? `2px solid ${col}` : "none", borderLeft: l ? `2px solid ${col}` : "none", borderRight: !l ? `2px solid ${col}` : "none", transition: "border-color .4s" }} />;
                  })}
                  {loading && <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${C.saffron},transparent)`, animation: "scanline 1.5s linear infinite", top: 0 }} />}
                  {verifySuccess && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(19,136,8,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(19,136,8,.3)", border: "2px solid rgba(19,136,8,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>✓</div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14, fontSize: 12, color: cameraReady ? C.green : C.muted }}>
                  {cameraReady ? "✓ Camera ready" : "⌛ Initialising camera…"}
                </div>
              </div>
            </div>

            {/* Verification panel */}
            <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, overflow: "hidden" }} className="fade-up3">
              <div style={{ height: 3, background: `linear-gradient(90deg,${C.green},transparent)` }} />
              <div style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(19,136,8,.12)", border: "1px solid rgba(19,136,8,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🗺️</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Voter Verification</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Select region · Scan face · Enter OTP</div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>⬡ Region Filter (Optional)</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <SelectField label="State"    value={selectedState}    onChange={setSelectedState}    options={states} />
                  <SelectField label="District" value={selectedDistrict} onChange={setSelectedDistrict} options={districts} disabled={!selectedState} />
                  <SelectField label="Zone"     value={selectedZone}     onChange={setSelectedZone}     options={zones}     disabled={!selectedDistrict} />
                  <SelectField label="Taluk"    value={selectedTaluk}    onChange={setSelectedTaluk}    options={taluks}    disabled={!selectedZone} />
                  <SelectField label="Ward No"  value={selectedWard}     onChange={setSelectedWard}     options={wards}     disabled={!selectedTaluk} />
                  <SelectField label="Pincode"  value={selectedPincode}  onChange={setSelectedPincode}  options={pincodes}  disabled={!selectedWard} />
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", marginBottom: 20 }} />

                <button onClick={verifyFace} disabled={loading || !cameraReady || verifySuccess} className="verify-btn"
                  style={{ width: "100%", background: (loading || !cameraReady || verifySuccess) ? "rgba(255,153,51,.35)" : "linear-gradient(135deg,#FF9933,#FFB347)", border: "none", borderRadius: 12, padding: 14, color: C.navy, fontSize: 15, fontWeight: 800, cursor: (loading || !cameraReady || verifySuccess) ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 20px rgba(255,153,51,.25)", transition: "transform .15s,box-shadow .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {loading ? <><div className="spin" style={{ borderTopColor: "#0a0f2e" }} />Scanning Face…</> : verifySuccess ? "✓ Fully Verified" : "🔍 Verify Face"}
                </button>

                {faceResult && (
                  <div style={{ marginTop: 14, display: "flex", alignItems: "flex-start", gap: 10, background: faceErr ? "rgba(255,107,107,.1)" : "rgba(19,136,8,.1)", border: `1px solid ${faceErr ? "rgba(255,107,107,.3)" : "rgba(19,136,8,.3)"}`, borderRadius: 12, padding: "13px 16px", color: faceErr ? C.red : "#4CAF50", fontSize: 14 }}>
                    <span style={{ flexShrink: 0, fontSize: 18 }}>{faceErr ? "⚠️" : "✓"}</span>
                    <span>{faceResult}</span>
                  </div>
                )}

                <div style={{ marginTop: 20, background: "rgba(255,255,255,.03)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>How it works</div>
                  {[
                    ["1", "Optionally select region to narrow the search"],
                    ["2", "Ensure face is clearly visible in the camera"],
                    ["3", "Click Verify Face — an OTP popup will appear"],
                    ["4", "Enter the OTP sent to your registered mobile"],
                    ["5", "No SMS? Switch to printed slip fallback"],
                  ].map(([n, t]) => (
                    <div key={n} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 12, color: C.muted, alignItems: "flex-start" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,153,51,.15)", border: "1px solid rgba(255,153,51,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.saffron, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{n}</div>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 36, color: C.muted, fontSize: 12 }}>
            🇮🇳 &nbsp;Election Commission of India · Biometric + OTP Dual-Factor Authentication
          </div>
        </div>

        {showModal && voterData && (
          <OtpModal voterData={voterData} onSuccess={() => setShowModal(false)} onClose={() => setShowModal(false)} />
        )}
      </div>
    </>
  );
};

export default VerificationScreen;