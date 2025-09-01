import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("http://localhost:3000/regions");
        if (response.ok) {
          const data = await response.json();
          setRegions(data.regions);
          const uniqueStates = [
            ...new Set(data.regions.map((region) => region.state)),
          ]
            .sort()
            .map((state) => ({ value: state, label: state }));
          setStates(uniqueStates);
        } else {
          setErrorMessage("Failed to fetch regions. Please try again.");
        }
      } catch (error) {
        setErrorMessage("Error fetching regions. Please try again.");
      }
    };

    fetchRegions();
  }, []);

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
  }, [selectedWardNo, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const handleEnrollParty = async () => {
    if (!partyName || !partyLeader || !partySymbol || !selectedPincode) {
      setErrorMessage("All fields are required.");
      return;
    }

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

      const response = await fetch("http://localhost:3000/enroll-party", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partyName: partyName.toLowerCase(),
          partyLeader: partyLeader.toLowerCase(),
          partySymbol: partySymbol.toLowerCase(),
          regionId: selectedRegion ? selectedRegion._id : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setErrorMessage("");
        setPartyName("");
        setPartyLeader("");
        setPartySymbol("");
        setSelectedState("");
        setSelectedDistrict("");
        setSelectedZone("");
        setSelectedTaluk("");
        setSelectedWardNo("");
        setSelectedPincode("");
      } else {
        const data = await response.json();
        if (response.status === 409) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Failed to enroll party. Please try again.");
        }
      }
    } catch (error) {
      setErrorMessage("Error enrolling party. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: "16px" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "Playfair Display",
            fontStyle: "italic",
            fontWeight: 900,
            color: "#121481",
          }}
        >
          Enroll Party
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
            <TextField
              label="Party Name"
              variant="outlined"
              fullWidth
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
            <TextField
              label="Party Leader"
              variant="outlined"
              fullWidth
              value={partyLeader}
              onChange={(e) => setPartyLeader(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
            <TextField
              label="Party Symbol"
              variant="outlined"
              fullWidth
              value={partySymbol}
              onChange={(e) => setPartySymbol(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
            <TextField
              select
              label="State"
              variant="outlined"
              fullWidth
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              required
              sx={{ minWidth: "200px" }}
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
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
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
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
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
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
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
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
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
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
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
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
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
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
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
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
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
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
          <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" }, minWidth: "200px" }}>
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
              InputProps={{ sx: { height: "48px", fontSize: "1rem" } }}
              InputLabelProps={{ sx: { fontSize: "1rem" } }}
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
        {errorMessage && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnrollParty}
            disabled={loading}
          >
            {loading ? "Enrolling..." : "Enroll Party"}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PartyForm;