import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  TextareaAutosize,
  Snackbar,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import AXIOS_CLIENT from '../../utils/api-client';
import MuiAlert from '@mui/material/Alert';
import { useAuth } from '../../context';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const themeTypography = createTheme();

themeTypography.typography.overline = {
  fontSize: '4rem',
  fontFamily: 'optima',
  '@media (min-width:300px)': {
    fontSize: '1.5rem',
  },
  [themeTypography.breakpoints.up('md')]: {
    fontSize: '4rem',
  },
};

const Feedback = () => {
  const { loggedInUser } = useAuth();

  const user = loggedInUser?.sub || null;
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [error, setError] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    let formData = {
      path: 'getbookings',
      user: user,
    };
    console.log(formData);
    AXIOS_CLIENT.post('api/hotel/getbookings', formData).then((res) => {
      if (res.status === 200 && res.data.statusCode === 200) {
        let date1 = new Date();

        let bookings = res.data.body.filter((item) => {
          let date2 = new Date(item.checkin * 1000);
          if (date2.getTime() <= date1.getTime()) {
            return true;
          }
        });
        setBookings(bookings);
      }
    });
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log();
    try {
      if (!user) {
        setOpen(true);
        return;
      }
      if (!bookingId) {
        const message = 'Booking Id Field is Required';
        setError(true);
        setErrorMsg(message);
        return;
      }
      if (!event.target[2].value) {
        const message = 'Feedback is Required';
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
      path: 'review',
      user: user,
      booking_id: bookingId,
      review: event.target[2].value,
    };

    AXIOS_CLIENT.post('api/user/review', formData)
      .then((res) => {
        if (res.status === 200) {
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log('errror', err);
      });
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
          <ThemeProvider theme={themeTypography}>
            <Typography variant="overline" display="block">
              <strong>Your Feedback Matters!</strong>
            </Typography>
          </ThemeProvider>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            {error && <Alert severity="error">{errorMsg}</Alert>}

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Booking Id</InputLabel>
              {bookings && bookings.length > 0 ? (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={bookingId}
                  label="Booking Id"
                  onChange={(event) => {
                    setError(false);

                    setBookingId(event.target.value);
                  }}
                >
                  {bookings &&
                    bookings.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.booking_id}>
                          {item.booking_id}
                        </MenuItem>
                      );
                    })}
                </Select>
              ) : null}
            </FormControl>
            <br />
            <br />
            <TextareaAutosize
              aria-label="minimum height"
              minRows={7}
              onChange={(event) => {
                setError(false);
              }}
              placeholder="Please enter feedback here about your experince with us."
              style={{ width: 500 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={user ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {user ? 'Thanks for submmiting feedback' : 'Login is required'}
        </Alert>
      </Snackbar>{' '}
    </Container>
  );
};

export default Feedback;
