import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Grid, InputBase, Typography } from "@mui/material";
import { firestore } from "../../configs";
import axios from "axios";
import constants from "../../constants";
import { collection, getDocs } from "firebase/firestore";
import { grey } from "@mui/material/colors";

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

const SecurityQuestions = ({ handleNext }) => {
  const [errors, setErrors] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      const questions = await getSecurityQuestions();
      const qs = questions.sort(() => 0.5 - Math.random());
      const randomQuestions = qs.slice(0, 2);

      setQuestions(randomQuestions);
    })();
  }, []);

  //calling cloud function to store security ans
  const storeSecurityAns = async () => {
    try {
      await axios.get(constants.storeSignupDetails);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleSubmit = (event) => {
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
  };

  const renderQuestions = useCallback(
    (question, index) => {
      const qNum = index + 1;
      return (
        <Grid item xs={12} key={index + ""}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {question}
          </Typography>
          <InputBase
            name={`question${qNum}`}
            id={`question${qNum}`}
            fullWidth
            placeholder="Answer..."
            sx={styles.input}
          />
          {errors[`question${qNum}`] && (
            <Typography variant="body2" sx={styles.error}>
              {errors[`question${qNum}`]}
            </Typography>
          )}
        </Grid>
      );
    },
    [errors]
  );

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {questions.map(renderQuestions)}
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Box>
  );
};

export default SecurityQuestions;

const styles = {
  input: {
    backgroundColor: grey[200],
    py: 1.5,
    px: 1.5,
    borderRadius: 2,
    fontSize: "15px",
  },
  error: {
    fontSize: "12px",
    color: "red",
  },
};
