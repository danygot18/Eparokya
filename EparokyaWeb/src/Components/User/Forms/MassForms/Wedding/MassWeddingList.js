import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import { format, parseISO } from "date-fns";
import { styled } from "@mui/material/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import Loader from "../../../../Layout/Loader";

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
  borderLeft: `6px solid ${
    status === "Confirmed"
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
      form.createdAt || form.weddingDateTime?.date || new Date()
    );
    const monthYear = format(date, "MMMM yyyy");
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(form);
  });
  return grouped;
};

const MassWeddingList = () => {
  const [massWeddingForms, setMassWeddingForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMassWeddingForms();
  }, []);

  const fetchMassWeddingForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/massWedding/getAllUserSubmittedWedding`,
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data.forms)) {
        const sortedForms = response.data.forms.sort(
          (a, b) =>
            new Date(b.createdAt || b.weddingDateTime?.date || 0) -
            new Date(a.createdAt || a.weddingDateTime?.date || 0)
        );
        setMassWeddingForms(sortedForms);
      } else {
        setMassWeddingForms([]);
      }
    } catch (error) {
      console.error("Error fetching mass wedding forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = massWeddingForms.filter((wedding) => {
    return (
      (filteredStatus === "All" || wedding.weddingStatus === filteredStatus) &&
      (searchTerm === "" ||
        wedding.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wedding.groomName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const sortedForms = [...filteredForms].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.weddingDateTime?.date || 0);
    const dateB = new Date(b.createdAt || b.weddingDateTime?.date || 0);
    return dateB - dateA;
  });

  const cardsPerPage = 10;
  const totalPages = Math.ceil(sortedForms.length / cardsPerPage);
  const paginatedForms = sortedForms.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return format(date, "hh:mm a");
  };

  const groupedPaginated = groupByMonthYear(paginatedForms);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        p: 3,
        backgroundColor: "#f9f9f9",
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
         Submitted Mass Wedding Application
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 2, justifyContent: "center" }}
        >
          {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (
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
                  : "primary"
              }
              onClick={() => setFilteredStatus(status)}
            >
              {status}
            </Button>
          ))}
        </Stack>
        <Box sx={{ width: "100%", mb: 2 }}>
          <input
            type="text"
            placeholder="Search by Bride or Groom Name"
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
        ) : paginatedForms.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              No mass wedding records found.
            </Typography>
          </Paper>
        ) : (
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
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(
                          `/user/MassSubmittedWeddingDetails/${item._id}`
                        )
                      }
                    >
                      <StyledCard
                        elevation={3}
                        status={item.weddingStatus}
                        sx={{ height: "100%" }}
                      >
                        <Box sx={{ position: "absolute", right: 16, top: 16 }}>
                          <StatusChip
                            label={item.weddingStatus ?? "Unknown"}
                            size="small"
                            status={item.weddingStatus}
                          />
                        </Box>
                        <Typography variant="h6" component="h2" gutterBottom>
                          Mass Wedding #
                          {index + 1 + (currentPage - 1) * cardsPerPage}:{" "}
                          {item.brideName ?? "Unknown Bride"} &{" "}
                          {item.groomName ?? "Unknown Groom"}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          <strong>Wedding Date and Time:</strong>{" "}
                          {item.weddingDateTime?.date
                            ? `${format(
                                new Date(item.weddingDateTime.date),
                                "MMMM dd, yyyy"
                              )} at ${
                                item.weddingDateTime.time
                                  ? formatTime(item.weddingDateTime.time)
                                  : "N/A"
                              }`
                            : "N/A"}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Bride Contact:</strong>{" "}
                          {item.bridePhone || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Groom Contact:</strong>{" "}
                          {item.groomPhone || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Status:</strong> {item.weddingStatus || "N/A"}
                        </Typography>
                        {item.cancellingReason?.reason && (
                          <Typography variant="body2" color="error">
                            <strong>Cancellation Reason:</strong>{" "}
                            {item.cancellingReason.reason}
                          </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary">
                          <strong>Submitted At:</strong>{" "}
                          {item.createdAt
                            ? format(new Date(item.createdAt), "MMMM dd, yyyy")
                            : "N/A"}
                        </Typography>
                      </StyledCard>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
            {totalPages > 1 && (
              <div
                style={{
                  position: "relative",
                  width: "50%",
                  height: "100%",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      startIcon={<ChevronLeftIcon />}
                    >
                      Previous
                    </Button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body1" color="text.secondary">
                      Page {currentPage} of {totalPages}
                    </Typography>
                  </div>
                  <div>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      endIcon={<ChevronRightIcon />}
                    >
                      Next
                    </Button>
                  </div>
                </Box>
              </div>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MassWeddingList;
