// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   TextField,
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   MenuItem,
// } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";
// import { ThemeProvider, createTheme } from "@mui/material/styles";

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

// const ViewRegions = () => {
//   const [regions, setRegions] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [taluks, setTaluks] = useState([]);
//   const [wardNos, setWardNos] = useState([]);
//   const [pincodes, setPincodes] = useState([]);
//   const [selectedState, setSelectedState] = useState("All");
//   const [selectedDistrict, setSelectedDistrict] = useState("All");
//   const [selectedZone, setSelectedZone] = useState("All");
//   const [selectedTaluk, setSelectedTaluk] = useState("All");
//   const [selectedWardNo, setSelectedWardNo] = useState("All");
//   const [selectedPincode, setSelectedPincode] = useState("All");
//   const [filteredRegion, setFilteredRegion] = useState(null);
//   const [voters, setVoters] = useState([]);
//   const [parties, setParties] = useState([]);
//   const [openVotersDialog, setOpenVotersDialog] = useState(false);
//   const [openPartiesDialog, setOpenPartiesDialog] = useState(false);
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
//             { value: "All", label: "All States" },
//             ...[...new Set(data.regions.map((region) => region.state))]
//               .sort()
//               .map((state) => ({ value: state, label: state })),
//           ];
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
//     const filteredDistricts = [
//       { value: "All", label: "All Districts" },
//       ...[
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 selectedState === "All" || region.state === selectedState
//             )
//             .map((region) => region.district)
//         ),
//       ]
//         .sort()
//         .map((district) => ({ value: district, label: district })),
//     ];
//     setDistricts(filteredDistricts);
//   }, [selectedState, regions]);

//   useEffect(() => {
//     const filteredZones = [
//       { value: "All", label: "All Zones" },
//       ...[
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 (selectedState === "All" || region.state === selectedState) &&
//                 (selectedDistrict === "All" ||
//                   region.district === selectedDistrict)
//             )
//             .map((region) => region.zone)
//         ),
//       ]
//         .sort()
//         .map((zone) => ({ value: zone, label: zone })),
//     ];
//     setZones(filteredZones);
//   }, [selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredTaluks = [
//       { value: "All", label: "All Taluks" },
//       ...[
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 (selectedState === "All" || region.state === selectedState) &&
//                 (selectedDistrict === "All" ||
//                   region.district === selectedDistrict) &&
//                 (selectedZone === "All" || region.zone === selectedZone)
//             )
//             .map((region) => region.taluk)
//         ),
//       ]
//         .sort()
//         .map((taluk) => ({ value: taluk, label: taluk })),
//     ];
//     setTaluks(filteredTaluks);
//   }, [selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredWardNos = [
//       { value: "All", label: "All Wards" },
//       ...[
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 (selectedState === "All" || region.state === selectedState) &&
//                 (selectedDistrict === "All" ||
//                   region.district === selectedDistrict) &&
//                 (selectedZone === "All" || region.zone === selectedZone) &&
//                 (selectedTaluk === "All" || region.taluk === selectedTaluk)
//             )
//             .map((region) => region.wardNo)
//         ),
//       ]
//         .sort((a, b) => a - b)
//         .map((wardNo) => ({ value: wardNo, label: wardNo })),
//     ];
//     setWardNos(filteredWardNos);
//   }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredPincodes = [
//       { value: "All", label: "All Pincodes" },
//       ...[
//         ...new Set(
//           regions
//             .filter(
//               (region) =>
//                 (selectedState === "All" || region.state === selectedState) &&
//                 (selectedDistrict === "All" ||
//                   region.district === selectedDistrict) &&
//                 (selectedZone === "All" || region.zone === selectedZone) &&
//                 (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
//                 (selectedWardNo === "All" || region.wardNo === selectedWardNo)
//             )
//             .map((region) => region.pincode)
//         ),
//       ]
//         .sort()
//         .map((pincode) => ({ value: pincode, label: pincode })),
//     ];
//     setPincodes(filteredPincodes);
//   }, [
//     selectedWardNo,
//     selectedTaluk,
//     selectedZone,
//     selectedDistrict,
//     selectedState,
//     regions,
//   ]);

