// import React, { useState, useEffect } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import MenuItem from "@mui/material/MenuItem";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#ff9933",
//     },
//     secondary: {
//       main: "#138808",
//     },
//   },
// });

// const PartyForm = () => {
//   const [partyName, setPartyName] = useState("");
//   const [partyLeader, setPartyLeader] = useState("");
//   const [partySymbol, setPartySymbol] = useState("");
//   const [regions, setRegions] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [taluks, setTaluks] = useState([]);
//   const [wardNos, setWardNos] = useState([]);
//   const [pincodes, setPincodes] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedZone, setSelectedZone] = useState("");
//   const [selectedTaluk, setSelectedTaluk] = useState("");
//   const [selectedWardNo, setSelectedWardNo] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchRegions = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/regions");
//         if (response.ok) {
//           const data = await response.json();
//           setRegions(data.regions);
//           const uniqueStates = [
//             ...new Set(data.regions.map((region) => region.state)),
//           ]
//             .sort()
//             .map((state) => ({ value: state, label: state }));
//           setStates(uniqueStates);
//         } else {
//           setErrorMessage("Failed to fetch regions. Please try again.");
//         }
//       } catch (error) {
//         setErrorMessage("Error fetching regions. Please try again.");
//       }
//     };

//     fetchRegions();
//   }, []);

//   useEffect(() => {
//     if (selectedState) {
//       const filteredDistricts = [
//         ...new Set(
//           regions
//             .filter((region) => region.state === selectedState)
//             .map((region) => region.district)
//         ),
//       ]
//         .sort()
//         .map((district) => ({ value: district, label: district }));
//       setDistricts(filteredDistricts);
//       setSelectedDistrict("");
//       setZones([]);
//       setTaluks([]);
//       setWardNos([]);
//       setPincodes([]);
//       setSelectedZone("");
//       setSelectedTaluk("");
//       setSelectedWardNo("");
//       setSelectedPincode("");
//     } else {
//       setDistricts([]);
//       setZones([]);
//       setTaluks([]);
//       setWardNos([]);
//       setPincodes([]);
//       setSelectedDistrict("");
//       setSelectedZone("");
//       setSelectedTaluk("");
//       setSelectedWardNo("");
//       setSelectedPincode("");
//     }
//   }, [selectedState, regions]);

//   useEffect(() => {
//     if (selectedDistrict) {
//       const filteredZones = [
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 region.state === selectedState &&
//                 region.district === selectedDistrict
//             )
//             .map((region) => region.zone)
//         ),
//       ]
//         .sort()
//         .map((zone) => ({ value: zone, label: zone }));
//       setZones(filteredZones);
//       setSelectedZone("");
//       setTaluks([]);
//       setWardNos([]);
//       setPincodes([]);
//       setSelectedTaluk("");
//       setSelectedWardNo("");
//       setSelectedPincode("");
//     } else {
//       setZones([]);
//       setTaluks([]);
//       setWardNos([]);
//       setPincodes([]);
//       setSelectedZone("");
//       setSelectedTaluk("");
//       setSelectedWardNo("");
//       setSelectedPincode("");
//     }
//   }, [selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     if (selectedZone) {
//       const filteredTaluks = [
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 region.state === selectedState &&
//                 region.district === selectedDistrict &&
//                 region.zone === selectedZone
//             )
//             .map((region) => region.taluk)
//         ),
//       ]
//         .sort()
//         .map((taluk) => ({ value: taluk, label: taluk }));
//       setTaluks(filteredTaluks);
//       setSelectedTaluk("");
//       setWardNos([]);
//       setPincodes([]);
//       setSelectedWardNo("");
//       setSelectedPincode("");
//     } else {
//       setTaluks([]);
//       setWardNos([]);
//       setPincodes([]);
//       setSelectedTaluk("");
//       setSelectedWardNo("");
//       setSelectedPincode("");
//     }
//   }, [selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     if (selectedTaluk) {
//       const filteredWardNos = [
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 region.state === selectedState &&
//                 region.district === selectedDistrict &&
//                 region.zone === selectedZone &&
//                 region.taluk === selectedTaluk
//             )
//             .map((region) => region.wardNo)
//         ),
//       ]
//         .sort((a, b) => a - b)
//         .map((wardNo) => ({ value: wardNo, label: wardNo }));
//       setWardNos(filteredWardNos);
//       setSelectedWardNo("");
//       setPincodes([]);
//       setSelectedPincode("");
//     } else {
//       setWardNos([]);
//       setPincodes([]);
//       setSelectedWardNo("");
//       setSelectedPincode("");
//     }
//   }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     if (selectedWardNo) {
//       const filteredPincodes = [
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 region.state === selectedState &&
//                 region.district === selectedDistrict &&
//                 region.zone === selectedZone &&
//                 region.taluk === selectedTaluk &&
//                 region.wardNo === selectedWardNo
//             )
//             .map((region) => region.pincode)
//         ),
//       ]
//         .sort()
//         .map((pincode) => ({ value: pincode, label: pincode }));
//       setPincodes(filteredPincodes);
//       setSelectedPincode("");
//     } else {
//       setPincodes([]);
//       setSelectedPincode("");
//     }
//   }, [selectedWardNo, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

