import React, { useState, useRef, useEffect } from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MenuItem from "@mui/material/MenuItem";
import Webcam from "react-webcam";
import axios from "axios";

// Define custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff9933",
    },
    secondary: {
      main: "#138808",
    },
  },
});

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

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("http://localhost:3000/regions");
        if (response.ok) {
          const data = await response.json();
          setRegions(data.regions);

          // Extract unique values for each field
          const uniqueStates = [
            ...new Set(data.regions.map((region) => region.state)),
          ]
            .sort()
            .map((state) => ({
              value: state,
              label: state,
            }));
          setStates(uniqueStates);
        } else {
          console.error("Failed to fetch regions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (selectedState) {
      const filteredDistricts = [
        ...new Set(
          regions
            .filter((region) => region.state === selectedState)
            .map((region) => region.district)
        ),
      ]
        .sort()
        .map((district) => ({ value: district, label: district }));
      setDistricts(filteredDistricts);
      setSelectedDistrict("");
      setZones([]);
      setTaluks([]);
      setWardNos([]);
      setPincodes([]);
      setSelectedZone("");
      setSelectedTaluk("");
      setSelectedWardNo("");
      setSelectedPincode("");
    } else {
      setDistricts([]);
      setZones([]);
      setTaluks([]);
      setWardNos([]);
      setPincodes([]);
      setSelectedDistrict("");
      setSelectedZone("");
      setSelectedTaluk("");
      setSelectedWardNo("");
      setSelectedPincode("");
    }
  }, [selectedState, regions]);

  // Update zones when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const filteredZones = [
        ...new Set(
          regions
            .filter(
              (region) =>
                region.state === selectedState &&
                region.district === selectedDistrict
            )
            .map((region) => region.zone)
        ),
      ]
        .sort()
        .map((zone) => ({ value: zone, label: zone }));
      setZones(filteredZones);
      setSelectedZone("");
      setTaluks([]);
      setWardNos([]);
      setPincodes([]);
      setSelectedTaluk("");
      setSelectedWardNo("");
      setSelectedPincode("");
    } else {
      setZones([]);
      setTaluks([]);
      setWardNos([]);
      setPincodes([]);
      setSelectedZone("");
      setSelectedTaluk("");
      setSelectedWardNo("");
      setSelectedPincode("");
    }
  }, [selectedDistrict, selectedState, regions]);

  // Update taluks when zone changes
  useEffect(() => {
    if (selectedZone) {
      const filteredTaluks = [
        ...new Set(
          regions
            .filter(
              (region) =>
                region.state === selectedState &&
                region.district === selectedDistrict &&
                region.zone === selectedZone
            )
            .map((region) => region.taluk)
        ),
      ]
        .sort()
        .map((taluk) => ({ value: taluk, label: taluk }));
      setTaluks(filteredTaluks);
      setSelectedTaluk("");
      setWardNos([]);
      setPincodes([]);
      setSelectedWardNo("");
      setSelectedPincode("");
    } else {
      setTaluks([]);
      setWardNos([]);
      setPincodes([]);
      setSelectedTaluk("");
      setSelectedWardNo("");
      setSelectedPincode("");
    }
  }, [selectedZone, selectedDistrict, selectedState, regions]);

  // Update wardNos when taluk changes
  useEffect(() => {
    if (selectedTaluk) {
      const filteredWardNos = [
        ...new Set(
          regions
            .filter(
              (region) =>
                region.state === selectedState &&
                region.district === selectedDistrict &&
                region.zone === selectedZone &&
                region.taluk === selectedTaluk
            )
            .map((region) => region.wardNo)
        ),
      ]
        .sort((a, b) => a - b)
        .map((wardNo) => ({ value: wardNo, label: wardNo }));
      setWardNos(filteredWardNos);
      setSelectedWardNo("");
      setPincodes([]);
      setSelectedPincode("");
    } else {
      setWardNos([]);
      setPincodes([]);
      setSelectedWardNo("");
      setSelectedPincode("");
    }
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  // Update pincodes when wardNo changes
  useEffect(() => {
    if (selectedWardNo) {
      const filteredPincodes = [
        ...new Set(
          regions
            .filter(
              (region) =>
                region.state === selectedState &&
                region.district === selectedDistrict &&
                region.zone === selectedZone &&
                region.taluk === selectedTaluk &&
                region.wardNo === selectedWardNo
            )
            .map((region) => region.pincode)
        ),
      ]
        .sort()
        .map((pincode) => ({ value: pincode, label: pincode }));
      setPincodes(filteredPincodes);
      setSelectedPincode("");
    } else {
      setPincodes([]);
      setSelectedPincode("");
    }
  }, [
    selectedWardNo,
    selectedTaluk,
    selectedZone,
    selectedDistrict,
    selectedState,
    regions,
  ]);

  const captureImages = async () => {
    const capturedPhotos = [];
    for (let i = 0; i < 20; i++) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        capturedPhotos.push(imageSrc);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setPhotos(capturedPhotos);
  };

  const handleEnroll = async () => {
    try {
      setLoading(true);
      const selectedRegion = regions.find(
        (region) =>
          region.state === selectedState &&
          region.district === selectedDistrict &&
          region.zone === selectedZone &&
          region.taluk === selectedTaluk &&
          region.wardNo === selectedWardNo &&
          region.pincode === selectedPincode
      );
      const payload = {
        title,
        name,
        mobile_number,
        gender,
        maritalStatus,
        spouseName: maritalStatus === "married" ? spouseName : null,
        fatherName: maritalStatus === "unmarried" ? fatherName : null,
        motherName: maritalStatus === "unmarried" ? motherName : null,
        dateOfBirth,
        regionId: selectedRegion ? selectedRegion._id : null,
        image: photos.map((photo) => photo.split(",")[1]),
      };
      const response = await axios.post(
        "http://127.0.0.1:5000/capture",
        payload
      );
      alert("Voter enrolled successfully!");
    } catch (error) {
      console.error("Error enrolling voter:", error);
      alert("Failed to enroll voter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            padding: "16px",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select Title
              </MenuItem>
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Ms">Ms</MenuItem>
              <MenuItem value="Mrs">Mrs</MenuItem>
              <MenuItem value="Dr">Dr</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              value={mobile_number}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              inputProps={{ pattern: "[0-9]*" }}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              label="Date of Birth"
              variant="outlined"
              fullWidth
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="Gender"
              variant="outlined"
              fullWidth
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select Gender
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="Marital Status"
              variant="outlined"
              fullWidth
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select Marital Status
              </MenuItem>
              <MenuItem value="married">Married</MenuItem>
              <MenuItem value="unmarried">Unmarried</MenuItem>
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              label={
                gender === "male"
                  ? "Wife's Name"
                  : gender === "female"
                  ? "Husband's Name"
                  : "Spouse's Name"
              }
              variant="outlined"
              fullWidth
              value={spouseName}
              onChange={(e) => setSpouseName(e.target.value)}
              disabled={maritalStatus !== "married"}
              required={maritalStatus === "married"}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              label="Father's Name"
              variant="outlined"
              fullWidth
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              disabled={maritalStatus !== "unmarried"}
              required={maritalStatus === "unmarried"}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              label="Mother's Name"
              variant="outlined"
              fullWidth
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              disabled={maritalStatus !== "unmarried"}
              required={maritalStatus === "unmarried"}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            />
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="State"
              variant="outlined"
              fullWidth
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select State
              </MenuItem>
              {states.map((state) => (
                <MenuItem key={state.value} value={state.value}>
                  {state.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="District"
              variant="outlined"
              fullWidth
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              required
              disabled={!selectedState}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select District
              </MenuItem>
              {districts.map((district) => (
                <MenuItem key={district.value} value={district.value}>
                  {district.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="Zone"
              variant="outlined"
              fullWidth
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              required
              disabled={!selectedDistrict}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select Zone
              </MenuItem>
              {zones.map((zone) => (
                <MenuItem key={zone.value} value={zone.value}>
                  {zone.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="Taluk"
              variant="outlined"
              fullWidth
              value={selectedTaluk}
              onChange={(e) => setSelectedTaluk(e.target.value)}
              required
              disabled={!selectedZone}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select Taluk
              </MenuItem>
              {taluks.map((taluk) => (
                <MenuItem key={taluk.value} value={taluk.value}>
                  {taluk.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="Ward No"
              variant="outlined"
              fullWidth
              value={selectedWardNo}
              onChange={(e) => setSelectedWardNo(e.target.value)}
              required
              disabled={!selectedTaluk}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select Ward No
              </MenuItem>
              {wardNos.map((wardNo) => (
                <MenuItem key={wardNo.value} value={wardNo.value}>
                  {wardNo.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", sm: "calc(50% - 8px)" },
              minWidth: "200px",
            }}
          >
            <TextField
              select
              label="Pincode"
              variant="outlined"
              fullWidth
              value={selectedPincode}
              onChange={(e) => setSelectedPincode(e.target.value)}
              required
              disabled={!selectedWardNo}
              sx={{ minWidth: "200px" }}
              InputProps={{
                sx: { height: "48px", fontSize: "1rem" },
              }}
              InputLabelProps={{
                sx: { fontSize: "1rem" },
              }}
            >
              <MenuItem value="" disabled>
                Select Pincode
              </MenuItem>
              {pincodes.map((pincode) => (
                <MenuItem key={pincode.value} value={pincode.value}>
                  {pincode.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Capture Photo
          </Typography>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={640}
            height={480}
          />
          <Grid container spacing={2} mt={2}>
            {photos.map((photo, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <img
                  src={photo}
                  alt={`Photo ${index}`}
                  style={{ width: "100%", borderRadius: "5px" }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={captureImages}
            disabled={loading}
            startIcon={<PhotoCameraIcon />}
          >
            {loading ? "Capturing..." : "Capture Images"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEnroll}
            disabled={loading || photos.length === 0 || !selectedPincode}
          >
            Enroll Voter
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default VoterForm;
