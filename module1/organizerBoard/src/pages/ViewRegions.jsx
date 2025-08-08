
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
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedTaluk, setSelectedTaluk] = useState("");
  const [selectedWardNo, setSelectedWardNo] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
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
      setFilteredRegion(null);
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
      setFilteredRegion(null);
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
      setFilteredRegion(null);
    } else {
      setZones([]);
      setTaluks([]);
      setWardNos([]);
      setPincodes([]);
      setSelectedZone("");
      setSelectedTaluk("");
      setSelectedWardNo("");
      setSelectedPincode("");
      setFilteredRegion(null);
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
      setFilteredRegion(null);
    } else {
      setTaluks([]);
      setWardNos([]);
      setPincodes([]);
      setSelectedTaluk("");
      setSelectedWardNo("");
      setSelectedPincode("");
      setFilteredRegion(null);
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
      setFilteredRegion(null);
    } else {
      setWardNos([]);
      setPincodes([]);
      setSelectedWardNo("");
      setSelectedPincode("");
      setFilteredRegion(null);
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
      setFilteredRegion(null);
    } else {
      setPincodes([]);
      setSelectedPincode("");
      setFilteredRegion(null);
    }
  }, [selectedWardNo, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const handleSearch = async () => {
    if (!selectedPincode) {
      setErrorMessage("Please select all location fields.");
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

      if (!selectedRegion) {
        setErrorMessage("Selected region not found.");
        setFilteredRegion(null);
        return;
      }

      setFilteredRegion({
        ...selectedRegion,
        numberOfVoters: selectedRegion.voters ? selectedRegion.voters.length : 0,
        numberOfParties: selectedRegion.parties ? selectedRegion.parties.length : 0,
      });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error fetching region data. Please try again.");
      setFilteredRegion(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoters = async (regionId) => {
    try {
      const response = await fetch(`http://localhost:3000/regions/${regionId}/voters`);
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
      const response = await fetch(`http://localhost:3000/regions/${regionId}/parties`);
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
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Box>

        {filteredRegion && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
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
              <TableBody>
                <TableRow>
                  <TableCell>{filteredRegion.state}</TableCell>
                  <TableCell>{filteredRegion.district}</TableCell>
                  <TableCell>{filteredRegion.zone}</TableCell>
                  <TableCell>{filteredRegion.taluk}</TableCell>
                  <TableCell>{filteredRegion.wardNo}</TableCell>
                  <TableCell>{filteredRegion.pincode}</TableCell>
                  <TableCell>{filteredRegion.numberOfVoters}</TableCell>
                  <TableCell>{filteredRegion.numberOfParties}</TableCell>
                  <TableCell sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon style={{ color: "#FFFFFF" }} />}
                      sx={{
                        color: "#FFFFFF",
                        "&:hover": { backgroundColor: "#138808" },
                      }}
                      onClick={() => fetchVoters(filteredRegion._id)}
                    >
                      View Voters
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon style={{ color: "#FFFFFF" }} />}
                      sx={{
                        color: "#FFFFFF",
                        "&:hover": { backgroundColor: "#138808" },
                      }}
                      onClick={() => fetchParties(filteredRegion._id)}
                    >
                      View Parties
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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
                      <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                        Name
                      </TableCell>
                      <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                        Mobile Number
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {voters.map((voter) => (
                      <TableRow key={voter._id}>
                        <TableCell>{voter.name}</TableCell>
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
                      <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                        Party Name
                      </TableCell>
                      <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                        Party Leader
                      </TableCell>
                      <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
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



