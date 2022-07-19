import React, { useState } from "react";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  Link,
} from "@mui/material";
import { loginValidator } from "../../utils/loginValidation";
import { loginValidationMsgs } from "../../utils/loginValidation";
import { UserPool } from "../../configs";
let userData = null;
const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});

    const formdata = new FormData(event.currentTarget);
    let errors = {};
    let data = {};

    formdata.forEach((formValue, key) => {
      const value = formValue.toString().trim();
      let isValid = false;
      data[key] = value;
    
      isValid = loginValidator(key, value);

      if (!isValid) {
        errors[key] = loginValidationMsgs(key, value);
      }
    });

    const isFormValid = Object.keys(errors).length === 0;

    if (!isFormValid) {
      setErrors(errors);
      return;
    }
    userData = data;
    validateUser();
  };

  const validateUser = async () => {

    UserPool.authenticateUser(
      userData,
      (err, data) => {
        if (err) {
          alert(err.message);
        } else {
          console.log({ user: data });
          // addAuthenticationDetails(data.userSub);
        }
      }
    );
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper sx={{ p: 8, mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockRoundedIcon />
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              required
              fullWidth
              name="pass"
              label="Password"
              type="password"
              id="pass"
              error={!!errors.pass}
              helperText={errors.pass}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
          <Grid container sx={{ justifyContent: "flex-end" }}>
            <Grid item>
              <Link onClick={handleSignup} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
