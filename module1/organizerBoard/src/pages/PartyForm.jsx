import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Select from "react-select";

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
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regions, setRegions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleEnrollParty = async () => {
    try {
      const response = await fetch("http://localhost:3000/enroll-party", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          partyName: partyName.toLowerCase(),
          partyLeader: partyLeader.toLowerCase(),
          partySymbol: partySymbol.toLowerCase(),
          regionId: selectedRegion ? selectedRegion.value : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setErrorMessage("");
        setPartyName("");
        setPartyLeader("");
        setPartySymbol("");
        setSelectedRegion(null);
      } else {
        const data = await response.json();
        if (response.status === 409) {
          setErrorMessage(data.message);
        } else {
          console.error("Failed to enroll party:", response.statusText);
          setErrorMessage("Failed to enroll party. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error enrolling party:", error);
      setErrorMessage("Error enrolling party. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        {/* <Typography
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
        </Typography> */}
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
          options={regions}
          value={selectedRegion}
          onChange={setSelectedRegion}
          placeholder="Select Region"
          isClearable
          isSearchable
        />
        {errorMessage && (
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        )}
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnrollParty}
          >
            Enroll Party
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PartyForm;
