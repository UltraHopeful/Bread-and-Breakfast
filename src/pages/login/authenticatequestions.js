import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { securityQuestions } from "../../data";
import { loginValidationMsgs } from "../../utils/loginValidation";
import { loginValidator } from "../../utils/loginValidation";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import constants from "../../constants";

let userInput = null;

const QuestionVerification = () => {

    const params = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [usrData, setUsrData] = useState();

    useEffect(() =>{
        const respObj = axios.get("https://yk3ixto4cgv7xpjtucnqsf3ijm0nlcnr.lambda-url.us-east-1.on.aws/").then((resp) => 
        {
            const uu = resp.data.Items.find(it => it.user_id.S == params.Username)
            setUsrData(uu)
        }
        )}, [])

    const handleQuestions = (event) => {
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
    userInput = data;
    verifyAnswers()
  };
  
  const verifyAnswers = () => {
        console.log("Going to verify answers")
        if(userInput.q1 == usrData.answer_1.S && userInput.q2 == usrData.answer_2.S && userInput.q3 == usrData.answer_3.S){
            navigate("/cipherVerification/"+usrData.user_id.S);
        }
        else{
            alert("Please enter correct answers to proceed further.")
        }
    };
  
    return (
        <Container component="main" maxWidth="sm" sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
        Questions Verification
        </Typography>
        <Paper variant="outlined" sx={{ mt: 2, p: 4 }}>
            <Box>
            <Box
                component="form"
                onSubmit={handleQuestions}
                noValidate
                sx={{ mt: 2 }}
            >
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
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 5, mb: 2 }}
                >
                Verify
                </Button>
            </Box>
            </Box>
        </Paper>
        </Container>
    );
    };
export default QuestionVerification;