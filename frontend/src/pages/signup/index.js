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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
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
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDialog = () => {
    setShowDialog(false);
    login();
  };

  const createUser = async () => {
    setLoading(true);

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
          setLoading(false);
          alert(err.message);
        } else {
          addSecurityAns(data.userSub);
        }
      }
    );
  };

  const addSecurityAns = async (userId) => {
    const data = {
      user_id: userId,
      answer_1: userData.q1,
      answer_2: userData.q2,
      answer_3: userData.q3,
      email: userData.email,
      firstname: userData.fname,
      lastname: userData.lname,
    };

    console.log({ data });

    try {
      const res = await axios.post(constants.authenticationDetails, data);
      addCipherKey(userId);
    } catch (e) {
      setLoading(false);
      console.log({ dynamo: e.message });
      alert(e.message);
    }
  };

  const addCipherKey = async (userId) => {
    try {
      const data = { user_id: userId, cipher_key: userData.cipherKey };
      const res = await axios.post(constants.addCipherKey, data);
      setLoading(false);
      setShowDialog(true);
    } catch (error) {
      setLoading(false);
      console.log({ error });
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Signup
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
                  required
                  fullWidth
                  id="q1"
                  name="q1"
                  label={securityQuestions[0]}
                  error={!!errors.q1}
                  helperText={errors.q1}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="q2"
                  name="q2"
                  label={securityQuestions[1]}
                  error={!!errors.q2}
                  helperText={errors.q2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="q3"
                  name="q3"
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign up"}
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
      <Dialog open={showDialog}>
        <DialogTitle>Signup Successful</DialogTitle>
        <DialogContent>
          <Typography>Please check your email and verify</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialog}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Signup;
