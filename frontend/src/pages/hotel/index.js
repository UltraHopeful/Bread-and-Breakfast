import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';

import AXIOS_CLIENT from '../../utils/api-client';

import MuiAlert from '@mui/material/Alert';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from '../../context';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function addMonths(numOfMonths, date = new Date()) {
  date.setMonth(date.getMonth() + numOfMonths);
  return date;
}

const HotelBooking = () => {
  const { loggedInUser } = useAuth();

  const user = loggedInUser?.sub || null;
  const navigate = useNavigate();

  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [rooms, setRooms] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [error, setError] = useState(false);
  const [request, setRequest] = useState(false);
  const [load, setLoading] = useState(false);
  const [roomtype, setRoomtype] = useState('');
  const [availability, setAvailability] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [notification, setNotification] = useState('');

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    if (!user) {
      navigate('/login');
    }
    window.location.reload();
  };

  const handleRoom = (event, value) => {
    if (value) {
      setRoomtype(value);
    }
  };

  const toggleStyles = makeStyles({
    root: {
      width: '100%',
      justifyContent: 'space-between',
    },
    toggle: {
      fontFamily: "'Raleway', sans-serif",
      fontSize: '.9rem',
      border: '2px solid rgba(0, 0, 0, 0.12)',
      borderRadius: '10px',
      '&.MuiToggleButtonGroup-groupedHorizontal:not(:last-child)': {
        borderRadius: '10px',
      },
      '&.MuiToggleButtonGroup-groupedHorizontal:not(:first-child)': {
        borderRadius: '10px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
      },
      '&.Mui-selected': {
        borderRadius: '10px',
        background: '#000',
        color: '#fff',
      },
      '&.MuiToggleButton-root': {
        '&:hover': {
          background: '#000',
          color: '#fff',
        },
      },
    },
  });
  function FilterListToggle({ options, value, changeToggle }) {
    const classes = toggleStyles();
    return (
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={changeToggle}
        className={classes.root}
      >
        {options.map(({ label, id, value }) => (
          <ToggleButton className={classes.toggle} key={id} value={value}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      if (!user) {
        const message = 'User Login is Required';
        setOpen(true);
        return;
      }
      if (!checkin) {
        const message = 'Check In Field is Required';
        setError(true);
        setErrorMsg(message);
        return;
      }
      if (!checkout) {
        const message = 'Check Out Field is Required';
        setError(true);
        setErrorMsg(message);
        return;
      }
      if (!rooms) {
        const message = 'Number of Rooms Field is Required';
        setError(true);
        setErrorMsg(message);
        return;
      }
      var date1 = new Date(checkin);

      var date2 = new Date(checkout);

      if (!(date2.getTime() >= date1.getTime())) {
        const message = 'Checkout Date Should be future';
        setError(true);
        setErrorMsg(message);
        return;
      }
    } catch (err) {
      const message = 'Invalid Data Entered';
      setError(true);
      setErrorMsg(message);
      return;
    }

    const formData = {
      path: 'check-availability',
      checkin: Math.floor(date1.getTime() / 1000).toString(),
      checkout: Math.floor(date2.getTime() / 1000).toString(),
      rooms: rooms,
    };
    setRequest(true);
    setLoading(true);

    AXIOS_CLIENT.post('api/hotel/check-availability', formData)
      .then((res) => {
        if (res.status === 200) {
          let roomListDisplay = [];
          let roomList = JSON.parse(res.data.body);
          for (let index = 0; index < roomList.length && index < 5; index++) {
            const item = roomList[index];
            roomListDisplay.push({ id: index, label: item, value: item });
          }
          setLoading(false);
          setAvailability(roomListDisplay);
        }
      })
      .catch((err) => {
        console.log('errror', err);
      });
  };
  const handleBookSubmit = (event) => {
    setLoading(true);
    var date1 = new Date(checkin);
    var date2 = new Date(checkout);
    const formData = {
      path: 'bookroom',
      checkin: Math.floor(date1.getTime() / 1000).toString(),
      checkout: Math.floor(date2.getTime() / 1000).toString(),
      rooms: rooms,
      roomid: roomtype,
      user: user,
    };

    const publishData = {
      message: 'room booking',
      path: 'bookroom',
      checkin: Math.floor(date1.getTime() / 1000).toString(),
      checkout: Math.floor(date2.getTime() / 1000).toString(),
      rooms: rooms,
      roomid: roomtype,
      user: user,
    };

    AXIOS_CLIENT.post('api/hotel/bookroom', formData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          console.log(res.data);
          setLoading(false);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log('pubsub error: ', err);
      });
  };

  const handleRooms = () => {
    navigate('/hotel/rooms');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper sx={{ p: 8, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Room Booking
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            {error && <Alert severity="error">{errorMsg}</Alert>}

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disablePast
                fullWidth
                label="Check In"
                value={checkin}
                maxDate={addMonths(1)}
                onChange={(newValue) => {
                  setCheckin(newValue);
                  setError(false);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />

              <DatePicker
                disablePast
                label="Check Out"
                value={checkout}
                maxDate={addMonths(1)}
                onChange={(newValue) => {
                  setCheckout(newValue);
                  setError(false);
                  setRequest(false);
                }}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>

            <TextField
              required
              fullWidth
              name="rooms"
              label="Number of Rooms"
              type="number"
              id="rooms"
              value={rooms}
              onChange={(event) => {
                setRooms(event.target.value);
                setError(false);
                setRequest(false);
              }}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Check Avaibility
            </Button>
          </Box>
          <Grid container sx={{ justifyContent: 'flex-end' }}>
            <Grid item>
              <Link onClick={handleRooms} variant="body2">
                {'Types of rooms'}
              </Link>
            </Grid>
          </Grid>
        </Box>
        {request && load && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {request && !load && availability.length > 0 && (
          <div className="filter-group">
            <p className="label">Available Room Types </p>
            <FilterListToggle
              options={availability}
              value={roomtype}
              changeToggle={handleRoom}
            />
          </div>
        )}
        {request && !load && availability.length == 0 && (
          <b>No Rooms Available</b>
        )}
        {request && roomtype && (
          <Button
            fullWidth
            type="submit"
            variant="contained"
            onClick={handleBookSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            Book
          </Button>
        )}
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={user ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {user ? 'Booking sucessfully Created!' : 'Login is required'}
        </Alert>
      </Snackbar>{' '}
    </Container>
  );
};

export default HotelBooking;
