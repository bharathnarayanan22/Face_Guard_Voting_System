import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
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
  Select,
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
  const [filterRegion, setFilterRegion] = useState("");
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [open, setOpen] = useState(false);
  const downloadButtonRef = useRef(null);

  useEffect(() => {
    fetchVoters();
    fetchRegions();
  }, []);

  useEffect(() => {
    filterVoters();
  }, [searchQuery, filterRegion, voters]);

  const fetchVoters = async () => {
    try {
      const response = await fetch("http://localhost:3000/voters");
      if (response.ok) {
        const data = await response.json();
        setVoters(data.voters);
      } else {
        console.error("Failed to fetch voters:", response.statusText);
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
      } else {
        console.error("Failed to fetch regions:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching regions:", error);
    }
  };

  const filterVoters = () => {
    let updatedVoters = voters;

    if (searchQuery) {
      updatedVoters = updatedVoters.filter((voter) =>
        voter.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRegion) {
      updatedVoters = updatedVoters.filter(
        (voter) => voter.regionId === filterRegion
      );
    }

    setFilteredVoters(updatedVoters);
  };

  const handleDeleteVoter = async (voterId) => {
    try {
      const response = await fetch(`http://localhost:3000/voters/${voterId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setVoters(voters.filter((voter) => voter._id !== voterId));
        console.log("Voter deleted successfully");
      } else {
        console.error("Failed to delete voter:", response.statusText);
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
      downloadButtonRef.current.style.display = "none"; // Hide the button
    }
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`${selectedVoter.label}_profile.pdf`);
      if (downloadButtonRef.current) {
        downloadButtonRef.current.style.display = "inline"; // Show the button again
      }
    });
  };

  return (
    <Box sx={{ p: 2 }}>
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
        Voters Registered
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          label="Search by Voter Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
        />
        <Select
          value={filterRegion}
          onChange={(e) => setFilterRegion(e.target.value)}
          displayEmpty
          variant="outlined"
          margin="normal"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">
            <em>All Regions</em>
          </MenuItem>
          {regions.map((region) => (
            <MenuItem key={region._id} value={region._id}>
              {region.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="voters table">
          <TableHead>
            <TableRow style={{ backgroundColor: "#138808" }}>
              <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Voter
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "#FFFFFF", fontWeight: "bold" }}
              >
                Mobile Number
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "#FFFFFF", fontWeight: "bold" }}
              >
                Region
              </TableCell>
              <TableCell
                align="right"
                style={{ color: "#FFFFFF", fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              filteredVoters.map((voter) => (
                <TableRow key={voter._id}>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: "#1976d2",
                          color: "#fff",
                          mr: 2,
                          fontSize: 20,
                        }}
                      >
                        {voter.label[0].toUpperCase()}
                      </Avatar>
                      {voter.label}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{voter.mobile_number}</TableCell>
                  <TableCell align="center">
                    {regions.find((region) => region._id === voter.regionId)
                      ?.name || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        "&:hover": {
                          backgroundColor: "#138808",
                          color: "common.white",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                      onClick={() => handleOpenProfile(voter)}
                    >
                      View Profile
                    </Button>
                    <IconButton
                      onClick={() => handleDeleteVoter(voter._id)}
                      style={{ color: "#FF5722" }}
                      sx={{ "&:hover": { color: "#d32f2f" } }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for viewing and downloading profile */}
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
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    bgcolor: "#138808",
                    color: "#fff",
                    width: 60,
                    height: 60,
                    mr: 2,
                    fontSize: 30,
                  }}
                >
                  {selectedVoter.label[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1">
                    <strong>Mobile Number:</strong>{" "}
                    {selectedVoter.mobile_number}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Region:</strong>{" "}
                    {regions.find(
                      (region) => region._id === selectedVoter.regionId
                    )?.name || "N/A"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date of Birth:</strong>{" "}
                    {moment(selectedVoter.dateOfBirth).format("MM/DD/YYYY")}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Gender:</strong> {selectedVoter.gender}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Father's name:</strong> {selectedVoter.fatherName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mother's Name:</strong> {selectedVoter.motherName}
                  </Typography>
                </Box>
              </Box>
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
