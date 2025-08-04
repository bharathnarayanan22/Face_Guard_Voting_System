import React, { useState, useEffect } from 'react';
import { Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Box, TableContainer, Paper, TextField, Button, MenuItem, Select } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const ViewParties= () => {
  const [parties, setParties] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredParties, setFilteredParties] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editParty, setEditParty] = useState(null);
  const [partyName, setPartyName] = useState('');
  const [partyLeader, setPartyLeader] = useState('');
  const [partySymbol, setPartySymbol] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  useEffect(() => {
    fetchRegions();
    fetchParties();
  }, []);

  useEffect(() => {
    filterParties();
  }, [searchQuery, filterRegion, parties]);

  const fetchParties = async () => {
    try {
      const response = await fetch('http://localhost:3000/parties');
      if (response.ok) {
        const data = await response.json();
        setParties(data.parties);
      } else {
        console.error('Failed to fetch parties:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching parties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const response = await fetch('http://localhost:3000/regions');
      if (response.ok) {
        const data = await response.json();
        setRegions(data.regions);
      } else {
        console.error('Failed to fetch regions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
    }
  };

  const filterParties = () => {
    let updatedParties = parties;

    if (searchQuery) {
      updatedParties = updatedParties.filter(party =>
        party.partyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterRegion) {
      updatedParties = updatedParties.filter(party =>
        party.regionId === filterRegion
      );
    }

    setFilteredParties(updatedParties);
  };

  const handleEditParty = (party) => {
    setIsEditing(true);
    setEditParty(party);
    setPartyName(party.partyName);
    setPartyLeader(party.partyLeader);
    setPartySymbol(party.partySymbol);
    setSelectedRegion(party.regionId);
  };

  const handleUpdateParty = async () => {
    try {
      const response = await fetch(`http://localhost:3000/${editParty._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partyName,
          partyLeader,
          partySymbol,
          regionId: selectedRegion,
        }),
      });
  
      if (response.ok) {
        const updatedParty = await response.json();
        setParties(parties.map(party => party._id === updatedParty._id ? updatedParty : party));
        console.log('Party updated successfully');
        handleDialogClose();
      } else {
        console.error('Failed to update party:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating party:', error);
    }
  };
  

  const handleDeleteParty = async (partyId) => {
    try {
      const response = await fetch(`http://localhost:3000/parties/${partyId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setParties(parties.filter(party => party._id !== partyId));
        console.log('Party deleted successfully');
      } else {
        console.error('Failed to delete party:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting party:', error);
    }
  };

  const handleDialogClose = () => {
    setIsEditing(false);
    setEditParty(null);
    setPartyName('');
    setPartyLeader('');
    setPartySymbol('');
    setSelectedRegion('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{
          fontFamily: "Playfair Display",
          fontStyle: "italic",
          fontWeight: 900,
          color: "#121481",
        }}>
        Parties Registered
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          label="Search by Party Name"
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
        >
          <MenuItem value="">
            <em>All Regions</em>
          </MenuItem>
          {regions.map((region) => (
            <MenuItem key={region._id} value={region._id}>{region.name}</MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#138808' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Leader</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Symbol</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Region</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              filteredParties.map((party) => (
                <TableRow key={party._id}>
                  <TableCell>{party.partyName}</TableCell>
                  <TableCell>{party.partyLeader}</TableCell>
                  <TableCell>{party.partySymbol}</TableCell>
                  <TableCell>{regions.find(region => region._id === party.regionId)?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditParty(party)} style={{ color: '#FF9933' }}
                      sx={{ '&:hover': { color: 'blue' } }}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDeleteParty(party._id)} style={{ color: '#FF9933' }}
                      sx={{ '&:hover': { color: 'blue' } }}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isEditing} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Party</DialogTitle>
        <DialogContent>
          <TextField
            label="Party Name"
            variant="outlined"
            fullWidth
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Party Leader"
            variant="outlined"
            fullWidth
            value={partyLeader}
            onChange={(e) => setPartyLeader(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Party Symbol"
            variant="outlined"
            fullWidth
            value={partySymbol}
            onChange={(e) => setPartySymbol(e.target.value)}
            margin="normal"
            required
          />
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            displayEmpty
            fullWidth
            variant="outlined"
            margin="normal"
          >
            <MenuItem value="">
              <em>Select Region</em>
            </MenuItem>
            {regions.map((region) => (
              <MenuItem key={region._id} value={region._id}>{region.name}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button onClick={handleUpdateParty} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewParties;
