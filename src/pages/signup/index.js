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
import { UserPool } from "../../configs";
const Signup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    const formdata = new FormData(event.currentTarget);
    const name = formdata.get("name");
    const email = formdata.get("email");
    const password = formdata.get("password");
    const userAttributes = [
      {
        Name: "name",
        Value: name,
      },
    ];

    UserPool.signUp(email, password, userAttributes, null, (err, data) => {
      if (err) {
        console.log({ err });
      } else {
        console.log({ data });
      }
    });
  };

  const login = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 8, my: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockRoundedIcon />
          <Typography component="h1" variant="h5">
            {"Sign up"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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
      </Paper>
    </Container>
  );
};

export default Signup;
