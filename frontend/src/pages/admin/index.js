import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { dateFormat } from "../../utils";

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "https://pm6a6afsb3uscgn4mmqjoxytyq0dhpqm.lambda-url.us-east-1.on.aws/"
        );
        console.log({ res });
        setUsers(res.data);
        // setUsers(res.data);
      } catch (error) {
        console.log({ error });
      }
    };

    getData();
  }, []);

  return (
    <Box sx={{ m: 3 }}>
      <Typography variant="h5">User Report</Typography>
      <Paper>
        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="Bookings Table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  User Id
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  First Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Last Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Login Time
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Login Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) =>
                user.email !== "admin@dal.ca" ? (
                  <TableRow
                    key={index + ""}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{user.user_id}</TableCell>
                    <TableCell align="center">{user.firstname}</TableCell>
                    <TableCell align="center">{user.lastname}</TableCell>
                    <TableCell align="center">{user.email}</TableCell>
                    <TableCell align="center">
                      {dateFormat(user.timestamp, "DD-MM-YYYY:HH:mm a")}
                    </TableCell>
                    <TableCell align="center">
                      {user.login ? "Login" : "Logged Out"}
                    </TableCell>
                  </TableRow>
                ) : null
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {users.length < 1 && (
          <Typography variant="h6" textAlign="center" sx={{ py: 5 }}>
            No Report found
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Admin;
