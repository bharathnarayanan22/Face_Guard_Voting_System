// // import React, { useState, useEffect, useRef } from "react";
// // import Webcam from "react-webcam";
// // import axios from "axios";
// // import io from "socket.io-client";
// // import {
// //   Grid,
// //   Button,
// //   Typography,
// //   TextField,
// //   MenuItem,
// //   CircularProgress,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   Box,
// //   Card,
// //   CardContent,
// //   Fade,
// // } from "@mui/material";
// // import { ThemeProvider, createTheme } from "@mui/material/styles";
// // import CameraAltIcon from "@mui/icons-material/CameraAlt";
// // import VerifiedIcon from "@mui/icons-material/Verified";

// // const socket = io("http://127.0.0.1:5000");

// // const theme = createTheme({
// //   palette: {
// //     primary: {
// //       main: "#FF9933", // Saffron
// //     },
// //     secondary: {
// //       main: "#138808", // Green
// //     },
// //     background: {
// //       default: "#FFFFFF", // White
// //     },
// //     text: {
// //       primary: "#000080", // Navy Blue
// //       secondary: "#4B0082", // Darker blue for contrast
// //     },
// //   },
// //   typography: {
// //     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
// //     h4: {
// //       fontWeight: 700,
// //       color: "#000080",
// //       textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
// //     },
// //     h6: {
// //       fontWeight: 600,
// //       color: "#000080",
// //     },
// //     body1: {
// //       color: "#000080",
// //     },
// //   },
// //   components: {
// //     MuiButton: {
// //       styleOverrides: {
// //         root: {
// //           borderRadius: 8,
// //           textTransform: "none",
// //           fontWeight: 600,
// //           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
// //           "&:hover": {
// //             boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
// //             backgroundColor: "#e68a00",
// //           },
// //         },
// //       },
// //     },
// //     MuiTextField: {
// //       styleOverrides: {
// //         root: {
// //           "& .MuiOutlinedInput-root": {
// //             borderRadius: 8,
// //             backgroundColor: "#F5F6F5",
// //             "&:hover fieldset": {
// //               borderColor: "#FF9933",
// //             },
// //             "&.Mui-focused fieldset": {
// //               borderColor: "#138808",
// //             },
// //           },
// //         },
// //       },
// //     },
// //     MuiCard: {
// //       styleOverrides: {
// //         root: {
// //           borderRadius: 12,
// //           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
// //           border: "1px solid #FF9933",
// //           background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F5 100%)",
// //           display: "flex",
// //           flexDirection: "column",
// //           height: "100%",
// //         },
// //       },
// //     },
// //     MuiDialog: {
// //       styleOverrides: {
// //         paper: {
// //           borderRadius: 12,
// //           border: "2px solid #FF9933",
// //           background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F5 100%)",
// //         },
// //       },
// //     },
// //   },
// // });

// // const Screen = () => {
// //   const [result, setResult] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [showOtpPopup, setShowOtpPopup] = useState(false);
// //   const [otp, setOtp] = useState("");
// //   const [mobileNumber, setMobileNumber] = useState("");
// //   const [regions, setRegions] = useState([]);
// //   const [states, setStates] = useState([]);
// //   const [districts, setDistricts] = useState([]);
// //   const [zones, setZones] = useState([]);
// //   const [taluks, setTaluks] = useState([]);
// //   const [wards, setWards] = useState([]);
// //   const [pincodes, setPincodes] = useState([]);
// //   const [selectedState, setSelectedState] = useState("");
// //   const [selectedDistrict, setSelectedDistrict] = useState("");
// //   const [selectedZone, setSelectedZone] = useState("");
// //   const [selectedTaluk, setSelectedTaluk] = useState("");
// //   const [selectedWard, setSelectedWard] = useState("");
// //   const [selectedPincode, setSelectedPincode] = useState("");
// //   const [regionId, setRegionId] = useState("");
// //   const webcamRef = useRef(null);

// //   useEffect(() => {
// //     const fetchRegions = async () => {
// //       try {
// //         const response = await axios.get("http://127.0.0.1:3000/regions");
// //         setRegions(response.data.regions || []);
// //         const uniqueStates = [...new Set(response.data.regions.map((r) => r.state))]
// //           .sort()
// //           .map((s) => ({ value: s, label: s }));
// //         setStates(uniqueStates);
// //       } catch (error) {
// //         console.error("Error fetching regions:", error);
// //       }
// //     };
// //     fetchRegions();
// //   }, []);

// //   useEffect(() => {
// //     const filteredDistricts = [
// //       ...new Set(
// //         regions
// //           .filter(
// //             (region) =>
// //               selectedState === "" || region.state === selectedState
// //           )
// //           .map((region) => region.district)
// //       ),
// //     ]
// //       .sort()
// //       .map((district) => ({ value: district, label: district }));
// //     setDistricts(filteredDistricts);
// //     if (
// //       selectedDistrict !== "" &&
// //       !filteredDistricts.some((d) => d.value === selectedDistrict)
// //     ) {
// //       setSelectedDistrict("");
// //     }
// //   }, [selectedState, regions]);

// //   useEffect(() => {
// //     const filteredZones = [
// //       ...new Set(
// //         regions
// //           .filter(
// //             (region) =>
// //               (selectedState === "" || region.state === selectedState) &&
// //               (selectedDistrict === "" ||
// //                 region.district === selectedDistrict)
// //           )
// //           .map((region) => region.zone)
// //       ),
// //     ]
// //       .sort()
// //       .map((zone) => ({ value: zone, label: zone }));
// //     setZones(filteredZones);
// //     if (
// //       selectedZone !== "" &&
// //       !filteredZones.some((z) => z.value === selectedZone)
// //     ) {
// //       setSelectedZone("");
// //     }
// //   }, [selectedDistrict, selectedState, regions]);

