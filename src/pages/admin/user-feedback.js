import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";

function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-vinay-serverless.cloudfunctions.net/getAllSentiments"
        );
        console.log({ res });
        setFeedbacks(res.data.results);
      } catch (error) {
        console.log({ error });
      }
    };

    getData();
  }, []);

  return (
    <Box sx={{ m: 3 }}>
      <Typography variant="h5">User Feedback</Typography>
      <Paper>
        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="Bookings Table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Booking Id
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Review
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.map((feedback, index) => (
                <TableRow
                  key={index + ""}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{feedback.booking_id}</TableCell>
                  <TableCell align="center">{feedback.review}</TableCell>
                  <TableCell align="center">{feedback.status}</TableCell>
                  <TableCell align="center">
                    {feedback.score.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {feedbacks.length < 1 && (
          <Typography variant="h6" textAlign="center" sx={{ py: 5 }}>
            No Feedback found
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default UserFeedback;
