import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Button,
  useTheme,
  Select,
  MenuItem,
  InputBase,
  Card,
  CardContent,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PrayerRequestIntentionHistory from "./PrayerRequestIntentionHistory";

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: "bold",
  backgroundColor: status
    ? theme.palette.success.light
    : theme.palette.error.light,
  color: status
    ? theme.palette.getContrastText(theme.palette.success.light)
    : theme.palette.getContrastText(theme.palette.error.light),
}));

const PrayerRequestIntentionList = () => {
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPages, setCurrentPages] = useState({});
  const [tabFilters, setTabFilters] = useState({});
  const [openHistory, setOpenHistory] = useState(null);
  const requestsPerPage = 10;
  const navigate = useNavigate();
  const theme = useTheme();
  const cardRefs = useRef({});

  const config = { withCredentials: true };

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllPrayerRequestIntention`,
        config
      );
      setPrayerRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByTab = (requests, type) => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const upcoming = new Date();
    upcoming.setDate(today.getDate() + 2);

    if (type === "Today") {
      return requests.filter((req) => new Date(req.prayerRequestDate).toDateString() === today.toDateString());
    } else if (type === "Tomorrow") {
      return requests.filter((req) => new Date(req.prayerRequestDate).toDateString() === tomorrow.toDateString());
    } else {
      return requests.filter((req) => new Date(req.prayerRequestDate) > tomorrow);
    }
  };

  const handleDownloadPDF = async (type) => {
    const input = cardRefs.current[type];
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${type}_prayer_requests.pdf`);
  };

  const filteredRequests = prayerRequests.filter((request) => {
    const matchesSearch = request.prayerType
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? request.prayerType === filterType : true;
    return matchesSearch && matchesFilter;
  });

  const groupedByPrayerType = filteredRequests.reduce((acc, item) => {
    if (!acc[item.prayerType]) acc[item.prayerType] = [];
    acc[item.prayerType].push(item);
    return acc;
  }, {});

  const tabOptions = ["Today", "Tomorrow", "Upcoming"];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <SideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: theme.palette.grey[50] }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Prayer Intention List
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
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
              onChange={(e) => setFilterType(e.target.value)}
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
          </Stack>

          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={() => navigate("/admin/prayerRequestIntentionFullList")}
          >
            View Full List
          </Button>

          {loading ? (
            <Typography>Loading prayer intentions...</Typography>
          ) : Object.keys(groupedByPrayerType).length === 0 ? (
            <Typography>No intentions found.</Typography>
          ) : (
            Object.entries(groupedByPrayerType).map(([type, allRequests]) => {
              const tab = tabFilters[type] || "Today";
              const currentPage = currentPages[type] || 1;
              const requests = filterByTab(allRequests, tab);
              return (
                <Card key={type} sx={{ mb: 4, p: 2 }} ref={(el) => (cardRefs.current[type] = el)}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>{type}</Typography>

                    <Tabs
                      value={tab}
                      onChange={(e, newValue) => setTabFilters({ ...tabFilters, [type]: newValue })}
                      indicatorColor="primary"
                      textColor="primary"
                      sx={{ mb: 2 }}
                    >
                      {tabOptions.map((label) => (
                        <Tab key={label} label={label} value={label} />
                      ))}
                    </Tabs>

                    <TableContainer component={Paper}>
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
                          {requests
                            .slice(
                              (currentPage - 1) * requestsPerPage,
                              currentPage * requestsPerPage
                            )
                            .map((request) => (
                              <TableRow
                                key={request._id}
                                hover
                                onClick={() =>
                                  navigate(`/admin/prayerIntention/details/${request._id}`)
                                }
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell>{request.offerrorsName}</TableCell>
                                <TableCell>{request.prayerType === "Others (Iba pa)" ? request.addPrayer : request.prayerType}</TableCell>
                                <TableCell>{request.prayerDescription || "—"}</TableCell>
                                <TableCell>{new Date(request.prayerRequestDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(`1970-01-01T${request.prayerRequestTime}`).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                                <TableCell>
                                  <span style={{ color: request.isDone ? theme.palette.success.main : theme.palette.error.main }}>
                                    {request.isDone ? "Done" : "Not Done"}
                                  </span>
                                </TableCell>
                                <TableCell>{request.userId?.name || "N/A"}</TableCell>
                                <TableCell>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {requests.length > requestsPerPage && (
                      <Box mt={2} display="flex" justifyContent="center">
                        <Pagination
                          count={Math.ceil(requests.length / requestsPerPage)}
                          page={currentPage}
                          onChange={(e, val) =>
                            setCurrentPages({ ...currentPages, [type]: val })
                          }
                        />
                      </Box>
                    )}

                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button variant="outlined" color="primary" onClick={() => handleDownloadPDF(type)}>
                        Download PDF
                      </Button>
                      <Button variant="outlined" color="secondary" onClick={() => setOpenHistory(type)}>
                        View History
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Box>
      {openHistory && (
        <PrayerRequestIntentionHistory
          open={!!openHistory}
          onClose={() => setOpenHistory(null)}
          prayerType={openHistory}
        />
      )}
    </Box>
  );
};

export default PrayerRequestIntentionList;
