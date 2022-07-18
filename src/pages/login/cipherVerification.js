import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { loginValidationMsgs } from "../../utils/loginValidation";
import { loginValidator } from "../../utils/loginValidation";
import { useEffect } from "react";
var result=''

const CipherVerification = () => {
    const [errors, setErrors] = useState({});

    // useEffect(() => {
    //         var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //         var charactersLength = characters.length;
    //         for ( var i = 0; i < 5; i++ ) {
    //           result += characters.charAt(Math.floor(Math.random() * 
    //      charactersLength));
    //        }
    // },[]);

    // useEffect(() =>{
    //     const respObj = axios.get("https://us-central1-assignment4serverless-355620.cloudfunctions.net/cipherVerification").then((resp) => 
    //     {
    //         const uu = resp.data.Items.find(it => it.user_id.S == params.Username)
    //         setUsrData(uu)
    //     }
    //     )}, [])

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
                    defaultValue={result}
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