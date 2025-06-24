import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  InputBase,
  Pagination,
} from "@mui/material";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";

const PrayerRequestIntentionFullList = () => {
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const requestsPerPage = 15;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllPrayerRequestIntention`,
        { withCredentials: true }
      );
      setPrayerRequests(response.data?.reverse() || []); 
    } catch (error) {
      setPrayerRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = prayerRequests.filter((request) => {
    const matchesSearch = request.prayerType
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? request.prayerType === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * requestsPerPage,
    page * requestsPerPage
  );

  const selectedTypeLabel = filterType
    ? prayerRequests.find((req) => req.prayerType === filterType)?.prayerType
    : "";


  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Prayer Intention Full List
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <InputBase
              placeholder="Search by prayer type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                px: 2,
                py: 1,
                border: "1px solid #ccc",
                borderRadius: 1,
                width: 250,
                background: "#fff",
              }}
            />
            <Select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setPage(1); // Reset to first page on filter change
              }}
              displayEmpty
              sx={{ minWidth: 180, background: "#fff" }}
              size="small"
            >
              <MenuItem value="">All Prayer Types</MenuItem>
              {[...new Set(prayerRequests.map((req) => req.prayerType))].map(
                (type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                )
              )}
            </Select>
          </Box>
          {/* Category Title */}
          {filterType && (
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              {selectedTypeLabel}
            </Typography>
          )}
          {loading ? (
            <Typography>Loading prayer intentions...</Typography>
          ) : filteredRequests.length === 0 ? (
            <Typography>No intentions found.</Typography>
          ) : (
            <Paper sx={{ mb: 4, p: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Offeror's Name</strong></TableCell>
                      <TableCell><strong>Prayer Type</strong></TableCell>
                      <TableCell><strong>Description</strong></TableCell>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Time</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Submitted By</strong></TableCell>
                      <TableCell><strong>Created At</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRequests.map((request) => (
                      <TableRow key={request._id} hover>
                        <TableCell>{request.offerrorsName}</TableCell>
                        <TableCell>
                          {request.prayerType === "Others (Iba pa)"
                            ? request.addPrayer
                            : request.prayerType}
                        </TableCell>
                        <TableCell>{request.prayerDescription || "—"}</TableCell>
                        <TableCell>
                          {request.prayerRequestDate
                            ? new Date(request.prayerRequestDate).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {request.prayerRequestTime
                            ? new Date(
                                `1970-01-01T${request.prayerRequestTime}`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <span style={{ color: request.isDone ? "#388e3c" : "#d32f2f" }}>
                            {request.isDone ? "Done" : "Not Done"}
                          </span>
                        </TableCell>
                        <TableCell>{request.userId?.name || "N/A"}</TableCell>
                        <TableCell>
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {filteredRequests.length > requestsPerPage && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Pagination
                    count={Math.ceil(filteredRequests.length / requestsPerPage)}
                    page={page}
                    onChange={(e, val) => setPage(val)}
                  />
                </Box>
              )}
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PrayerRequestIntentionFullList;