// //   useEffect(() => {
// //     const filteredTaluks = [
// //       ...new Set(
// //         regions
// //           .filter(
// //             (region) =>
// //               (selectedState === "" || region.state === selectedState) &&
// //               (selectedDistrict === "" ||
// //                 region.district === selectedDistrict) &&
// //               (selectedZone === "" || region.zone === selectedZone)
// //           )
// //           .map((region) => region.taluk)
// //       ),
// //     ]
// //       .sort()
// //       .map((taluk) => ({ value: taluk, label: taluk }));
// //     setTaluks(filteredTaluks);
// //     if (
// //       selectedTaluk !== "" &&
// //       !filteredTaluks.some((t) => t.value === selectedTaluk)
// //     ) {
// //       setSelectedTaluk("");
// //     }
// //   }, [selectedZone, selectedDistrict, selectedState, regions]);

// //   useEffect(() => {
// //     const filteredWards = [
// //       ...new Set(
// //         regions
// //           .filter(
// //             (region) =>
// //               (selectedState === "" || region.state === selectedState) &&
// //               (selectedDistrict === "" ||
// //                 region.district === selectedDistrict) &&
// //               (selectedZone === "" || region.zone === selectedZone) &&
// //               (selectedTaluk === "" || region.taluk === selectedTaluk)
// //           )
// //           .map((region) => region.wardNo)
// //       ),
// //     ]
// //       .sort((a, b) => a - b)
// //       .map((wardNo) => ({ value: wardNo, label: wardNo }));
// //     setWards(filteredWards);
// //     if (
// //       selectedWard !== "" &&
// //       !filteredWards.some((w) => w.value === selectedWard)
// //     ) {
// //       setSelectedWard("");
// //     }
// //   }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

// //   useEffect(() => {
// //     const filteredPincodes = [
// //       ...new Set(
// //         regions
// //           .filter(
// //             (region) =>
// //               (selectedState === "" || region.state === selectedState) &&
// //               (selectedDistrict === "" ||
// //                 region.district === selectedDistrict) &&
// //               (selectedZone === "" || region.zone === selectedZone) &&
// //               (selectedTaluk === "" || region.taluk === selectedTaluk) &&
// //               (selectedWard === "" || region.wardNo === selectedWard)
// //           )
// //           .map((region) => region.pincode)
// //       ),
// //     ]
// //       .sort()
// //       .map((pincode) => ({ value: pincode, label: pincode }));
// //     setPincodes(filteredPincodes);
// //     if (
// //       selectedPincode !== "" &&
// //       !filteredPincodes.some((p) => p.value === selectedPincode)
// //     ) {
// //       setSelectedPincode("");
// //     }
// //   }, [
// //     selectedWard,
// //     selectedTaluk,
// //     selectedZone,
// //     selectedDistrict,
// //     selectedState,
// //     regions,
// //   ]);

// //   // const verifyUser = async () => {
// //   //   const imageSrc = webcamRef.current.getScreenshot();
// //   //   if (imageSrc) {
// //   //     setLoading(true);
// //   //     try {
// //   //       const response = await axios.post("http://127.0.0.1:5000/recognize", {
// //   //         image: imageSrc.split(",")[1],
// //   //         region: {
// //   //           state: selectedState || undefined,
// //   //           district: selectedDistrict || undefined,
// //   //           zone: selectedZone || undefined,
// //   //           taluk: selectedTaluk || undefined,
// //   //           wardNo: selectedWard || undefined,
// //   //           pincode: selectedPincode || undefined,
// //   //         },
// //   //       });

// //   //       console.log("Recognition response:", response.data);

// //   //       if (response.data.error) throw new Error(response.data.error);

// //   //       if (response.data.name) {
// //   //         if (response.data.message === "Already voted") {
// //   //           setResult("You have already voted. No further actions required.");
// //   //         } else if (response.data.message === "Region mismatch") {
// //   //           setResult("Voter does not belong to the selected region.");
// //   //         } else {
// //   //           setMobileNumber(response.data.mobileNumber);
// //   //           setShowOtpPopup(true);
// //   //           setResult("Face recognized. OTP sent to your mobile number.");
// //   //         }
// //   //       }
// //   //     } catch (error) {
// //   //       console.error("Error verifying user:", error);
// //   //       setResult("Error verifying user. Please try again.");
// //   //     } finally {
// //   //       setLoading(false);
// //   //     }
// //   //   } else {
// //   //     setResult("Please capture an image to proceed.");
// //   //   }
// //   // };

// //   // const verifyOtp = async () => {
// //   //   try {
// //   //     const response = await axios.post("http://127.0.0.1:5000/verify-otp", {
// //   //       mobileNumber,
// //   //       otp,
// //   //     });

// //   //     if (response.data.success) {
// //   //       // socket.emit("verifiedVoter", {
// //   //       //   region: {
// //   //       //     state: selectedState || undefined,
// //   //       //     district: selectedDistrict || undefined,
// //   //       //     zone: selectedZone || undefined,
// //   //       //     taluk: selectedTaluk || undefined,
// //   //       //     wardNo: selectedWard || undefined,
// //   //       //     pincode: selectedPincode || undefined,
// //   //       //   },
// //   //       //   voter: response.data.voter,
// //   //       // });
// //   //       setResult("OTP verified. Vote submitted successfully.");
// //   //       setShowOtpPopup(false);
// //   //     } else {
// //   //       setResult("Incorrect OTP. Please try again.");
// //   //     }
// //   //   } catch (error) {
// //   //     console.error("Error verifying OTP:", error);
// //   //     setResult(
// //   //       `Error verifying OTP: ${
// //   //         error.response ? error.response.data.message : error.message
// //   //       }`
// //   //     );
// //   //   }
// //   // };
// // const verifyUser = async () => {
// //     const imageSrc = webcamRef.current.getScreenshot();
// //     if (imageSrc) {
// //       setLoading(true);
// //       try {
// //         const response = await axios.post("http://127.0.0.1:5000/recognize", {
// //           image: imageSrc.split(",")[1],
// //           region: {
// //             state: selectedState || undefined,
// //             district: selectedDistrict || undefined,
// //             zone: selectedZone || undefined,
// //             taluk: selectedTaluk || undefined,
// //             wardNo: selectedWard || undefined,
// //             pincode: selectedPincode || undefined,
// //           },
// //         });

