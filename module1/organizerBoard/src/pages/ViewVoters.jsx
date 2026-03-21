// import React, { useState, useEffect, useRef } from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import Button from "@mui/material/Button";
// import DeleteIcon from "@mui/icons-material/Delete";
// import moment from "moment";
// import {
//   Typography,
//   IconButton,
//   Box,
//   Skeleton,
//   TextField,
//   MenuItem,
//   Modal,
//   Avatar,
// } from "@mui/material";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";

// const ViewVoters = () => {
//   const [voters, setVoters] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [filteredVoters, setFilteredVoters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchMobile, setSearchMobile] = useState("");
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [taluks, setTaluks] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [pincodes, setPincodes] = useState([]);
//   const [selectedState, setSelectedState] = useState("All");
//   const [selectedDistrict, setSelectedDistrict] = useState("All");
//   const [selectedZone, setSelectedZone] = useState("All");
//   const [selectedTaluk, setSelectedTaluk] = useState("All");
//   const [selectedWard, setSelectedWard] = useState("All");
//   const [selectedPincode, setSelectedPincode] = useState("All");
//   const [selectedVoter, setSelectedVoter] = useState(null);
//   const [open, setOpen] = useState(false);
//   const downloadButtonRef = useRef(null);

//   useEffect(() => {
//     fetchVoters();
//     fetchRegions();
//   }, []);

//   useEffect(() => {
//     filterVoters();
//   }, [
//     searchQuery,
//     searchMobile,
//     voters,
//     selectedState,
//     selectedDistrict,
//     selectedZone,
//     selectedTaluk,
//     selectedWard,
//     selectedPincode,
//   ]);

//   useEffect(() => {
//     const filteredDistricts = [
//       { value: "All", label: "All Districts" },
//       ...[...new Set(
//         regions
//           .filter((region) => selectedState === "All" || region.state === selectedState)
//           .map((region) => region.district)
//       )].sort().map((district) => ({ value: district, label: district })),
//     ];
//     setDistricts(filteredDistricts);
//   }, [selectedState, regions]);

//   useEffect(() => {
//     const filteredZones = [
//       { value: "All", label: "All Zones" },
//       ...[...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "All" || region.state === selectedState) &&
//               (selectedDistrict === "All" || region.district === selectedDistrict)
//           )
//           .map((region) => region.zone)
//       )].sort().map((zone) => ({ value: zone, label: zone })),
//     ];
//     setZones(filteredZones);
//   }, [selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredTaluks = [
//       { value: "All", label: "All Taluks" },
//       ...[...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "All" || region.state === selectedState) &&
//               (selectedDistrict === "All" || region.district === selectedDistrict) &&
//               (selectedZone === "All" || region.zone === selectedZone)
//           )
//           .map((region) => region.taluk)
//       )].sort().map((taluk) => ({ value: taluk, label: taluk })),
//     ];
//     setTaluks(filteredTaluks);
//   }, [selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredWards = [
//       { value: "All", label: "All Wards" },
//       ...[...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "All" || region.state === selectedState) &&
//               (selectedDistrict === "All" || region.district === selectedDistrict) &&
//               (selectedZone === "All" || region.zone === selectedZone) &&
//               (selectedTaluk === "All" || region.taluk === selectedTaluk)
//           )
//           .map((region) => region.wardNo)
//       )].sort((a, b) => a - b).map((wardNo) => ({ value: wardNo, label: wardNo })),
//     ];
//     setWards(filteredWards);
//   }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredPincodes = [
//       { value: "All", label: "All Pincodes" },
//       ...[...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "All" || region.state === selectedState) &&
//               (selectedDistrict === "All" || region.district === selectedDistrict) &&
//               (selectedZone === "All" || region.zone === selectedZone) &&
//               (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
//               (selectedWard === "All" || region.wardNo === selectedWard)
//           )
//           .map((region) => region.pincode)
//       )].sort().map((pincode) => ({ value: pincode, label: pincode })),
//     ];
//     setPincodes(filteredPincodes);
//   }, [selectedWard, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

