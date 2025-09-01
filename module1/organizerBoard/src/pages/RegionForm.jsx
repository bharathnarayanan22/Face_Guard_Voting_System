import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

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
  const [formData, setFormData] = useState({
    state: "",
    district: "",
    zone: "",
    taluk: "",
    wardNo: "",
    pincode: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Optional: check if wardNo is a number
    if (name === "wardNo" && isNaN(Number(value))) {
      setErrorMessage("Ward number must be a number");
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCreateRegion = async () => {
    try {
      const response = await fetch("http://localhost:3000/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Region created:", data);
        setSuccessMessage("Region created successfully");
        setFormData({
          state: "",
          district: "",
          zone: "",
          taluk: "",
          wardNo: "",
          pincode: "",
        });
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "Failed to create region");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error creating region. Please try again.");
    }
  };

  // return (
  //   <ThemeProvider theme={theme}>
  //     <Box>
  //       <Typography
  //         variant="h4"
  //         gutterBottom
  //         sx={{
  //           fontFamily: "Playfair Display",
  //           fontStyle: "italic",
  //           fontWeight: 900,
  //           color: "#121481",
  //         }}
  //       >
  //         Create Region
  //       </Typography>

  //       {["state", "district", "zone", "taluk", "wardNo", "pincode"].map((field) => (
  //         <TextField
  //           key={field}
  //           label={field.charAt(0).toUpperCase() + field.slice(1)}
  //           name={field}
  //           variant="outlined"
  //           fullWidth
  //           value={formData[field]}
  //           onChange={handleChange}
  //           margin="normal"
  //           required
  //         />
  //       ))}

  //       {errorMessage && (
  //         <Typography variant="body1" color="error">
  //           {errorMessage}
  //         </Typography>
  //       )}

  //       {successMessage && (
  //         <Typography variant="body1" color="primary">
  //           {successMessage}
  //         </Typography>
  //       )}

  //       <Box mt={2}>
  //         <Button variant="contained" color="primary" onClick={handleCreateRegion}>
  //           Create Region
  //         </Button>
  //       </Box>
  //     </Box>
  //   </ThemeProvider>
  // );

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
        Create Region 
      </Typography> */}

     <Grid container spacing={3}>
  {["state", "district", "zone", "taluk", "wardNo", "pincode"].map((field) => (
    <Grid item xs={12} sm={6} key={field}>
      <TextField
        label={field.charAt(0).toUpperCase() + field.slice(1)}
        name={field}
        variant="outlined"
        fullWidth
        value={formData[field]}
        onChange={handleChange}
        required
        sx={{
                "& .MuiOutlinedInput-root": {
                  height: 56, 
                },
                "& .MuiSelect-select": {
                  padding: "12px 14px", 
                },
                width: { xs: '150%', sm: '100%', md: 350 }, }} // Adjust width as needed
      />
    </Grid>
  ))}
</Grid>


      {errorMessage && (
        <Typography variant="body1" color="error" mt={2}>
          {errorMessage}
        </Typography>
      )}

      {successMessage && (
        <Typography variant="body1" color="primary" mt={2}>
          {successMessage}
        </Typography>
      )}

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleCreateRegion}>
          Create Region
        </Button>
      </Box>
    </Box>
  </ThemeProvider>
);
};

export default RegionForm;
