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
import { securityQuestions } from "../../data";
import { questionValidationMsgs } from "../../utils/questionValidation";
import { questionValidator } from "../../utils/questionValidation";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

var data = {};
const QuestionVerification = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleQuestions = (event) => {
    event.preventDefault();
    setErrors({});
    const formdata = new FormData(event.currentTarget);
    let errors = {};

    formdata.forEach((formValue, key) => {
      const value = formValue.toString().trim();
      console.log(value);
      let isValid = false;
      data[key] = value;

      isValid = questionValidator(key, value);

      if (!isValid) {
        errors[key] = questionValidationMsgs(key, value);
      }
    });
    const isFormValid = Object.keys(errors).length === 0;

    if (!isFormValid) {
      setErrors(errors);
      return;
    }
    verifyAnswers();
  };

  const verifyAnswers = async () => {
    let user_id = params.Username;
    const userInput = {
      user_id: params.Username,
      a1: data.q1,
      a2: data.q2,
      a3: data.q3,
    };

    //verifying user answers with backend
    try {
      const postUserResp = await axios.post(
        "https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/user/question_verification",
        userInput
      );
      console.log(postUserResp);
      if (postUserResp.data == "Success") {
        navigate("/cipherVerification/" + user_id);
      } else {
        alert("Please enter correct answers!");
      }
    } catch (err) {
      console.log(err);
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
