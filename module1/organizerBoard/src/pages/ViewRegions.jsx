import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  MenuItem,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { ThemeProvider, createTheme } from "@mui/material/styles";

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
  const [voters, setVoters] = useState([]);
  const [parties, setParties] = useState([]);
  const [openVotersDialog, setOpenVotersDialog] = useState(false);
  const [openPartiesDialog, setOpenPartiesDialog] = useState(false);
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
            { value: "All", label: "All States" },
            ...[...new Set(data.regions.map((region) => region.state))]
              .sort()
              .map((state) => ({ value: state, label: state })),
          ];
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
  }, [selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const filteredWardNos = [
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
    setWardNos(filteredWardNos);
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
                (selectedWardNo === "All" || region.wardNo === selectedWardNo)
            )
            .map((region) => region.pincode)
        ),
      ]
        .sort()
        .map((pincode) => ({ value: pincode, label: pincode })),
    ];
    setPincodes(filteredPincodes);
  }, [
    selectedWardNo,
    selectedTaluk,
    selectedZone,
    selectedDistrict,
    selectedState,
    regions,
  ]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const filtered = regions.filter(
        (region) =>
          (selectedState === "All" || region.state === selectedState) &&
          (selectedDistrict === "All" ||
            region.district === selectedDistrict) &&
          (selectedZone === "All" || region.zone === selectedZone) &&
          (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
          (selectedWardNo === "All" || region.wardNo === selectedWardNo) &&
          (selectedPincode === "All" || region.pincode === selectedPincode)
      );

      if (filtered.length === 0) {
        setErrorMessage("No regions found for the selected criteria.");
        setFilteredRegion([]);
        return;
      }

      setFilteredRegion(
        filtered.map((region) => ({
          ...region,
          numberOfVoters: region.voters ? region.voters.length : 0,
          numberOfParties: region.parties ? region.parties.length : 0,
        }))
      );
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error fetching region data. Please try again.");
      setFilteredRegion([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoters = async (regionId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/regions/${regionId}/voters`
      );
      if (response.ok) {
        const data = await response.json();
        setVoters(data);
        setOpenVotersDialog(true);
      } else {
        setErrorMessage("Failed to fetch voters. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error fetching voters. Please try again.");
    }
  };

  const fetchParties = async (regionId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/regions/${regionId}/parties`
      );
      if (response.ok) {
        const data = await response.json();
        setParties(data);
        setOpenPartiesDialog(true);
      } else {
        setErrorMessage("Failed to fetch parties. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error fetching parties. Please try again.");
    }
  };

  const downloadVotersList = (regionId) => {
    window.open(`http://localhost:3000/regions/${regionId}/download-voters`);
  };

  const downloadPartiesList = (regionId) => {
    window.open(`http://localhost:3000/regions/${regionId}/download-parties`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: "16px" }}>
        {!filteredRegion && (
          <>
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
              Search Regions
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
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
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </Box>
          </>
        )}
        {errorMessage && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}

        {filteredRegion && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "1%",
                mb: 4,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <TextField
                select
                label="State"
                variant="outlined"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                required
                sx={{ width: "120px", flexShrink: 0 }}
                InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              >
                <MenuItem value="" disabled>
                  State
                </MenuItem>
                {states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="District"
                variant="outlined"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
                sx={{ width: "120px", flexShrink: 0 }}
                InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              >
                <MenuItem value="" disabled>
                  District
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.value} value={district.value}>
                    {district.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Zone"
                variant="outlined"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                disabled={!selectedDistrict}
                sx={{ width: "120px", flexShrink: 0 }}
                InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              >
                <MenuItem value="" disabled>
                  Zone
                </MenuItem>
                {zones.map((zone) => (
                  <MenuItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Taluk"
                variant="outlined"
                value={selectedTaluk}
                onChange={(e) => setSelectedTaluk(e.target.value)}
                disabled={!selectedZone}
                sx={{ width: "120px", flexShrink: 0 }}
                InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              >
                <MenuItem value="" disabled>
                  Taluk
                </MenuItem>
                {taluks.map((taluk) => (
                  <MenuItem key={taluk.value} value={taluk.value}>
                    {taluk.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Ward No"
                variant="outlined"
                value={selectedWardNo}
                onChange={(e) => setSelectedWardNo(e.target.value)}
                disabled={!selectedTaluk}
                sx={{ width: "120px", flexShrink: 0 }}
                InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              >
                <MenuItem value="" disabled>
                  Ward No
                </MenuItem>
                {wardNos.map((wardNo) => (
                  <MenuItem key={wardNo.value} value={wardNo.value}>
                    {wardNo.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Pincode"
                variant="outlined"
                value={selectedPincode}
                onChange={(e) => setSelectedPincode(e.target.value)}
                disabled={!selectedWardNo}
                sx={{ width: "120px", flexShrink: 0 }}
                InputProps={{ sx: { height: "36px", fontSize: "0.8rem" } }}
                InputLabelProps={{ sx: { fontSize: "0.8rem" } }}
              >
                <MenuItem value="" disabled>
                  Pincode
                </MenuItem>
                {pincodes.map((pincode) => (
                  <MenuItem key={pincode.value} value={pincode.value}>
                    {pincode.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: "36px", fontSize: "0.8rem", flexShrink: 0, color: '#fff' }}
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#138808" }}>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      State
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      District
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Zone
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Taluk
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Ward No
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Pincode
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Number of Voters
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Number of Parties
                    </TableCell>
                    <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                {Array.isArray(filteredRegion) && (
                  <TableBody>
                    {filteredRegion.map((region) => (
                      <TableRow key={region._id}>
                        <TableCell>{region.state}</TableCell>
                        <TableCell>{region.district}</TableCell>
                        <TableCell>{region.zone}</TableCell>
                        <TableCell>{region.taluk}</TableCell>
                        <TableCell>{region.wardNo}</TableCell>
                        <TableCell>{region.pincode}</TableCell>
                        <TableCell>{region.numberOfVoters}</TableCell>
                        <TableCell>{region.numberOfParties}</TableCell>
                        <TableCell sx={{ display: "flex", gap: 1 }}>
                          <Button onClick={() => fetchVoters(region._id)}>
                            View Voters
                          </Button>
                          <Button onClick={() => fetchParties(region._id)}>
                            View Parties
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </>
        )}

        {/* Voters Dialog */}
        <Dialog
          open={openVotersDialog}
          onClose={() => setOpenVotersDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              fontFamily: "Playfair Display",
              fontStyle: "italic",
              fontWeight: 900,
              color: "#121481",
            }}
          >
            Voters List
          </DialogTitle>
          <DialogContent>
            {voters.length === 0 ? (
              <Typography variant="body1" sx={{ p: 2 }}>
                No voters found for this region.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#ff9933" }}>
                      <TableCell
                        style={{ color: "#FFFFFF", fontWeight: "bold" }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        style={{ color: "#FFFFFF", fontWeight: "bold" }}
                      >
                        Mobile Number
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {voters.map((voter) => (
                      <TableRow key={voter._id}>
                        <TableCell>{voter.label}</TableCell>
                        <TableCell>{voter.mobile_number}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenVotersDialog(false)}
              color="secondary"
            >
              Close
            </Button>
            <Button
              onClick={() => downloadVotersList(filteredRegion?._id)}
              color="primary"
              startIcon={<DownloadIcon />}
              disabled={!voters.length}
            >
              Download List
            </Button>
          </DialogActions>
        </Dialog>

        {/* Parties Dialog */}
        <Dialog
          open={openPartiesDialog}
          onClose={() => setOpenPartiesDialog(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              fontFamily: "Playfair Display",
              fontStyle: "italic",
              fontWeight: 900,
              color: "#121481",
            }}
          >
            Parties List
          </DialogTitle>
          <DialogContent>
            {parties.length === 0 ? (
              <Typography variant="body1" sx={{ p: 2 }}>
                No parties found for this region.
              </Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: "#ff9933" }}>
                      <TableCell
                        style={{ color: "#FFFFFF", fontWeight: "bold" }}
                      >
                        Party Name
                      </TableCell>
                      <TableCell
                        style={{ color: "#FFFFFF", fontWeight: "bold" }}
                      >
                        Party Leader
                      </TableCell>
                      <TableCell
                        style={{ color: "#FFFFFF", fontWeight: "bold" }}
                      >
                        Party Symbol
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parties.map((party) => (
                      <TableRow key={party._id}>
                        <TableCell>{party.partyName}</TableCell>
                        <TableCell>{party.partyLeader}</TableCell>
                        <TableCell>{party.partySymbol}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenPartiesDialog(false)}
              color="secondary"
            >
              Close
            </Button>
            <Button
              onClick={() => downloadPartiesList(filteredRegion?._id)}
              color="primary"
              startIcon={<DownloadIcon />}
              disabled={!parties.length}
            >
              Download List
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default ViewRegions;
