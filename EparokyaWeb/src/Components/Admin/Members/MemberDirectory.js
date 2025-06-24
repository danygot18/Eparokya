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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import SideBar from '../SideBar';
import { useNavigate } from "react-router-dom";

const MemberDirectory = () => {
  const [ministries, setMinistries] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

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
                address: user.address || null,
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
          month: "short",
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
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideBar />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: 3, 
        ml: { sm: '240px' },
        width: { lg: 'calc(100% - 240px)' },
        overflowX: 'auto'
      }}>
        <Container maxWidth={false} sx={{ p: 0 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Parish Members
          </Typography>
          <TextField
            label="Search Member"
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3, maxWidth: 500 }}
          />

          {loading ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : (
            Object.keys(filteredMinistries).map((ministryName) => (
              <Box key={ministryName} mb={4}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {ministryName}
                </Typography>
                <TableContainer component={Paper} sx={{ 
                  width: '100%',
                  overflowX: 'auto',
                  '& .MuiTableCell-root': {
                    py: 1,
                    px: 1,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }
                }}>
                  <Table size="small" sx={{ minWidth: 1200 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: 60 }}>Avatar</TableCell>
                        <TableCell sx={{ minWidth: 120 }}>Name</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>Email</TableCell>
                        <TableCell sx={{ width: 100 }}>Birth Date</TableCell>
                        <TableCell sx={{ width: 100 }}>Civil Status</TableCell>
                        <TableCell sx={{ width: 100 }}>Preference</TableCell>
                        <TableCell sx={{ width: 120 }}>Lot/Block/Phase</TableCell>
                        <TableCell sx={{ width: 120 }}>Bldg Name</TableCell>
                        <TableCell sx={{ width: 120 }}>Subdivision</TableCell>
                        <TableCell sx={{ width: 100 }}>Street</TableCell>
                        <TableCell sx={{ width: 100 }}>District</TableCell>
                        <TableCell sx={{ width: 100 }}>Barangay</TableCell>
                        <TableCell sx={{ width: 100 }}>City</TableCell>
                        <TableCell sx={{ width: 100 }}>Role</TableCell>
                        <TableCell sx={{ width: 120 }}>Since</TableCell>
                        <TableCell sx={{ width: 80 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMinistries[ministryName].map((member) => (
                        <TableRow
                          key={member.userId}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() => navigate(`/admin/memberDirectoryEditDetails/${member.userId}`)}
                        >
                          <TableCell>
                            <Avatar
                              src={member.avatar?.url || "/default-avatar.png"}
                              alt={member.name}
                              sx={{ width: 36, height: 36 }}
                            />
                          </TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>{formatDate(member.birthDate)}</TableCell>
                          <TableCell>{member.civilStatus}</TableCell>
                          <TableCell>{member.preference}</TableCell>
                          <TableCell>{member.address?.LotBlockPhaseHouseNo || "N/A"}</TableCell>
                          <TableCell>{member.address?.BldgNameTower || "N/A"}</TableCell>
                          <TableCell>{member.address?.SubdivisionVillageZone || "N/A"}</TableCell>
                          <TableCell>{member.address?.Street || "N/A"}</TableCell>
                          <TableCell>{member.address?.District || "N/A"}</TableCell>
                          <TableCell>
                            {member.address?.barangay === 'Others'
                              ? member.address?.customBarangay
                              : member.address?.barangay || "N/A"}
                          </TableCell>
                          <TableCell>
                            {member.address?.city === 'Others'
                              ? member.address?.customCity
                              : member.address?.city || "N/A"}
                          </TableCell>
                          <TableCell>{member.role}</TableCell>
                          <TableCell>{member.yearsActive}</TableCell>
                          <TableCell sx={{ 
                            color: member.isActive ? "green" : "red",
                            fontWeight: 'bold'
                          }}>
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
      </Box>
    </Box>
  );
};

export default MemberDirectory;