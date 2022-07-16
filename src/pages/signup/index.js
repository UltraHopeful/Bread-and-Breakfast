import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Link,
  Divider,
  Typography,
} from "@mui/material";
import { formValidationMsgs, formValidator } from "../../utils";
import { useNavigate } from "react-router-dom";
import { securityQuestions } from "../../data";
import { UserPool } from "../../configs";
import constants from "../../constants";
import axios from "axios";

let userData = null;

const Signup = () => {
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const login = () => {
    navigate("/login");
  };

  const handleSignup = (event) => {
    event.preventDefault();
    setErrors({});

    const formdata = new FormData(event.currentTarget);

    let errors = {};
    let data = {};

    formdata.forEach((formValue, key) => {
      const value = formValue.toString().trim();
      let isValid = false;
      data[key] = value;

      if (key === "cpassword") {
        const password = formdata.get("password")?.toString() ?? "";
        isValid = formValidator(key, password, value);
      } else {
        isValid = formValidator(key, value);
      }

      if (!isValid) {
        errors[key] = formValidationMsgs(key, value);
      }
    });

    const isFormValid = Object.keys(errors).length === 0;

    if (!isFormValid) {
      setErrors(errors);
      return;
    }

    userData = data;

    createUser();
  };

  const createUser = async () => {
    const userAttributes = [
      {
        Name: "given_name",
        Value: userData.fname,
      },
      {
        Name: "family_name",
        Value: userData.lname,
      },
    ];

    UserPool.signUp(
      userData.email,
      userData.password,
      userAttributes,
      null,
      (err, data) => {
        if (err) {
          alert(err.message);
        } else {
          console.log({ user: data });
          addAuthenticationDetails(data.userSub);
        }
      }
    );
  };

  const addAuthenticationDetails = async (userId) => {
    const data = {
      user_id: userId,
      answer_1: userData.q1,
      answer_2: userData.q2,
      answer_3: userData.q3,
      cipher_key: userData.cipherKey,
    };

    try {
      const res = await axios.post(constants.authenticationDetails, data);
      console.log({ res });
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Sign up
      </Typography>
      <Paper variant="outlined" sx={{ mt: 2, p: 4 }}>
        <Box>
          <Box
            component="form"
            onSubmit={handleSignup}
            noValidate
            sx={{ mt: 2 }}
          >
            <Divider sx={{ mb: 5 }}>User Details</Divider>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="fname"
                  defaultValue="John"
                  required
                  fullWidth
                  id="fname"
                  label="First Name"
                  error={!!errors.fname}
                  helperText={errors.fname}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="family-name"
                  name="lname"
                  defaultValue="Doe"
                  required
                  fullWidth
                  id="lname"
                  label="Last Name"
                  error={!!errors.lname}
                  helperText={errors.lname}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  defaultValue="jd@yopmail.com"
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
                  defaultValue="12345678"
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
                  defaultValue="12345678"
                  label="Confirm Password"
                  type="password"
                  id="cpassword"
                  autoComplete="new-password"
                  error={!!errors.cpassword}
                  helperText={errors.cpassword}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 5 }}>Security Questions</Divider>
            {/* security questions */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="q1"
                  defaultValue="John"
                  required
                  fullWidth
                  id="q1"
                  label={securityQuestions[0]}
                  error={!!errors.q1}
                  helperText={errors.q1}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="q2"
                  defaultValue="Doe"
                  required
                  fullWidth
                  id="q2"
                  label={securityQuestions[1]}
                  error={!!errors.q2}
                  helperText={errors.q2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="q3"
                  defaultValue="Doe"
                  required
                  fullWidth
                  id="q3"
                  label={securityQuestions[2]}
                  error={!!errors.q3}
                  helperText={errors.q3}
                />
              </Grid>
            </Grid>
            <Divider sx={{ my: 5 }}>Caesar Cipher Key</Divider>
            {/* caesar ciphar */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="cipherKey"
                  defaultValue="2"
                  required
                  fullWidth
                  id="cipherKey"
                  label={"Caesar Cipher Key"}
                  error={!!errors.cipherKey}
                  helperText={errors.cipherKey}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 5, mb: 2 }}
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
      </Paper>
    </Container>
  );
};

export default Signup;
