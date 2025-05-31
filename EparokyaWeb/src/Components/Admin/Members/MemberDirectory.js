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
  Avatar,
} from "@mui/material";
import axios from "axios";
import SideBar from '../SideBar';
import { useNavigate } from "react-router-dom";

const MemberDirectory = () => {
  const [ministries, setMinistries] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemberStatuses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getMemberStatuses`
        );
        if (response.status === 200) {
          const memberStatuses = response.data;
          const grouped = {};
          memberStatuses.forEach((user) => {
            user.ministries.forEach((ministryRole) => {
              const ministryName = ministryRole.ministry || "Unknown Ministry";
              if (!grouped[ministryName]) {
                grouped[ministryName] = [];
              }
              grouped[ministryName].push({
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: ministryRole.role,
                yearsActive: ministryRole.endYear
                  ? `${ministryRole.startYear} - ${ministryRole.endYear}`
                  : `${ministryRole.startYear} - Ongoing`,
                isActive: user.isActive,
                avatar: user.avatar || "",
                birthDate: user.birthDate || "N/A",
                civilStatus: user.civilStatus || "N/A",
                preference: user.preference || "N/A",
              });
            });
          });

          setMinistries(grouped);
        }
      } catch (error) {
        console.error("Error fetching member statuses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStatuses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return isNaN(dateObj.getTime())
      ? "Invalid Date"
      : dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const filteredMinistries = {};
  Object.keys(ministries).forEach((ministryName) => {
    filteredMinistries[ministryName] = ministries[ministryName].filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <Container maxWidth="lg" style={{ marginLeft: 270, flex: 1 }}>
        <Typography variant="h4" gutterBottom>
          Parish Members
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
          Object.keys(filteredMinistries).map((ministryName) => (
            <Box key={ministryName} mb={4}>
              <Typography variant="h5" gutterBottom>
                {ministryName}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Avatar</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Birth Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Civil Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Preference</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Role</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Years Active</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMinistries[ministryName].map((member) => (
                      <TableRow
                        key={member.userId}
                        hover
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/admin/memberDirectoryEditDetails/${member.userId}`)}
                      >
                        <TableCell>
                          <Avatar
                            src={member.avatar.url || "/default-avatar.png"}
                            alt={member.name}
                            sx={{ width: 50, height: 50, borderRadius: 2 }}
                          />
                        </TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{formatDate(member.birthDate)}</TableCell>
                        <TableCell>{member.civilStatus || "N/A"}</TableCell>
                        <TableCell>{member.preference || "N/A"}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.yearsActive}</TableCell>
                        <TableCell style={{ color: member.isActive ? "green" : "red" }}>
                          {member.isActive ? "Active" : "Inactive"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))
        )}
      </Container>
    </div>
  );
};

export default MemberDirectory;