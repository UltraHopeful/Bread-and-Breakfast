import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Link,
  Snackbar,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';

import AXIOS_CLIENT from '../../utils/api-client';

import MuiAlert from '@mui/material/Alert';
import { useAuth } from '../../context';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Kitchen = () => {
  const { loggedInUser } = useAuth();

  const user = loggedInUser?.sub || null;

  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [bookingId, setBookingId] = useState('');
  const [meals, setMeals] = useState([{ meal_id: '', meal_value: '' }]);
  const [errorMsg, setErrorMsg] = useState('');
  const [error, setError] = useState(false);
  const [load, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    let formData = {
      path: 'getbookings',
      user: user,
    };

    AXIOS_CLIENT.post('api/hotel/getbookings', formData).then((res) => {
      if (res.status === 200 && res.data.statusCode === 200) {
        let date1 = new Date();

        let bookings = res.data.body.filter((item) => {
          let date2 = new Date(item.checkin * 1000);
          if (date2.getTime() >= date1.getTime()) {
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

    try {
      if (user == null) {
        const message = 'User Login is Required';
        // setError(true);
        // setErrorMsg(message);
        setOpen(true);
        return;
      }
      if (!bookingId) {
        const message = 'Booking Id is Field is Required';
        setError(true);
        setErrorMsg(message);
        return;
      }

      if (meals.length == 0) {
        const message = 'Meals is Field is Required';
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

    for (let index = 0; index < meals.length; index++) {
      const element = meals[index];
      if (element.meal_id === '') {
        const message = 'Meal Id is Required';
        setError(true);
        setErrorMsg(message);
        return;
      }
      if (element.meal_value === '') {
        const message = 'Number of meals is Required';
        setError(true);
        setErrorMsg(message);
        return;
      }
      if (!(element.meal_id > 0 && element.meal_id < 11)) {
        const message = 'Meal id should be between 1 to 10';
        setError(true);
        setErrorMsg(message);
        return;
      }
    }
    setLoading(true);

    const formData = {
      path: 'mealorder',
      user: user,
      booking_id: bookingId,
      meals: meals,
    };

    AXIOS_CLIENT.post('api/kitchen/mealorder', formData)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setOpen(true);
        }
      })
      .catch((err) => {
        console.log('errror', err);
      });
  };

  const handleMeals = () => {
    navigate('/kitchen/meals');
  };

  let handleValueChange = (i, e) => {
    setError(false);
    let newFormValues = [...meals];
    newFormValues[i][e.target.name] = e.target.value;
    setMeals(newFormValues);
  };

  let addFormFields = () => {
    setMeals([...meals, { meal_id: '', meal_value: '' }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...meals];
    newFormValues.splice(i, 1);
    setMeals(newFormValues);
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
            Breakfast Meal Booking
          </Typography>

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
            <div className="meals">
              {meals.map((element, index) => (
                <div className="form-inline" key={index}>
                  <TextField
                    required
                    fullWidth
                    name="meal_id"
                    label="Meal Id"
                    type="number"
                    id="meal_id"
                    value={element.meal_id}
                    onChange={(event) => handleValueChange(index, event)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    required
                    fullWidth
                    name="meal_value"
                    label="Number of meals"
                    type="number"
                    id="meal_value"
                    value={element.meal_value}
                    onChange={(event) => handleValueChange(index, event)}
                    sx={{ mb: 2 }}
                  />

                  {index ? (
                    <button
                      type="button"
                      className="button remove"
                      onClick={() => removeFormFields(index)}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
              <div className="button-section">
                <button
                  className="button add"
                  type="button"
                  onClick={() => addFormFields()}
                >
                  Add
                </button>
              </div>
            </div>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Book Meals
            </Button>
          </Box>
          <Grid container sx={{ justifyContent: 'flex-end' }}>
            <Grid item>
              <Link onClick={handleMeals} variant="body2">
                {'Types of meals'}
              </Link>
            </Grid>
          </Grid>
        </Box>
        {load && (
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
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={user ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {user ? 'Order being proccessed!' : 'Login is required'}
        </Alert>
      </Snackbar>{' '}
    </Container>
  );
};

export default Kitchen;