//   const handleEnrollParty = async () => {
//     if (!partyName || !partyLeader || !partySymbol || !selectedPincode) {
//       setErrorMessage("All fields are required.");
//       return;
//     }

//     try {
//       setLoading(true);
//       const selectedRegion = regions.find(
//         (region) =>
//           region.state === selectedState &&
//           region.district === selectedDistrict &&
//           region.zone === selectedZone &&
//           region.taluk === selectedTaluk &&
//           region.wardNo === selectedWardNo &&
//           region.pincode === selectedPincode
//       );

//       const response = await fetch("http://localhost:3000/enroll-party", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           partyName: partyName.toLowerCase(),
//           partyLeader: partyLeader.toLowerCase(),
//           partySymbol: partySymbol.toLowerCase(),
//           regionId: selectedRegion ? selectedRegion._id : null,
//         }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setErrorMessage("");
//         setPartyName("");
//         setPartyLeader("");
//         setPartySymbol("");
//         setSelectedState("");
//         setSelectedDistrict("");
//         setSelectedZone("");
//         setSelectedTaluk("");
//         setSelectedWardNo("");
//         setSelectedPincode("");
//       } else {
//         const data = await response.json();
//         if (response.status === 409) {
//           setErrorMessage(data.message);
//         } else {
//           setErrorMessage("Failed to enroll party. Please try again.");
//         }
//       }
//     } catch (error) {
//       setErrorMessage("Error enrolling party. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ padding: "16px" }}>
//         <Typography
//           variant="h4"
//           gutterBottom
//           sx={{
//             fontFamily: "Playfair Display",
//             fontStyle: "italic",
//             fontWeight: 900,
//             color: "#121481",
//           }}
//         >
//           Enroll Party
//         </Typography>
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               label="Party Name"
//               variant="outlined"
//               fullWidth
//               value={partyName}
//               onChange={(e) => setPartyName(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             />
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               label="Party Leader"
//               variant="outlined"
//               fullWidth
//               value={partyLeader}
//               onChange={(e) => setPartyLeader(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             />
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               label="Party Symbol"
//               variant="outlined"
//               fullWidth
//               value={partySymbol}
//               onChange={(e) => setPartySymbol(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             />
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               select
//               label="State"
//               variant="outlined"
//               fullWidth
//               value={selectedState}
//               onChange={(e) => setSelectedState(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             >
//               <MenuItem value="" disabled>
//                 Select State
//               </MenuItem>
//               {states.map((state) => (
//                 <MenuItem key={state.value} value={state.value}>
//                   {state.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               select
//               label="District"
//               variant="outlined"
//               fullWidth
//               value={selectedDistrict}
//               onChange={(e) => setSelectedDistrict(e.target.value)}
//               required
//               disabled={!selectedState}
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             >
//               <MenuItem value="" disabled>
//                 Select District
//               </MenuItem>
//               {districts.map((district) => (
//                 <MenuItem key={district.value} value={district.value}>
//                   {district.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               select
//               label="Zone"
//               variant="outlined"
//               fullWidth
//               value={selectedZone}
//               onChange={(e) => setSelectedZone(e.target.value)}
//               required
//               disabled={!selectedDistrict}
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             >
//               <MenuItem value="" disabled>
//                 Select Zone
//               </MenuItem>
//               {zones.map((zone) => (
//                 <MenuItem key={zone.value} value={zone.value}>
//                   {zone.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               select
//               label="Taluk"
//               variant="outlined"
//               fullWidth
//               value={selectedTaluk}
//               onChange={(e) => setSelectedTaluk(e.target.value)}
//               required
//               disabled={!selectedZone}
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             >
//               <MenuItem value="" disabled>
//                 Select Taluk
//               </MenuItem>
//               {taluks.map((taluk) => (
//                 <MenuItem key={taluk.value} value={taluk.value}>
//                   {taluk.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               select
//               label="Ward No"
//               variant="outlined"
//               fullWidth
//               value={selectedWardNo}
//               onChange={(e) => setSelectedWardNo(e.target.value)}
//               required
//               disabled={!selectedTaluk}
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             >
//               <MenuItem value="" disabled>
//                 Select Ward No
//               </MenuItem>
//               {wardNos.map((wardNo) => (
//                 <MenuItem key={wardNo.value} value={wardNo.value}>
//                   {wardNo.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>
//           <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
//             <TextField
//               select
//               label="Pincode"
//               variant="outlined"
//               fullWidth
//               value={selectedPincode}
//               onChange={(e) => setSelectedPincode(e.target.value)}
//               required
//               disabled={!selectedWardNo}
//               sx={{ minWidth: "200px" }}
//               InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//               InputLabelProps={{ sx: { fontSize: "1rem" } }}
//             >
//               <MenuItem value="" disabled>
//                 Select Pincode
//               </MenuItem>
//               {pincodes.map((pincode) => (
//                 <MenuItem key={pincode.value} value={pincode.value}>
//                   {pincode.label}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </Box>
//         </Box>
//         {errorMessage && (
//           <Typography variant="body1" color="error" sx={{ mt: 2 }}>
//             {errorMessage}
//           </Typography>
//         )}
//         <Box mt={2}>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleEnrollParty}
//             disabled={loading}
//           >
//             {loading ? "Enrolling..." : "Enroll Party"}
//           </Button>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default PartyForm;


