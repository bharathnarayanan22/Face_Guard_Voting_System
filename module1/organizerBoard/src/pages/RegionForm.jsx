// import React, { useState } from "react";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";
// import { Grid } from "@mui/material";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#ff9933",
//     },
//     secondary: {
//       main: "#138808",
//     },
//   },
// });

// const RegionForm = () => {
//   const [formData, setFormData] = useState({
//     state: "",
//     district: "",
//     zone: "",
//     taluk: "",
//     wardNo: "",
//     pincode: "",
//   });

//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Optional: check if wardNo is a number
//     if (name === "wardNo" && isNaN(Number(value))) {
//       setErrorMessage("Ward number must be a number");
//       return;
//     }

//     setFormData({ ...formData, [name]: value });
//     setErrorMessage("");
//     setSuccessMessage("");
//   };

//   const handleCreateRegion = async () => {
//     try {
//       const response = await fetch("http://localhost:3000/regions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Region created:", data);
//         setSuccessMessage("Region created successfully");
//         setFormData({
//           state: "",
//           district: "",
//           zone: "",
//           taluk: "",
//           wardNo: "",
//           pincode: "",
//         });
//       } else {
//         const data = await response.json();
//         setErrorMessage(data.message || "Failed to create region");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setErrorMessage("Error creating region. Please try again.");
//     }
//   };

//   // return (
//   //   <ThemeProvider theme={theme}>
//   //     <Box>
//   //       <Typography
//   //         variant="h4"
//   //         gutterBottom
//   //         sx={{
//   //           fontFamily: "Playfair Display",
//   //           fontStyle: "italic",
//   //           fontWeight: 900,
//   //           color: "#121481",
//   //         }}
//   //       >
//   //         Create Region
//   //       </Typography>

//   //       {["state", "district", "zone", "taluk", "wardNo", "pincode"].map((field) => (
//   //         <TextField
//   //           key={field}
//   //           label={field.charAt(0).toUpperCase() + field.slice(1)}
//   //           name={field}
//   //           variant="outlined"
//   //           fullWidth
//   //           value={formData[field]}
//   //           onChange={handleChange}
//   //           margin="normal"
//   //           required
//   //         />
//   //       ))}

//   //       {errorMessage && (
//   //         <Typography variant="body1" color="error">
//   //           {errorMessage}
//   //         </Typography>
//   //       )}

//   //       {successMessage && (
//   //         <Typography variant="body1" color="primary">
//   //           {successMessage}
//   //         </Typography>
//   //       )}

//   //       <Box mt={2}>
//   //         <Button variant="contained" color="primary" onClick={handleCreateRegion}>
//   //           Create Region
//   //         </Button>
//   //       </Box>
//   //     </Box>
//   //   </ThemeProvider>
//   // );

//   return (
//   <ThemeProvider theme={theme}>
//     <Box>
//       {/* <Typography
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
//       </Typography> */}

//      <Grid container spacing={3}>
//   {["state", "district", "zone", "taluk", "wardNo", "pincode"].map((field) => (
//     <Grid item xs={12} sm={6} key={field}>
//       <TextField
//         label={field.charAt(0).toUpperCase() + field.slice(1)}
//         name={field}
//         variant="outlined"
//         fullWidth
//         value={formData[field]}
//         onChange={handleChange}
//         required
//         sx={{
//                 "& .MuiOutlinedInput-root": {
//                   height: 56, 
//                 },
//                 "& .MuiSelect-select": {
//                   padding: "12px 14px", 
//                 },
//                 width: { xs: '150%', sm: '100%', md: 350 }, }} // Adjust width as needed
//       />
//     </Grid>
//   ))}
// </Grid>


//       {errorMessage && (
//         <Typography variant="body1" color="error" mt={2}>
//           {errorMessage}
//         </Typography>
//       )}

//       {successMessage && (
//         <Typography variant="body1" color="primary" mt={2}>
//           {successMessage}
//         </Typography>
//       )}

//       <Box mt={3}>
//         <Button variant="contained" color="primary" onClick={handleCreateRegion}>
//           Create Region
//         </Button>
//       </Box>
//     </Box>
//   </ThemeProvider>
// );
// };

// export default RegionForm;


import React, { useState } from "react";

const C = { saffron: "#FF9933", green: "#138808", navy: "#0a0f2e", white: "#FFFFFF", muted: "#8892B0" };

const field = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'Outfit', sans-serif", width: "100%", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" };
const lbl = { fontSize: 11, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: 6, display: "block" };

const FIELDS = ["state", "district", "zone", "taluk", "wardNo", "pincode"];

const RegionForm = () => {
  const [formData, setFormData] = useState({ state: "", district: "", zone: "", taluk: "", wardNo: "", pincode: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "wardNo" && isNaN(Number(value))) { setErrorMessage("Ward number must be numeric"); return; }
    setFormData({ ...formData, [name]: value });
    setErrorMessage(""); setSuccessMessage("");
  };

  const handleCreate = async () => {
    if (Object.values(formData).some(v => !v.trim())) { setErrorMessage("All fields are required."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/regions", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage("Region created successfully ✓");
        setFormData({ state: "", district: "", zone: "", taluk: "", wardNo: "", pincode: "" });
      } else setErrorMessage(data.message || "Failed to create region.");
    } catch { setErrorMessage("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", color: C.white }}>
      <div style={{ fontSize: 11, color: C.saffron, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>⬡ Region Details</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {FIELDS.map(f => (
          <div key={f}>
            <label style={lbl}>{f === "wardNo" ? "Ward No" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
            <input
              name={f}
              value={formData[f]}
              onChange={handleChange}
              placeholder={`Enter ${f === "wardNo" ? "Ward No" : f}`}
              style={field}
              onFocus={e => { e.target.style.borderColor = "rgba(255,153,51,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,153,51,0.08)"; }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            />
          </div>
        ))}
      </div>

      {errorMessage && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: 10, padding: "12px 16px", color: "#FF6B6B", fontSize: 13, marginBottom: 16 }}>
          ⚠️ {errorMessage}
        </div>
      )}
      {successMessage && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(19,136,8,0.1)", border: "1px solid rgba(19,136,8,0.3)", borderRadius: 10, padding: "12px 16px", color: "#4CAF50", fontSize: 13, marginBottom: 16 }}>
          ✓ {successMessage}
        </div>
      )}

      <button
        onClick={handleCreate}
        disabled={loading}
        style={{ background: loading ? "rgba(255,153,51,0.4)" : "linear-gradient(135deg, #FF9933, #FFB347)", border: "none", borderRadius: 10, padding: "12px 28px", color: C.navy, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em", boxShadow: "0 4px 16px rgba(255,153,51,0.25)" }}
        onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.target.style.transform = "none"; }}
      >
        {loading ? "Creating…" : "Create Region"}
      </button>
    </div>
  );
};

export default RegionForm;