import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

function Tour() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          "https://4dhkpbeuzfslkqgbodsxmtmu3i0xwzos.lambda-url.us-east-1.on.aws/",
          {}
        );

        console.log({ res });
        setTours(res.data);
        setLoading(false);
      } catch (error) {
        console.log({ error });
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <Box sx={{ m: 3 }}>
      <Typography variant="h5">Recommended Tours</Typography>
      <Paper>
        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="Bookings Table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Tour Id
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Hotel
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Destination
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Days
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Price
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tours.map((tour, index) => (
                <TableRow
                  key={index + ""}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{tour.Id}</TableCell>
                  <TableCell align="center">{tour.Hotel}</TableCell>
                  <TableCell align="center">{tour.Destination}</TableCell>
                  <TableCell align="center">{tour.Days}</TableCell>
                  <TableCell align="center">{tour.Price} CAD</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && (
          <Skeleton variant="rectangular" width={"100%"} height={200} />
        )}
        {tours.length < 1 && (
          <Typography variant="h6" textAlign="center" sx={{ py: 5 }}>
            {loading ? "Loading..." : "No Tours found"}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Tour;
