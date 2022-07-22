import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Alert } from '@mui/material';
import { Snackbar } from '@mui/material';
import { Link } from 'react-router-dom';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AXIOS_CLIENT from '../../utils/api-client';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import { padding } from '@mui/system';

const pages = {
  hotel: 'Room Booking',
  kitchen: 'Order Meal',
  tour: 'Tour Service',
};
const routes = ['hotel', 'kitchen', 'tour'];
const settings = ['profile', 'dashboard', 'review', 'logout'];
const settings_routes = {
  profile: 'Profile',
  dashboard: 'Dashboard',
  review: 'Feedback',
  logout: 'Logout',
};


const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notification, setNotification] = useState([]);
const [notificationBox, setNotificationBox] = useState(false);
let notificationList = [];
const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setNotificationBox(false);
  // window.location.reload();
};

const handleNotificationClick =() => {
  // setNotificationBox(true);
  console.log(notificationBox);
  AXIOS_CLIENT.get('api/notification')
    .then((res) => {
      if (res.status === 200) {
        console.log("message: "+res.data);
        console.log(typeof( res.data.message));
        let data = res.data;
        if(data !== undefined){
          notificationList.push(data);
          setNotificationBox(true);
          console.log(notificationBox);
          setNotification(notificationList);
          console.log("notification : "+notification);
        }
        
        
      }
    })
    .catch((err) => {
      console.log('errror', err);
    });
  
}

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <RoomServiceIcon
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            B&B
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {routes.map((page) => (
                <Link to={page} key={page}>
                  <MenuItem
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ background: '' }}
                  >
                    <Button key={page} sx={{ color: '#58616e' }}>
                      {pages[page]}
                    </Button>{' '}
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

          <RoomServiceIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            B&B
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {routes.map((page) => (
              <Link to={page} key={page}>
                <Button
                  key={page}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {pages[page]}
                </Button>
              </Link>
            ))}
          </Box>
          <div style={{padding: "20px"}}>
          <CircleNotificationsIcon onClick={handleNotificationClick} sx={{ fontSize: "50px"}} />
          <div>
          
          
            {setNotificationBox ? 
            (
              
              <div>
              {notification.map((noti) => {
                return(
                 
                  <Snackbar anchorOrigin={{"vertical": "top", "horizontal":"right" }} open={notificationBox} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  {noti}
              </Alert>
              </Snackbar>
              
                );
              })}
              </div>
          
              
            )
            :
            (
            
              <div>
               <Snackbar anchorOrigin={{"vertical": "top", "horizontal":"right" }} open={notificationBox} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                  No notifications!!
              </Alert>
              </Snackbar></div>
            )
            }
          </div>
         
          </div>

          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <Link to={setting} key={setting}>
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      {settings_routes[setting]}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
         
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