// //         console.log("Recognition response:", response.data);

// //         if (response.data.error) throw new Error(response.data.error);

// //         if (response.data.name) {
// //           if (response.data.message === "Already voted") {
// //             setResult("You have already voted. No further actions required.");
// //           } else if (response.data.message === "Region mismatch") {
// //             setResult("Voter does not belong to the selected region.");
// //           } else {
// //             setMobileNumber(response.data.mobileNumber);
// //             setRegionId(response.data.regionId); // Store regionId from response
// //             setShowOtpPopup(true);
// //             setResult("Face recognized. OTP sent to your mobile number.");
// //           }
// //         }
// //       } catch (error) {
// //         console.error("Error verifying user:", error);
// //         setResult("Error verifying user. Please try again.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     } else {
// //       setResult("Please capture an image to proceed.");
// //     }
// //   };

// //   const verifyOtp = async () => {
// //     try {
// //       const response = await axios.post("http://127.0.0.1:5000/verify-otp", {
// //         mobileNumber,
// //         otp,
// //       });

// //       if (response.data.success) {
// //         socket.emit("verifiedVoter", {
// //           regionId: regionId, // Pass regionId
// //           voterId: response.data.voterId, // Assuming voterId is returned
// //         });
// //         setResult("OTP verified. Voting interface unlocked.");
// //         setShowOtpPopup(false);
// //       } else {
// //         setResult("Incorrect OTP. Please try again.");
// //       }
// //     } catch (error) {
// //       console.error("Error verifying OTP:", error);
// //       setResult(
// //         `Error verifying OTP: ${
// //           error.response ? error.response.data.message : error.message
// //         }`
// //       );
// //     }
// //   };

// //   return (
// //     <ThemeProvider theme={theme}>
// //       <Box
// //         sx={{
// //           background:
// //             "linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //           justifyContent: "center",
// //           height: "100vh",
// //         }}
// //       >
// //         <Typography
// //           variant="h4"
// //           align="center"
// //           gutterBottom
// //           sx={{
// //             background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
// //             WebkitBackgroundClip: "text",
// //             WebkitTextFillColor: "transparent",
// //             fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
// //             mb: { xs: 3, sm: 4 },
// //             display: "flex",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             fontWeight: 700,
// //             letterSpacing: "0.5px",
// //             textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
// //             position: "relative",
// //             "&::before": {
// //               content: '""',
// //               position: "absolute",
// //               bottom: -8,
// //               left: "50%",
// //               transform: "translateX(-50%)",
// //               width: "60%",
// //               height: "3px",
// //               background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
// //               borderRadius: 2,
// //             },
// //           }}
// //         >
// //           <VerifiedIcon
// //             sx={{
// //               fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
// //               mr: 1.5,
// //               borderRadius: "50%",
// //               p: 0.5,
// //             //   boxShadow: "0 4px 8px rgba(0, 40, 185, 0.3)",
// //             //   border: "2px solid #0028b9ff",
// //             }}
// //           />
// //           Voter Verification System
// //         </Typography>
// //         <Box sx={{ width: "80%" }}>
// //           <Box
// //             container
// //             spacing={{ xs: 2, sm: 3, md: 4 }}
// //             sx={{
// //               display: "flex",
// //               alignItems: "space-between",
// //               justifyContent: "space-between",
// //               gap: 5,
// //             }}
// //           >
// //             {/* Left Panel - Camera */}
// //             <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
// //               <Card sx={{ minHeight: { xs: 400, sm: 500, md: 600 } }}>
// //                 <CardContent
// //                   sx={{ flex: 1, display: "flex", flexDirection: "column" }}
// //                 >
// //                   <Typography variant="h6" gutterBottom>
// //                     <CameraAltIcon
// //                       sx={{ verticalAlign: "middle", mr: 1, color: "#138808" }}
// //                     />
// //                     Live Camera Feed
// //                   </Typography>
// //                   <Fade in={true} timeout={1000}>
// //                     <Box
// //                       sx={{
// //                         borderRadius: 2,
// //                         overflow: "hidden",
// //                         border: "2px solid #FF9933",
// //                         flex: 1,
// //                         display: "flex",
// //                       }}
// //                     >
// //                       <Webcam
// //                         ref={webcamRef}
// //                         audio={false}
// //                         screenshotFormat="image/jpeg"
// //                         style={{
// //                           width: "100%",
// //                           height: "100%",
// //                           objectFit: "cover",
// //                           borderRadius: 8,
// //                         }}
// //                       />
// //                     </Box>
// //                   </Fade>
// //                 </CardContent>
// //               </Card>
// //             </Grid>

