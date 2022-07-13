import React, { useState } from "react";
import { Box, Button, Grid, InputBase, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

const CipherCode = () => {
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});
    const formdata = new FormData(event.currentTarget);

    const code = formdata.get("code").toString().trim();

    if (!code) {
      setErrors({ code: "This field is required" });
      return;
    }

    console.log({ code });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {/* <Typography variant="body2" sx={{ mb: 0.5 }}>
            {question}
          </Typography> */}
      <InputBase
        name={"code"}
        id={"code"}
        fullWidth
        placeholder="Caesar Cipher Key"
        sx={styles.input}
      />
      {errors.code && (
        <Typography variant="body2" sx={styles.error}>
          {errors["code"]}
        </Typography>
      )}
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Finish
      </Button>
    </Box>
  );
};

export default CipherCode;

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
