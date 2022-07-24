import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import AXIOS_CLIENT from "../../utils/api-client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { dateFormat } from "../../utils";
import { useAuth } from "../../context";

const renderLabelValue = (label, value) => {
  return (
    <Stack>
      <Typography variant="body1" sx={{ fontWeight: "600" }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontSize: 18 }}>
        {value}
      </Typography>
    </Stack>
  );
};

const Profile = () => {
  const [bookings, setBookings] = useState([]);
  const { loggedInUser } = useAuth();

  useEffect(() => {
    let formData = {
      path: "getbookings",
      user: loggedInUser.sub,
    };

    AXIOS_CLIENT.post("api/hotel/getbookings", formData).then((res) => {
      if (res?.data?.body) {
        setBookings(res.data.body);
      }
    });
  }, []);

  return loggedInUser ? (
    <Container maxWidth="md">
      <Paper sx={{ p: 2, my: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Stack direction={"row"} spacing={30} sx={{ mb: 2 }}>
            {renderLabelValue("First Name", loggedInUser.given_name)}
            {renderLabelValue("Last Name", loggedInUser.family_name)}
          </Stack>
          {renderLabelValue("Email", loggedInUser.email)}
        </Box>
      </Paper>
      <Box sx={{ my: 3 }}>
        <Typography variant="h5">Booking History</Typography>
        <Paper>
          <TableContainer sx={{ mt: 2 }}>
            <Table aria-label="Bookings Table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Booking Id</TableCell>
                  <TableCell align="center">Check-In</TableCell>
                  <TableCell align="center">Check-Out</TableCell>
                  <TableCell align="center">Rooms Type</TableCell>
                  <TableCell align="center">Rooms Booked</TableCell>
                  <TableCell align="center">Bill</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow
                    key={index + ""}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{booking.booking_id}</TableCell>
                    <TableCell align="center">
                      {dateFormat(booking.checkin * 1000, "MMM DD, YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      {dateFormat(booking.checkout * 1000, "MMM DD, YYYY")}
                    </TableCell>
                    <TableCell align="center">{booking.roomtype}</TableCell>
                    <TableCell align="center">{booking.rooms}</TableCell>
                    <TableCell align="center">{booking.total_bill}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {bookings.length < 1 && (
            <Typography variant="h6" textAlign="center" sx={{ py: 5 }}>
              No Bookings found
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  ) : (
    <> </>
  );
};

export default Profile;
