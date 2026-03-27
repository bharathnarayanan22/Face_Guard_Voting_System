import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const C = {
  saffron: "#FF9933", green: "#138808", navy: "#0a0f2e",
  white: "#FFFFFF", muted: "#8892B0",
};

const field = {
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14,
  fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none", transition: "border-color 0.2s",
};
const sel = {
  ...field, WebkitAppearance: "none", appearance: "none", cursor: "pointer", paddingRight: 36,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "12px",
};
const lbl = {
  fontSize: 11, color: "#8892B0", letterSpacing: "0.12em", textTransform: "uppercase",
  fontWeight: 600, marginBottom: 6, display: "block",
};

const focusOn  = e => { e.target.style.borderColor = "rgba(255,153,51,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,153,51,0.08)"; };
const focusOff = e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; };

const TF = ({ label, value, onChange, type = "text", disabled = false, placeholder }) => (
  <div>
    <label style={lbl}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder || label} disabled={disabled}
      style={{ ...field, opacity: disabled ? 0.4 : 1 }} onFocus={focusOn} onBlur={focusOff} />
  </div>
);

const SF = ({ label, value, onChange, options, disabled = false }) => (
  <div>
    <label style={lbl}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      style={{ ...sel, opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <option value="">Select {label}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const SectionHead = ({ text }) => (
  <div style={{ fontSize: 11, color: "#FF9933", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16, borderTop: text !== "Personal Info" ? "1px solid rgba(255,153,51,0.15)" : "none", paddingTop: text !== "Personal Info" ? 20 : 0 }}>
    ⬡ {text}
  </div>
);


// ─────────────────────────────────────────────────────────────────────────────
// SLIP PRINT MODAL
// Shows the slip code after enrollment and lets the officer print it.
// The code is never shown again after this modal is closed.
// ─────────────────────────────────────────────────────────────────────────────
const SlipModal = ({ slipData, onClose }) => {
  const { voterName, voterId, slipCode, region } = slipData;

  // Format code with dashes for readability: ABCD-EF-GHIJ
  const fmt = c => c.length === 10 ? `${c.slice(0,4)}-${c.slice(4,6)}-${c.slice(6)}` : c;

  const handlePrint = () => {
    const now = new Date().toLocaleString("en-IN");
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Voter Slip – ${voterName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@600;700&family=IBM+Plex+Sans:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'IBM Plex Sans', sans-serif; background: #f0f0f0; display: flex; justify-content: center; padding: 30px; }
    .slip { width: 90mm; background: #fff; border: 2px solid #111; border-radius: 4px; overflow: hidden; }
    .stripe { display: flex; height: 7px; }
    .s1 { flex:1; background:#FF9933; } .s2 { flex:1; background:#fff; border-top:1px solid #ddd; border-bottom:1px solid #ddd; } .s3 { flex:1; background:#138808; }
    .header { padding: 12px 14px 10px; text-align: center; border-bottom: 1.5px dashed #ccc; }
    .eci { font-size: 8px; letter-spacing: .2em; text-transform: uppercase; color: #666; margin-bottom: 3px; font-weight: 600; }
    .title { font-size: 13px; font-weight: 700; color: #111; }
    .body { padding: 12px 14px; }
    .field { margin-bottom: 8px; }
    .fl { font-size: 8px; text-transform: uppercase; letter-spacing: .12em; color: #888; font-weight: 600; margin-bottom: 2px; }
    .fv { font-size: 13px; font-weight: 700; color: #111; text-transform: capitalize; }
    .fv.mono { font-family: 'IBM Plex Mono', monospace; font-size: 11px; text-transform: uppercase; color: #333; }
    .code-box { margin: 12px 0; background: #f7f7f7; border: 2px dashed #bbb; border-radius: 4px; padding: 12px; text-align: center; }
    .code-lbl { font-size: 8px; text-transform: uppercase; letter-spacing: .2em; color: #888; margin-bottom: 8px; font-weight: 600; }
    .code { font-family: 'IBM Plex Mono', monospace; font-size: 22px; font-weight: 700; color: #111; letter-spacing: .15em; }
    .code-hint { font-size: 9px; color: #666; margin-top: 6px; line-height: 1.5; }
    .warn { background: #fff8e6; border: 1px solid #ffd666; border-radius: 3px; padding: 7px 10px; font-size: 9px; color: #7a5600; line-height: 1.5; margin-bottom: 8px; }
    .footer { padding: 8px 14px 12px; border-top: 1.5px dashed #ccc; text-align: center; font-size: 8px; color: #aaa; line-height: 1.6; }
    .cut { display: flex; align-items: center; gap: 4px; padding: 5px 8px; font-size: 8px; color: #bbb; border-top: 1px dashed #ccc; }
    @media print { body { background: #fff; padding: 0; } .slip { box-shadow: none; border: 1px solid #000; } @page { margin: 4mm; size: 90mm auto; } }
  </style>
</head>
<body>
<div class="slip">
  <div class="stripe"><div class="s1"></div><div class="s2"></div><div class="s3"></div></div>
  <div class="header">
    <div class="eci">Election Commission of India</div>
    <div class="title">Voter Registration Slip</div>
  </div>
  <div class="body">
    <div class="field"><div class="fl">Voter Name</div><div class="fv">${voterName}</div></div>
    <div class="field"><div class="fl">Voter ID (System)</div><div class="fv mono">${voterId}</div></div>
    ${region ? `<div class="field"><div class="fl">Region</div><div class="fv">${region}</div></div>` : ""}
    <div class="code-box">
      <div class="code-lbl">🔐 Verification Slip Code</div>
      <div class="code">${fmt(slipCode)}</div>
      <div class="code-hint">Present this slip if SMS OTP cannot<br/>be delivered to your mobile number.</div>
    </div>
    <div class="warn">
      <strong>⚠ Important:</strong> Keep this slip safe and private.
      Valid for <strong>one use only</strong>. Do <strong>NOT</strong> share with anyone.
      A supervisor must be present to use slip verification.
    </div>
  </div>
  <div class="footer">Issued: ${now}<br/>Misuse of this slip is a criminal offence under election law.</div>
  <div class="cut">✂ ─────────────── Keep this slip safely ───────────────</div>
</div>
<script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=400,height=600");
    win.document.write(html);
    win.document.close();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(4,8,28,.88)", backdropFilter: "blur(14px)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "linear-gradient(145deg,#0d1535,#0a1220)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>

        {/* Top bar */}
        <div style={{ height: 3, background: "linear-gradient(90deg,#138808,transparent)" }} />

        <div style={{ padding: "26px 28px 30px" }}>

          {/* Success chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(19,136,8,.1)", border: "1px solid rgba(19,136,8,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#138808,#1aad0a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>✓</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.white, textTransform: "capitalize" }}>{voterName}</div>
              <div style={{ fontSize: 12, color: "#4CAF50", marginTop: 2 }}>Voter enrolled successfully</div>
            </div>
          </div>

          {/* Warning */}
          <div style={{ background: "rgba(255,183,71,.08)", border: "1px solid rgba(255,183,71,.3)", borderRadius: 10, padding: "11px 14px", fontSize: 12, color: "#FFB347", lineHeight: 1.6, marginBottom: 20 }}>
            ⚠️ <strong>Print this slip immediately.</strong> The slip code is shown only once and is never stored. If you close without printing, it cannot be recovered.
          </div>

          {/* Slip code display */}
          <div style={{ background: "rgba(255,255,255,.04)", border: "1.5px dashed rgba(255,255,255,.15)", borderRadius: 12, padding: "20px", textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>🔐 Verification Slip Code</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 26, fontWeight: 800, color: C.white, letterSpacing: "0.2em", marginBottom: 8 }}>
              {fmt(slipCode)}
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>Used when SMS OTP cannot be delivered</div>
          </div>

          {/* Voter ID */}
          <div style={{ background: "rgba(255,255,255,.03)", borderRadius: 10, padding: "10px 14px", marginBottom: 24, fontSize: 12, color: C.muted }}>
            Voter ID: <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: C.white, fontSize: 11 }}>{voterId}</span>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handlePrint}
              style={{ flex: 1, background: "linear-gradient(135deg,#138808,#1aad0a)", border: "none", borderRadius: 11, padding: "13px", color: C.white, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              🖨️ Print Slip
            </button>
            <button onClick={onClose}
              style={{ flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 11, padding: "13px", color: C.muted, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              Close
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: "rgba(255,107,107,.7)" }}>
            Closing without printing means the code is lost permanently.
          </div>
        </div>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// VOTER FORM
// ─────────────────────────────────────────────────────────────────────────────
const VoterForm = () => {
  const webcamRef = useRef(null);
  const [title, setTitle]                   = useState("");
  const [name, setName]                     = useState("");
  const [mobile_number, setMobileNumber]    = useState("");
  const [gender, setGender]                 = useState("");
  const [maritalStatus, setMaritalStatus]   = useState("");
  const [spouseName, setSpouseName]         = useState("");
  const [fatherName, setFatherName]         = useState("");
  const [motherName, setMotherName]         = useState("");
  const [dateOfBirth, setDateOfBirth]       = useState("");
  const [photos, setPhotos]                 = useState([]);
  const [loading, setLoading]               = useState(false);
  const [capturing, setCapturing]           = useState(false);
  const [message, setMessage]               = useState({ type: "", text: "" });

  // Slip modal state
  const [slipModal, setSlipModal]           = useState(null); // null | { voterName, voterId, slipCode, region }

  const [regions, setRegions]               = useState([]);
  const [states, setStates]                 = useState([]);
  const [districts, setDistricts]           = useState([]);
  const [zones, setZones]                   = useState([]);
  const [taluks, setTaluks]                 = useState([]);
  const [wardNos, setWardNos]               = useState([]);
  const [pincodes, setPincodes]             = useState([]);
  const [selectedState, setSelectedState]   = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedZone, setSelectedZone]     = useState("");
  const [selectedTaluk, setSelectedTaluk]   = useState("");
  const [selectedWardNo, setSelectedWardNo] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:3000/regions").then(r => r.json()).then(data => {
      setRegions(data.regions);
      setStates([...new Set(data.regions.map(r => r.state))].sort().map(s => ({ value: s, label: s })));
    });
  }, []);

  useEffect(() => {
    if (selectedState) {
      setDistricts([...new Set(regions.filter(r => r.state === selectedState).map(r => r.district))].sort().map(d => ({ value: d, label: d })));
      setSelectedDistrict(""); setZones([]); setTaluks([]); setWardNos([]); setPincodes([]);
      setSelectedZone(""); setSelectedTaluk(""); setSelectedWardNo(""); setSelectedPincode("");
    } else { setDistricts([]); }
  }, [selectedState, regions]);

  useEffect(() => {
    if (selectedDistrict) {
      setZones([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict).map(r => r.zone))].sort().map(z => ({ value: z, label: z })));
      setSelectedZone(""); setTaluks([]); setWardNos([]); setPincodes([]);
    } else { setZones([]); }
  }, [selectedDistrict, selectedState, regions]);

  useEffect(() => {
    if (selectedZone) {
      setTaluks([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.zone === selectedZone).map(r => r.taluk))].sort().map(t => ({ value: t, label: t })));
      setSelectedTaluk(""); setWardNos([]); setPincodes([]);
    } else { setTaluks([]); }
  }, [selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    if (selectedTaluk) {
      setWardNos([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.zone === selectedZone && r.taluk === selectedTaluk).map(r => r.wardNo))].sort((a, b) => a - b).map(w => ({ value: String(w), label: w })));
      setSelectedWardNo(""); setPincodes([]);
    } else { setWardNos([]); }
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    if (selectedWardNo) {
      setPincodes([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.zone === selectedZone && r.taluk === selectedTaluk && String(r.wardNo) === selectedWardNo).map(r => r.pincode))].sort().map(p => ({ value: p, label: p })));
      setSelectedPincode("");
    } else { setPincodes([]); }
  }, [selectedWardNo, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const captureImages = async () => {
    setCapturing(true);
    const capturedPhotos = [];
    for (let i = 0; i < 20; i++) {
      const src = webcamRef.current?.getScreenshot();
      if (src) capturedPhotos.push(src);
      await new Promise(r => setTimeout(r, 500));
    }
    setPhotos(capturedPhotos);
    setCapturing(false);
  };

  const handleEnroll = async () => {
    const selectedRegion = regions.find(r =>
      r.state === selectedState && r.district === selectedDistrict &&
      r.zone === selectedZone && r.taluk === selectedTaluk &&
      String(r.wardNo) === selectedWardNo && r.pincode === selectedPincode
    );

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("http://127.0.0.1:5000/capture", {
        title, name, mobile_number, gender, maritalStatus,
        spouseName:  maritalStatus === "married"   ? spouseName  : null,
        fatherName:  maritalStatus === "unmarried" ? fatherName  : null,
        motherName:  maritalStatus === "unmarried" ? motherName  : null,
        dateOfBirth,
        regionId: selectedRegion?._id || null,
        image: photos.map(p => p.split(",")[1]),
      });

      // ── Open slip modal with the one-time plain code ──────────────────────
      const regionLabel = [selectedState, selectedDistrict, selectedTaluk, `Ward ${selectedWardNo}`]
        .filter(Boolean).join(" · ");

      setSlipModal({
        voterName:  name,
        voterId:    res.data.voterId   || "—",
        slipCode:   res.data.slipCode  || "—",
        region:     regionLabel,
      });

      setMessage({ type: "success", text: "Voter enrolled successfully ✓" });

      // Reset form fields after enrollment
      setTitle(""); setName(""); setMobileNumber(""); setGender("");
      setMaritalStatus(""); setSpouseName(""); setFatherName(""); setMotherName("");
      setDateOfBirth(""); setPhotos([]);
      setSelectedState(""); setSelectedDistrict(""); setSelectedZone("");
      setSelectedTaluk(""); setSelectedWardNo(""); setSelectedPincode("");

    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to enroll voter. Please try again.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=IBM+Plex+Mono:wght@600;700&display=swap');
        select option { background: #111936; color: #fff; }
      `}</style>

      <SectionHead text="Personal Info" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <SF label="Title" value={title} onChange={setTitle} options={["Mr","Ms","Mrs","Dr","Other"].map(v => ({ value: v, label: v }))} />
        <TF label="Full Name" value={name} onChange={setName} />
        <TF label="Mobile Number" value={mobile_number} onChange={setMobileNumber} />
        <TF label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
        <SF label="Gender" value={gender} onChange={setGender} options={["male","female","other"].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))} />
        <SF label="Marital Status" value={maritalStatus} onChange={setMaritalStatus} options={["married","unmarried"].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))} />
        <TF label={gender === "male" ? "Wife's Name" : gender === "female" ? "Husband's Name" : "Spouse's Name"} value={spouseName} onChange={setSpouseName} disabled={maritalStatus !== "married"} />
        <TF label="Father's Name" value={fatherName} onChange={setFatherName} disabled={maritalStatus !== "unmarried"} />
        <TF label="Mother's Name" value={motherName} onChange={setMotherName} disabled={maritalStatus !== "unmarried"} />
      </div>

      <SectionHead text="Region Assignment" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <SF label="State"    value={selectedState}    onChange={setSelectedState}    options={states} />
        <SF label="District" value={selectedDistrict} onChange={setSelectedDistrict} options={districts} disabled={!selectedState} />
        <SF label="Zone"     value={selectedZone}     onChange={setSelectedZone}     options={zones}     disabled={!selectedDistrict} />
        <SF label="Taluk"    value={selectedTaluk}    onChange={setSelectedTaluk}    options={taluks}    disabled={!selectedZone} />
        <SF label="Ward No"  value={selectedWardNo}   onChange={setSelectedWardNo}   options={wardNos}   disabled={!selectedTaluk} />
        <SF label="Pincode"  value={selectedPincode}  onChange={setSelectedPincode}  options={pincodes}  disabled={!selectedWardNo} />
      </div>

      <SectionHead text="Biometric Capture" />
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div style={{ border: "2px solid rgba(255,153,51,0.2)", borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
          <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={320} height={240} style={{ display: "block" }} />
        </div>
        {photos.length > 0 && (
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{photos.length} frames captured</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
              {photos.slice(0, 10).map((p, i) => (
                <img key={i} src={p} alt={`frame ${i}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {message.text && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: message.type === "success" ? "rgba(19,136,8,0.1)" : "rgba(255,107,107,0.1)", border: `1px solid ${message.type === "success" ? "rgba(19,136,8,0.3)" : "rgba(255,107,107,0.3)"}`, borderRadius: 10, padding: "12px 16px", color: message.type === "success" ? "#4CAF50" : "#FF6B6B", fontSize: 13, marginTop: 20 }}>
          {message.type === "success" ? "✓" : "⚠️"} {message.text}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <button onClick={captureImages} disabled={capturing}
          style={{ background: capturing ? "rgba(255,153,51,0.4)" : "linear-gradient(135deg,#FF9933,#FFB347)", border: "none", borderRadius: 10, padding: "12px 24px", color: C.navy, fontSize: 14, fontWeight: 700, cursor: capturing ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(255,153,51,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
          📷 {capturing ? `Capturing… (${photos.length}/20)` : "Capture Images"}
        </button>
        <button onClick={handleEnroll} disabled={loading || photos.length === 0 || !selectedPincode}
          style={{ background: (loading || photos.length === 0 || !selectedPincode) ? "rgba(19,136,8,0.3)" : "linear-gradient(135deg,#138808,#1aad0a)", border: "none", borderRadius: 10, padding: "12px 24px", color: C.white, fontSize: 14, fontWeight: 700, cursor: (loading || photos.length === 0 || !selectedPincode) ? "not-allowed" : "pointer", fontFamily: "'Outfit',sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(19,136,8,0.2)" }}>
          {loading ? "Enrolling…" : "Enroll Voter"}
        </button>
      </div>

      {/* Slip modal — shown immediately after successful enrollment */}
      {slipModal && (
        <SlipModal slipData={slipModal} onClose={() => setSlipModal(null)} />
      )}
    </div>
  );
};

export default VoterForm;