//   const handleSearch = async () => {
//     try {
//       setLoading(true);
//       const filtered = regions.filter(
//         (region) =>
//           (selectedState === "All" || region.state === selectedState) &&
//           (selectedDistrict === "All" ||
//             region.district === selectedDistrict) &&
//           (selectedZone === "All" || region.zone === selectedZone) &&
//           (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
//           (selectedWardNo === "All" || region.wardNo === selectedWardNo) &&
//           (selectedPincode === "All" || region.pincode === selectedPincode)
//       );

//       if (filtered.length === 0) {
//         setErrorMessage("No regions found for the selected criteria.");
//         setFilteredRegion([]);
//         return;
//       }

//       setFilteredRegion(
//         filtered.map((region) => ({
//           ...region,
//           numberOfVoters: region.voters ? region.voters.length : 0,
//           numberOfParties: region.parties ? region.parties.length : 0,
//         }))
//       );
//       setErrorMessage("");
//     } catch (error) {
//       setErrorMessage("Error fetching region data. Please try again.");
//       setFilteredRegion([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchVoters = async (regionId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/regions/${regionId}/voters`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setVoters(data);
//         setOpenVotersDialog(true);
//       } else {
//         setErrorMessage("Failed to fetch voters. Please try again.");
//       }
//     } catch (error) {
//       setErrorMessage("Error fetching voters. Please try again.");
//     }
//   };

//   const fetchParties = async (regionId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/regions/${regionId}/parties`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         setParties(data);
//         setOpenPartiesDialog(true);
//       } else {
//         setErrorMessage("Failed to fetch parties. Please try again.");
//       }
//     } catch (error) {
//       setErrorMessage("Error fetching parties. Please try again.");
//     }
//   };

//   const downloadVotersList = (regionId) => {
//     window.open(`http://localhost:3000/regions/${regionId}/download-voters`);
//   };

//   const downloadPartiesList = (regionId) => {
//     window.open(`http://localhost:3000/regions/${regionId}/download-parties`);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ padding: "16px" }}>
//         {!filteredRegion && (
//           <>
//             <Typography
//               variant="h4"
//               gutterBottom
//               sx={{
//                 fontFamily: "Playfair Display",
//                 fontStyle: "italic",
//                 fontWeight: 900,
//                 color: "#121481",
//               }}
//             >
//               Search Regions
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
//               <Box
//                 sx={{
//                   width: { xs: "100%", sm: "calc(50% - 8px)" },
//                   minWidth: "200px",
//                 }}
//               >
//                 <TextField
//                   select
//                   label="State"
//                   variant="outlined"
//                   fullWidth
//                   value={selectedState}
//                   onChange={(e) => setSelectedState(e.target.value)}
//                   required
//                   sx={{ minWidth: "200px" }}
//                   InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//                   InputLabelProps={{ sx: { fontSize: "1rem" } }}
//                 >
//                   <MenuItem value="" disabled>
//                     Select State
//                   </MenuItem>
//                   {states.map((state) => (
//                     <MenuItem key={state.value} value={state.value}>
//                       {state.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//               <Box
//                 sx={{
//                   width: { xs: "100%", sm: "calc(50% - 8px)" },
//                   minWidth: "200px",
//                 }}
//               >
//                 <TextField
//                   select
//                   label="District"
//                   variant="outlined"
//                   fullWidth
//                   value={selectedDistrict}
//                   onChange={(e) => setSelectedDistrict(e.target.value)}
//                   required
//                   disabled={!selectedState}
//                   sx={{ minWidth: "200px" }}
//                   InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//                   InputLabelProps={{ sx: { fontSize: "1rem" } }}
//                 >
//                   <MenuItem value="" disabled>
//                     Select District
//                   </MenuItem>
//                   {districts.map((district) => (
//                     <MenuItem key={district.value} value={district.value}>
//                       {district.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//               <Box
//                 sx={{
//                   width: { xs: "100%", sm: "calc(50% - 8px)" },
//                   minWidth: "200px",
//                 }}
//               >
//                 <TextField
//                   select
//                   label="Zone"
//                   variant="outlined"
//                   fullWidth
//                   value={selectedZone}
//                   onChange={(e) => setSelectedZone(e.target.value)}
//                   required
//                   disabled={!selectedDistrict}
//                   sx={{ minWidth: "200px" }}
//                   InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//                   InputLabelProps={{ sx: { fontSize: "1rem" } }}
//                 >
//                   <MenuItem value="" disabled>
//                     Select Zone
//                   </MenuItem>
//                   {zones.map((zone) => (
//                     <MenuItem key={zone.value} value={zone.value}>
//                       {zone.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//               <Box
//                 sx={{
//                   width: { xs: "100%", sm: "calc(50% - 8px)" },
//                   minWidth: "200px",
//                 }}
//               >
//                 <TextField
//                   select
//                   label="Taluk"
//                   variant="outlined"
//                   fullWidth
//                   value={selectedTaluk}
//                   onChange={(e) => setSelectedTaluk(e.target.value)}
//                   required
//                   disabled={!selectedZone}
//                   sx={{ minWidth: "200px" }}
//                   InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//                   InputLabelProps={{ sx: { fontSize: "1rem" } }}
//                 >
//                   <MenuItem value="" disabled>
//                     Select Taluk
//                   </MenuItem>
//                   {taluks.map((taluk) => (
//                     <MenuItem key={taluk.value} value={taluk.value}>
//                       {taluk.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//               <Box
//                 sx={{
//                   width: { xs: "100%", sm: "calc(50% - 8px)" },
//                   minWidth: "200px",
//                 }}
//               >
//                 <TextField
//                   select
//                   label="Ward No"
//                   variant="outlined"
//                   fullWidth
//                   value={selectedWardNo}
//                   onChange={(e) => setSelectedWardNo(e.target.value)}
//                   required
//                   disabled={!selectedTaluk}
//                   sx={{ minWidth: "200px" }}
//                   InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//                   InputLabelProps={{ sx: { fontSize: "1rem" } }}
//                 >
//                   <MenuItem value="" disabled>
//                     Select Ward No
//                   </MenuItem>
//                   {wardNos.map((wardNo) => (
//                     <MenuItem key={wardNo.value} value={wardNo.value}>
//                       {wardNo.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//               <Box
//                 sx={{
//                   width: { xs: "100%", sm: "calc(50% - 8px)" },
//                   minWidth: "200px",
//                 }}
//               >
//                 <TextField
//                   select
//                   label="Pincode"
//                   variant="outlined"
//                   fullWidth
//                   value={selectedPincode}
//                   onChange={(e) => setSelectedPincode(e.target.value)}
//                   required
//                   disabled={!selectedWardNo}
//                   sx={{ minWidth: "200px" }}
//                   InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
//                   InputLabelProps={{ sx: { fontSize: "1rem" } }}
//                 >
//                   <MenuItem value="" disabled>
//                     Select Pincode
//                   </MenuItem>
//                   {pincodes.map((pincode) => (
//                     <MenuItem key={pincode.value} value={pincode.value}>
//                       {pincode.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Box>
//             </Box>
//             <Box mt={2}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSearch}
//                 disabled={loading}
//               >
//                 {loading ? "Searching..." : "Search"}
//               </Button>
//             </Box>
//           </>
//         )}
//         {errorMessage && (
//           <Typography variant="body1" color="error" sx={{ mt: 2 }}>
//             {errorMessage}
//           </Typography>
//         )}

//         {filteredRegion && (
//           <>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "row",
//                 gap: "1%",
//                 mb: 4,
//                 alignItems: "center",
//                 flexWrap: "wrap",
//               }}
//             >
//               <TextField
//                 select
//                 label="State"
//                 variant="outlined"
//                 value={selectedState}
//                 onChange={(e) => setSelectedState(e.target.value)}
//                 required
//                 sx={{ width: "120px", flexShrink: 0 }}
//                 InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
//                 InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
//               >
//                 <MenuItem value="" disabled>
//                   State
//                 </MenuItem>
//                 {states.map((state) => (
//                   <MenuItem key={state.value} value={state.value}>
//                     {state.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 select
//                 label="District"
//                 variant="outlined"
//                 value={selectedDistrict}
//                 onChange={(e) => setSelectedDistrict(e.target.value)}
//                 disabled={!selectedState}
//                 sx={{ width: "120px", flexShrink: 0 }}
//                 InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
//                 InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
//               >
//                 <MenuItem value="" disabled>
//                   District
//                 </MenuItem>
//                 {districts.map((district) => (
//                   <MenuItem key={district.value} value={district.value}>
//                     {district.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 select
//                 label="Zone"
//                 variant="outlined"
//                 value={selectedZone}
//                 onChange={(e) => setSelectedZone(e.target.value)}
//                 disabled={!selectedDistrict}
//                 sx={{ width: "120px", flexShrink: 0 }}
//                 InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
//                 InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
//               >
//                 <MenuItem value="" disabled>
//                   Zone
//                 </MenuItem>
//                 {zones.map((zone) => (
//                   <MenuItem key={zone.value} value={zone.value}>
//                     {zone.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 select
//                 label="Taluk"
//                 variant="outlined"
//                 value={selectedTaluk}
//                 onChange={(e) => setSelectedTaluk(e.target.value)}
//                 disabled={!selectedZone}
//                 sx={{ width: "120px", flexShrink: 0 }}
//                 InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
//                 InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
//               >
//                 <MenuItem value="" disabled>
//                   Taluk
//                 </MenuItem>
//                 {taluks.map((taluk) => (
//                   <MenuItem key={taluk.value} value={taluk.value}>
//                     {taluk.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 select
//                 label="Ward No"
//                 variant="outlined"
//                 value={selectedWardNo}
//                 onChange={(e) => setSelectedWardNo(e.target.value)}
//                 disabled={!selectedTaluk}
//                 sx={{ width: "120px", flexShrink: 0 }}
//                 InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
//                 InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
//               >
//                 <MenuItem value="" disabled>
//                   Ward No
//                 </MenuItem>
//                 {wardNos.map((wardNo) => (
//                   <MenuItem key={wardNo.value} value={wardNo.value}>
//                     {wardNo.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <TextField
//                 select
//                 label="Pincode"
//                 variant="outlined"
//                 value={selectedPincode}
//                 onChange={(e) => setSelectedPincode(e.target.value)}
//                 disabled={!selectedWardNo}
//                 sx={{ width: "120px", flexShrink: 0 }}
//                 InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
//                 InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
//               >
//                 <MenuItem value="" disabled>
//                   Pincode
//                 </MenuItem>
//                 {pincodes.map((pincode) => (
//                   <MenuItem key={pincode.value} value={pincode.value}>
//                     {pincode.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSearch}
//                 disabled={loading}
//                 sx={{ height: "36px", fontSize: "0.8rem", flexShrink: 0, color: '#fff' }}
//               >
//                 {loading ? "Searching..." : "Search"}
//               </Button>
//             </Box>
//             <TableContainer component={Paper}>
//               <Table sx={{ width: "100%" }}>
//                 <TableHead>
//                   <TableRow style={{ backgroundColor: "#138808" }}>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       State
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       District
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       Zone
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       Taluk
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       Ward No
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       Pincode
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       Number of Voters
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       Number of Parties
//                     </TableCell>
//                     <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
//                       Actions
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 {Array.isArray(filteredRegion) && (
//                   <TableBody>
//                     {filteredRegion.map((region) => (
//                       <TableRow key={region._id}>
//                         <TableCell>{region.state}</TableCell>
//                         <TableCell>{region.district}</TableCell>
//                         <TableCell>{region.zone}</TableCell>
//                         <TableCell>{region.taluk}</TableCell>
//                         <TableCell>{region.wardNo}</TableCell>
//                         <TableCell>{region.pincode}</TableCell>
//                         <TableCell>{region.numberOfVoters}</TableCell>
//                         <TableCell>{region.numberOfParties}</TableCell>
//                         <TableCell sx={{ display: "flex", gap: 1 }}>
//                           <Button onClick={() => fetchVoters(region._id)}>
//                             View Voters
//                           </Button>
//                           <Button onClick={() => fetchParties(region._id)}>
//                             View Parties
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 )}
//               </Table>
//             </TableContainer>
//           </>
//         )}

