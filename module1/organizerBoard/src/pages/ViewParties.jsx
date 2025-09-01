import React, { useState, useEffect } from 'react';
import { Typography, IconButton, Table, TableHead, TableBody, TableRow, TableCell, Skeleton, Box, TableContainer, Paper, TextField, Button, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const ViewParties = () => {
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

  useEffect(() => {
    fetchRegions();
    fetchParties();
  }, []);

  useEffect(() => {
    filterParties();
  }, [searchQuery, selectedState, selectedDistrict, selectedZone, selectedTaluk, selectedWard, selectedPincode, parties]);

  useEffect(() => {
    const uniqueStates = [
      { value: "All", label: "All States" },
      ...[...new Set(regions.map((r) => r.state))].sort().map((s) => ({ value: s, label: s })),
    ];
    setStates(uniqueStates);
  }, [regions]);

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

    updatedParties = updatedParties.filter((party) => {
      const region = regions.find((r) => r._id === party.regionId);
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
      const response = await fetch(`http://localhost:3000/parties/${editParty._id}`, {
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
    <Box sx={{ p: 2 }}>
      <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
        <TextField
          label="Search by Party Name"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 150 }}
        />
        <TextField
          select
          label="State"
          variant="outlined"
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 150 }}
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
          sx={{ minWidth: 150 }}
        >
          {pincodes.map((p) => (
            <MenuItem key={p.value} value={p.value}>
              {p.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#138808' }}>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Name</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Leader</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Party Symbol</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>State</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>District</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Zone</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Taluk</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Ward</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Pincode</TableCell>
              <TableCell style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={10}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={10}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={10}>
                    <Skeleton variant="rectangular" width="100%" height={50} />
                  </TableCell>
                </TableRow>
              </>
            ) : (
              filteredParties.map((party) => {
                const region = regions.find(region => region._id === party.regionId);
                return (
                  <TableRow key={party._id}>
                    <TableCell>{party.partyName}</TableCell>
                    <TableCell>{party.partyLeader}</TableCell>
                    <TableCell>{party.partySymbol}</TableCell>
                    <TableCell>{region?.state || 'N/A'}</TableCell>
                    <TableCell>{region?.district || 'N/A'}</TableCell>
                    <TableCell>{region?.zone || 'N/A'}</TableCell>
                    <TableCell>{region?.taluk || 'N/A'}</TableCell>
                    <TableCell>{region?.wardNo || 'N/A'}</TableCell>
                    <TableCell>{region?.pincode || 'N/A'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditParty(party)} style={{ color: '#FF9933' }}
                        sx={{ '&:hover': { color: 'blue' } }}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteParty(party._id)} style={{ color: '#FF9933' }}
                        sx={{ '&:hover': { color: 'blue' } }}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
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
          <TextField
            select
            label="Region"
            variant="outlined"
            fullWidth
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            margin="normal"
          >
            {regions.map((region) => (
              <MenuItem key={region._id} value={region._id}>
                {`${region.state}, ${region.district}, ${region.zone}, ${region.taluk}, Ward ${region.wardNo}, Pin ${region.pincode}`}
              </MenuItem>
            ))}
          </TextField>
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