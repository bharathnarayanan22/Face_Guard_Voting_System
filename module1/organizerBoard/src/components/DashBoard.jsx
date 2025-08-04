import React, { useState } from "react";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MapIcon from "@mui/icons-material/Map";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ListItemText from "@mui/material/ListItemText";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import p1 from "../assets/pngegg (7).png";
import p2 from "../assets/pngegg (6).png";
import p3 from "../assets/pngegg (9).png";
import p4 from "../assets/pngegg (4).png";
import p5 from "../assets/pngegg (12).png";
import p6 from "../assets/pngegg (2).png";
import chakra from "../assets/chakra.png";
import government from "../assets/government.png";
import EnrollVoterForm from "../pages/VoterForm";
import EnrollPartyForm from "../pages/PartyForm";
import ViewPartyPage from "../pages/ViewParties";
import ViewVoterPage from "../pages/ViewVoters";
import RegionForm from "../pages/RegionForm";
import ViewRegions from "../pages/ViewRegions";
import logo1 from "../assets/logo1.png";

const drawerWidth = 240;

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: "100%",
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background:
    "linear-gradient(90deg, #FF9933 0%, #FF9933 30%, #FFFFFF 40%, #FFFFFF 60%, #138808 70%, #138808 100%)",
  color: "#000",
  width: "100%",
  position: "fixed",
  "&::after": {
    content: '""',
    position: "absolute",
    transform: "translate(-50%, -50%)",
    left: "50%",
    top: "50%",
    width: "100px",
    height: "50px",
    backgroundImage: `url(${chakra})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    opacity: 1,
    transition: "opacity 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      top: "10%",
      transform: "translateX(-50%)",
      opacity: 0.2,
    },
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  backgroundColor: "#ff9933",
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "#ff9933",
    color: "white",
    borderRight: "none",
    zIndex: theme.zIndex.drawer,
  },
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingTop: 0,
  "& .MuiListItemText-primary": {
    fontFamily: '"Dancing Script", cursive', // Beautiful cursive font
    fontStyle: "italic",
    fontWeight: 700, // Bold italic
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  color: "white",
  "&:hover": {
    backgroundColor: "#138808",
  },
  "&.Mui-selected": {
    backgroundColor: "#138808",
    "&:hover": {
      backgroundColor: "#138808",
    },
  },
}));

const StyledListItemIcon = styled(ListItemIcon)({
  color: "inherit",
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontWeight: "bold",
  fontFamily: '"Dancing Script", cursive',
  fontStyle: "italic",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  // WebkitTextStroke: "1px black", // Black outline for text
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", // Subtle shadow for depth
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem", // Smaller font size on mobile
    // WebkitTextStroke: "1px black", // Thinner stroke on smaller screens
    textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff9933",
    },
    secondary: {
      main: "#138808",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          "@keyframes glitter": {
            "0%": {
              transform: "rotate(30deg) translate(-30%, -30%)",
            },
            "100%": {
              transform: "rotate(30deg) translate(30%, 30%)",
            },
          },
        },
      },
    },
  },
});

export default function OrganizerDashboard() {
  const [open, setOpen] = useState(false);
  const [selectedView, setSelectedView] = useState(null);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuItemClick = (view) => {
    setSelectedView(view);
    setOpen(false);
  };

  const handleCardClick = (view) => {
    setSelectedView(view);
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <div
          style={{
            backgroundImage: `url(${chakra})`,
            backgroundPosition: "center",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            opacity: 0.2,
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
            pointerEvents: "none",
          }}
        />

        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              sx={{ mr: 2, color: "#fff" }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

            <StyledTypography variant="h6" noWrap>
              Election Organizer Dashboard
            </StyledTypography>
          </Toolbar>
        </AppBar>

        <StyledDrawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
        >
          <DrawerHeader />
          <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
          <StyledList>
            {[
              {
                view: "createRegion",
                text: "Create Region",
                icon: <AddLocationIcon />,
              },
              {
                view: "enrollVoter",
                text: "Enroll Voter",
                icon: <PersonAddIcon />,
              },
              {
                view: "enrollParty",
                text: "Enroll Party",
                icon: <GroupAddIcon />,
              },
              { view: "viewRegions", text: "View Regions", icon: <MapIcon /> },
              {
                view: "viewVoters",
                text: "View Voters",
                icon: <PeopleAltIcon />,
              },
              {
                view: "viewParties",
                text: "View Parties",
                icon: <GroupsIcon />,
              },
            ].map((item, index) => (
              <React.Fragment key={item.view}>
                <StyledListItemButton
                  onClick={() => handleMenuItemClick(item.view)}
                  selected={selectedView === item.view}
                >
                  <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                  <ListItemText primary={item.text} />
                </StyledListItemButton>
                {index < 5 && (
                  <Divider sx={{ backgroundColor: "#fff", mx: "auto" }} />
                )}
              </React.Fragment>
            ))}
          </StyledList>
          <Box sx={{ marginTop: "auto", padding: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <img
                src={government}
                alt="Government Logo"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        </StyledDrawer>

        <Main>
          <Toolbar />
          {selectedView === null && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-around",
                gap: 12,
                padding: 5,
              }}
            >
              {[
                { view: "createRegion", text: "Create Region", icon: p6 },
                { view: "enrollVoter", text: "Enroll Voter", icon: p2 },
                { view: "enrollParty", text: "Enroll Party", icon: p3 },
                { view: "viewRegions", text: "View Regions", icon: p5 },
                { view: "viewVoters", text: "View Voters", icon: p1 },
                { view: "viewParties", text: "View Parties", icon: p4 },
              ].map((item) => (
                <Card
                  key={item.view}
                  sx={{
                    width: { xs: "100%", sm: "45%", md: "30%", lg: "20%" },
                    borderRadius: 5,
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    boxShadow: `
      0 4px 8px rgba(0,0,0,0.2),
      0 0 12px rgba(255, 215, 0, 0.3)`,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: `
        0 6px 16px rgba(0,0,0,0.25),
        0 0 24px rgba(255, 215, 0, 0.6)`,
                      "& .topSection": {
                        backgroundColor: "#FF9933",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: "-50%",
                          left: "-50%",
                          width: "200%",
                          height: "200%",
                          background: `linear-gradient(
            to bottom right,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.8) 50%,
            rgba(255,255,255,0) 100%
          )`,
                          transform: "rotate(30deg)",
                          animation: "glitter 3s infinite linear",
                        },
                      },
                    },
                  }}
                  onClick={() => handleCardClick(item.view)}
                >
                  {/* Top Section - Image with Glitter */}
                  <Box
                    className="topSection"
                    sx={{
                      backgroundColor: "#138808",
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 2,
                      minHeight: 150,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        height: 100,
                        width: "auto",
                        objectFit: "contain",
                        transition: "all 0.3s ease-in-out",
                        position: "relative",
                        zIndex: 2,
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                      image={item.icon}
                      alt={item.text}
                    />
                  </Box>

                  {/* Bottom Section - Text */}
                  <Box
                    sx={{
                      backgroundColor: "white",
                      padding: 2,
                      textAlign: "center",
                      borderTop: "2px solid #138808",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {},
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: "#1976d2",
                        fontFamily: '"Dancing Script", cursive',
                        fontStyle: "italic",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        letterSpacing: "0.5px",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          color: "#0d47a1",
                        },
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Box>
          )}
          {selectedView && (
            <Box
              sx={{
                maxWidth: "800px",
                width: { xs: "90%", sm: "80%", md: "70%" },
                mx: "auto",
                mt: 2,
              }}
            >
              {selectedView === "createRegion" && <RegionForm />}
              {selectedView === "enrollVoter" && <EnrollVoterForm />}
              {selectedView === "enrollParty" && <EnrollPartyForm />}
              {selectedView === "viewRegions" && <ViewRegions />}
              {selectedView === "viewVoters" && <ViewVoterPage />}
              {selectedView === "viewParties" && <ViewPartyPage />}
            </Box>
          )}
        </Main>
      </Box>
    </ThemeProvider>
  );
}
