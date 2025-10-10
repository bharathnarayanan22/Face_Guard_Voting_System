import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
  Card,
  CardContent,
  Fade,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const socket = io("http://127.0.0.1:5000", {
  path: "/socket.io",
  transports: ["websocket"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF9933", // Saffron
    },
    secondary: {
      main: "#138808", // Green
    },
    background: {
      default: "#FFFFFF", // White
    },
    text: {
      primary: "#000080", // Navy Blue
      secondary: "#4B0082", // Darker blue for contrast
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      color: "#000080",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
    },
    h6: {
      fontWeight: 600,
      color: "#000080",
    },
    body1: {
      color: "#000080",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
            backgroundColor: "#e68a00",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: "1px solid #FF9933",
          background: "linear-gradient(180deg, #FFFFFF 0%, #F5F6F5 100%)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          margin: "0 auto",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          "&:last-child": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          border: "2px solid #138808",
          background: "#FFFFFF",
        },
      },
    },
  },
});

const VotingScreen = () => {
  const [locked, setLocked] = useState(true);
  const [voter, setVoter] = useState(null);
  const [regionId, setRegionId] = useState(null);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
    });
    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setResult("Failed to connect to server. Please try again.");
    });

    const fetchParties = async () => {
      if (!regionId || !/^[0-9a-fA-F]{24}$/.test(regionId)) {
        console.warn("Invalid or missing regionId:", regionId);
        return;
      }
      try {
        console.log("Fetching parties for regionId:", regionId);
        const response = await axios.get(
          `http://127.0.0.1:3000/regions/${regionId}/parties`
        );
        setParties(response.data || []);
      } catch (error) {
        console.error("Error fetching parties:", error);
        setResult("Error fetching parties. Please try again.");
      }
    };

    if (regionId) {
      fetchParties();
    }

    socket.on("verifiedVoter", (data) => {
      console.log("Received verifiedVoter event:", data);
      if (data && data.voterId && data.regionId) {
        setLocked(false);
        setVoter(data.voterId);
        setRegionId(data.regionId);
      } else {
        console.error("Invalid verifiedVoter data:", data);
        setResult("Invalid voter data received.");
      }
    });

    socket.on("lockVoting", () => {
      console.log("Received lockVoting event");
      setLocked(true);
      setVoter(null);
      setRegionId(null);
      setParties([]);
      setResult("Voting interface locked.");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("verifiedVoter");
      socket.off("lockVoting");
    };
  }, [regionId]);

  const castVote = async (partyId) => {
    if (!voter) {
      setResult("No voter selected. Please verify first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/cast-vote", {
        voterId: voter,
        partyId,
      });

      if (response.data.success) {
        socket.emit("lockVoting", { voterId: voter });
        setResult("Vote cast successfully!");
        setOpenDialog(true);
        setTimeout(() => {
          setOpenDialog(false);
          setResult("");
        }, 3000); // Dialog closes after 3 seconds
      } else {
        setResult("Failed to cast vote. Please try again.");
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      setResult(
        `Error casting vote: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          p: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            mb: { xs: 3, sm: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            letterSpacing: "0.5px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "3px",
              background: "linear-gradient(90deg, #0028b9ff, #260888ff)",
              borderRadius: 2,
            },
          }}
        >
          <HowToVoteIcon
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              mr: 1.5,
              borderRadius: "50%",
              p: 0.5,
            }}
          />
          Voting Interface
        </Typography>
        <Box sx={{ width: { xs: "90%", sm: "80%", md: "60%" }, maxWidth: 600 }}>
          <Card sx={{ minHeight: { xs: 300, sm: 400, md: 500 } }}>
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {locked ? (
                <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                  Voting Locked. Waiting for verification...
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    <HowToVoteIcon
                      sx={{ verticalAlign: "middle", mr: 1, color: "#138808" }}
                    />
                    Select a Party to Vote
                  </Typography>
                  <List sx={{ flex: 1, width: "100%" }}>
                    {parties.length === 0 ? (
                      <Typography variant="body1" align="center">
                        No parties available. Please ensure region is valid.
                      </Typography>
                    ) : (
                      parties.map((party) => (
                        <ListItem key={party._id}>
                          <ListItemIcon>
                            <FlagIcon sx={{ color: "#FF9933" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={party.partyName}
                            secondary={`Leader: ${party.partyLeader}, Symbol: ${party.partySymbol}`}
                            primaryTypographyProps={{
                              color: "#000080",
                              fontWeight: 600,
                            }}
                            secondaryTypographyProps={{ color: "#4B0082" }}
                          />
                          <ListItemSecondaryAction>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => castVote(party._id)}
                              disabled={loading}
                              startIcon={
                                loading ? (
                                  <CircularProgress
                                    size={20}
                                    sx={{ color: "#138808" }}
                                  />
                                ) : (
                                  <HowToVoteIcon />
                                )
                              }
                            >
                              {loading ? "Voting..." : "Vote"}
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    )}
                  </List>
                </>
              )}
              {result && !result.includes("success") && (
                <Fade in={true} timeout={500}>
                  <Typography
                    variant="body1"
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor:
                        result.includes("Error") || result.includes("Failed")
                          ? "rgba(255, 0, 0, 0.1)"
                          : "rgba(19, 136, 8, 0.1)",
                      color:
                        result.includes("Error") || result.includes("Failed")
                          ? "#D32F2F"
                          : "#138808",
                      border: "1px solid",
                      borderColor:
                        result.includes("Error") || result.includes("Failed")
                          ? "#D32F2F"
                          : "#138808",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {result}
                  </Typography>
                </Fade>
              )}
            </CardContent>
          </Card>
        </Box>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="vote-success-dialog"
          sx={{ backdropFilter: "blur(3px)" }}
        >
          <DialogTitle
            id="vote-success-dialog"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#138808",
            }}
          >
            <CheckCircleIcon sx={{ mr: 1, color: "#138808" }} />
            Success
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                color: "#000080",
                textAlign: "center",
                fontWeight: 500,
                fontSize: "1.1rem",
              }}
            >
              {result}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default VotingScreen;