// //             {/* Right Panel - Verification */}
// //             <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
// //               <Card sx={{ minHeight: { xs: 400, sm: 500, md: 600 } }}>
// //                 <CardContent
// //                   sx={{
// //                     flex: 1,
// //                     display: "flex",
// //                     flexDirection: "column",
// //                     gap: 2,
// //                   }}
// //                 >
// //                   <Typography variant="h6" gutterBottom>
// //                     <VerifiedIcon
// //                       sx={{ verticalAlign: "middle", mr: 1, color: "#FF9933" }}
// //                     />
// //                     Voter Verification
// //                   </Typography>
// //                   <TextField
// //                     select
// //                     label="State"
// //                     value={selectedState}
// //                     onChange={(e) => setSelectedState(e.target.value)}
// //                     fullWidth
// //                     variant="outlined"
// //                   >
// //                     {states.map((s) => (
// //                       <MenuItem key={s.value} value={s.value}>
// //                         {s.label}
// //                       </MenuItem>
// //                     ))}
// //                   </TextField>
// //                   <TextField
// //                     select
// //                     label="District"
// //                     value={selectedDistrict}
// //                     onChange={(e) => setSelectedDistrict(e.target.value)}
// //                     fullWidth
// //                     variant="outlined"
// //                   >
// //                     {districts.map((d) => (
// //                       <MenuItem key={d.value} value={d.value}>
// //                         {d.label}
// //                       </MenuItem>
// //                     ))}
// //                   </TextField>
// //                   <TextField
// //                     select
// //                     label="Zone"
// //                     value={selectedZone}
// //                     onChange={(e) => setSelectedZone(e.target.value)}
// //                     fullWidth
// //                     variant="outlined"
// //                   >
// //                     {zones.map((z) => (
// //                       <MenuItem key={z.value} value={z.value}>
// //                         {z.label}
// //                       </MenuItem>
// //                     ))}
// //                   </TextField>
// //                   <TextField
// //                     select
// //                     label="Taluk"
// //                     value={selectedTaluk}
// //                     onChange={(e) => setSelectedTaluk(e.target.value)}
// //                     fullWidth
// //                     variant="outlined"
// //                   >
// //                     {taluks.map((t) => (
// //                       <MenuItem key={t.value} value={t.value}>
// //                         {t.label}
// //                       </MenuItem>
// //                     ))}
// //                   </TextField>
// //                   <TextField
// //                     select
// //                     label="Ward No"
// //                     value={selectedWard}
// //                     onChange={(e) => setSelectedWard(e.target.value)}
// //                     fullWidth
// //                     variant="outlined"
// //                   >
// //                     {wards.map((w) => (
// //                       <MenuItem key={w.value} value={w.value}>
// //                         {w.label}
// //                       </MenuItem>
// //                     ))}
// //                   </TextField>
// //                   <TextField
// //                     select
// //                     label="Pincode"
// //                     value={selectedPincode}
// //                     onChange={(e) => setSelectedPincode(e.target.value)}
// //                     fullWidth
// //                     variant="outlined"
// //                   >
// //                     {pincodes.map((p) => (
// //                       <MenuItem key={p.value} value={p.value}>
// //                         {p.label}
// //                       </MenuItem>
// //                     ))}
// //                   </TextField>
// //                   <Button
// //                     variant="contained"
// //                     color="primary"
// //                     onClick={verifyUser}
// //                     disabled={loading}
// //                     startIcon={
// //                       loading ? (
// //                         <CircularProgress size={20} sx={{ color: "#138808" }} />
// //                       ) : (
// //                         <VerifiedIcon />
// //                       )
// //                     }
// //                     sx={{ mt: 2 }}
// //                   >
// //                     {loading ? "Verifying..." : "Verify Face"}
// //                   </Button>
// //                   {result && (
// //                     <Fade in={true} timeout={500}>
// //                       <Typography
// //                         variant="body1"
// //                         sx={{
// //                           mt: 2,
// //                           p: 2,
// //                           borderRadius: 2,
// //                           backgroundColor:
// //                             result.includes("Error") ||
// //                             result.includes("mismatch") ||
// //                             result.includes("already voted")
// //                               ? "rgba(255, 0, 0, 0.1)"
// //                               : "rgba(19, 136, 8, 0.1)",
// //                           color:
// //                             result.includes("Error") ||
// //                             result.includes("mismatch") ||
// //                             result.includes("already voted")
// //                               ? "#D32F2F"
// //                               : "#138808",
// //                           border: "1px solid",
// //                           borderColor:
// //                             result.includes("Error") ||
// //                             result.includes("mismatch") ||
// //                             result.includes("already voted")
// //                               ? "#D32F2F"
// //                               : "#138808",
// //                         }}
// //                       >
// //                         {result}
// //                       </Typography>
// //                     </Fade>
// //                   )}
// //                 </CardContent>
// //               </Card>
// //             </Grid>
// //           </Box>
// //         </Box>

// //         {/* OTP Dialog */}
// //         <Dialog open={showOtpPopup} onClose={() => setShowOtpPopup(false)}>
// //           <DialogTitle sx={{ color: "#000080", fontWeight: 600 }}>
// //             Enter OTP
// //           </DialogTitle>
// //           <DialogContent>
// //             <Typography variant="body2" gutterBottom sx={{ color: "#000080" }}>
// //               Enter the OTP sent to your mobile number {mobileNumber}
// //             </Typography>
// //             <TextField
// //               autoFocus
// //               margin="dense"
// //               label="OTP"
// //               type="text"
// //               fullWidth
// //               value={otp}
// //               onChange={(e) => setOtp(e.target.value)}
// //               inputProps={{ maxLength: 6 }}
// //               variant="outlined"
// //             />
// //           </DialogContent>
// //           <DialogActions>
// //             <Button onClick={() => setShowOtpPopup(false)} color="secondary">
// //               Cancel
// //             </Button>
// //             <Button onClick={verifyOtp} color="primary" variant="contained">
// //               Submit
// //             </Button>
// //           </DialogActions>
// //         </Dialog>
// //       </Box>
// //     </ThemeProvider>
// //   );
// // };

// // export default Screen;

