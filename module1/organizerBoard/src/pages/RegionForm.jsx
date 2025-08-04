import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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

const RegionForm = () => {
  const [regionName, setRegionName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreateRegion = async () => {
    try {
      const response = await fetch("http://localhost:3000/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: regionName.toLowerCase(),
          description: description.toLowerCase(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        setErrorMessage("");
        setRegionName("");
        setDescription("");
      } else {
        const data = await response.json();
        if (response.status === 409) {
          setErrorMessage(data.message);
        } else {
          console.error("Failed to create region:", response.statusText);
          setErrorMessage("Failed to create region. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating region:", error);
      setErrorMessage("Error creating region. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
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
          Create Region
        </Typography>
        <TextField
          label="Region Name"
          variant="outlined"
          fullWidth
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
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
            onClick={handleCreateRegion}
          >
            Create Region
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default RegionForm;
