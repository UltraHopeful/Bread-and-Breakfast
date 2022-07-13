import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SignupDetails from "./signup-details";
import SecurityQuestions from "./security-questions";
import CipherCode from "./cipher-code";
import { firestore, UserPool } from "../../configs";
import axios from "axios";
import constants from "../../constants";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const steps = ["User Details", "Security Questions", "Secret Code"];
let userId = "";

function getStepContent(step, handleNext) {
  switch (step) {
    case 0:
      return <SignupDetails handleNext={handleNext} />;
    case 1:
      return <SecurityQuestions handleNext={handleNext} userId={userId} />;
    case 2:
      return <CipherCode handleNext={handleNext} />;
    default:
      throw new Error("Unknown step");
  }
}

const getSecurityQuestions = async () => {
  const questions = [];

  const querySnapshot = await getDocs(
    collection(firestore, "security_questions")
  );

  querySnapshot.forEach((doc) => {
    questions.push(...doc.data().questions);
  });

  return questions;
};

export default function SignupSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleNext = (data) => {
    if (data.userSub) {
      userId = data.userSub;
    }
    setActiveStep(activeStep + 1);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        variant="outlined"
        sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
      >
        <Typography component="h1" variant="h4" align="center">
          Sign up
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep, handleNext)}
      </Paper>
    </Container>
  );
}
