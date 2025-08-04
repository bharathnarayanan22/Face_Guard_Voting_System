import React, { useState, useEffect } from "react";
import {
  Typography,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  TextField,
  Box,
  TableContainer,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const ViewRegions = () => {
  const [regions, setRegions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRegion, setEditRegion] = useState(null);
  const [regionName, setRegionName] = useState("");
  const [numberOfVoters, setNumberOfVoters] = useState("");
  const [numberOfParties, setNumberOfParties] = useState("");
  const [loading, setLoading] = useState(true);
  const [voters, setVoters] = useState([]);
  const [parties, setParties] = useState([]);
  const [openVotersDialog, setOpenVotersDialog] = useState(false);
  const [openPartiesDialog, setOpenPartiesDialog] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEditRegion = (region) => {
    setIsEditing(true);
    setEditRegion(region);
    setRegionName(region.name);
    setNumberOfVoters(region.voters.length);
    setNumberOfParties(region.parties.length);
  };

  const handleUpdateRegion = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/regions/${editRegion._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: regionName,
            voters: numberOfVoters,
            parties: numberOfParties,
          }),
        }
      );

      if (response.ok) {
        const updatedRegion = await response.json();
        setRegions(
          regions.map((region) =>
            region._id === updatedRegion._id ? updatedRegion : region
          )
        );
        console.log("Region updated successfully");
        handleDialogClose(); // Close the dialog after updating
      } else {
        console.error("Failed to update region:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  const handleDeleteRegion = async (regionId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/regions/${regionId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setRegions(regions.filter((region) => region._id !== regionId));
        console.log("Region deleted successfully");
      } else {
        console.error("Failed to delete region:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting region:", error);
    }
  };

  const fetchVoters = async (regionId) => {
    try {
      const response = await fetch(`http://localhost:3000/regions/${regionId}/voters`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setVoters(data);
        setOpenVotersDialog(true);
      } else {
        console.error("Failed to fetch voters:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching voters:", error);
    }
  };

  const fetchParties = async (regionId) => {
    try {
      const response = await fetch(`http://localhost:3000/regions/${regionId}/parties`);
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setParties(data);
        setOpenPartiesDialog(true);
      } else {
        console.error("Failed to fetch parties:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

  const downloadVotersList = async (regionId) => {
    console.log(regionId)
    window.open(`http://localhost:3000/regions/${regionId}/download-voters`);
  };

  const downloadPartiesList = async (regionId) => {
    window.open(`http://localhost:3000/regions/${regionId}/download-parties`);
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    setEditRegion(null);
    setRegionName("");
    setNumberOfVoters("");
    setNumberOfParties("");
  };

  return (
    <Box>
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
        Regions Registered
      </Typography>
   <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow style={{ backgroundColor: "#138808" }}>
              <TableCell  style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Region Name
              </TableCell>
              <TableCell align="center" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Number of Voters
              </TableCell>
              <TableCell align="center" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Number of Parties
              </TableCell>
              <TableCell align="center" style={{ color: "#FFFFFF", fontWeight: "bold" }}>
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
              regions.map((region) => (
                <TableRow key={region._id}>
                  <TableCell>{region.name}</TableCell>
                  <TableCell align="center">{region.voters.length}</TableCell>
                  <TableCell align="center">{region.parties.length}</TableCell>
                  <TableCell sx ={{display:"flex",width:"80%",justifyContent:"space-around"}}>
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleEditRegion(region)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDeleteRegion(region._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon style={{ color: "#FFFFFF", fontWeight: "bold" }}/>}
                      sx={{ color: "#FFFFFF", '&:hover': {
                        backgroundColor: '#138808',
                      }, }}
                      onClick={() => fetchVoters(region._id)}
                    >
                      View Voters
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<DownloadIcon style={{ color: "#FFFFFF", fontWeight: "bold" }} />}
                      sx={{ color: "#FFFFFF" , '&:hover': {
                        backgroundColor: '#138808',
                      },}}
                      onClick={() => fetchParties(region._id)}
                    >
                      View Parties
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isEditing}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Region</DialogTitle>
        <DialogContent>
          <TextField
            label="Region Name"
            variant="outlined"
            fullWidth
            value={regionName}
            onChange={(e) => setRegionName(e.target.value)}
            margin="normal"
            required
          />
          {/* <TextField
            label="Number of Voters"
            variant="outlined"
            fullWidth
            type="number"
            value={numberOfVoters}
            onChange={(e) => setNumberOfVoters(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Number of Parties"
            variant="outlined"
            fullWidth
            type="number"
            value={numberOfParties}
            onChange={(e) => setNumberOfParties(e.target.value)}
            margin="normal"
            required
          /> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpdateRegion}
            variant="contained"
            color="primary"
          >
            Update Region
          </Button>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>


      {/* Voters Dialog */}
      <Dialog
        open={openVotersDialog}
        onClose={() => setOpenVotersDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{
          fontFamily: "Playfair Display",
          fontStyle: "italic",
          fontWeight: 900,
          color: "#121481",
        }}>Voters List</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#ff9933" }}>
                  <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>Mobile Number</TableCell>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVotersDialog(false)} color="secondary">
            Close
          </Button>
          <Button
            onClick={() => downloadVotersList(voters[0]?.regionId)}
            color="primary"
            startIcon={<DownloadIcon />}
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
        <DialogTitle sx={{
          fontFamily: "Playfair Display",
          fontStyle: "italic",
          fontWeight: 900,
          color: "#121481",
        }}>Parties List</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#ff9933" }}>
                  <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>Party Name</TableCell>
                  <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>Party Leader</TableCell>
                  <TableCell style={{ color: "#FFFFFF", fontWeight: "bold" }}>Party Symbol</TableCell>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPartiesDialog(false)} color="secondary">
            Close
          </Button>
          <Button
            onClick={() => downloadPartiesList(parties[0]?.regionId)}
            color="primary"
            startIcon={<DownloadIcon />}
          >
            Download List
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewRegions;
