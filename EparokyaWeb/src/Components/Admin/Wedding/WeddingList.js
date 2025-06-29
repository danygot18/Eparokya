import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import Loader from "../../Layout/Loader";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Paper,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import Pagination from "@mui/material/Pagination";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

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
    const date = new Date(form.createdAt || form.weddingDate || new Date());
    const monthYear = format(date, "MMMM yyyy");
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(form);
  });
  return grouped;
};

const formatWeddingTime = (rawTime) => {
  if (!rawTime) return "N/A";

  try {
    let date;
    if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
      const today = new Date();
      const [hours, minutes] = rawTime.split(':');
      date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), +hours, +minutes);
    } else {
      date = new Date(rawTime);
    }

    if (isNaN(date.getTime())) {
      console.warn("Invalid weddingTime:", rawTime);
      return "N/A";
    }

    return format(date, 'h:mm a'); // e.g. "1:08 AM"
  } catch (e) {
    console.error("Error parsing weddingTime:", rawTime, e);
    return "N/A";
  }
};

const WeddingList = () => {
  const [weddingForms, setWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchWeddingForms();
  }, []);

  const fetchWeddingForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllWeddings`,
        { withCredentials: true }
      );
      if (response.data && Array.isArray(response.data)) {
        setWeddingForms(response.data);
      } else {
        setWeddingForms([]);
      }
    } catch (error) {
      console.error("Error fetching wedding forms:", error);
      toast.error("Unable to fetch wedding forms.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort
  const filteredForms = weddingForms.filter((wedding) => {
    return (
      (filteredStatus === "All" || wedding.weddingStatus === filteredStatus) &&
      (searchTerm === "" ||
        wedding.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wedding.groomName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Sort from latest to oldest
  const sortedForms = [...filteredForms].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.weddingDate || 0);
    const dateB = new Date(b.createdAt || b.weddingDate || 0);
    return dateB - dateA;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;
  const totalPages = Math.ceil(sortedForms.length / cardsPerPage);
  const paginatedForms = sortedForms.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const groupedPaginated = groupByMonthYear(paginatedForms);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const renderCardsView = () => (
    <Stack spacing={4} sx={{ width: "100%" }}>
      {Object.entries(groupedPaginated).map(([monthYear, forms]) => (
        <Box key={monthYear}>
          <Divider sx={{ mb: 2 }}>
            <Chip
              label={monthYear}
              color="primary"
              variant="outlined"
              sx={{ px: 2, fontSize: "0.875rem" }}
            />
          </Divider>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              width: "100%",
            }}
          >
            {forms.map((item, index) => (
              <Box
                key={item._id}
                sx={{
                  flex: "1 1 calc(50% - 16px)",
                  minWidth: 0,
                  maxWidth: "calc(50% - 16px)",
                  boxSizing: "border-box",
                }}
              >
                <StyledCard
                  elevation={3}
                  status={item.weddingStatus}
                  onClick={() => navigate(`/admin/weddingDetails/${item._id}`)}
                  sx={{ cursor: "pointer", height: "100%" }}
                >
                  <Box sx={{ position: "absolute", right: 16, top: 16 }}>
                    <StatusChip
                      label={item.weddingStatus ?? "Unknown"}
                      size="small"
                      status={item.weddingStatus}
                    />
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Wedding #{index + 1 + (currentPage - 1) * cardsPerPage}: {item.brideName ?? "Unknown Bride"} & {item.groomName ?? "Unknown Groom"}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Wedding Date:</strong>{" "}
                    {item.weddingDate
                      ? new Date(item.weddingDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Wedding Time:</strong> {formatWeddingTime(item?.weddingTime)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Bride Contact:</strong> {item.bridePhone ?? "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Groom Contact:</strong> {item.groomPhone ?? "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Priest:</strong> {item.priest?.fullName || "after confirmation"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Submitted By:</strong> {item.userId?.name || "Unknown"}
                  </Typography>
                </StyledCard>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Stack>
  );

  const renderTableView = () => (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Couple</strong></TableCell>
              <TableCell><strong>Wedding Date</strong></TableCell>
              <TableCell><strong>Wedding Time</strong></TableCell>
              <TableCell><strong>Bride Contact</strong></TableCell>
              <TableCell><strong>Groom Contact</strong></TableCell>
              <TableCell><strong>Priest</strong></TableCell>
              <TableCell><strong>Submitted By</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedForms.map((item, index) => (
              <TableRow
                key={item._id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/weddingDetails/${item._id}`)}
              >
                <TableCell>{index + 1 + (currentPage - 1) * cardsPerPage}</TableCell>
                <TableCell>
                  {item.brideName ?? "Unknown Bride"} & {item.groomName ?? "Unknown Groom"}
                </TableCell>
                <TableCell>
                  {item.weddingDate ? new Date(item.weddingDate).toLocaleDateString() : "N/A"}
                </TableCell>
                <TableCell>{formatWeddingTime(item?.weddingTime)}</TableCell>
                <TableCell>{item.bridePhone ?? "N/A"}</TableCell>
                <TableCell>{item.groomPhone ?? "N/A"}</TableCell>
                <TableCell>{item.priest?.fullName ?? "After Confirmation"}</TableCell>
                <TableCell>{item.userId?.name || "Unknown"}</TableCell>
                <TableCell>
                  <StatusChip
                    label={item.weddingStatus ?? "Unknown"}
                    size="small"
                    status={item.weddingStatus}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
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
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Wedding Records
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {["All", "Confirmed", "Pending", "Cancelled", "Rescheduled"].map((status) => (
                <Button
                  key={status}
                  variant={filteredStatus === status ? "contained" : "outlined"}
                  color={
                    status === "Confirmed"
                      ? "success"
                      : status === "Cancelled"
                        ? "error"
                        : status === "Pending"
                          ? "warning"
                          : status === "Rescheduled"
                            ? "info"
                            : "primary"
                  }
                  onClick={() => setFilteredStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </Stack>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newMode) => newMode && setViewMode(newMode)}
              aria-label="view mode"
            >
              <ToggleButton value="cards" aria-label="card view">
                Card View
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                Table View
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ width: "100%", mb: 2 }}>
            <TextField
              label="Search by Bride or Groom Name"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          {loading ? (
            <Loader />
          ) : paginatedForms.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No wedding records found.
              </Typography>
            </Paper>
          ) : (
            <>
              {viewMode === "cards" ? renderCardsView() : renderTableView()}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ position: "relative", width: "50%", height: "100%", alignItems: "center", margin: "auto" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    <div>
                      <Button
                        variant="outlined"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        startIcon={<ChevronLeftIcon />}
                      >
                        Previous
                      </Button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography variant="body1" color="text.secondary">
                        Page {currentPage} of {totalPages}
                      </Typography>
                    </div>
                    <div>
                      <Button
                        variant="outlined"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        endIcon={<ChevronRightIcon />}
                      >
                        Next
                      </Button>
                    </div>
                  </Box>
                </div>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default WeddingList;