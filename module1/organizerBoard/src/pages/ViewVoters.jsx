import React, { useState, useEffect, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import {
  Typography,
  IconButton,
  Box,
  Skeleton,
  TextField,
  MenuItem,
  Modal,
  Avatar,
} from "@mui/material";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ViewVoters = () => {
  const [voters, setVoters] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
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
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [open, setOpen] = useState(false);
  const downloadButtonRef = useRef(null);

  useEffect(() => {
    fetchVoters();
    fetchRegions();
  }, []);

  useEffect(() => {
    filterVoters();
  }, [
    searchQuery,
    searchMobile,
    voters,
    selectedState,
    selectedDistrict,
    selectedZone,
    selectedTaluk,
    selectedWard,
    selectedPincode,
  ]);

  useEffect(() => {
    const filteredDistricts = [
      { value: "All", label: "All Districts" },
      ...[...new Set(
        regions
          .filter((region) => selectedState === "All" || region.state === selectedState)
          .map((region) => region.district)
      )].sort().map((district) => ({ value: district, label: district })),
    ];
    setDistricts(filteredDistricts);
  }, [selectedState, regions]);

  useEffect(() => {
    const filteredZones = [
      { value: "All", label: "All Zones" },
      ...[...new Set(
        regions
          .filter(
            (region) =>
              (selectedState === "All" || region.state === selectedState) &&
              (selectedDistrict === "All" || region.district === selectedDistrict)
          )
          .map((region) => region.zone)
      )].sort().map((zone) => ({ value: zone, label: zone })),
    ];
    setZones(filteredZones);
  }, [selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const filteredTaluks = [
      { value: "All", label: "All Taluks" },
      ...[...new Set(
        regions
          .filter(
            (region) =>
              (selectedState === "All" || region.state === selectedState) &&
              (selectedDistrict === "All" || region.district === selectedDistrict) &&
              (selectedZone === "All" || region.zone === selectedZone)
          )
          .map((region) => region.taluk)
      )].sort().map((taluk) => ({ value: taluk, label: taluk })),
    ];
    setTaluks(filteredTaluks);
  }, [selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const filteredWards = [
      { value: "All", label: "All Wards" },
      ...[...new Set(
        regions
          .filter(
            (region) =>
              (selectedState === "All" || region.state === selectedState) &&
              (selectedDistrict === "All" || region.district === selectedDistrict) &&
              (selectedZone === "All" || region.zone === selectedZone) &&
              (selectedTaluk === "All" || region.taluk === selectedTaluk)
          )
          .map((region) => region.wardNo)
      )].sort((a, b) => a - b).map((wardNo) => ({ value: wardNo, label: wardNo })),
    ];
    setWards(filteredWards);
  }, [selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  useEffect(() => {
    const filteredPincodes = [
      { value: "All", label: "All Pincodes" },
      ...[...new Set(
        regions
          .filter(
            (region) =>
              (selectedState === "All" || region.state === selectedState) &&
              (selectedDistrict === "All" || region.district === selectedDistrict) &&
              (selectedZone === "All" || region.zone === selectedZone) &&
              (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
              (selectedWard === "All" || region.wardNo === selectedWard)
          )
          .map((region) => region.pincode)
      )].sort().map((pincode) => ({ value: pincode, label: pincode })),
    ];
    setPincodes(filteredPincodes);
  }, [selectedWard, selectedTaluk, selectedZone, selectedDistrict, selectedState, regions]);

  const fetchVoters = async () => {
    try {
      const response = await fetch("http://localhost:3000/voters");
      if (response.ok) {
        const data = await response.json();
        setVoters(data.voters);
      }
    } catch (error) {
      console.error("Error fetching voters:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const response = await fetch("http://localhost:3000/regions");
      if (response.ok) {
        const data = await response.json();
        setRegions(data.regions);
        const uniqueStates = [
          { value: "All", label: "All States" },
          ...[...new Set(data.regions.map((r) => r.state))]
            .sort()
            .map((s) => ({ value: s, label: s })),
        ];
        setStates(uniqueStates);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const filterVoters = () => {
    let updated = voters;

    if (searchQuery) {
      updated = updated.filter((v) =>
        v.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchMobile) {
      updated = updated.filter((v) =>
        v.mobile_number.toLowerCase().includes(searchMobile.toLowerCase())
      );
    }

    updated = updated.filter((v) => {
      const region = regions.find((r) => r._id === v.regionId);
      if (!region) return false;

      return (
        (selectedState === "All" || region.state === selectedState) &&
        (selectedDistrict === "All" || region.district === selectedDistrict) &&
        (selectedZone === "All" || region.zone === selectedZone) &&
        (selectedTaluk === "All" || region.taluk === selectedTaluk) &&
        (selectedWard === "All" || region.wardNo === selectedWard) &&
        (selectedPincode === "All" || region.pincode === selectedPincode)
      );
    });

    setFilteredVoters(updated);
  };

  const handleDeleteVoter = async (voterId) => {
    try {
      const response = await fetch(`http://localhost:3000/voters/${voterId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setVoters(voters.filter((v) => v._id !== voterId));
      }
    } catch (error) {
      console.error("Error deleting voter:", error);
    }
  };

  const handleOpenProfile = (voter) => {
    setSelectedVoter(voter);
    setOpen(true);
  };

  const handleCloseProfile = () => {
    setSelectedVoter(null);
    setOpen(false);
  };

  const handleDownloadProfile = () => {
    const input = document.getElementById("voter-profile");
    if (downloadButtonRef.current) {
      downloadButtonRef.current.style.display = "none";
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`${selectedVoter.label}_profile.pdf`);
      if (downloadButtonRef.current) {
        downloadButtonRef.current.style.display = "inline";
      }
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Search Fields */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 220 }}
        />
        <TextField
          label="Search by Mobile"
          variant="outlined"
          value={searchMobile}
          onChange={(e) => setSearchMobile(e.target.value)}
          sx={{ width: 190 }}
        />
        <TextField
          select
          label="State"
          variant="outlined"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          sx={{ width: 130 }}
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
          variant="outlined"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          sx={{ width: 130  }}
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
          variant="outlined"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
          sx={{ width: 130  }}
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
          variant="outlined"
          value={selectedTaluk}
          onChange={(e) => setSelectedTaluk(e.target.value)}
          sx={{ width: 130  }}
        >
          {taluks.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Ward"
          variant="outlined"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          sx={{ width: 130  }}
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
          variant="outlined"
          value={selectedPincode}
          onChange={(e) => setSelectedPincode(e.target.value)}
          sx={{ width: 130  }}
        >
          {pincodes.map((p) => (
            <MenuItem key={p.value} value={p.value}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table aria-label="voters table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#138808" }}>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Voter
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Mobile Number
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                State
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                District
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Zone
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Taluk
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Ward
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Pincode
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Skeleton variant="rectangular" width="100%" height={50} />
                </TableCell>
              </TableRow>
            ) : (
              filteredVoters.map((voter) => {
                const region = regions.find((r) => r._id === voter.regionId);
                return (
                  <TableRow key={voter._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                          {voter.label[0].toUpperCase()}
                        </Avatar>
                        {voter.label}
                      </Box>
                    </TableCell>
                    <TableCell>{voter.mobile_number}</TableCell>
                    <TableCell>{region?.state || "N/A"}</TableCell>
                    <TableCell>{region?.district || "N/A"}</TableCell>
                    <TableCell>{region?.zone || "N/A"}</TableCell>
                    <TableCell>{region?.taluk || "N/A"}</TableCell>
                    <TableCell>{region?.wardNo || "N/A"}</TableCell>
                    <TableCell>{region?.pincode || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleOpenProfile(voter)}
                      >
                        View Profile
                      </Button>
                      <IconButton
                        onClick={() => handleDeleteVoter(voter._id)}
                        style={{ color: "#FF5722" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Profile Modal */}
      <Modal open={open} onClose={handleCloseProfile}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
          id="voter-profile"
        >
          {selectedVoter && (
            <>
              <Typography variant="h6" gutterBottom>
                <strong>{selectedVoter.label}'s Profile</strong>
              </Typography>
              <Typography>
                <strong>Mobile:</strong> {selectedVoter.mobile_number}
              </Typography>
              <Typography>
                <strong>Date of Birth:</strong>{" "}
                {moment(selectedVoter.dateOfBirth).format("MM/DD/YYYY")}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {selectedVoter.gender}
              </Typography>
              <Typography>
                <strong>Father:</strong> {selectedVoter.fatherName}
              </Typography>
              <Typography>
                <strong>Mother:</strong> {selectedVoter.motherName}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDownloadProfile}
                ref={downloadButtonRef}
              >
                Download Profile
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ViewVoters;