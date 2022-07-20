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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import constants from "../../constants";
var result=''
var data = {}

const CipherVerification = () => {
    const [errors, setErrors] = useState({});
    const [usrData, setUsrData] = useState();
    const [valueData, getData] = useState();
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() =>{
        const respObj = axios.get("https://yk3ixto4cgv7xpjtucnqsf3ijm0nlcnr.lambda-url.us-east-1.on.aws/").then((resp) => 
        {
            const uu = resp.data.Items.find(it => it.user_id.S == params.cipherKey)
            setUsrData(uu)
            console.log(uu)
            console.log(uu.cipher_key.S)
            var key = uu.cipher_key.S
            data = {
                cipher_key : key
            }
            axios.post("https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/user/cipher_gateway", data).then((response)=>{
                // setCipherData(response)   
                console.log(response)
                console.log(response.data.plainText) 
                getData(response.data)

        }).catch((err)=>{
        console.log(err)
        })
        }).catch((err)=>{
        alert(err.message)
        })
        }, [])

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
        if(data.convertedCipher == valueData.cipherText){
            // const postDetails = {
            //     user_id : usrData.user_id,
            // }
            // try {
            //     const res =  axios.post("https://jpx6jierjufn24fq32bxwkmb240dgrdb.lambda-url.us-east-1.on.aws/", postDetails);
            //     console.log({ res });
            //   } catch (e) {
            //     alert(e.message);
            //   }
            navigate("/hotel")
        }
        else{
            alert("Please enter correct cipher!")
        }

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
                    // defaultValue={{valueData ? valueData.plainText : ""}}
                    value={valueData ? valueData.plainText : ""}
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
                    defaultValue="CXDIKL"
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