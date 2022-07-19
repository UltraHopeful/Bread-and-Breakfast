import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Divider,
  Typography,
} from "@mui/material";
import { loginValidationMsgs } from "../../utils/loginValidation";
import { loginValidator } from "../../utils/loginValidation";

const CipherVerification = () => {
    const [errors, setErrors] = useState({});

    const handleCipher = (event) => {
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
    //userData = data;
    //validateUser();
  };

    return (
        <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
        Caesar Cipher Verification
        </Typography>
        <Paper variant="outlined" sx={{ mt: 2, p: 4 }}>
            <Box>
            <Box
                component="form"
                onSubmit={handleCipher}
                noValidate
                sx={{ mt: 2 }}
            >
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    name="normalText"
                    defaultValue="AVGB"
                    required
                    fullWidth
                    disabled
                    id="normalText"
                    label= "Normal Text"
                    error={!!errors.normalText}
                    helperText={errors.normalText}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    name="key"
                    defaultValue="2"
                    required
                    fullWidth
                    disabled
                    id="key"
                    label="Key Value"
                    error={!!errors.key}
                    helperText={errors.key}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                    name="convertedCipher"
                    defaultValue="CXDI"
                    required
                    fullWidth
                    id="convertedCipher"
                    label="Converted Cipher"
                    error={!!errors.convertedCipher}
                    helperText={errors.convertedCipher}
                    />
                </Grid>
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 5, mb: 2 }}
                >
                Verify and Login
                </Button>
            </Box>
            </Box>
        </Paper>
        </Container>
    );
    };

export default CipherVerification;