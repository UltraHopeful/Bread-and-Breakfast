import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, TextField, Button, Paper, Link } from "@mui/material";
import { UserPool } from "../../configs";

const SignupDetails = ({ handleNext }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSignup = (event) => {
    event.preventDefault();
    setErrors({});
    const formdata = new FormData(event.currentTarget);
    let errors = {};
    let data = {};
    let isFormValid = true;

    formdata.forEach((formValue, key) => {
      const value = formValue.toString().trim();

      if (!value) {
        isFormValid = false;
        errors[key] = "This field is required";
      } else {
        data[key] = value;
      }
    });

    if (!isFormValid) {
      setErrors(errors);
      return;
    }

    const userAttributes = [
      {
        Name: "name",
        Value: data.name,
      },
    ];

    UserPool.signUp(
      data.email,
      data.password,
      userAttributes,
      null,
      (err, data) => {
        if (err) {
          console.log({ err });
        } else {
          console.log({ data });
          handleNext(data);
        }
      }
    );
  };

  const login = () => {
    navigate("/login");
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoComplete="given-name"
              name="name"
              required
              fullWidth
              id="name"
              label="Full Name"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="cpassword"
              label="Confirm Password"
              type="password"
              id="cpassword"
              autoComplete="new-password"
              error={!!errors.cpassword}
              helperText={errors.cpassword}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign up
        </Button>
      </Box>
      <Grid container sx={{ justifyContent: "flex-end" }}>
        <Grid item>
          <Link onClick={login} variant="body2">
            {"Already have an account? Login"}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignupDetails;
