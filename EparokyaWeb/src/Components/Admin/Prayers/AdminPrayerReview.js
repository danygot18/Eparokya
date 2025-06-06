import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import Loader from "../../Layout/Loader";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Delete as DeleteIcon,

} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
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
    const date = new Date(form.createdAt || form.updatedAt || new Date());
    const monthYear = format(date, "MMMM yyyy");
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(form);
  });
  return grouped;
};

const AdminPrayerReview = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const prayersPerPage = 10;
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [filteredForms, setFilteredForms] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();

  const config = { withCredentials: true };

  useEffect(() => {
    const fetchPrayers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getAllPrayers?page=${currentPage}&limit=${prayersPerPage}`,
          config
        );
        setPrayers(response.data.prayers || []);
        setTotalPrayers(response.data.total || 0);
      } catch (error) {
        console.error(
          "Error fetching prayers:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();
  }, [currentPage]);

  useEffect(() => {
    let filtered = prayers;
    if (activeFilter !== "All") {
      filtered = filtered.filter(
        (form) => form.prayerWallStatus === activeFilter
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((form) =>
        form.userId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    setFilteredForms(filtered);
  }, [activeFilter, searchTerm, prayers]);

  const handleApprove = async (prayerId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/confirmPrayer/${prayerId}`,
        {},
        config
      );
      setPrayers((prev) =>
        prev.map((prayer) =>
          prayer._id === prayerId
            ? { ...prayer, prayerWallStatus: "Confirmed" }
            : prayer
        )
      );
      toast.success("Prayer approved successfully");
    } catch (error) {
      console.error(
        "Error approving prayer:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleReject = async (prayerId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/rejectPrayer/${prayerId}`,
        {},
        config
      );
      setPrayers((prev) =>
        prev.map((prayer) =>
          prayer._id === prayerId
            ? { ...prayer, prayerWallStatus: "Cancelled" }
            : prayer
        )
      );
    } catch (error) {
      console.error(
        "Error rejecting prayer:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
            Admin Prayer Review
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: "center" }}>
            {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
              <Button
                key={status}
                variant={activeFilter === status ? "contained" : "outlined"}
                color={
                  status === "Confirmed"
                    ? "success"
                    : status === "Cancelled"
                      ? "error"
                      : status === "Pending"
                        ? "warning"
                        : "primary"
                }
                onClick={() => setActiveFilter(status)}
              >
                {status}
              </Button>
            ))}
          </Stack>
          {loading ? (
            <Loader />
          ) : filteredForms.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No prayers match your criteria.
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={4} sx={{ width: "100%" }}>
              {Object.entries(groupByMonthYear(filteredForms)).map(
                ([monthYear, forms]) => (
                  <Box key={monthYear}>
                    <Divider sx={{ mb: 2 }}>
                      <Chip
                        label={monthYear}
                        color="primary"
                        variant="outlined"
                        sx={{ px: 2, fontSize: "0.875rem" }}
                      />
                    </Divider>
                    <Stack spacing={3}>
                      {forms.map((prayer) => (
                        <StyledCard
                          key={prayer._id}
                          elevation={3}
                          status={prayer.prayerWallStatus}
                        >
                          <Box sx={{ position: "absolute", right: 16, top: 16 }}>
                            <StatusChip
                              label={prayer.prayerWallStatus}
                              size="small"
                              status={prayer.prayerWallStatus}
                            />
                          </Box>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {prayer.title}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {prayer.prayerRequest}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Contact:</strong> {prayer.contact || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Submitted By:</strong>{" "}
                            {prayer.prayerWallSharing === "myName"
                              ? `${prayer.userId?.name}`
                              : `Parishioner`}
                          </Typography>
                          <div style={{
                            width: "75%",
                            display: "flex", // Add display: "flex" here
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <Box sx={{ mt: 2 }}>
                              {prayer.prayerWallStatus === "Pending" && (
                                <Stack direction="row" spacing={2}>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApprove(prayer._id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleReject(prayer._id)}
                                  >
                                    Reject
                                  </Button>
                                </Stack>
                              )}
                            </Box>
                          </div>
                        </StyledCard>
                      ))}
                    </Stack>
                  </Box>
                )
              )}
            </Stack>
          )}
          {totalPrayers > prayersPerPage && (
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
                    Page {currentPage} of {Math.ceil(totalPrayers / prayersPerPage)}
                  </Typography>
                </div>
                <div>
                  <Button
                    variant="outlined"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(totalPrayers / prayersPerPage)))}
                    disabled={currentPage === Math.ceil(totalPrayers / prayersPerPage)}
                    endIcon={<ChevronRightIcon />}
                  >
                    Next
                  </Button>
                </div>
              </Box>
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPrayerReview;