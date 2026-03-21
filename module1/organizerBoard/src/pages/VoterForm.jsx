// import React, { useState, useRef, useEffect } from "react";
// import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
// import MenuItem from "@mui/material/MenuItem";
// import Webcam from "react-webcam";
// import axios from "axios";

// // Define custom theme
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

// const VoterForm = () => {
//   const webcamRef = useRef(null);
//   const [title, setTitle] = useState("");
//   const [name, setName] = useState("");
//   const [mobile_number, setMobileNumber] = useState("");
//   const [gender, setGender] = useState("");
//   const [maritalStatus, setMaritalStatus] = useState("");
//   const [spouseName, setSpouseName] = useState("");
//   const [fatherName, setFatherName] = useState("");
//   const [motherName, setMotherName] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(false);
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

//   useEffect(() => {
//     const fetchRegions = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/regions");
//         if (response.ok) {
//           const data = await response.json();
//           setRegions(data.regions);

//           // Extract unique values for each field
//           const uniqueStates = [
//             ...new Set(data.regions.map((region) => region.state)),
//           ]
//             .sort()
//             .map((state) => ({
//               value: state,
//               label: state,
//             }));
//           setStates(uniqueStates);
//         } else {
//           console.error("Failed to fetch regions:", response.statusText);
//         }
//       } catch (error) {
//         console.error("Error fetching regions:", error);
//       }
//     };

//     fetchRegions();
//   }, []);

//   // Update districts when state changes
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

//   // Update zones when district changes
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

//   // Update taluks when zone changes
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

//   // Update wardNos when taluk changes
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

//   // Update pincodes when wardNo changes
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
//   }, [
//     selectedWardNo,
//     selectedTaluk,
//     selectedZone,
//     selectedDistrict,
//     selectedState,
//     regions,
//   ]);

//   const captureImages = async () => {
//     const capturedPhotos = [];
//     for (let i = 0; i < 20; i++) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       if (imageSrc) {
//         capturedPhotos.push(imageSrc);
//       }
//       await new Promise((resolve) => setTimeout(resolve, 500));
//     }
//     setPhotos(capturedPhotos);
//   };

//   const handleEnroll = async () => {
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
//       const payload = {
//         title,
//         name,
//         mobile_number,
//         gender,
//         maritalStatus,
//         spouseName: maritalStatus === "married" ? spouseName : null,
//         fatherName: maritalStatus === "unmarried" ? fatherName : null,
//         motherName: maritalStatus === "unmarried" ? motherName : null,
//         dateOfBirth,
//         regionId: selectedRegion ? selectedRegion._id : null,
//         image: photos.map((photo) => photo.split(",")[1]),
//       };
//       const response = await axios.post(
//         "http://127.0.0.1:5000/capture",
//         payload
//       );
//       alert("Voter enrolled successfully!");
//     } catch (error) {
//       console.error("Error enrolling voter:", error);
//       alert("Failed to enroll voter. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box>
//         <Box
//           sx={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: "16px",
//             padding: "16px",
//           }}
//         >
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               select
//               label="Title"
//               variant="outlined"
//               fullWidth
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             >
//               <MenuItem value="" disabled>
//                 Select Title
//               </MenuItem>
//               <MenuItem value="Mr">Mr</MenuItem>
//               <MenuItem value="Ms">Ms</MenuItem>
//               <MenuItem value="Mrs">Mrs</MenuItem>
//               <MenuItem value="Dr">Dr</MenuItem>
//               <MenuItem value="Other">Other</MenuItem>
//             </TextField>
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               label="Name"
//               variant="outlined"
//               fullWidth
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             />
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               label="Mobile Number"
//               variant="outlined"
//               fullWidth
//               value={mobile_number}
//               onChange={(e) => setMobileNumber(e.target.value)}
//               required
//               inputProps={{ pattern: "[0-9]*" }}
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             />
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               label="Date of Birth"
//               variant="outlined"
//               fullWidth
//               type="date"
//               value={dateOfBirth}
//               onChange={(e) => setDateOfBirth(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//             />
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               select
//               label="Gender"
//               variant="outlined"
//               fullWidth
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             >
//               <MenuItem value="" disabled>
//                 Select Gender
//               </MenuItem>
//               <MenuItem value="male">Male</MenuItem>
//               <MenuItem value="female">Female</MenuItem>
//               <MenuItem value="other">Other</MenuItem>
//             </TextField>
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               select
//               label="Marital Status"
//               variant="outlined"
//               fullWidth
//               value={maritalStatus}
//               onChange={(e) => setMaritalStatus(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             >
//               <MenuItem value="" disabled>
//                 Select Marital Status
//               </MenuItem>
//               <MenuItem value="married">Married</MenuItem>
//               <MenuItem value="unmarried">Unmarried</MenuItem>
//             </TextField>
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               label={
//                 gender === "male"
//                   ? "Wife's Name"
//                   : gender === "female"
//                   ? "Husband's Name"
//                   : "Spouse's Name"
//               }
//               variant="outlined"
//               fullWidth
//               value={spouseName}
//               onChange={(e) => setSpouseName(e.target.value)}
//               disabled={maritalStatus !== "married"}
//               required={maritalStatus === "married"}
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             />
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               label="Father's Name"
//               variant="outlined"
//               fullWidth
//               value={fatherName}
//               onChange={(e) => setFatherName(e.target.value)}
//               disabled={maritalStatus !== "unmarried"}
//               required={maritalStatus === "unmarried"}
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             />
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               label="Mother's Name"
//               variant="outlined"
//               fullWidth
//               value={motherName}
//               onChange={(e) => setMotherName(e.target.value)}
//               disabled={maritalStatus !== "unmarried"}
//               required={maritalStatus === "unmarried"}
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
//             />
//           </Box>
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
//             <TextField
//               select
//               label="State"
//               variant="outlined"
//               fullWidth
//               value={selectedState}
//               onChange={(e) => setSelectedState(e.target.value)}
//               required
//               sx={{ minWidth: "200px" }}
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
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
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
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
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
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
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
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
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
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
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
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
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
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
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
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
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
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
//           <Box
//             sx={{
//               width: { xs: "100%", sm: "calc(50% - 8px)" },
//               minWidth: "200px",
//             }}
//           >
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
//               InputProps={{
//                 sx: { height: "48px", fontSize: "1rem" },
//               }}
//               InputLabelProps={{
//                 sx: { fontSize: "1rem" },
//               }}
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
//         <Box mt={2}>
//           <Typography variant="h6" gutterBottom>
//             Capture Photo
//           </Typography>
//           <Webcam
//             audio={false}
//             ref={webcamRef}
//             screenshotFormat="image/jpeg"
//             width={640}
//             height={480}
//           />
//           <Grid container spacing={2} mt={2}>
//             {photos.map((photo, index) => (
//               <Grid item xs={6} sm={3} key={index}>
//                 <img
//                   src={photo}
//                   alt={`Photo ${index}`}
//                   style={{ width: "100%", borderRadius: "5px" }}
//                 />
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//         <Box mt={2} display="flex" justifyContent="space-between">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={captureImages}
//             disabled={loading}
//             startIcon={<PhotoCameraIcon />}
//           >
//             {loading ? "Capturing..." : "Capture Images"}
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={handleEnroll}
//             disabled={loading || photos.length === 0 || !selectedPincode}
//           >
//             Enroll Voter
//           </Button>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default VoterForm;
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const C = { saffron: "#FF9933", green: "#138808", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };
const field = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none", transition: "border-color 0.2s" };
const sel = { ...field, WebkitAppearance: "none", appearance: "none", cursor: "pointer", paddingRight: 36, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "12px" };
const lbl = { fontSize: 11, color: "#8892B0", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6, display: "block" };

const focusOn = e => { e.target.style.borderColor = "rgba(255,153,51,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,153,51,0.08)"; };
const focusOff = e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; };

// ✅ All helper components defined OUTSIDE VoterForm so React doesn't remount them
//    on every state change (which kills input focus after 1 keystroke)
const TF = ({ label, value, onChange, type = "text", disabled = false, placeholder }) => (
  <div>
    <label style={lbl}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || label} disabled={disabled}
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