//   const fetchVoters = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/voters");
//       if (response.ok) {
//         const data = await response.json();
//         setVoters(data.voters);
//       }
//     } catch (error) {
//       console.error("Error fetching voters:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRegions = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/regions");
//       if (response.ok) {
//         const data = await response.json();
//         setRegions(data.regions);
//         const uniqueStates = [
//           { value: "All", label: "All States" },
//           ...[...new Set(data.regions.map((r) => r.state))]
//             .sort()
//             .map((s) => ({ value: s, label: s })),
//         ];
//         setStates(uniqueStates);
//       }
//     } catch (error) {
//       console.error("Error fetching regions:", error);
//     }
//   };

//   const filterVoters = () => {
//     let updated = voters;

//     if (searchQuery) {
//       updated = updated.filter((v) =>
//         v.label.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (searchMobile) {
//       updated = updated.filter((v) =>
//         v.mobile_number.toLowerCase().includes(searchMobile.toLowerCase())
//       );
//     }

//     updated = updated.filter((v) => {
//       const region = regions.find((r) => r._id === v.regionId);
//       if (!region) return false;

//       return (
//         (selectedState === "All" || region.state === selectedState) &&
//         (selectedDistrict === "All" || region.district === selectedDistrict) &&
//         (selectedZone === "All" || region.zone === selectedZone) &&
//         (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
//         (selectedWard === "All" || region.wardNo === selectedWard) &&
//         (selectedPincode === "All" || region.pincode === selectedPincode)
//       );
//     });

//     setFilteredVoters(updated);
//   };

//   const handleDeleteVoter = async (voterId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/voters/${voterId}`, {
//         method: "DELETE",
//       });
//       if (response.ok) {
//         setVoters(voters.filter((v) => v._id !== voterId));
//       }
//     } catch (error) {
//       console.error("Error deleting voter:", error);
//     }
//   };

//   const handleOpenProfile = (voter) => {
//     setSelectedVoter(voter);
//     setOpen(true);
//   };

//   const handleCloseProfile = () => {
//     setSelectedVoter(null);
//     setOpen(false);
//   };

//   const handleDownloadProfile = () => {
//     const input = document.getElementById("voter-profile");
//     if (downloadButtonRef.current) {
//       downloadButtonRef.current.style.display = "none";
//     }
//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF();
//       pdf.addImage(imgData, "PNG", 0, 0);
//       pdf.save(`${selectedVoter.label}_profile.pdf`);
//       if (downloadButtonRef.current) {
//         downloadButtonRef.current.style.display = "inline";
//       }
//     });
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       {/* Search Fields */}
//       <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
//         <TextField
//           label="Search by Name"
//           variant="outlined"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           sx={{ width: 220 }}
//         />
//         <TextField
//           label="Search by Mobile"
//           variant="outlined"
//           value={searchMobile}
//           onChange={(e) => setSearchMobile(e.target.value)}
//           sx={{ width: 190 }}
//         />
//         <TextField
//           select
//           label="State"
//           variant="outlined"
//           value={selectedState}
//           onChange={(e) => setSelectedState(e.target.value)}
//           sx={{ width: 130 }}
//         >
//           {states.map((s) => (
//             <MenuItem key={s.value} value={s.value}>
//               {s.label}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           select
//           label="District"
//           variant="outlined"
//           value={selectedDistrict}
//           onChange={(e) => setSelectedDistrict(e.target.value)}
//           sx={{ width: 130  }}
//         >
//           {districts.map((d) => (
//             <MenuItem key={d.value} value={d.value}>
//               {d.label}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           select
//           label="Zone"
//           variant="outlined"
//           value={selectedZone}
//           onChange={(e) => setSelectedZone(e.target.value)}
//           sx={{ width: 130  }}
//         >
//           {zones.map((z) => (
//             <MenuItem key={z.value} value={z.value}>
//               {z.label}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           select
//           label="Taluk"
//           variant="outlined"
//           value={selectedTaluk}
//           onChange={(e) => setSelectedTaluk(e.target.value)}
//           sx={{ width: 130  }}
//         >
//           {taluks.map((t) => (
//             <MenuItem key={t.value} value={t.value}>
//               {t.label}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           select
//           label="Ward"
//           variant="outlined"
//           value={selectedWard}
//           onChange={(e) => setSelectedWard(e.target.value)}
//           sx={{ width: 130  }}
//         >
//           {wards.map((w) => (
//             <MenuItem key={w.value} value={w.value}>
//               {w.label}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           select
//           label="Pincode"
//           variant="outlined"
//           value={selectedPincode}
//           onChange={(e) => setSelectedPincode(e.target.value)}
//           sx={{ width: 130  }}
//         >
//           {pincodes.map((p) => (
//             <MenuItem key={p.value} value={p.value}>
//               {p.label}
//             </MenuItem>
//           ))}
//         </TextField>
//       </Box>