//         {/* Voters Dialog */}
//         <Dialog
//           open={openVotersDialog}
//           onClose={() => setOpenVotersDialog(false)}
//           fullWidth
//           maxWidth="md"
//         >
//           <DialogTitle
//             sx={{
//               fontFamily: "Playfair Display",
//               fontStyle: "italic",
//               fontWeight: 900,
//               color: "#121481",
//             }}
//           >
//             Voters List
//           </DialogTitle>
//           <DialogContent>
//             {voters.length === 0 ? (
//               <Typography variant="body1" sx={{ p: 2 }}>
//                 No voters found for this region.
//               </Typography>
//             ) : (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow style={{ backgroundColor: "#ff9933" }}>
//                       <TableCell
//                         style={{ color: "#FFFFFF", fontWeight: "bold" }}
//                       >
//                         Name
//                       </TableCell>
//                       <TableCell
//                         style={{ color: "#FFFFFF", fontWeight: "bold" }}
//                       >
//                         Mobile Number
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {voters.map((voter) => (
//                       <TableRow key={voter._id}>
//                         <TableCell>{voter.label}</TableCell>
//                         <TableCell>{voter.mobile_number}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => setOpenVotersDialog(false)}
//               color="secondary"
//             >
//               Close
//             </Button>
//             <Button
//               onClick={() => downloadVotersList(filteredRegion?._id)}
//               color="primary"
//               startIcon={<DownloadIcon />}
//               disabled={!voters.length}
//             >
//               Download List
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Parties Dialog */}
//         <Dialog
//           open={openPartiesDialog}
//           onClose={() => setOpenPartiesDialog(false)}
//           fullWidth
//           maxWidth="md"
//         >
//           <DialogTitle
//             sx={{
//               fontFamily: "Playfair Display",
//               fontStyle: "italic",
//               fontWeight: 900,
//               color: "#121481",
//             }}
//           >
//             Parties List
//           </DialogTitle>
//           <DialogContent>
//             {parties.length === 0 ? (
//               <Typography variant="body1" sx={{ p: 2 }}>
//                 No parties found for this region.
//               </Typography>
//             ) : (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow style={{ backgroundColor: "#ff9933" }}>
//                       <TableCell
//                         style={{ color: "#FFFFFF", fontWeight: "bold" }}
//                       >
//                         Party Name
//                       </TableCell>
//                       <TableCell
//                         style={{ color: "#FFFFFF", fontWeight: "bold" }}
//                       >
//                         Party Leader
//                       </TableCell>
//                       <TableCell
//                         style={{ color: "#FFFFFF", fontWeight: "bold" }}
//                       >
//                         Party Symbol
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {parties.map((party) => (
//                       <TableRow key={party._id}>
//                         <TableCell>{party.partyName}</TableCell>
//                         <TableCell>{party.partyLeader}</TableCell>
//                         <TableCell>{party.partySymbol}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => setOpenPartiesDialog(false)}
//               color="secondary"
//             >
//               Close
//             </Button>
//             <Button
//               onClick={() => downloadPartiesList(filteredRegion?._id)}
//               color="primary"
//               startIcon={<DownloadIcon />}
//               disabled={!parties.length}
//             >
//               Download List
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ViewRegions;

import React, { useState, useEffect } from "react";

const C = { saffron: "#FF9933", green: "#138808", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };
const field = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none" };
const sel = { ...field, WebkitAppearance: "none", appearance: "none", cursor: "pointer", paddingRight: 32, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='7' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "10px" };
const lbl = { fontSize: 10, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 5, display: "block" };

const ViewRegions = () => {
  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [wardNos, setWardNos] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [selectedZone, setSelectedZone] = useState("All");
  const [selectedTaluk, setSelectedTaluk] = useState("All");
  const [selectedWardNo, setSelectedWardNo] = useState("All");
  const [selectedPincode, setSelectedPincode] = useState("All");
  const [filteredRegion, setFilteredRegion] = useState(null);
  const [votersData, setVotersData] = useState([]);
  const [partiesData, setPartiesData] = useState([]);
  const [votersModal, setVotersModal] = useState(false);
  const [partiesModal, setPartiesModal] = useState(false);
  const [activeRegionId, setActiveRegionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/regions").then(r => r.json()).then(data => {
      setRegions(data.regions);
      setStates([{ value: "All", label: "All States" }, ...[...new Set(data.regions.map(r => r.state))].sort().map(s => ({ value: s, label: s }))]);
    }).catch(() => setErrorMessage("Failed to load regions."));
  }, []);

  useEffect(() => { setDistricts([{ value: "All", label: "All Districts" }, ...[...new Set(regions.filter(r => selectedState === "All" || r.state === selectedState).map(r => r.district))].sort().map(d => ({ value: d, label: d }))]); }, [selectedState, regions]);
  useEffect(() => { setZones([{ value: "All", label: "All Zones" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict)).map(r => r.zone))].sort().map(z => ({ value: z, label: z }))]); }, [selectedDistrict, selectedState, regions]);
  useEffect(() => { setTaluks([{ value: "All", label: "All Taluks" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone)).map(r => r.taluk))].sort().map(t => ({ value: t, label: t }))]); }, [selectedZone, selectedDistrict, selectedState, regions]);
  useEffect(() => { setWardNos([{ value: "All", label: "All Wards" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk)).map(r => r.wardNo))].sort((a, b) => a - b).map(w => ({ value: String(w), label: w }))]); }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);
  useEffect(() => { setPincodes([{ value: "All", label: "All Pincodes" }, ...[...new Set(regions.filter(r => (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) && (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk) && (selectedWardNo === "All" || String(r.wardNo) === selectedWardNo)).map(r => r.pincode))].sort().map(p => ({ value: p, label: p }))]); }, [selectedWardNo, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const handleSearch = () => {
    setLoading(true); setErrorMessage("");
    const filtered = regions.filter(r =>
      (selectedState === "All" || r.state === selectedState) && (selectedDistrict === "All" || r.district === selectedDistrict) &&
      (selectedZone === "All" || r.zone === selectedZone) && (selectedTaluk === "All" || r.taluk === selectedTaluk) &&
      (selectedWardNo === "All" || String(r.wardNo) === selectedWardNo) && (selectedPincode === "All" || r.pincode === selectedPincode)
    );
    if (!filtered.length) { setErrorMessage("No regions found for the selected criteria."); setFilteredRegion([]); }
    else setFilteredRegion(filtered.map(r => ({ ...r, numberOfVoters: r.voters?.length || 0, numberOfParties: r.parties?.length || 0 })));
    setLoading(false);
  };

  const openVoters = async (regionId) => {
    setActiveRegionId(regionId);
    const res = await fetch(`http://localhost:3000/regions/${regionId}/voters`);
    const data = await res.json();
    setVotersData(data); setVotersModal(true);
  };

  const openParties = async (regionId) => {
    setActiveRegionId(regionId);
    const res = await fetch(`http://localhost:3000/regions/${regionId}/parties`);
    const data = await res.json();
    setPartiesData(data); setPartiesModal(true);
  };

  const FilterSelects = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
      {[
        { l: "State", v: selectedState, s: setSelectedState, opts: states },
        { l: "District", v: selectedDistrict, s: setSelectedDistrict, opts: districts },
        { l: "Zone", v: selectedZone, s: setSelectedZone, opts: zones },
        { l: "Taluk", v: selectedTaluk, s: setSelectedTaluk, opts: taluks },
        { l: "Ward No", v: selectedWardNo, s: setSelectedWardNo, opts: wardNos },
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
  );

  const COLS = ["State", "District", "Zone", "Taluk", "Ward", "Pincode", "Voters", "Parties", "Actions"];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
        .trow:hover { background: rgba(255,255,255,0.03) !important; }
        select option { background: #111936; color: #fff; }
        .view-btn { background: rgba(255,153,51,0.1); border: 1px solid rgba(255,153,51,0.2); borderRadius: 8px; padding: 5px 12px; color: #FF9933; fontSize: 12px; cursor: pointer; fontFamily: Outfit; fontWeight: 600; transition: background 0.15s; }
        .view-btn:hover { background: rgba(255,153,51,0.2); }
      `}</style>

      {/* Filter section */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,153,51,0.12)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>⬡ Search Regions</div>
        <FilterSelects />
        <button onClick={handleSearch} disabled={loading}
          style={{ marginTop: 14, background: loading ? "rgba(255,153,51,0.4)" : "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "11px 24px", color: "#0a0f2e", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif" }}>
          {loading ? "Searching…" : "🔍 Search"}
        </button>
      </div>

      {errorMessage && <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, padding: "12px 16px", color: "#FF6B6B", fontSize: 13, marginBottom: 16 }}>⚠️ {errorMessage}</div>}

      {/* Results */}
      {filteredRegion && filteredRegion.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.25)", borderRadius: 100, padding: "4px 14px", fontSize: 12, color: C.saffron, fontWeight: 600 }}>
              {filteredRegion.length} {filteredRegion.length === 1 ? "region" : "regions"} found
            </div>
          </div>

          <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid rgba(255,153,51,0.12)", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.9fr 0.6fr 0.8fr 0.7fr 0.7fr 1.2fr", minWidth: 900, padding: "14px 16px", background: "rgba(255,153,51,0.08)", borderBottom: "1px solid rgba(255,153,51,0.15)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.saffron, fontWeight: 700 }}>
              {COLS.map(c => <span key={c}>{c}</span>)}
            </div>
            {filteredRegion.map((r, i) => (
              <div key={r._id} className="trow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 0.9fr 0.6fr 0.8fr 0.7fr 0.7fr 1.2fr", minWidth: 900, padding: "13px 16px", borderBottom: i < filteredRegion.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", fontSize: 13, alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{r.state}</span>
                <span style={{ color: "#ccc" }}>{r.district}</span>
                <span style={{ color: "#ccc" }}>{r.zone}</span>
                <span style={{ color: "#ccc" }}>{r.taluk}</span>
                <span style={{ color: "#ccc" }}>{r.wardNo}</span>
                <span style={{ color: "#ccc" }}>{r.pincode}</span>
                <span>
                  <div style={{ background: "rgba(19,136,8,0.15)", border: "1px solid rgba(19,136,8,0.3)", borderRadius: 100, padding: "2px 10px", fontSize: 12, color: "#4CAF50", fontWeight: 700, display: "inline-block" }}>{r.numberOfVoters}</div>
                </span>
                <span>
                  <div style={{ background: "rgba(74,144,217,0.15)", border: "1px solid rgba(74,144,217,0.3)", borderRadius: 100, padding: "2px 10px", fontSize: 12, color: "#90C8F7", fontWeight: 700, display: "inline-block" }}>{r.numberOfParties}</div>
                </span>
                <span style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openVoters(r._id)} style={{ background: "rgba(255,153,51,0.1)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: 8, padding: "5px 10px", color: C.saffron, fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Voters</button>
                  <button onClick={() => openParties(r._id)} style={{ background: "rgba(74,144,217,0.1)", border: "1px solid rgba(74,144,217,0.2)", borderRadius: 8, padding: "5px 10px", color: "#90C8F7", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Parties</button>
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Voters Modal */}
      {votersModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setVotersModal(false)}>
          <div style={{ background: "linear-gradient(145deg, #111936, #0d1a28)", border: "1px solid rgba(255,153,51,0.2)", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 560, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Voters List</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>{votersData.length} voters in this region</div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {votersData.length === 0 ? <div style={{ color: C.muted, fontSize: 14, padding: "20px 0" }}>No voters in this region.</div> : (
                <div style={{ borderRadius: 12, border: "1px solid rgba(255,153,51,0.12)", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "10px 14px", background: "rgba(255,153,51,0.08)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.saffron, fontWeight: 700 }}>
                    <span>Name</span><span>Mobile</span>
                  </div>
                  {votersData.map((v, i) => (
                    <div key={v._id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "11px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                      <span style={{ fontWeight: 500 }}>{v.label}</span>
                      <span style={{ color: C.muted }}>{v.mobile_number}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => window.open(`http://localhost:3000/regions/${activeRegionId}/download-voters`)} disabled={!votersData.length}
                style={{ flex: 1, background: "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "10px", color: "#0a0f2e", fontSize: 13, fontWeight: 700, cursor: votersData.length ? "pointer" : "not-allowed", opacity: votersData.length ? 1 : 0.4, fontFamily: "'Outfit', sans-serif" }}>
                ⬇️ Download List
              </button>
              <button onClick={() => setVotersModal(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 20px", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Parties Modal */}
      {partiesModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setPartiesModal(false)}>
          <div style={{ background: "linear-gradient(145deg, #111936, #0d1a28)", border: "1px solid rgba(74,144,217,0.2)", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 560, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 11, color: "#90C8F7", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 4 }}>Parties List</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>{partiesData.length} parties in this region</div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {partiesData.length === 0 ? <div style={{ color: C.muted, fontSize: 14, padding: "20px 0" }}>No parties in this region.</div> : (
                <div style={{ borderRadius: 12, border: "1px solid rgba(74,144,217,0.15)", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", padding: "10px 14px", background: "rgba(74,144,217,0.08)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "#90C8F7", fontWeight: 700 }}>
                    <span>Name</span><span>Leader</span><span>Symbol</span>
                  </div>
                  {partiesData.map((p) => (
                    <div key={p._id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr", padding: "11px 14px", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                      <span style={{ fontWeight: 500 }}>{p.partyName}</span>
                      <span style={{ color: C.muted }}>{p.partyLeader}</span>
                      <span style={{ color: C.muted }}>{p.partySymbol}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => window.open(`http://localhost:3000/regions/${activeRegionId}/download-parties`)} disabled={!partiesData.length}
                style={{ flex: 1, background: "linear-gradient(135deg, #4A90D9, #6AA8E8)", border: "none", borderRadius: 10, padding: "10px", color: C.white, fontSize: 13, fontWeight: 700, cursor: partiesData.length ? "pointer" : "not-allowed", opacity: partiesData.length ? 1 : 0.4, fontFamily: "'Outfit', sans-serif" }}>
                ⬇️ Download List
              </button>
              <button onClick={() => setPartiesModal(false)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 20px", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRegions;