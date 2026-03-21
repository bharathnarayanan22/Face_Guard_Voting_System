// import React, { useState, useEffect } from 'react';
// import { Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Box, TableContainer, Paper, TextField, Button, MenuItem } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";

// const ViewParties = () => {
//   const [parties, setParties] = useState([]);
//   const [regions, setRegions] = useState([]);
//   const [filteredParties, setFilteredParties] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editParty, setEditParty] = useState(null);
//   const [partyName, setPartyName] = useState('');
//   const [partyLeader, setPartyLeader] = useState('');
//   const [partySymbol, setPartySymbol] = useState('');
//   const [selectedRegion, setSelectedRegion] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
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

//   useEffect(() => {
//     fetchRegions();
//     fetchParties();
//   }, []);

//   useEffect(() => {
//     filterParties();
//   }, [searchQuery, selectedState, selectedDistrict, selectedZone, selectedTaluk, selectedWard, selectedPincode, parties]);

//   useEffect(() => {
//     const uniqueStates = [
//       { value: "All", label: "All States" },
//       ...[...new Set(regions.map((r) => r.state))].sort().map((s) => ({ value: s, label: s })),
//     ];
//     setStates(uniqueStates);
//   }, [regions]);

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

//   const fetchParties = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/parties');
//       if (response.ok) {
//         const data = await response.json();
//         setParties(data.parties);
//       } else {
//         console.error('Failed to fetch parties:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching parties:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRegions = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/regions');
//       if (response.ok) {
//         const data = await response.json();
//         setRegions(data.regions);
//       } else {
//         console.error('Failed to fetch regions:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching regions:', error);
//     }
//   };

//   const filterParties = () => {
//     let updatedParties = parties;

//     if (searchQuery) {
//       updatedParties = updatedParties.filter(party =>
//         party.partyName.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     updatedParties = updatedParties.filter((party) => {
//       const region = regions.find((r) => r._id === party.regionId);
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

//     setFilteredParties(updatedParties);
//   };

//   const handleEditParty = (party) => {
//     setIsEditing(true);
//     setEditParty(party);
//     setPartyName(party.partyName);
//     setPartyLeader(party.partyLeader);
//     setPartySymbol(party.partySymbol);
//     setSelectedRegion(party.regionId);
//   };

//   const handleUpdateParty = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/parties/${editParty._id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           partyName,
//           partyLeader,
//           partySymbol,
//           regionId: selectedRegion,
//         }),
//       });

//       if (response.ok) {
//         const updatedParty = await response.json();
//         setParties(parties.map(party => party._id === updatedParty._id ? updatedParty : party));
//         console.log('Party updated successfully');
//         handleDialogClose();
//       } else {
//         console.error('Failed to update party:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error updating party:', error);
//     }
//   };

//   const handleDeleteParty = async (partyId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/parties/${partyId}`, {
//         method: 'DELETE',
//       });
//       if (response.ok) {
//         setParties(parties.filter(party => party._id !== partyId));
//         console.log('Party deleted successfully');
//       } else {
//         console.error('Failed to delete party:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error deleting party:', error);
//     }
//   };

//   const handleDialogClose = () => {
//     setIsEditing(false);
//     setEditParty(null);
//     setPartyName('');
//     setPartyLeader('');
//     setPartySymbol('');
//     setSelectedRegion('');
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
//         <TextField
//           label="Search by Party Name"
//           variant="outlined"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           sx={{ minWidth: 150 }}
//         />
//         <TextField
//           select
//           label="State"
//           variant="outlined"
//           value={selectedState}
//           onChange={(e) => setSelectedState(e.target.value)}
//           sx={{ minWidth: 150 }}
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
//           sx={{ minWidth: 150 }}
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
//           sx={{ minWidth: 150 }}
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
//           sx={{ minWidth: 150 }}
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
//           sx={{ minWidth: 150 }}
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
//           sx={{ minWidth: 150 }}
//         >
//           {pincodes.map((p) => (
//             <MenuItem key={p.value} value={p.value}>
//               {p.label}
//             </MenuItem>
//           ))}
//         </TextField>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow style={{ backgroundColor: '#138808' }}>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Name</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Leader</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Symbol</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>State</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>District</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Zone</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Taluk</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Ward</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Pincode</TableCell>
//               <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <>
//                 <TableRow>
//                   <TableCell colSpan={10}>
//                     <Skeleton variant="rectangular" width="100%" height={50} />
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell colSpan={10}>
//                     <Skeleton variant="rectangular" width="100%" height={50} />
//                   </TableCell>
//                 </TableRow>
//                 <TableRow>
//                   <TableCell colSpan={10}>
//                     <Skeleton variant="rectangular" width="100%" height={50} />
//                   </TableCell>
//                 </TableRow>
//               </>
//             ) : (
//               filteredParties.map((party) => {
//                 const region = regions.find(region => region._id === party.regionId);
//                 return (
//                   <TableRow key={party._id}>
//                     <TableCell>{party.partyName}</TableCell>
//                     <TableCell>{party.partyLeader}</TableCell>
//                     <TableCell>{party.partySymbol}</TableCell>
//                     <TableCell>{region?.state || 'N/A'}</TableCell>
//                     <TableCell>{region?.district || 'N/A'}</TableCell>
//                     <TableCell>{region?.zone || 'N/A'}</TableCell>
//                     <TableCell>{region?.taluk || 'N/A'}</TableCell>
//                     <TableCell>{region?.wardNo || 'N/A'}</TableCell>
//                     <TableCell>{region?.pincode || 'N/A'}</TableCell>
//                     <TableCell>
//                       <IconButton onClick={() => handleEditParty(party)} style={{ color: '#FF9933' }}
//                         sx={{ '&:hover': { color: 'blue' } }}><EditIcon /></IconButton>
//                       <IconButton onClick={() => handleDeleteParty(party._id)} style={{ color: '#FF9933' }}
//                         sx={{ '&:hover': { color: 'blue' } }}><DeleteIcon /></IconButton>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Dialog open={isEditing} onClose={handleDialogClose} fullWidth maxWidth="sm">
//         <DialogTitle>Edit Party</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="Party Name"
//             variant="outlined"
//             fullWidth
//             value={partyName}
//             onChange={(e) => setPartyName(e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Party Leader"
//             variant="outlined"
//             fullWidth
//             value={partyLeader}
//             onChange={(e) => setPartyLeader(e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Party Symbol"
//             variant="outlined"
//             fullWidth
//             value={partySymbol}
//             onChange={(e) => setPartySymbol(e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             select
//             label="Region"
//             variant="outlined"
//             fullWidth
//             value={selectedRegion}
//             onChange={(e) => setSelectedRegion(e.target.value)}
//             margin="normal"
//           >
//             {regions.map((region) => (
//               <MenuItem key={region._id} value={region._id}>
//                 {`${region.state}, ${region.district}, ${region.zone}, ${region.taluk}, Ward ${region.wardNo}, Pin ${region.pincode}`}
//               </MenuItem>
//             ))}
//           </TextField>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
//           <Button onClick={handleUpdateParty} color="primary">Save</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ViewParties;

import React, { useState, useEffect } from "react";

const C = { saffron: "#FF9933", green: "#138808", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };
const field = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none" };
const sel = { ...field, WebkitAppearance: "none", appearance: "none", cursor: "pointer", paddingRight: 32, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "10px" };
const lbl = { fontSize: 10, color: "#8892B0", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 5, display: "block" };