//       {/* Table */}
//       <TableContainer component={Paper}>
//         <Table aria-label="voters table">
//           <TableHead>
//             <TableRow style={{ backgroundColor: "#138808" }}>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 Voter
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 Mobile Number
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 State
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 District
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 Zone
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 Taluk
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 Ward
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 Pincode
//               </TableCell>
//               <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
//                 Actions
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={9}>
//                   <Skeleton variant="rectangular" width="100%" height={50} />
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredVoters.map((voter) => {
//                 const region = regions.find((r) => r._id === voter.regionId);
//                 return (
//                   <TableRow key={voter._id}>
//                     <TableCell>
//                       <Box display="flex" alignItems="center">
//                         <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
//                           {voter.label[0].toUpperCase()}
//                         </Avatar>
//                         {voter.label}
//                       </Box>
//                     </TableCell>
//                     <TableCell>{voter.mobile_number}</TableCell>
//                     <TableCell>{region?.state || "N/A"}</TableCell>
//                     <TableCell>{region?.district || "N/A"}</TableCell>
//                     <TableCell>{region?.zone || "N/A"}</TableCell>
//                     <TableCell>{region?.taluk || "N/A"}</TableCell>
//                     <TableCell>{region?.wardNo || "N/A"}</TableCell>
//                     <TableCell>{region?.pincode || "N/A"}</TableCell>
//                     <TableCell>
//                       <Button
//                         variant="contained"
//                         onClick={() => handleOpenProfile(voter)}
//                       >
//                         View Profile
//                       </Button>
//                       <IconButton
//                         onClick={() => handleDeleteVoter(voter._id)}
//                         style={{ color: "#FF5722" }}
//                       >
//                         <DeleteIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Profile Modal */}
//       <Modal open={open} onClose={handleCloseProfile}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: 400,
//             bgcolor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 24,
//             p: 4,
//           }}
//           id="voter-profile"
//         >
//           {selectedVoter && (
//             <>
//               <Typography variant="h6" gutterBottom>
//                 <strong>{selectedVoter.label}'s Profile</strong>
//               </Typography>
//               <Typography>
//                 <strong>Mobile:</strong> {selectedVoter.mobile_number}
//               </Typography>
//               <Typography>
//                 <strong>Date of Birth:</strong>{" "}
//                 {moment(selectedVoter.dateOfBirth).format("MM/DD/YYYY")}
//               </Typography>
//               <Typography>
//                 <strong>Gender:</strong> {selectedVoter.gender}
//               </Typography>
//               <Typography>
//                 <strong>Father:</strong> {selectedVoter.fatherName}
//               </Typography>
//               <Typography>
//                 <strong>Mother:</strong> {selectedVoter.motherName}
//               </Typography>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleDownloadProfile}
//                 ref={downloadButtonRef}
//               >
//                 Download Profile
//               </Button>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default ViewVoters;

import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const C = { saffron: "#FF9933", green: "#138808", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };
const field = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none" };
const sel = { ...field, WebkitAppearance: "none", appearance: "none", cursor: "pointer", paddingRight: 32, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "10px" };
const lbl = { fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 5, display: "block" };

const Avatar = ({ name }) => (
  <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, #FF9933, #138808)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0 }}>
    {name?.[0]?.toUpperCase() || "?"}
  </div>
);

const ViewVoters = () => {
  const [voters, setVoters] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [wards, setWards] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedZone, setSelectedZone] = useState("All");
  const [selectedTaluk, setSelectedTaluk] = useState("All");
  const [selectedWard, setSelectedWard] = useState("All");
  const [selectedPincode, setSelectedPincode] = useState("All");
  const [selectedVoter, setSelectedVoter] = useState(null);
  const downloadRef = useRef(null);

  useEffect(() => { fetchVoters(); fetchRegions(); }, []);
  useEffect(() => { filterVoters(); }, [searchQuery, searchMobile, voters, selectedState, selectedDistrict, selectedZone, selectedTaluk, selectedWard, selectedPincode, regions]);
  useEffect(() => { setDistricts([{ value: "All", label: "All Districts" }, ...[...new Set(regions.filter(r => selectedState === "All" || r.state === selectedState).map(r => r.district))].sort().map(d => ({ value: d, label: d }))]); }, [selectedState, regions]);
  useEffect(() => { setZones([{ value: "All", label: "All Zones" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict)).map(r => r.zone))].sort().map(z => ({ value: z, label: z }))]); }, [selectedDistrict, selectedState, regions]);
  useEffect(() => { setTaluks([{ value: "All", label: "All Taluks" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone)).map(r => r.taluk))].sort().map(t => ({ value: t, label: t }))]); }, [selectedZone, selectedDistrict, selectedState, regions]);
  useEffect(() => { setWards([{ value: "All", label: "All Wards" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk)).map(r => r.wardNo))].sort((a, b) => a - b).map(w => ({ value: w, label: w }))]); }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);
  useEffect(() => { setPincodes([{ value: "All", label: "All Pincodes" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk) && (selectedWard === "All" || r.wardNo === selectedWard)).map(r => r.pincode))].sort().map(p => ({ value: p, label: p }))]); }, [selectedWard, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const fetchVoters = async () => {
    try { const res = await fetch("http://localhost:3000/voters"); const data = await res.json(); setVoters(data.voters); } catch { } finally { setLoading(false); }
  };
  const fetchRegions = async () => {
    try {
      const res = await fetch("http://localhost:3000/regions"); const data = await res.json(); setRegions(data.regions);
      setStates([{ value: "All", label: "All States" }, ...[...new Set(data.regions.map(r => r.state))].sort().map(s => ({ value: s, label: s }))]);
    } catch { }
  };

  const filterVoters = () => {
    let list = voters;
    if (searchQuery) list = list.filter(v => v.label.toLowerCase().includes(searchQuery.toLowerCase()));
    if (searchMobile) list = list.filter(v => v.mobile_number.toLowerCase().includes(searchMobile.toLowerCase()));
    list = list.filter(v => {
      const r = regions.find(r => r._id === v.regionId);
      if (!r) return false;
      return (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk) && (selectedWard === "All" || r.wardNo === selectedWard) && (selectedPincode === "All" || r.pincode === selectedPincode);
    });
    setFilteredVoters(list);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this voter?")) return;
    await fetch(`http://localhost:3000/voters/${id}`, { method: "DELETE" });
    setVoters(v => v.filter(x => x._id !== id));
  };

  const handleDownload = () => {
    const el = document.getElementById("voter-profile-card");
    if (downloadRef.current) downloadRef.current.style.display = "none";
    html2canvas(el).then(canvas => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0);
      pdf.save(`${selectedVoter.label}_profile.pdf`);
      if (downloadRef.current) downloadRef.current.style.display = "inline-flex";
    });
  };

  const COLS = ["Voter", "Mobile", "State", "District", "Zone", "Taluk", "Ward", "Pincode", "Actions"];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
        .trow:hover { background: rgba(255,255,255,0.03) !important; }
        .act-btn { background: none; border: none; cursor: pointer; padding: 6px 8px; border-radius: 8px; font-size: 15px; transition: background 0.15s; }
        .act-btn:hover { background: rgba(255,255,255,0.08); }
        select option { background: #111936; color: #fff; }
      `}</style>

      {/* Filters */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,153,51,0.12)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>⬡ Search & Filter</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {[
            { l: "Name", v: searchQuery, s: setSearchQuery, isText: true },
            { l: "Mobile", v: searchMobile, s: setSearchMobile, isText: true },
          ].map(({ l, v, s }) => (
            <div key={l}>
              <label style={lbl}>{l}</label>
              <input value={v} onChange={e => s(e.target.value)} placeholder={`Search…`} style={field} />
            </div>
          ))}
          {[
            { l: "State", v: selectedState, s: setSelectedState, opts: states },
            { l: "District", v: selectedDistrict, s: setSelectedDistrict, opts: districts },
            { l: "Zone", v: selectedZone, s: setSelectedZone, opts: zones },
            { l: "Taluk", v: selectedTaluk, s: setSelectedTaluk, opts: taluks },
            { l: "Ward", v: selectedWard, s: setSelectedWard, opts: wards },
            { l: "Pincode", v: selectedPincode, s: setSelectedPincode, opts: pincodes },
          ].map(({ l, v, s, opts }) => (
            <div key={l}>
              <label style={lbl}>{l}</label>
              <select value={v} onChange={e => s(e.target.value)} style={sel}>
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.25)", borderRadius: 100, padding: "4px 14px", fontSize: 12, color: C.saffron, fontWeight: 600 }}>
          {filteredVoters.length} {filteredVoters.length === 1 ? "voter" : "voters"}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(255,153,51,0.12)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.8fr 0.9fr 0.7fr 0.7fr 0.6fr 0.8fr 0.9fr", minWidth: 920, padding: "14px 16px", background: "rgba(255,153,51,0.08)", borderBottom: "1px solid rgba(255,153,51,0.15)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.saffron, fontWeight: 700 }}>
          {COLS.map(c => <span key={c}>{c}</span>)}
        </div>
        {loading ? (
          Array(5).fill(0).map((_, i) => <div key={i} style={{ height: 52, background: "rgba(255,255,255,0.04)", borderRadius: 8, margin: "4px 16px", animation: "pulse 1.5s ease-in-out infinite" }} />)
        ) : filteredVoters.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: C.muted, fontSize: 14 }}>No voters found.</div>
        ) : filteredVoters.map((voter, i) => {
          const r = regions.find(r => r._id === voter.regionId);
          return (
            <div key={voter._id} className="trow" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.8fr 0.9fr 0.7fr 0.7fr 0.6fr 0.8fr 0.9fr", minWidth: 920, padding: "12px 16px", borderBottom: i < filteredVoters.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", fontSize: 13, alignItems: "center" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={voter.label} />
                <span style={{ fontWeight: 600 }}>{voter.label}</span>
              </span>
              <span style={{ color: "#ccc" }}>{voter.mobile_number}</span>
              <span style={{ color: "#ccc", fontSize: 12 }}>{r?.state || "N/A"}</span>
              <span style={{ color: "#ccc", fontSize: 12 }}>{r?.district || "N/A"}</span>
              <span style={{ color: "#ccc", fontSize: 12 }}>{r?.zone || "N/A"}</span>
              <span style={{ color: "#ccc", fontSize: 12 }}>{r?.taluk || "N/A"}</span>
              <span style={{ color: "#ccc", fontSize: 12 }}>{r?.wardNo || "N/A"}</span>
              <span style={{ color: "#ccc", fontSize: 12 }}>{r?.pincode || "N/A"}</span>
              <span style={{ display: "flex", gap: 4 }}>
                <button className="act-btn" title="View Profile" onClick={() => setSelectedVoter(voter)}>👁️</button>
                <button className="act-btn" title="Delete" onClick={() => handleDelete(voter._id)}>🗑️</button>
              </span>
            </div>
          );
        })}
      </div>

      {/* Profile Modal */}
      {selectedVoter && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setSelectedVoter(null)}>
          <div id="voter-profile-card" style={{ background: "linear-gradient(145deg, #111936, #0d1a28)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: 20, padding: "32px", width: "100%", maxWidth: 420, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
            {/* Profile top */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #FF9933, #138808)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: C.white, margin: "0 auto 12px" }}>
                {selectedVoter.label?.[0]?.toUpperCase()}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.white }}>{selectedVoter.label}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Voter Profile</div>
            </div>

            {/* Details grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                ["Mobile", selectedVoter.mobile_number],
                ["Date of Birth", moment(selectedVoter.dateOfBirth).format("DD/MM/YYYY")],
                ["Gender", selectedVoter.gender],
                ["Father", selectedVoter.fatherName || "—"],
                ["Mother", selectedVoter.motherName || "—"],
                ["Spouse", selectedVoter.spouseName || "—"],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px" }}>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 14, color: C.white, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }} ref={downloadRef}>
              <button onClick={handleDownload} style={{ flex: 1, background: "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "11px", color: "#0a0f2e", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                ⬇️ Download PDF
              </button>
              <button onClick={() => setSelectedVoter(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 20px", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewVoters;