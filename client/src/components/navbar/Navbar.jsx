import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import { PriceDistanceContext } from "../context/PriceDistanceContext"; // import context
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { TbFilterEdit } from "react-icons/tb";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SlidingBar from "../slidingBar/RangeSlider";
import ListView from "../listView/ListView";
import "./Navbar.css";
import Switch from "@mui/material/Switch";
import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown19 } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SearchComponent from "../searchBar/SearchComponent";
import useMediaQuery from "@mui/material/useMediaQuery"; // Import the hook

const drawerWidth = 580;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    position: "relative",
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isSmallScreen",
})(({ theme, }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
   
  }),
 
}));

const DrawerHeader = styled("div", {
  shouldForwardProp: (prop) => prop !== "isSmallScreen" && prop !== "open",
})(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",


}));


const Navbar = ({ setSelectedCoordinates, userCoords }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:750px)"); // Detect screen size
  const [open, setOpen] = React.useState(true);
  const [isClicked, setIsClicked] = React.useState(true);
  const { showFreeOnly, setShowFreeOnly, order, setOrder } =
    useContext(PriceDistanceContext);

  const handleDrawerOpen = () => {
    setOpen(true);
    setIsClicked(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setIsClicked(false);
  };

  // Handle the switch toggle
  const handleSwitchChange = (event) => {
    setShowFreeOnly(event.target.checked);
  };
  // Handle sorting
  const handleSorting = () => {
    if (order === "") {
      setOrder("asc");
    } else if (order === "asc") {
      setOrder("");
    }
  };

  return (
    <Box sx={{}}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        isSmallScreen={isSmallScreen} // Pass screen size check
        style={{ backgroundColor: "#0f0e0e" }}
      >
        <Toolbar>
          <Typography variant="h5" noWrap sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img
                src="src/assets/pp-logo-reversed.svg"
                sx={{ flexGrow: 1 }}
                style={{
                  height: "35px",
                  width: "auto",
                  marginRight: "10px",
                  padding: "0px",
                }}
                alt="Logo"
              />
            </Link>
          </Typography>
          {!isSmallScreen ? (
  <TbFilterEdit
    size={25}
    aria-label="open drawer"
    edge="end"
    onClick={handleDrawerOpen}
    style={{
      color: isClicked ? "black" : "#fee000", // Switch color on click
      display: isClicked ? "none" : "block", // Optionally hide icon
      cursor: "pointer", // Add pointer cursor for better UX
    }}
  />
) : (
  <TbFilterEdit
    size={50}
    aria-label="open drawer"
    onClick={handleDrawerOpen}
    style={{
      position: "fixed", // Position at the bottom
      bottom: "20px", 
      right: "20px", 
      color: "#fee000",
      backgroundColor: "black", // Add a background color for better visibility
      borderRadius: "50%", // Make it circular
      padding: "10px", 
      cursor: "pointer", 
      zIndex: 1000, // Ensure it's above other elements
    }}
  />
)}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: isSmallScreen ? "100%" : drawerWidth, // Adjust drawer size for small screens
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSmallScreen ? "100%" : drawerWidth,
            height: isSmallScreen ? "70%" : "100vh", // Adjust height for bottom drawer
            backgroundColor: "#0f0e0e",
            color: "white",
            borderRadius: isSmallScreen ? "15px 15px 0px 0px" : "0px",
            
         
          },
        }}
        variant="persistent"
        anchor={isSmallScreen ? "bottom" : "right"} // Change anchor dynamically
        open={open}
        // style={{ zIndex: 100 }}
      >
        <DrawerHeader>
     
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon style={{ color: "white" }} />
            ) : (
              <ChevronRightIcon
                style={{ color: "white", marginRight: "20px" }}
              />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <div className="sldiing_wrapper"
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "center",
            
          }}
        >
          <SlidingBar />
        </div>
        <Divider />


        <div className="filtering_wrapper">
         
         <div className="filtering_Free">
          <Typography style={{ marginLeft: "10px" }}>Free Only</Typography>
          <Switch
            color="#ffc900"
            checked={showFreeOnly || false} // Ensure it's never undefined
            onChange={handleSwitchChange}
          />
          </div>

          {" "}
          <div className="filtering_Sort">
          <Typography style={{ marginLeft: "10px" }}>Sort Price</Typography>
          <FontAwesomeIcon 
          
            icon={faArrowDown19}
            style={{ height: "25px",
              color: order === "asc" ? " #ffc900" : "white"
             }}
           
            onClick={handleSorting}
          />
        </div>
        </div>
        <div className="list_wrapper" style={{height: "100%"}} >
        <ListView
          userCoords={userCoords}
          setSelectedCoordinates={setSelectedCoordinates}
          setOpen={setOpen}
          setIsClicked={setIsClicked}
          style={{ height: "100vh"}}
        />
        </div>
      </Drawer>
      {!open && (
        <div
          style={{
            position: "absolute",
            top: "85px",
            left: "48%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <SearchComponent setSelectedCoordinates={setSelectedCoordinates} />
        </div>
      )}
    </Box>
  );
};

export default Navbar;
