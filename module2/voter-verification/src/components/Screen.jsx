import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import io from "socket.io-client";
import {
  Grid,
  Button,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VerifiedIcon from "@mui/icons-material/Verified";

const socket = io("http://127.0.0.1:4000");

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF9933", // Saffron
    },
    secondary: {
      main: "#138808", // Green
    },
    background: {
      default: "#FFFFFF", // White
    },
    text: {
      primary: "#000080", // Navy Blue
      secondary: "#4B0082", // Darker blue for contrast
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: "#000080",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
    },
    h6: {
      fontWeight: 600,
      color: "#000080",
    },
    body1: {
      color: "#000080",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
            backgroundColor: "#e68a00",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#F5F6F5",
            "&:hover fieldset": {
              borderColor: "#FF9933",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#138808",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: "1px solid #FF9933",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F5 100%)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          border: "2px solid #FF9933",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F5 100%)",
        },
      },
    },
  },
});

const Screen = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [regions, setRegions] = useState([]);
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
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:3000/regions");
        setRegions(response.data.regions || []);
        const uniqueStates = [
          { value: "All", label: "All States" },
          ...[...new Set(response.data.regions.map((r) => r.state))]
            .sort()
            .map((s) => ({ value: s, label: s })),
        ];
        setStates(uniqueStates);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const filteredDistricts = [
      { value: "All", label: "All Districts" },
      ...[
        ...new Set(
          regions
            .filter(
              (region) =>
                selectedState === "All" || region.state === selectedState
            )
            .map((region) => region.district)
        ),
      ]
        .sort()
        .map((district) => ({ value: district, label: district })),
    ];
    setDistricts(filteredDistricts);
    if (
      selectedDistrict !== "All" &&
      !filteredDistricts.some((d) => d.value === selectedDistrict)
    ) {
      setSelectedDistrict("All");
    }
  }, [selectedState, regions]);

  useEffect(() => {
    const filteredZones = [
      { value: "All", label: "All Zones" },
      ...[
        ...new Set(
          regions
            .filter(
              (region) =>
                (selectedState === "All" || region.state === selectedState) &&
                (selectedDistrict === "All" ||
                  region.district === selectedDistrict)
            )
            .map((region) => region.zone)
        ),
      ]
        .sort()
        .map((zone) => ({ value: zone, label: zone })),
    ];
    setZones(filteredZones);
    if (
      selectedZone !== "All" &&
      !filteredZones.some((z) => z.value === selectedZone)
    ) {
      setSelectedZone("All");
    }
  }, [selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const filteredTaluks = [
      { value: "All", label: "All Taluks" },
      ...[
        ...new Set(
          regions
            .filter(
              (region) =>
                (selectedState === "All" || region.state === selectedState) &&
                (selectedDistrict === "All" ||
                  region.district === selectedDistrict) &&
                (selectedZone === "All" || region.zone === selectedZone)
            )
            .map((region) => region.taluk)
        ),
      ]
        .sort()
        .map((taluk) => ({ value: taluk, label: taluk })),
    ];
    setTaluks(filteredTaluks);
    if (
      selectedTaluk !== "All" &&
      !filteredTaluks.some((t) => t.value === selectedTaluk)
    ) {
      setSelectedTaluk("All");
    }
  }, [selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const filteredWards = [
      { value: "All", label: "All Wards" },
      ...[
        ...new Set(
          regions
            .filter(
              (region) =>
                (selectedState === "All" || region.state === selectedState) &&
                (selectedDistrict === "All" ||
                  region.district === selectedDistrict) &&
                (selectedZone === "All" || region.zone === selectedZone) &&
                (selectedTaluk === "All" || region.taluk === selectedTaluk)
            )
            .map((region) => region.wardNo)
        ),
      ]
        .sort((a, b) => a - b)
        .map((wardNo) => ({ value: wardNo, label: wardNo })),
    ];
    setWards(filteredWards);
    if (
      selectedWard !== "All" &&
      !filteredWards.some((w) => w.value === selectedWard)
    ) {
      setSelectedWard("All");
    }
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const filteredPincodes = [
      { value: "All", label: "All Pincodes" },
      ...[
        ...new Set(
          regions
            .filter(
              (region) =>
                (selectedState === "All" || region.state === selectedState) &&
                (selectedDistrict === "All" ||
                  region.district === selectedDistrict) &&
                (selectedZone === "All" || region.zone === selectedZone) &&
                (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
                (selectedWard === "All" || region.wardNo === selectedWard)
            )
            .map((region) => region.pincode)
        ),
      ]
        .sort()
        .map((pincode) => ({ value: pincode, label: pincode })),
    ];
    setPincodes(filteredPincodes);
    if (
      selectedPincode !== "All" &&
      !filteredPincodes.some((p) => p.value === selectedPincode)
    ) {
      setSelectedPincode("All");
    }
  }, [
    selectedWard,
    selectedTaluk,
    selectedZone,
    selectedDistrict,
    selectedState,
    regions,
  ]);

  const verifyUser = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setLoading(true);
      try {
        const response = await axios.post("http://127.0.0.1:5000/recognize", {
          image: imageSrc.split(",")[1],
          region: {
            state: selectedState === "All" ? undefined : selectedState,
            district: selectedDistrict === "All" ? undefined : selectedDistrict,
            zone: selectedZone === "All" ? undefined : selectedZone,
            taluk: selectedTaluk === "All" ? undefined : selectedTaluk,
            wardNo: selectedWard === "All" ? undefined : selectedWard,
            pincode: selectedPincode === "All" ? undefined : selectedPincode,
          },
        });

        if (response.data.error) throw new Error(response.data.error);

        if (response.data.name) {
          if (response.data.message === "Already voted") {
            setResult("You have already voted. No further actions required.");
          } else if (response.data.message === "Region mismatch") {
            setResult("Voter does not belong to the selected region.");
          } else {
            setMobileNumber(response.data.mobileNumber);
            setShowOtpPopup(true);
            setResult("Face recognized. OTP sent to your mobile number.");
          }
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setResult("Error verifying user. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setResult("Please capture an image to proceed.");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/verify-otp", {
        mobile: mobileNumber,
        otp,
      });

      if (response.data.success) {
        socket.emit("verifiedVoter", {
          region: {
            state: selectedState === "All" ? undefined : selectedState,
            district: selectedDistrict === "All" ? undefined : selectedDistrict,
            zone: selectedZone === "All" ? undefined : selectedZone,
            taluk: selectedTaluk === "All" ? undefined : selectedTaluk,
            wardNo: selectedWard === "All" ? undefined : selectedWard,
            pincode: selectedPincode === "All" ? undefined : selectedPincode,
          },
          voter: response.data.voter,
        });
        setResult("OTP verified. Vote submitted successfully.");
        setShowOtpPopup(false);
      } else {
        setResult("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setResult(
        `Error verifying OTP: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            mb: { xs: 3, sm: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "3px",
              background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
              borderRadius: 2,
            },
          }}
        >
          <VerifiedIcon
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              mr: 1.5,
              borderRadius: "50%",
              p: 0.5,
            //   boxShadow: "0 4px 8px rgba(0, 40, 185, 0.3)",
            //   border: "2px solid #0028b9ff",
            }}
          />
          Voter Verification System
        </Typography>
        <Box sx={{ width: "80%" }}>
          <Box
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            sx={{
              display: "flex",
              alignItems: "space-between",
              justifyContent: "space-between",
              gap: 5,
            }}
          >
            {/* Left Panel - Camera */}
            <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
              <Card sx={{ minHeight: { xs: 400, sm: 500, md: 600 } }}>
                <CardContent
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" gutterBottom>
                    <CameraAltIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: "#138808" }}
                    />
                    Live Camera Feed
                  </Typography>
                  <Fade in={true} timeout={1000}>
                    <Box
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "2px solid #FF9933",
                        flex: 1,
                        display: "flex",
                      }}
                    >
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    </Box>
                  </Fade>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Panel - Verification */}
            <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
              <Card sx={{ minHeight: { xs: 400, sm: 500, md: 600 } }}>
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    <VerifiedIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: "#FF9933" }}
                    />
                    Voter Verification
                  </Typography>
                  <TextField
                    select
                    label="State"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    fullWidth
                    variant="outlined"
                  >
                    {states.map((s) => (
                      <MenuItem key={s.value} value={s.value}>
                        {s.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="District"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    fullWidth
                    variant="outlined"
                  >
                    {districts.map((d) => (
                      <MenuItem key={d.value} value={d.value}>
                        {d.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Zone"
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    fullWidth
                    variant="outlined"
                  >
                    {zones.map((z) => (
                      <MenuItem key={z.value} value={z.value}>
                        {z.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Taluk"
                    value={selectedTaluk}
                    onChange={(e) => setSelectedTaluk(e.target.value)}
                    fullWidth
                    variant="outlined"
                  >
                    {taluks.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Ward No"
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    fullWidth
                    variant="outlined"
                  >
                    {wards.map((w) => (
                      <MenuItem key={w.value} value={w.value}>
                        {w.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Pincode"
                    value={selectedPincode}
                    onChange={(e) => setSelectedPincode(e.target.value)}
                    fullWidth
                    variant="outlined"
                  >
                    {pincodes.map((p) => (
                      <MenuItem key={p.value} value={p.value}>
                        {p.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={verifyUser}
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={20} sx={{ color: "#138808" }} />
                      ) : (
                        <VerifiedIcon />
                      )
                    }
                    sx={{ mt: 2 }}
                  >
                    {loading ? "Verifying..." : "Verify Face"}
                  </Button>
                  {result && (
                    <Fade in={true} timeout={500}>
                      <Typography
                        variant="body1"
                        sx={{
                          mt: 2,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor:
                            result.includes("Error") ||
                            result.includes("mismatch") ||
                            result.includes("already voted")
                              ? "rgba(255, 0, 0, 0.1)"
                              : "rgba(19, 136, 8, 0.1)",
                          color:
                            result.includes("Error") ||
                            result.includes("mismatch") ||
                            result.includes("already voted")
                              ? "#D32F2F"
                              : "#138808",
                          border: "1px solid",
                          borderColor:
                            result.includes("Error") ||
                            result.includes("mismatch") ||
                            result.includes("already voted")
                              ? "#D32F2F"
                              : "#138808",
                        }}
                      >
                        {result}
                      </Typography>
                    </Fade>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Box>
        </Box>

        {/* OTP Dialog */}
        <Dialog open={showOtpPopup} onClose={() => setShowOtpPopup(false)}>
          <DialogTitle sx={{ color: "#000080", fontWeight: 600 }}>
            Enter OTP
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" gutterBottom sx={{ color: "#000080" }}>
              Enter the OTP sent to your mobile number {mobileNumber}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="OTP"
              type="text"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6 }}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowOtpPopup(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={verifyOtp} color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Screen;