// import React, { useState, useEffect, useRef } from "react";
// import Webcam from "react-webcam";
// import axios from "axios";
// import {
//   Grid,
//   Button,
//   Typography,
//   TextField,
//   MenuItem,
//   CircularProgress,
//   Box,
//   Card,
//   CardContent,
//   Fade,
// } from "@mui/material";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import VerifiedIcon from "@mui/icons-material/Verified";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#FF9933", // Saffron
//     },
//     secondary: {
//       main: "#138808", // Green
//     },
//     background: {
//       default: "#FFFFFF", // White
//     },
//     text: {
//       primary: "#000080", // Navy Blue
//       secondary: "#4B0082", // Darker blue for contrast
//     },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//     h4: {
//       fontWeight: 700,
//       color: "#000080",
//       textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
//     },
//     h6: {
//       fontWeight: 600,
//       color: "#000080",
//     },
//     body1: {
//       color: "#000080",
//     },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           borderRadius: 8,
//           textTransform: "none",
//           fontWeight: 600,
//           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
//           "&:hover": {
//             boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
//             backgroundColor: "#e68a00",
//           },
//         },
//       },
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           "& .MuiOutlinedInput-root": {
//             borderRadius: 8,
//             backgroundColor: "#F5F6F5",
//             "&:hover fieldset": {
//               borderColor: "#FF9933",
//             },
//             "&.Mui-focused fieldset": {
//               borderColor: "#138808",
//             },
//           },
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//           boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//           border: "1px solid #FF9933",
//           background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F5 100%)",
//           display: "flex",
//           flexDirection: "column",
//           height: "100%",
//         },
//       },
//     },
//   },
// });

// const Screen = () => {
//   const [result, setResult] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [regions, setRegions] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [taluks, setTaluks] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [pincodes, setPincodes] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedZone, setSelectedZone] = useState("");
//   const [selectedTaluk, setSelectedTaluk] = useState("");
//   const [selectedWard, setSelectedWard] = useState("");
//   const [selectedPincode, setSelectedPincode] = useState("");
//   const webcamRef = useRef(null);

//   useEffect(() => {
//     const fetchRegions = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:3000/regions");
//         setRegions(response.data.regions || []);
//         const uniqueStates = [...new Set(response.data.regions.map((r) => r.state))]
//           .sort()
//           .map((s) => ({ value: s, label: s }));
//         setStates(uniqueStates);
//       } catch (error) {
//         console.error("Error fetching regions:", error);
//       }
//     };
//     fetchRegions();
//   }, []);

//   useEffect(() => {
//     const filteredDistricts = [
//       ...new Set(
//         regions
//           .filter(
//             (region) =>
//               selectedState === "" || region.state === selectedState
//           )
//           .map((region) => region.district)
//       ),
//     ]
//       .sort()
//       .map((district) => ({ value: district, label: district }));
//     setDistricts(filteredDistricts);
//     if (
//       selectedDistrict !== "" &&
//       !filteredDistricts.some((d) => d.value === selectedDistrict)
//     ) {
//       setSelectedDistrict("");
//     }
//   }, [selectedState, regions]);

//   useEffect(() => {
//     const filteredZones = [
//       ...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "" || region.state === selectedState) &&
//               (selectedDistrict === "" ||
//                 region.district === selectedDistrict)
//           )
//           .map((region) => region.zone)
//       ),
//     ]
//       .sort()
//       .map((zone) => ({ value: zone, label: zone }));
//     setZones(filteredZones);
//     if (
//       selectedZone !== "" &&
//       !filteredZones.some((z) => z.value === selectedZone)
//     ) {
//       setSelectedZone("");
//     }
//   }, [selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredTaluks = [
//       ...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "" || region.state === selectedState) &&
//               (selectedDistrict === "" ||
//                 region.district === selectedDistrict) &&
//               (selectedZone === "" || region.zone === selectedZone)
//           )
//           .map((region) => region.taluk)
//       ),
//     ]
//       .sort()
//       .map((taluk) => ({ value: taluk, label: taluk }));
//     setTaluks(filteredTaluks);
//     if (
//       selectedTaluk !== "" &&
//       !filteredTaluks.some((t) => t.value === selectedTaluk)
//     ) {
//       setSelectedTaluk("");
//     }
//   }, [selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredWards = [
//       ...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "" || region.state === selectedState) &&
//               (selectedDistrict === "" ||
//                 region.district === selectedDistrict) &&
//               (selectedZone === "" || region.zone === selectedZone) &&
//               (selectedTaluk === "" || region.taluk === selectedTaluk)
//           )
//           .map((region) => region.wardNo)
//       ),
//     ]
//       .sort((a, b) => a - b)
//       .map((wardNo) => ({ value: wardNo, label: wardNo }));
//     setWards(filteredWards);
//     if (
//       selectedWard !== "" &&
//       !filteredWards.some((w) => w.value === selectedWard)
//     ) {
//       setSelectedWard("");
//     }
//   }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

//   useEffect(() => {
//     const filteredPincodes = [
//       ...new Set(
//         regions
//           .filter(
//             (region) =>
//               (selectedState === "" || region.state === selectedState) &&
//               (selectedDistrict === "" ||
//                 region.district === selectedDistrict) &&
//               (selectedZone === "" || region.zone === selectedZone) &&
//               (selectedTaluk === "" || region.taluk === selectedTaluk) &&
//               (selectedWard === "" || region.wardNo === selectedWard)
//           )
//           .map((region) => region.pincode)
//       ),
//     ]
//       .sort()
//       .map((pincode) => ({ value: pincode, label: pincode }));
//     setPincodes(filteredPincodes);
//     if (
//       selectedPincode !== "" &&
//       !filteredPincodes.some((p) => p.value === selectedPincode)
//     ) {
//       setSelectedPincode("");
//     }
//   }, [
//     selectedWard,
//     selectedTaluk,
//     selectedZone,
//     selectedDistrict,
//     selectedState,
//     regions,
//   ]);

//   const verifyUser = async () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     if (imageSrc) {
//       setLoading(true);
//       try {
//         const response = await axios.post("http://127.0.0.1:5000/recognize", {
//           image: imageSrc.split(",")[1],
//           region: {
//             state: selectedState || undefined,
//             district: selectedDistrict || undefined,
//             zone: selectedZone || undefined,
//             taluk: selectedTaluk || undefined,
//             wardNo: selectedWard || undefined,
//             pincode: selectedPincode || undefined,
//           },
//         });

//         console.log("Recognition response:", response.data);

//         if (response.data.error) throw new Error(response.data.error);

//         if (response.data.name) {
//           if (response.data.message === "Already voted") {
//             setResult("You have already voted. No further actions required.");
//           } else if (response.data.message === "Region mismatch") {
//             setResult("Voter does not belong to the selected region.");
//           } else {
//             setResult("Face recognized. Voting interface unlocked.");
//           }
//         }
//       } catch (error) {
//         console.error("Error verifying user:", error);
//         setResult("Error verifying user. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setResult("Please capture an image to proceed.");
//     }
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           background:
//             "linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100vh",
//         }}
//       >
//         <Typography
//           variant="h4"
//           align="center"
//           gutterBottom
//           sx={{
//             background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
//             WebkitBackgroundClip: "text",
//             WebkitTextFillColor: "transparent",
//             fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
//             mb: { xs: 3, sm: 4 },
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontWeight: 700,
//             letterSpacing: "0.5px",
//             textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//             position: "relative",
//             "&::before": {
//               content: '""',
//               position: "absolute",
//               bottom: -8,
//               left: "50%",
//               transform: "translateX(-50%)",
//               width: "60%",
//               height: "3px",
//               background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
//               borderRadius: 2,
//             },
//           }}
//         >
//           <VerifiedIcon
//             sx={{
//               fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
//               mr: 1.5,
//               borderRadius: "50%",
//               p: 0.5,
//             }}
//           />
//           Voter Verification System
//         </Typography>
//         <Box sx={{ width: "80%" }}>
//           <Box
//             container
//             spacing={{ xs: 2, sm: 3, md: 4 }}
//             sx={{
//               display: "flex",
//               alignItems: "space-between",
//               justifyContent: "space-between",
//               gap: 5,
//             }}
//           >
//             {/* Left Panel - Camera */}
//             <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
//               <Card sx={{ minHeight: { xs: 400, sm: 500, md: 600 } }}>
//                 <CardContent
//                   sx={{ flex: 1, display: "flex", flexDirection: "column" }}
//                 >
//                   <Typography variant="h6" gutterBottom>
//                     <CameraAltIcon
//                       sx={{ verticalAlign: "middle", mr: 1, color: "#138808" }}
//                     />
//                     Live Camera Feed
//                   </Typography>
//                   <Fade in={true} timeout={1000}>
//                     <Box
//                       sx={{
//                         borderRadius: 2,
//                         overflow: "hidden",
//                         border: "2px solid #FF9933",
//                         flex: 1,
//                         display: "flex",
//                       }}
//                     >
//                       <Webcam
//                         ref={webcamRef}
//                         audio={false}
//                         screenshotFormat="image/jpeg"
//                         style={{
//                           width: "100%",
//                           height: "100%",
//                           objectFit: "cover",
//                           borderRadius: 8,
//                         }}
//                       />
//                     </Box>
//                   </Fade>
//                 </CardContent>
//               </Card>
//             </Grid>

//             {/* Right Panel - Verification */}
//             <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
//               <Card sx={{ minHeight: { xs: 400, sm: 500, md: 600 } }}>
//                 <CardContent
//                   sx={{
//                     flex: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 2,
//                   }}
//                 >
//                   <Typography variant="h6" gutterBottom>
//                     <VerifiedIcon
//                       sx={{ verticalAlign: "middle", mr: 1, color: "#FF9933" }}
//                     />
//                     Voter Verification
//                   </Typography>
//                   <TextField
//                     select
//                     label="State"
//                     value={selectedState}
//                     onChange={(e) => setSelectedState(e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                   >
//                     {states.map((s) => (
//                       <MenuItem key={s.value} value={s.value}>
//                         {s.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <TextField
//                     select
//                     label="District"
//                     value={selectedDistrict}
//                     onChange={(e) => setSelectedDistrict(e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                   >
//                     {districts.map((d) => (
//                       <MenuItem key={d.value} value={d.value}>
//                         {d.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <TextField
//                     select
//                     label="Zone"
//                     value={selectedZone}
//                     onChange={(e) => setSelectedZone(e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                   >
//                     {zones.map((z) => (
//                       <MenuItem key={z.value} value={z.value}>
//                         {z.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <TextField
//                     select
//                     label="Taluk"
//                     value={selectedTaluk}
//                     onChange={(e) => setSelectedTaluk(e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                   >
//                     {taluks.map((t) => (
//                       <MenuItem key={t.value} value={t.value}>
//                         {t.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <TextField
//                     select
//                     label="Ward No"
//                     value={selectedWard}
//                     onChange={(e) => setSelectedWard(e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                   >
//                     {wards.map((w) => (
//                       <MenuItem key={w.value} value={w.value}>
//                         {w.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <TextField
//                     select
//                     label="Pincode"
//                     value={selectedPincode}
//                     onChange={(e) => setSelectedPincode(e.target.value)}
//                     fullWidth
//                     variant="outlined"
//                   >
//                     {pincodes.map((p) => (
//                       <MenuItem key={p.value} value={p.value}>
//                         {p.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={verifyUser}
//                     disabled={loading}
//                     startIcon={
//                       loading ? (
//                         <CircularProgress size={20} sx={{ color: "#138808" }} />
//                       ) : (
//                         <VerifiedIcon />
//                       )
//                     }
//                     sx={{ mt: 2 }}
//                   >
//                     {loading ? "Verifying..." : "Verify Face"}
//                   </Button>
//                   {result && (
//                     <Fade in={true} timeout={500}>
//                       <Typography
//                         variant="body1"
//                         sx={{
//                           mt: 2,
//                           p: 2,
//                           borderRadius: 2,
//                           backgroundColor:
//                             result.includes("Error") ||
//                             result.includes("mismatch") ||
//                             result.includes("already voted")
//                               ? "rgba(255, 0, 0, 0.1)"
//                               : "rgba(19, 136, 8, 0.1)",
//                           color:
//                             result.includes("Error") ||
//                             result.includes("mismatch") ||
//                             result.includes("already voted")
//                               ? "#D32F2F"
//                               : "#138808",
//                           border: "1px solid",
//                           borderColor:
//                             result.includes("Error") ||
//                             result.includes("mismatch") ||
//                             result.includes("already voted")
//                               ? "#D32F2F"
//                               : "#138808",
//                         }}
//                       >
//                         {result}
//                       </Typography>
//                     </Fade>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default Screen;

import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const C = { saffron: "#FF9933", green: "#138808", greenLight: "#1aad0a", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };
const field = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none", transition: "border-color 0.2s" };
const sel = { ...field, WebkitAppearance: "none", appearance: "none", cursor: "pointer", paddingRight: 36, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23FF9933' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "12px" };
const lbl = { fontSize: 11, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6, display: "block" };
const focusOn = e => { e.target.style.borderColor = "rgba(255,153,51,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,153,51,0.08)"; };
const focusOff = e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; };

const Screen = () => {
  const webcamRef = useRef(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [taluks, setTaluks] = useState([]);
  const [wards, setWards] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/regions").then(res => {
      setRegions(res.data.regions || []);
      setStates([...new Set(res.data.regions.map(r => r.state))].sort().map(s => ({ value: s, label: s })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const d = [...new Set(regions.filter(r => !selectedState || r.state === selectedState).map(r => r.district))].sort().map(v => ({ value: v, label: v }));
    setDistricts(d);
    if (selectedDistrict && !d.some(x => x.value === selectedDistrict)) setSelectedDistrict("");
  }, [selectedState, regions]);

  useEffect(() => {
    const z = [...new Set(regions.filter(r => (!selectedState || r.state === selectedState) && (!selectedDistrict || r.district === selectedDistrict)).map(r => r.zone))].sort().map(v => ({ value: v, label: v }));
    setZones(z);
    if (selectedZone && !z.some(x => x.value === selectedZone)) setSelectedZone("");
  }, [selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const t = [...new Set(regions.filter(r => (!selectedState || r.state === selectedState) && (!selectedDistrict || r.district === selectedDistrict) && (!selectedZone || r.zone === selectedZone)).map(r => r.taluk))].sort().map(v => ({ value: v, label: v }));
    setTaluks(t);
    if (selectedTaluk && !t.some(x => x.value === selectedTaluk)) setSelectedTaluk("");
  }, [selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const w = [...new Set(regions.filter(r => (!selectedState || r.state === selectedState) && (!selectedDistrict || r.district === selectedDistrict) && (!selectedZone || r.zone === selectedZone) && (!selectedTaluk || r.taluk === selectedTaluk)).map(r => r.wardNo))].sort((a, b) => a - b).map(v => ({ value: String(v), label: v }));
    setWards(w);
    if (selectedWard && !w.some(x => x.value === selectedWard)) setSelectedWard("");
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const p = [...new Set(regions.filter(r => (!selectedState || r.state === selectedState) && (!selectedDistrict || r.district === selectedDistrict) && (!selectedZone || r.zone === selectedZone) && (!selectedTaluk || r.taluk === selectedTaluk) && (!selectedWard || String(r.wardNo) === selectedWard)).map(r => r.pincode))].sort().map(v => ({ value: v, label: v }));
    setPincodes(p);
    if (selectedPincode && !p.some(x => x.value === selectedPincode)) setSelectedPincode("");
  }, [selectedWard, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const verifyUser = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) { setResult("Please ensure camera is ready before verifying."); return; }
    setLoading(true); setResult("");
    try {
      const response = await axios.post("http://127.0.0.1:5000/recognize", {
        image: imageSrc.split(",")[1],
        region: { state: selectedState || undefined, district: selectedDistrict || undefined, zone: selectedZone || undefined, taluk: selectedTaluk || undefined, wardNo: selectedWard ? Number(selectedWard) : undefined, pincode: selectedPincode || undefined },
      });
      if (response.data.error) throw new Error(response.data.error);
      if (response.data.name) {
        if (response.data.message === "Already voted") setResult("You have already voted. No further actions required.");
        else if (response.data.message === "Region mismatch") setResult("Voter does not belong to the selected region.");
        else setResult("Face recognized. Voting interface unlocked.");
      }
    } catch (err) {
      setResult("Error verifying user. Please try again.");
    } finally { setLoading(false); }
  };

  const isError = result && (result.includes("Error") || result.includes("mismatch") || result.includes("already voted"));
  const isSuccess = result && !isError;

  const SF = ({ label, value, onChange, options, disabled = false }) => (
    <div>
      <label style={lbl}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        style={{ ...sel, opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
        onFocus={focusOn} onBlur={focusOff}>
        <option value="">Select {label}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0f2e; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse2 { 0%,100%{box-shadow:0 0 0 0 rgba(255,153,51,0.3)} 50%{box-shadow:0 0 0 8px rgba(255,153,51,0)} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.2s ease both; }
        select option { background: #111936; color: #fff; }
        select:focus, input:focus { outline: none; border-color: rgba(255,153,51,0.5) !important; box-shadow: 0 0 0 3px rgba(255,153,51,0.08) !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,153,51,0.25); border-radius: 3px; }
        .verify-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(255,153,51,0.35) !important; }
        .verify-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.navy} 0%, #0d1535 50%, #0a1a10 100%)`, fontFamily: "'Outfit', sans-serif", color: C.white, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* Background effects */}
        <div style={{ position: "fixed", top: "-15%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,153,51,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,153,51,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,51,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "32px 20px 48px" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }} className="fade-up">
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
              {["#FF9933", "#FFFFFF", "#138808"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 12px ${c}` }} />)}
            </div>
            <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: C.saffron, marginBottom: 8, fontWeight: 700 }}>Election Commission of India</div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 900, letterSpacing: "-0.02em", background: `linear-gradient(135deg, ${C.saffron}, ${C.white} 45%, #1aad0a)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 6 }}>
              Voter Verification System
            </h1>
            <p style={{ fontSize: 14, color: C.muted }}>Biometric face recognition · Region-based authentication</p>
          </div>

          {/* Two-panel layout */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "start" }}>

            {/* ── Left: Camera Panel ── */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }} className="fade-up-2">
              {/* Panel top accent */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${C.saffron}, transparent)` }} />
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,153,51,0.12)", border: "1px solid rgba(255,153,51,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📷</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Live Camera Feed</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Position face within frame</div>
                  </div>
                  {/* Live indicator */}
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.green, fontWeight: 600 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse2 2s infinite" }} />
                    LIVE
                  </div>
                </div>

                {/* Camera frame */}
                <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: "2px solid rgba(255,153,51,0.3)", background: "#000", aspectRatio: "4/3" }}>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    onUserMedia={() => setCameraReady(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  {/* Corner brackets overlay */}
                  {["top-left", "top-right", "bottom-left", "bottom-right"].map(corner => {
                    const isTop = corner.includes("top");
                    const isLeft = corner.includes("left");
                    return (
                      <div key={corner} style={{ position: "absolute", [isTop ? "top" : "bottom"]: 12, [isLeft ? "left" : "right"]: 12, width: 20, height: 20, borderTop: isTop ? `2px solid ${C.saffron}` : "none", borderBottom: !isTop ? `2px solid ${C.saffron}` : "none", borderLeft: isLeft ? `2px solid ${C.saffron}` : "none", borderRight: !isLeft ? `2px solid ${C.saffron}` : "none" }} />
                    );
                  })}
                  {/* Scanning line animation */}
                  {loading && (
                    <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.saffron}, transparent)`, animation: "scanline 1.5s linear infinite", top: 0 }} />
                  )}
                </div>

                {/* Camera status */}
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: cameraReady ? C.green : C.muted }}>
                  <span>{cameraReady ? "✓ Camera ready" : "⌛ Initializing camera…"}</span>
                </div>
              </div>
            </div>

            {/* ── Right: Verification Panel ── */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }} className="fade-up-3">
              <div style={{ height: 3, background: `linear-gradient(90deg, ${C.green}, transparent)` }} />
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(19,136,8,0.12)", border: "1px solid rgba(19,136,8,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🗺️</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>Voter Verification</div>
                    <div style={{ fontSize: 11, color: C.muted }}>Select region to narrow search</div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>⬡ Region Filter (Optional)</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <SF label="State" value={selectedState} onChange={setSelectedState} options={states} />
                  <SF label="District" value={selectedDistrict} onChange={setSelectedDistrict} options={districts} disabled={!selectedState} />
                  <SF label="Zone" value={selectedZone} onChange={setSelectedZone} options={zones} disabled={!selectedDistrict} />
                  <SF label="Taluk" value={selectedTaluk} onChange={setSelectedTaluk} options={taluks} disabled={!selectedZone} />
                  <SF label="Ward No" value={selectedWard} onChange={setSelectedWard} options={wards} disabled={!selectedTaluk} />
                  <SF label="Pincode" value={selectedPincode} onChange={setSelectedPincode} options={pincodes} disabled={!selectedWard} />
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 20 }} />

                {/* Verify button */}
                <button
                  onClick={verifyUser}
                  disabled={loading || !cameraReady}
                  className="verify-btn"
                  style={{ width: "100%", background: (loading || !cameraReady) ? "rgba(255,153,51,0.35)" : "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 12, padding: "14px", color: C.navy, fontSize: 15, fontWeight: 800, cursor: (loading || !cameraReady) ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 20px rgba(255,153,51,0.25)", transition: "transform 0.15s, box-shadow 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 18, height: 18, border: "2px solid rgba(10,15,46,0.3)", borderTop: "2px solid #0a0f2e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Verifying Face…
                    </>
                  ) : (
                    <>🔍 Verify Face</>
                  )}
                </button>

                {/* Result message */}
                {result && (
                  <div style={{ marginTop: 16, display: "flex", alignItems: "flex-start", gap: 10, background: isError ? "rgba(255,107,107,0.1)" : "rgba(19,136,8,0.1)", border: `1px solid ${isError ? "rgba(255,107,107,0.3)" : "rgba(19,136,8,0.3)"}`, borderRadius: 12, padding: "14px 16px", color: isError ? "#FF6B6B" : "#4CAF50", fontSize: 14, fontWeight: 500 }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{isError ? "⚠️" : "✓"}</span>
                    <span>{result}</span>
                  </div>
                )}

                {/* Instructions */}
                <div style={{ marginTop: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>How it works</div>
                  {[
                    ["1", "Optionally select your region to narrow the search"],
                    ["2", "Ensure your face is clearly visible in the camera"],
                    ["3", "Click Verify Face to authenticate via biometrics"],
                    ["4", "Upon success, the voting interface unlocks"],
                  ].map(([n, text]) => (
                    <div key={n} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 12, color: C.muted, alignItems: "flex-start" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,153,51,0.15)", border: "1px solid rgba(255,153,51,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.saffron, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{n}</div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 36, color: C.muted, fontSize: 12, letterSpacing: "0.05em" }}>
            🇮🇳 &nbsp; Election Commission of India · Biometric Voter Authentication
          </div>
        </div>

        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    </>
  );
};

export default Screen;