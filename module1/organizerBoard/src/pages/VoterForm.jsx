import React, { useState, useRef, useEffect } from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MenuItem from "@mui/material/MenuItem";
import Select from "react-select";
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
  const [selectedRegion, setSelectedRegion] = useState("");

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("http://localhost:3000/regions");
        if (response.ok) {
          const data = await response.json();
          setRegions(
            data.regions.map((region) => ({
              value: region._id,
              label: region.name,
            }))
          );
        } else {
          console.error("Failed to fetch regions:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

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
        regionId: selectedRegion ? selectedRegion.value : null,
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 56, 
                },
                "& .MuiSelect-select": {
                  padding: "12px 14px", 
                },
                width: 90, 
              }}
            >
              <MenuItem value="Mr">Mr</MenuItem>
              <MenuItem value="Ms">Ms</MenuItem>
              <MenuItem value="Mrs">Mrs</MenuItem>
              <MenuItem value="Dr">Dr</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mobile Number"
              variant="outlined"
              fullWidth
              value={mobile_number}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              inputProps={{ pattern: "[0-9]*" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              variant="outlined"
              fullWidth
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Gender"
              variant="outlined"
              fullWidth
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 56, 
                },
                "& .MuiSelect-select": {
                  padding: "12px 14px", 
                },
                width: 120, 
              }}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Marital Status"
              variant="outlined"
              fullWidth
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 56, 
                },
                "& .MuiSelect-select": {
                  padding: "12px 14px", 
                },
                width: 160, 
              }}
            >
              <MenuItem value="married">Married</MenuItem>
              <MenuItem value="unmarried">Unmarried</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
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
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Father's Name"
              variant="outlined"
              fullWidth
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              disabled={maritalStatus !== "unmarried"}
              required={maritalStatus === "unmarried"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mother's Name"
              variant="outlined"
              fullWidth
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              disabled={maritalStatus !== "unmarried"}
              required={maritalStatus === "unmarried"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              options={regions}
              value={selectedRegion}
              onChange={setSelectedRegion}
              placeholder="Select Region"
              isClearable
              isSearchable
            />
          </Grid>
        </Grid>
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
            disabled={loading || photos.length === 0}
          >
            Enroll Voter
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default VoterForm;
