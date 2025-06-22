import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Divider,
  Paper,
  Alert,
  Button,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { format, parse } from "date-fns";
import { styled } from "@mui/material/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import Loader from "../../Layout/Loader";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PrayerRequestHistory from './PrayerRequestHistory';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: "bold",
  backgroundColor:
    status === "Confirmed"
      ? theme.palette.success.light
      : status === "Cancelled"
        ? theme.palette.error.light
        : theme.palette.warning.light,
  color: theme.palette.getContrastText(
    status === "Confirmed"
      ? theme.palette.success.light
      : status === "Cancelled"
        ? theme.palette.error.light
        : theme.palette.warning.light
  ),
}));

const StyledCard = styled(Paper)(({ theme, status }) => ({
  position: "relative",
  borderLeft: `6px solid ${status === "Confirmed"
    ? theme.palette.success.main
    : status === "Cancelled"
      ? theme.palette.error.main
      : theme.palette.warning.main
    }`,
  padding: theme.spacing(2),
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[6],
  },
}));

const groupByMonthYear = (forms) => {
  const grouped = {};
  forms.forEach((form) => {
    const date = new Date(
      form.createdAt || form.prayerRequestDate || new Date()
    );
    const monthYear = format(date, "MMMM yyyy");
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(form);
  });
  return grouped;
};

const PrayerRequestList = () => {
  const [prayerRequestForms, setPrayerRequestForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const [todayPage, setTodayPage] = useState(1);
  const [tomorrowPage, setTomorrowPage] = useState(1);
  const [otherPage, setOtherPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState("Accepted");
  const [historyPage, setHistoryPage] = useState(1);

  const perPage = 10;
  const cardRefs = useRef({});

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [updateTimeDialogOpen, setUpdateTimeDialogOpen] = useState(false);
  const [selectedPrayerId, setSelectedPrayerId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedPrayerTime, setSelectedPrayerTime] = useState("");
  const [historyPrayerType, setHistoryPrayerType] = useState(null);


  const config = { withCredentials: true };

  const fetchPrayerRequestForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/getAllPrayerRequest`,
        config
      );
      const forms = response.data.prayerRequests || [];

      const sortedForms = forms.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPrayerRequestForms(sortedForms);
    } catch (err) {
      console.error("Error fetching prayer request forms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerRequestForms();
  }, []);

  const filtered = prayerRequestForms.filter(p =>
    (filteredStatus === "All" || p.prayerStatus === filteredStatus) &&
    (searchTerm === "" || p.offerrorsName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const categorized = {};
  filtered.forEach(form => {
    const type = form.prayerType || "Other";

    if (!categorized[type]) categorized[type] = { today: [], tomorrow: [], upcoming: [] };

    const date = new Date(form.prayerRequestDate);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const dateStr = date.toISOString().split("T")[0];

    if (dateStr === todayStr) {
      categorized[type].today.push(form);
    } else if (dateStr === tomorrowStr) {
      categorized[type].tomorrow.push(form);
    } else if (date >= dayAfterTomorrow) {
      categorized[type].upcoming.push(form);
    }
  }
  );

  const getPage = (type, day) => pagination[type]?.[day] || 1;
  const setPage = (type, day, value) =>
    setPagination(prev => ({ ...prev, [type]: { ...prev[type], [day]: value } }));

  const handleDownloadPDF = async (type) => {
    const input = cardRefs.current[type]; // <-- use .current
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

  const handleAccept = (id) => {
    setSelectedPrayerId(id);
    setAcceptDialogOpen(true);
  };
  const handleConfirmAccept = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/acceptPrayerRequest/${selectedPrayerId}`,
        {}, // Optional body
        config
      );
      toast.success("Accepted.");
      fetchPrayerRequestForms();
    } catch {
      toast.error("Failed to accept.");
    } finally {
      setAcceptDialogOpen(false);
    }
  };

  const handleCancel = (id) => {
    setSelectedPrayerId(id);
    setCancelReason("");
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) return toast.error("Reason required.");
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/v1/cancelPrayerRequest/${selectedPrayerId}`, config);
      toast.success("Cancelled.");
      fetchPrayerRequestForms();
    } catch {
      toast.error("Failed to cancel.");
    } finally {
      setCancelDialogOpen(false);
    }
  };

  const handleOpenUpdateTime = (id, originalTime) => {
    setSelectedPrayerId(id);
    setSelectedPrayerTime(originalTime);
    setNewTime("");
    setUpdateTimeDialogOpen(true);
  };

  const handleConfirmUpdateTime = async () => {
    if (!newTime) return toast.error("Select a time.");
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/updatePrayerRequestTime/${selectedPrayerId}`,
        { newTime },
        config
      );

      toast.success("Time updated.");
      fetchPrayerRequestForms();
    } catch {
      toast.error("Update failed.");
    } finally {
      setUpdateTimeDialogOpen(false);
    }
  };

  const prioritizedOrder = [
    "Eternal Repose(Patay)",
    "Thanks Giving(Pasasalamat)",
    "Special Intentions(Natatanging Kahilingan)"
  ];

  const sortedEntries = Object.entries(categorized).sort(
    ([a], [b]) =>
      prioritizedOrder.indexOf(a) - prioritizedOrder.indexOf(b)
  );


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
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Prayer Request Records
          </Typography>
          <Box sx={{ width: "100%", mb: 2 }}>
            <input
              type="text"
              placeholder="Search by Full Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "10px",
                marginBottom: "20px",
                width: "100%",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </Box>
          {loading ? (
            <Loader />
          ) : (
            <Box sx={{ width: "100%" }}>
              {Object.keys(categorized).length === 0 && (
                <Typography align="center" color="text.secondary">
                  No prayer requests found.
                </Typography>
              )}
              {sortedEntries.map(([type, group]) => (
                <Paper
                  key={type}
                  sx={{
                    mb: 4,
                    p: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    position: "relative"
                  }}
                  ref={el => (cardRefs.current[type] = el)}
                >
                  <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                    {type}
                  </Typography>
                  {/* TODAY */}
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Today
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Prayer Type</strong></TableCell>
                          <TableCell><strong>Offeror's Name</strong></TableCell>
                          <TableCell><strong>Prayer Request Date</strong></TableCell>
                          <TableCell><strong>Prayer Time</strong></TableCell>
                          <TableCell><strong>Intentions</strong></TableCell>
                          <TableCell><strong>Submitted By</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>

                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {group.today.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No prayer requests for today.
                            </TableCell>
                          </TableRow>
                        ) : (
                          group.today
                            .slice(
                              (getPage(type, "today") - 1) * perPage,
                              getPage(type, "today") * perPage
                            )
                            .map((item) => (
                              <React.Fragment key={item._id}>
                                <TableRow
                                  hover
                                  sx={{
                                    cursor: "pointer",
                                    backgroundColor: item.prayerStatus === "Accepted" ? "#e0f7e9" : "inherit"
                                  }}
                                  onClick={() => navigate(`/admin/prayerRequestDetails/${item._id}`)}
                                >

                                  <TableCell>{item.prayerType}</TableCell>
                                  <TableCell>{item.offerrorsName || "N/A"}</TableCell>
                                  <TableCell>{item.prayerRequestDate ? format(new Date(item.prayerRequestDate), "MMMM dd, yyyy") : "N/A"}</TableCell>
                                  <TableCell>
                                    Original: {item.prayerRequestTime ? format(parse(item.prayerRequestTime, "HH:mm", new Date()), "h:mm a") : "N/A"}<br />
                                    Updated: {item.UpdateTime ? format(parse(item.UpdateTime, "HH:mm", new Date()), "h:mm a") : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {Array.isArray(item.Intentions) && item.Intentions.length > 0
                                      ? item.Intentions.map((intention, i) => (
                                        <span key={intention._id || i}>
                                          {intention.name || "Unnamed"}
                                          {i !== item.Intentions.length - 1 ? ", " : ""}
                                        </span>
                                      ))
                                      : "N/A"}
                                  </TableCell>
                                  <TableCell>{item.userId?.name || "Unknown"}</TableCell>
                                  <Box display="flex" gap={1} flexWrap="wrap">
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="success"
                                      disabled={item.prayerStatus === "Cancelled" || item.prayerStatus === "Accepted"}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAccept(item._id);
                                      }}
                                    >
                                      Accept
                                    </Button>

                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="warning"
                                      disabled={item.prayerStatus === "Cancelled"}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenUpdateTime(item._id, item.prayerRequestTime);
                                      }}
                                    >
                                      Update Time
                                    </Button>

                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancel(item._id);
                                      }}
                                      disabled={item.prayerStatus === "Cancelled"}
                                    >
                                      Cancel
                                    </Button>
                                  </Box>

                                </TableRow>
                              </React.Fragment>
                            ))
                        )}
                      </TableBody>

                    </Table>
                  </TableContainer>
                  {/* Pagination for Today */}
                  {group.today.length > perPage && (
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setPage(type, "today", Math.max(getPage(type, "today") - 1, 1))
                        }
                        disabled={getPage(type, "today") === 1}
                        sx={{ mr: 1 }}
                      >
                        Previous
                      </Button>
                      <Typography variant="body1" color="text.secondary" sx={{ mx: 2 }}>
                        Page {getPage(type, "today")} of {Math.ceil(group.today.length / perPage)}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setPage(
                            type,
                            "today",
                            Math.min(
                              getPage(type, "today") + 1,
                              Math.ceil(group.today.length / perPage)
                            )
                          )
                        }
                        disabled={
                          getPage(type, "today") === Math.ceil(group.today.length / perPage)
                        }
                      >
                        Next
                      </Button>
                    </Box>
                  )}
                  {/* TOMORROW */}
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Tomorrow
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Prayer Type</strong></TableCell>
                          <TableCell><strong>Offeror's Name</strong></TableCell>
                          <TableCell><strong>Prayer Request Date</strong></TableCell>
                          <TableCell><strong>Prayer Request Time</strong></TableCell>
                          <TableCell><strong>Intentions</strong></TableCell>
                          <TableCell><strong>Submitted By</strong></TableCell>
                          <TableCell><strong>Actions</strong></TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.tomorrow.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No prayer requests for tomorrow.
                            </TableCell>
                          </TableRow>
                        ) : (
                          group.tomorrow
                            .slice(
                              (getPage(type, "tomorrow") - 1) * perPage,
                              getPage(type, "tomorrow") * perPage
                            )
                            .map((item) => (
                              <TableRow
                                key={item._id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate(`/admin/prayerRequestDetails/${item._id}`)
                                }
                              >
                                <TableCell>{item.prayerType}</TableCell>
                                <TableCell>{item.offerrorsName || "N/A"}</TableCell>
                                <TableCell>
                                  {item.prayerRequestDate
                                    ? format(
                                      new Date(item.prayerRequestDate),
                                      "MMMM dd, yyyy"
                                    )
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {Array.isArray(item.Intentions) &&
                                    item.Intentions.length > 0
                                    ? item.Intentions.map((intention, i) => (
                                      <span key={intention._id || i}>
                                        {intention.name || "Unnamed"}
                                        {i !== item.Intentions.length - 1
                                          ? ", "
                                          : ""}
                                      </span>
                                    ))
                                    : "N/A"}
                                </TableCell>
                                <TableCell>{item.userId?.name || "Unknown"}</TableCell>
                                <TableCell>
                                  <Box display="flex" gap={1} flexWrap="wrap">
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="success"
                                      disabled={item.prayerStatus === "Cancelled" || item.prayerStatus === "Accepted"}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAccept(item._id);
                                      }}
                                    >
                                      Accept
                                    </Button>

                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="warning"
                                      disabled={item.prayerStatus === "Cancelled"}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenUpdateTime(item._id, item.prayerRequestTime);
                                      }}
                                    >
                                      Update Time
                                    </Button>

                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancel(item._id);
                                      }}
                                      disabled={item.prayerStatus === "Cancelled"}
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                </TableCell>

                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* Pagination for Tomorrow */}
                  {group.tomorrow.length > perPage && (
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setPage(
                            type,
                            "tomorrow",
                            Math.max(getPage(type, "tomorrow") - 1, 1)
                          )
                        }
                        disabled={getPage(type, "tomorrow") === 1}
                        sx={{ mr: 1 }}
                      >
                        Previous
                      </Button>
                      <Typography variant="body1" color="text.secondary" sx={{ mx: 2 }}>
                        Page {getPage(type, "tomorrow")} of {Math.ceil(group.tomorrow.length / perPage)}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setPage(
                            type,
                            "tomorrow",
                            Math.min(
                              getPage(type, "tomorrow") + 1,
                              Math.ceil(group.tomorrow.length / perPage)
                            )
                          )
                        }
                        disabled={
                          getPage(type, "tomorrow") === Math.ceil(group.tomorrow.length / perPage)
                        }
                      >
                        Next
                      </Button>
                    </Box>
                  )}

                  {/* UPCOMING */}
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Upcoming
                  </Typography>
                  <TableContainer component={Paper} sx={{ mb: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Prayer Type</strong></TableCell>
                          <TableCell><strong>Offeror's Name</strong></TableCell>
                          <TableCell><strong>Prayer Request Date</strong></TableCell>
                          <TableCell><strong>Prayer Request Time</strong></TableCell>
                          <TableCell><strong>Intentions</strong></TableCell>
                          <TableCell><strong>Submitted By</strong></TableCell>
                           <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.upcoming.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No upcoming prayer requests.
                            </TableCell>
                          </TableRow>
                        ) : (
                          group.upcoming
                            .slice(
                              (getPage(type, "upcoming") - 1) * perPage,
                              getPage(type, "upcoming") * perPage
                            )
                            .map((item) => (
                              <TableRow
                                key={item._id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate(`/admin/prayerRequestDetails/${item._id}`)
                                }
                              >
                                <TableCell>{item.prayerType}</TableCell>
                                <TableCell>{item.offerrorsName || "N/A"}</TableCell>
                                <TableCell>
                                  {item.prayerRequestDate
                                    ? format(new Date(item.prayerRequestDate), "MMMM dd, yyyy")
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {item.prayerRequestTime || "N/A"}
                                </TableCell>
                                <TableCell>
                                  {Array.isArray(item.Intentions) && item.Intentions.length > 0
                                    ? item.Intentions.map((intention, i) => (
                                      <span key={intention._id || i}>
                                        {intention.name || "Unnamed"}
                                        {i !== item.Intentions.length - 1 ? ", " : ""}
                                      </span>
                                    ))
                                    : "N/A"}
                                </TableCell>
                                <TableCell>{item.userId?.name || "Unknown"}</TableCell>
                                <TableCell>
                                  <Box display="flex" gap={1} flexWrap="wrap">
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="success"
                                      disabled={item.prayerStatus === "Cancelled" || item.prayerStatus === "Accepted"}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAccept(item._id);
                                      }}
                                    >
                                      Accept
                                    </Button>

                                    <Button
                                      size="small"
                                      variant="outlined"
                                      color="warning"
                                      disabled={item.prayerStatus === "Cancelled"}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenUpdateTime(item._id, item.prayerRequestTime);
                                      }}
                                    >
                                      Update Time
                                    </Button>

                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="error"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancel(item._id);
                                      }}
                                      disabled={item.prayerStatus === "Cancelled"}
                                    >
                                      Cancel
                                    </Button>
                                  </Box>
                                </TableCell>

                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination for Upcoming */}
                  {group.upcoming.length > perPage && (
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setPage(
                            type,
                            "upcoming",
                            Math.max(getPage(type, "upcoming") - 1, 1)
                          )
                        }
                        disabled={getPage(type, "upcoming") === 1}
                        sx={{ mr: 1 }}
                      >
                        Previous
                      </Button>
                      <Typography variant="body1" color="text.secondary" sx={{ mx: 2 }}>
                        Page {getPage(type, "upcoming")} of {Math.ceil(group.upcoming.length / perPage)}
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setPage(
                            type,
                            "upcoming",
                            Math.min(
                              getPage(type, "upcoming") + 1,
                              Math.ceil(group.upcoming.length / perPage)
                            )
                          )
                        }
                        disabled={
                          getPage(type, "upcoming") === Math.ceil(group.upcoming.length / perPage)
                        }
                      >
                        Next
                      </Button>
                    </Box>
                  )}

                  {/* Download PDF Button */}
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDownloadPDF(type)}
                    >
                      Download PDF
                    </Button>
                  </Box>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      setHistoryPrayerType(type);
                      setHistoryOpen(true);
                    }}
                  >
                    History
                  </Button>

                </Paper>
              ))}
              <>

                {/* Accept Dialog */}
                <Dialog open={acceptDialogOpen} onClose={() => setAcceptDialogOpen(false)}>
                  <DialogTitle>Confirm Accept</DialogTitle>
                  <DialogContent>
                    <Typography>Are you sure you want to accept?</Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setAcceptDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="success" onClick={handleConfirmAccept}>
                      Accept
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Cancel Dialog */}
                <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                  <DialogTitle>Cancel Request</DialogTitle>
                  <DialogContent>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Reason for cancellation"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>Close</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmCancel}>
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Update Time Dialog */}
                <Dialog
                  open={updateTimeDialogOpen}
                  onClose={() => setUpdateTimeDialogOpen(false)}
                  fullWidth
                  maxWidth="sm" // You can also try "md"
                >
                  <DialogTitle>Update Time</DialogTitle>
                  <DialogContent>
                    <Typography sx={{ mb: 1 }}>
                      <strong>Original Time:</strong>{" "}
                      {selectedPrayerTime
                        ? format(parse(selectedPrayerTime, "HH:mm", new Date()), "h:mm a")
                        : "N/A"}
                    </Typography>
                    <TextField
                      label="New Time"
                      type="time"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setUpdateTimeDialogOpen(false)}>Close</Button>
                    <Button variant="contained" color="warning" onClick={handleConfirmUpdateTime}>
                      Update
                    </Button>
                  </DialogActions>
                </Dialog>

              </>
            </Box>
          )}
        </Box>
        <PrayerRequestHistory
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          tab={historyTab}
          page={historyPage}
          setTab={setHistoryTab}
          setPage={setHistoryPage}
          prayerType={historyPrayerType}
        />
      </Box>
    </Box>
  );
};

export default PrayerRequestList;