const VoterForm = () => {
  const webcamRef = useRef(null);
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [mobile_number, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
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
  const [message, setMessage] = useState({ type: "", text: "" });

  // ✅ Fixed API URL: localhost → 127.0.0.1
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
      // ✅ wardNo type fix: store as String so select value matches
      setWardNos([...new Set(regions.filter(r => r.state === selectedState && r.district === selectedDistrict && r.zone === selectedZone && r.taluk === selectedTaluk).map(r => r.wardNo))].sort((a, b) => a - b).map(w => ({ value: String(w), label: w })));
      setSelectedWardNo(""); setPincodes([]);
    } else { setWardNos([]); }
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    if (selectedWardNo) {
      // ✅ wardNo type fix: compare as String
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
    // ✅ wardNo type fix: compare as String when finding region
    const selectedRegion = regions.find(r =>
      r.state === selectedState && r.district === selectedDistrict &&
      r.zone === selectedZone && r.taluk === selectedTaluk &&
      String(r.wardNo) === selectedWardNo && r.pincode === selectedPincode
    );
    setLoading(true); setMessage({ type: "", text: "" });
    try {
      await axios.post("http://127.0.0.1:5000/capture", {
        title, name, mobile_number, gender, maritalStatus,
        spouseName: maritalStatus === "married" ? spouseName : null,
        fatherName: maritalStatus === "unmarried" ? fatherName : null,
        motherName: maritalStatus === "unmarried" ? motherName : null,
        dateOfBirth, regionId: selectedRegion?._id || null,
        image: photos.map(p => p.split(",")[1]),
      });
      setMessage({ type: "success", text: "Voter enrolled successfully ✓" });
    } catch { setMessage({ type: "error", text: "Failed to enroll voter. Please try again." }); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <style>{`select option { background: #111936; color: #fff; }`}</style>

      <SectionHead text="Personal Info" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <SF label="Title" value={title} onChange={setTitle} options={["Mr", "Ms", "Mrs", "Dr", "Other"].map(v => ({ value: v, label: v }))} />
        <TF label="Full Name" value={name} onChange={setName} />
        <TF label="Mobile Number" value={mobile_number} onChange={setMobileNumber} />
        <TF label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
        <SF label="Gender" value={gender} onChange={setGender} options={["male", "female", "other"].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))} />
        <SF label="Marital Status" value={maritalStatus} onChange={setMaritalStatus} options={["married", "unmarried"].map(v => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }))} />
        <TF label={gender === "male" ? "Wife's Name" : gender === "female" ? "Husband's Name" : "Spouse's Name"} value={spouseName} onChange={setSpouseName} disabled={maritalStatus !== "married"} />
        <TF label="Father's Name" value={fatherName} onChange={setFatherName} disabled={maritalStatus !== "unmarried"} />
        <TF label="Mother's Name" value={motherName} onChange={setMotherName} disabled={maritalStatus !== "unmarried"} />
      </div>

      <SectionHead text="Region Assignment" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        <SF label="State" value={selectedState} onChange={setSelectedState} options={states} />
        <SF label="District" value={selectedDistrict} onChange={setSelectedDistrict} options={districts} disabled={!selectedState} />
        <SF label="Zone" value={selectedZone} onChange={setSelectedZone} options={zones} disabled={!selectedDistrict} />
        <SF label="Taluk" value={selectedTaluk} onChange={setSelectedTaluk} options={taluks} disabled={!selectedZone} />
        <SF label="Ward No" value={selectedWardNo} onChange={setSelectedWardNo} options={wardNos} disabled={!selectedTaluk} />
        <SF label="Pincode" value={selectedPincode} onChange={setSelectedPincode} options={pincodes} disabled={!selectedWardNo} />
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
          style={{ background: capturing ? "rgba(255,153,51,0.4)" : "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "12px 24px", color: C.navy, fontSize: 14, fontWeight: 700, cursor: capturing ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(255,153,51,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
          📷 {capturing ? `Capturing… (${photos.length}/20)` : "Capture Images"}
        </button>
        <button onClick={handleEnroll} disabled={loading || photos.length === 0 || !selectedPincode}
          style={{ background: (loading || photos.length === 0 || !selectedPincode) ? "rgba(19,136,8,0.3)" : "linear-gradient(135deg, #138808, #1aad0a)", border: "none", borderRadius: 10, padding: "12px 24px", color: C.white, fontSize: 14, fontWeight: 700, cursor: (loading || photos.length === 0 || !selectedPincode) ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(19,136,8,0.2)" }}>
          {loading ? "Enrolling…" : "Enroll Voter"}
        </button>
      </div>
    </div>
  );
};

export default VoterForm;