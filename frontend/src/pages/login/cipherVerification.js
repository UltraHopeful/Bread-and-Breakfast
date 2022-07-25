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
import { cipherValidationMsgs } from "../../utils/cipherValidation";
import { cipherValidator } from "../../utils/cipherValidation";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context";
import { getLoggedInUser } from "../../utils";

const CipherVerification = () => {
  const [errors, setErrors] = useState({});
  const [text, setText] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const { setLoggedInUser } = useAuth();

  useEffect(() => {
    makeid(5);
  }, [1]);

  function makeid(length) {
    var normalText = "";
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var charsLength = chars.length;
    for (var i = 0; i < length; i++) {
      normalText += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    setText(normalText);
  }

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
      isValid = cipherValidator(key, value);

      if (!isValid) {
        errors[key] = cipherValidationMsgs(key, value);
      }
    });

    const isFormValid = Object.keys(errors).length === 0;

    if (!isFormValid) {
      setErrors(errors);
      return;
    }

    verifyCipher(data.convertedCipher);
  };

  const verifyCipher = async (cipherText) => {
    const data = {
      user_id: params.cipherKey,
      normal_text: text,
      cipher_text: cipherText,
    };

    console.log({ data });
    //Sending generated normal text, cuser entered cipher text and user id to cloud function
    try {
      const cipherRes = await axios.post(
        "https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/user/cipher_gateway",
        data
      );

      if (cipherRes.data.status == "success") {
        const postDetails = {
          userId: params.cipherKey,
          event_type: "login",
        };

        //adding login timestamp
        try {
          const timestampRes = await axios.post(
            "https://pfqnboa6zi.execute-api.us-east-1.amazonaws.com/dev/api/user/logintimeupdate",
            postDetails
          );

          const user = await getLoggedInUser();

          if (user) {
            setLoggedInUser(user);

            if (user.email === "admin@dal.ca") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }
        } catch (e) {
          alert(e.message);
        }
      } else {
        alert("Please enter correct cipher code!");
      }
    } catch (err) {
      console.log(err);
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
                  value={text}
                  fullWidth
                  disabled
                  id="normalText"
                  label="Normal Text"
                  error={!!errors.normalText}
                  helperText={errors.normalText}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="convertedCipher"
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