import React, { useState, useEffect } from "react";

const C = { saffron: "#FF9933", green: "#138808", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };
const field = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none", transition: "border-color 0.2s" };
const sel = { ...field, WebkitAppearance: "none", appearance: "none", cursor: "pointer", paddingRight: 36, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "12px" };
const lbl = { fontSize: 11, color: "#8892B0", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6, display: "block" };

// ✅ Defined OUTSIDE PartyForm — prevents remount on every render (which kills input focus)
const F = ({ label, value, onChange, placeholder }) => (
  <div>
    <label style={lbl}>{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || `Enter ${label}`} style={field}
      onFocus={e => { e.target.style.borderColor = "rgba(255,153,51,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,153,51,0.08)"; }}
      onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
  </div>
);

const S = ({ label, value, onChange, options, disabled }) => (
  <div>
    <label style={lbl}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
      style={{ ...sel, opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <option value="">Select {label}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const PartyForm = () => {
  const [partyName, setPartyName] = useState("");
  const [partyLeader, setPartyLeader] = useState("");
  const [partySymbol, setPartySymbol] = useState("");
  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [wardNos, setWardNos] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedWardNo, setSelectedWardNo] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fixed API URL: localhost → 127.0.0.1
  useEffect(() => {
    fetch("http://127.0.0.1:3000/regions").then(r => r.json()).then(data => {
      setRegions(data.regions);
      setStates([...new Set(data.regions.map(r => r.state))].sort().map(s => ({ value: s, label: s })));
    }).catch(() => setErrorMessage("Failed to load regions."));
  }, []);

  useEffect(() => {
    if (selectedState) {
      setDistricts([...new Set(regions.filter(r => r.state === selectedState).map(r => r.district))].sort().map(d => ({ value: d, label: d })));
      setSelectedDistrict(""); setZones([]); setTaluks([]); setWardNos([]); setPincodes([]);
      setSelectedZone(""); setSelectedTaluk(""); setSelectedWardNo(""); setSelectedPincode("");
    } else { setDistricts([]); setZones([]); setTaluks([]); setWardNos([]); setPincodes([]); }
  }, [selectedState, regions]);

  useEffect(() => {
    if (selectedDistrict) {
      setZones([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict).map(r => r.zone))].sort().map(z => ({ value: z, label: z })));
      setSelectedZone(""); setTaluks([]); setWardNos([]); setPincodes([]);
    } else { setZones([]); setTaluks([]); setWardNos([]); setPincodes([]); }
  }, [selectedDistrict, selectedState, regions]);

  useEffect(() => {
    if (selectedZone) {
      setTaluks([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.zone === selectedZone).map(r => r.taluk))].sort().map(t => ({ value: t, label: t })));
      setSelectedTaluk(""); setWardNos([]); setPincodes([]);
    } else { setTaluks([]); setWardNos([]); setPincodes([]); }
  }, [selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    if (selectedTaluk) {
      // ✅ wardNo type fix: store as String
      setWardNos([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.zone === selectedZone && r.taluk === selectedTaluk).map(r => r.wardNo))].sort((a, b) => a - b).map(w => ({ value: String(w), label: w })));
      setSelectedWardNo(""); setPincodes([]);
    } else { setWardNos([]); setPincodes([]); }
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    if (selectedWardNo) {
      // ✅ wardNo type fix: compare as String
      setPincodes([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.zone === selectedZone && r.taluk === selectedTaluk && String(r.wardNo) === selectedWardNo).map(r => r.pincode))].sort().map(p => ({ value: p, label: p })));
      setSelectedPincode("");
    } else setPincodes([]);
  }, [selectedWardNo, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const handleEnroll = async () => {
    if (!partyName || !partyLeader || !partySymbol || !selectedPincode) { setErrorMessage("All fields are required."); return; }
    setLoading(true); setErrorMessage(""); setSuccessMessage("");
    try {
      // ✅ wardNo type fix: compare as String when finding region
      const selectedRegion = regions.find(r =>
        r.state === selectedState && r.district === selectedDistrict &&
        r.zone === selectedZone && r.taluk === selectedTaluk &&
        String(r.wardNo) === selectedWardNo && r.pincode === selectedPincode
      );
      // ✅ Fixed API URL: localhost → 127.0.0.1
      const res = await fetch("http://127.0.0.1:3000/enroll-party", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyName: partyName.toLowerCase(), partyLeader: partyLeader.toLowerCase(), partySymbol: partySymbol.toLowerCase(), regionId: selectedRegion?._id || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Party enrolled successfully ✓");
        setPartyName(""); setPartyLeader(""); setPartySymbol("");
        setSelectedState(""); setSelectedDistrict(""); setSelectedZone(""); setSelectedTaluk(""); setSelectedWardNo(""); setSelectedPincode("");
      } else setErrorMessage(res.status === 409 ? data.message : "Failed to enroll party.");
    } catch { setErrorMessage("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <style>{`select option { background: #111936; color: #fff; }`}</style>

      <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>⬡ Party Information</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <F label="Party Name" value={partyName} onChange={setPartyName} />
        <F label="Party Leader" value={partyLeader} onChange={setPartyLeader} />
        <F label="Party Symbol" value={partySymbol} onChange={setPartySymbol} />
      </div>

      <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16, borderTop: "1px solid rgba(255,153,51,0.15)", paddingTop: 20 }}>⬡ Region Assignment</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <S label="State" value={selectedState} onChange={setSelectedState} options={states} disabled={false} />
        <S label="District" value={selectedDistrict} onChange={setSelectedDistrict} options={districts} disabled={!selectedState} />
        <S label="Zone" value={selectedZone} onChange={setSelectedZone} options={zones} disabled={!selectedDistrict} />
        <S label="Taluk" value={selectedTaluk} onChange={setSelectedTaluk} options={taluks} disabled={!selectedZone} />
        <S label="Ward No" value={selectedWardNo} onChange={setSelectedWardNo} options={wardNos} disabled={!selectedTaluk} />
        <S label="Pincode" value={selectedPincode} onChange={setSelectedPincode} options={pincodes} disabled={!selectedWardNo} />
      </div>

      {errorMessage && <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, padding: "12px 16px", color: "#FF6B6B", fontSize: 13, marginBottom: 16 }}>⚠️ {errorMessage}</div>}
      {successMessage && <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(19,136,8,0.1)", border: "1px solid rgba(19,136,8,0.3)", borderRadius: 10, padding: "12px 16px", color: "#4CAF50", fontSize: 13, marginBottom: 16 }}>✓ {successMessage}</div>}

      <button onClick={handleEnroll} disabled={loading}
        style={{ background: loading ? "rgba(255,153,51,0.4)" : "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "12px 28px", color: C.navy, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(255,153,51,0.25)" }}>
        {loading ? "Enrolling…" : "Enroll Party"}
      </button>
    </div>
  );
};

export default PartyForm;