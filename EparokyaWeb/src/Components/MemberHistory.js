import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";

const MemberHistory = ({ ministryCategoryId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!ministryCategoryId) return;

    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getUsersByMinistryCategory/${ministryCategoryId}`);
        if (response.status === 200) {
          setMembers(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [ministryCategoryId]);

  const currentYear = new Date().getFullYear();

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Member History
      </Typography>

      <TextField
        label="Search Member"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Role</strong></TableCell>
                <TableCell><strong>Years Active</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => {
                const isActive = member.ministryRoles.some(
                  (role) => !role.endYear || role.endYear >= currentYear
                );

                return (
                  <TableRow key={member._id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.ministryRoles.map((r) => r.role).join(", ")}</TableCell>
                    <TableCell>
                      {member.ministryRoles.map((r) =>
                        r.endYear ? `${r.startYear} - ${r.endYear}` : `${r.startYear} - Ongoing`
                      ).join(", ")}
                    </TableCell>
                    <TableCell style={{ color: isActive ? "green" : "red" }}>
                      {isActive ? "Active" : "Inactive"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MemberHistory;
