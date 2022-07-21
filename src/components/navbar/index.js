import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import { useMemo } from "react";
import { logoutCognitoUser } from "../../utils";

const pages = {
  hotel: "Room Booking",
  kitchen: "Order Meal",
  tour: "Tour Service",
};
const routes = ["hotel", "kitchen", "tour"];

const loggedInRoutes = [
  { name: "Profile", route: "/profile" },
  { name: "Dashboard", route: "/dashboard" },
  { name: "Feedback", route: "/feedback" },
  { name: "Logout", route: "/" },
];

const loggedOutRoutes = [
  { name: "Login", route: "login" },
  { name: "Dashboard", route: "dashboard" },
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { loggedInUser, setLoggedInUser } = useAuth();
  const navigate = useNavigate();

  const settingRoutes = useMemo(
    () => (loggedInUser ? loggedInRoutes : loggedOutRoutes),
    [loggedInUser]
  );

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = async (route) => {
    setAnchorElUser(null);
    if (route) {
      navigate(route);

      if (route === "/") {
        await logoutCognitoUser();
        setLoggedInUser(null);
      }
    }
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <RoomServiceIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            B&B
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {routes.map((page) => (
                <Link to={page} key={page}>
                  <MenuItem
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ background: "" }}
                  >
                    <Button key={page} sx={{ color: "#58616e" }}>
                      {pages[page]}
                    </Button>{" "}
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          <RoomServiceIcon
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            B&B
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {routes.map((page) => (
              <Link to={page} key={page}>
                <Button
                  key={page}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {pages[page]}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {loggedInUser ? (
                  <Avatar alt="" src="" />
                ) : (
                  <RoomServiceIcon sx={{ color: "white" }} size="medium" />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settingRoutes.map(({ name, route }) => (
                <MenuItem
                  key={route}
                  onClick={() => handleCloseUserMenu(route)}
                >
                  <Typography textAlign="center">{name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
