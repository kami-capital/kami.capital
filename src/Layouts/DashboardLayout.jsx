import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "../hooks/useTheme";
import { useAddress, useWeb3Context } from "../hooks/web3Context";
import useSegmentAnalytics from "../hooks/useSegmentAnalytics";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { shouldTriggerSafetyCheck } from "../helpers"; 
import PropTypes from "prop-types"; 
 import Sidebar from "../components/Sidebar/Sidebar.jsx";
import TopBar from "../components/TopBar/TopBar.jsx";
import NavDrawer from "../components/Sidebar/NavDrawer.jsx";
import Messages from "../components/Messages/Messages";
import NotFound from "../views/404/NotFound";
import { dark as darkTheme } from "../themes/dark.js";
import "../style.css";
import { useGoogleAnalytics } from "../hooks/useGoogleAnalytics";
 import { useAppSelector } from "../hooks";
import LoadingSplash from "../components/Loading/LoadingSplash";

 

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function DashboardLayout(props) {
    const { children, ...other } = props;

    const location = useLocation();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const currentPath = location.pathname + location.search + location.hash;
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };
  let themeMode = darkTheme;



    return(
    <ThemeProvider theme={themeMode}>
        <CssBaseline />
         <TopBar handleDrawerToggle={handleDrawerToggle} />
        <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} ${theme}`}>
            <Messages />
            <nav className={classes.drawer}>
                {isSmallerScreen ? (
                    <NavDrawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                ) : (
                    <Sidebar />
                )}
            </nav>

            <div className={`${classes.content} ${isSmallerScreen && classes.contentShift}`} style={{ paddingTop: 64 }}>
                {children}

            </div>
        </div>
    </ThemeProvider>);
}


DashboardLayout.propTypes = {
  children: PropTypes.node, 
};

export default DashboardLayout;