const ViewParties = () => {
  const [parties, setParties] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredParties, setFilteredParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [editParty, setEditParty] = useState(null);
  const [editName, setEditName] = useState("");
  const [editLeader, setEditLeader] = useState("");
  const [editSymbol, setEditSymbol] = useState("");
  const [editRegion, setEditRegion] = useState("");

  // ✅ Fixed API URLs: localhost → 127.0.0.1
  useEffect(() => { fetchRegions(); fetchParties(); }, []);

  const fetchParties = async () => {
    try { const res = await fetch("http://127.0.0.1:3000/parties"); const data = await res.json(); setParties(data.parties); }
    catch { } finally { setLoading(false); }
  };

  const fetchRegions = async () => {
    try { const res = await fetch("http://127.0.0.1:3000/regions"); const data = await res.json(); setRegions(data.regions); }
    catch { }
  };

  // Cascading filter dropdowns
  useEffect(() => { setStates([{ value: "All", label: "All States" }, ...[...new Set(regions.map(r => r.state))].sort().map(s => ({ value: s, label: s }))]); }, [regions]);

  useEffect(() => { setDistricts([{ value: "All", label: "All Districts" }, ...[...new Set(regions.filter(r => selectedState === "All" || r.state === selectedState).map(r => r.district))].sort().map(d => ({ value: d, label: d }))]); }, [selectedState, regions]);

  useEffect(() => { setZones([{ value: "All", label: "All Zones" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict)).map(r => r.zone))].sort().map(z => ({ value: z, label: z }))]); }, [selectedDistrict, selectedState, regions]);

  useEffect(() => { setTaluks([{ value: "All", label: "All Taluks" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone)).map(r => r.taluk))].sort().map(t => ({ value: t, label: t }))]); }, [selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    // ✅ wardNo type fix: store as String
    setWards([{ value: "All", label: "All Wards" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk)).map(r => r.wardNo))].sort((a, b) => a - b).map(w => ({ value: String(w), label: w }))]);
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    // ✅ wardNo type fix: compare as String
    setPincodes([{ value: "All", label: "All Pincodes" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk) && (selectedWard === "All" || String(r.wardNo) === selectedWard)).map(r => r.pincode))].sort().map(p => ({ value: p, label: p }))]);
  }, [selectedWard, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => { filterParties(); }, [searchQuery, selectedState, selectedDistrict, selectedZone, selectedTaluk, selectedWard, selectedPincode, parties, regions]);

  const filterParties = () => {
    let list = parties;
    if (searchQuery) list = list.filter(p => p.partyName.toLowerCase().includes(searchQuery.toLowerCase()));
    list = list.filter(p => {
      const r = regions.find(r => r._id === p.regionId);
      if (!r) return false;
      return (
        (selectedState === "All" || r.state === selectedState) &&
        (selectedDistrict === "All" || r.district === selectedDistrict) &&
        (selectedZone === "All" || r.zone === selectedZone) &&
        (selectedTaluk === "All" || r.taluk === selectedTaluk) &&
        // ✅ wardNo type fix in filter comparison
        (selectedWard === "All" || String(r.wardNo) === selectedWard) &&
        (selectedPincode === "All" || r.pincode === selectedPincode)
      );
    });
    setFilteredParties(list);
  };

  // ✅ Fixed API URL for delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this party?")) return;
    const res = await fetch(`http://127.0.0.1:3000/parties/${id}`, { method: "DELETE" });
    if (res.ok) setParties(p => p.filter(x => x._id !== id));
  };

  const openEdit = (p) => { setEditParty(p); setEditName(p.partyName); setEditLeader(p.partyLeader); setEditSymbol(p.partySymbol); setEditRegion(p.regionId); };

  // ✅ Fixed API URL for update
  const handleUpdate = async () => {
    const res = await fetch(`http://127.0.0.1:3000/parties/${editParty._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partyName: editName, partyLeader: editLeader, partySymbol: editSymbol, regionId: editRegion }),
    });
    if (res.ok) {
      const updated = await res.json();
      setParties(p => p.map(x => x._id === updated._id ? updated : x));
      setEditParty(null);
    }
  };

  const COLS = ["Party Name", "Leader", "Symbol", "State", "District", "Zone", "Taluk", "Ward", "Pincode", "Actions"];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
        .trow:hover { background: rgba(255,255,255,0.03) !important; }
        .act-btn { background: none; border: none; cursor: pointer; padding: 6px 8px; border-radius: 8px; font-size: 16px; transition: background 0.15s; }
        .act-btn:hover { background: rgba(255,255,255,0.08); }
        select option { background: #111936; color: #fff; }
      `}</style>

      {/* Filters */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,153,51,0.12)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>⬡ Filter Parties</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          <div>
            <label style={lbl}>Search</label>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Party name…"
              style={{ ...field, paddingLeft: 32, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238892B0' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='M21 21l-4.35-4.35'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "10px center", outline: "none" }} />
          </div>
          {[
            { l: "State", val: selectedState, set: setSelectedState, opts: states },
            { l: "District", val: selectedDistrict, set: setSelectedDistrict, opts: districts },
            { l: "Zone", val: selectedZone, set: setSelectedZone, opts: zones },
            { l: "Taluk", val: selectedTaluk, set: setSelectedTaluk, opts: taluks },
            { l: "Ward", val: selectedWard, set: setSelectedWard, opts: wards },
            { l: "Pincode", val: selectedPincode, set: setSelectedPincode, opts: pincodes },
          ].map(({ l, val, set, opts }) => (
            <div key={l}>
              <label style={lbl}>{l}</label>
              <select value={val} onChange={e => set(e.target.value)} style={sel}>
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Count badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.25)", borderRadius: 100, padding: "4px 14px", fontSize: 12, color: C.saffron, fontWeight: 600 }}>
          {filteredParties.length} {filteredParties.length === 1 ? "party" : "parties"}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(255,153,51,0.12)", background: "rgba(255,255,255,0.02)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 0.9fr 0.9fr 0.8fr 0.8fr 0.6fr 0.8fr 0.8fr", minWidth: 900, padding: "14px 16px", background: "rgba(255,153,51,0.08)", borderBottom: "1px solid rgba(255,153,51,0.15)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.saffron, fontWeight: 700 }}>
          {COLS.map(c => <span key={c}>{c}</span>)}
        </div>

        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} style={{ height: 52, background: "rgba(255,255,255,0.04)", borderRadius: 8, margin: "4px 16px", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))
        ) : filteredParties.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: C.muted, fontSize: 14 }}>No parties found matching your filters.</div>
        ) : (
          filteredParties.map((party, i) => {
            const r = regions.find(r => r._id === party.regionId);
            return (
              <div key={party._id} className="trow"
                style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 0.9fr 0.9fr 0.8fr 0.8fr 0.6fr 0.8fr 0.8fr", minWidth: 900, padding: "13px 16px", borderBottom: i < filteredParties.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", fontSize: 13, alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{party.partyName}</span>
                <span style={{ color: "#ccc" }}>{party.partyLeader}</span>
                <span style={{ color: C.muted }}>{party.partySymbol || "—"}</span>
                <span style={{ color: "#ccc", fontSize: 12 }}>{r?.state || "N/A"}</span>
                <span style={{ color: "#ccc", fontSize: 12 }}>{r?.district || "N/A"}</span>
                <span style={{ color: "#ccc", fontSize: 12 }}>{r?.zone || "N/A"}</span>
                <span style={{ color: "#ccc", fontSize: 12 }}>{r?.taluk || "N/A"}</span>
                <span style={{ color: "#ccc", fontSize: 12 }}>{r?.wardNo || "N/A"}</span>
                <span style={{ color: "#ccc", fontSize: 12 }}>{r?.pincode || "N/A"}</span>
                <span style={{ display: "flex", gap: 4 }}>
                  <button className="act-btn" title="Edit" onClick={() => openEdit(party)}>✏️</button>
                  <button className="act-btn" title="Delete" onClick={() => handleDelete(party._id)}>🗑️</button>
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {editParty && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setEditParty(null)}>
          <div style={{ background: "linear-gradient(145deg, #111936, #0d1a28)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: 20, padding: "32px", width: "100%", maxWidth: 480, boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Edit Party</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.white, marginBottom: 24 }}>{editParty.partyName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[["Party Name", editName, setEditName], ["Party Leader", editLeader, setEditLeader], ["Party Symbol", editSymbol, setEditSymbol]].map(([l, v, s]) => (
                <div key={l}>
                  <label style={lbl}>{l}</label>
                  <input value={v} onChange={e => s(e.target.value)}
                    style={{ ...field, background: "rgba(255,255,255,0.07)" }}
                    onFocus={e => { e.target.style.borderColor = "rgba(255,153,51,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,153,51,0.08)"; }}
                    onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }} />
                </div>
              ))}
              <div>
                <label style={lbl}>Region</label>
                <select value={editRegion} onChange={e => setEditRegion(e.target.value)} style={{ ...sel, background: "rgba(255,255,255,0.07)" }}>
                  {regions.map(r => (
                    <option key={r._id} value={r._id}>{`${r.state}, ${r.district}, ${r.zone}, ${r.taluk}, Ward ${r.wardNo}, Pin ${r.pincode}`}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={handleUpdate} style={{ background: "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "11px 24px", color: C.navy, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Save Changes</button>
              <button onClick={() => setEditParty(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "11px 20px", color: C.muted, fontSize: 14, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewParties;