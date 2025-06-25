import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Box,
  Container,
} from "@mui/material";
import SideBar from "../SideBar";
import Loader from "../../Layout/Loader";

const UserFormCounts = () => {
  const [userForms, setUserForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/formCounts/user`,
          {
            withCredentials: true,
          }
        );
        const sortedData = response.data
          .map((user) => ({
            ...user,
            totalSubmissions:
              user.wedding +
              user.baptism +
              user.counseling +
              user.houseBlessing,
          }))
          .sort((a, b) => b.totalSubmissions - a.totalSubmissions);
        setUserForms(sortedData);
      } catch (error) {
        console.error("Error fetching user form counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = userForms.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box sx={{ width: "250px", flexShrink: 0 }}>
        <SideBar />
      </Box>

      {/* Main Content */}
      <Container sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h5" gutterBottom>
          User Form Submissions
        </Typography>

        <TextField
          label="Search by Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <Loader />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>User</b></TableCell>
                  <TableCell><b>Email</b></TableCell>
                  <TableCell><b>Wedding</b></TableCell>
                  <TableCell><b>Baptism</b></TableCell>
                  <TableCell><b>Counseling</b></TableCell>
                  <TableCell><b>House Blessing</b></TableCell>
                  <TableCell><b>Total Submissions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.wedding}</TableCell>
                    <TableCell>{user.baptism}</TableCell>
                    <TableCell>{user.counseling}</TableCell>
                    <TableCell>{user.houseBlessing}</TableCell>
                    <TableCell>{user.totalSubmissions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default UserFormCounts;
