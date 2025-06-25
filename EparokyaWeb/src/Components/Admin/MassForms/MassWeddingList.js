import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { styled } from "@mui/material/styles";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import Loader from "../../Layout/Loader";

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
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchMassWeddingForms();
  }, []);

  const fetchMassWeddingForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/massWedding/getAllMassWeddings`,
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedForms = response.data.sort(
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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedForms.length / itemsPerPage);
  const paginatedForms = sortedForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const groupedPaginated = groupByMonthYear(paginatedForms);

  // --- Card View ---
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
                  onClick={() =>
                    navigate(`/admin/massWeddingDetails/${item._id}`)
                  }
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
                    Mass Wedding #
                    {index + 1 + (currentPage - 1) * itemsPerPage}:{" "}
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
                        )} at ${item.weddingDateTime?.time || "N/A"}`
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Bride Contact:</strong> {item.bridePhone || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Groom Contact:</strong> {item.groomPhone || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Submitted By:</strong>{" "}
                    {item.userId?.name || "Unknown"}
                  </Typography>
                </StyledCard>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Stack>
  );

  // --- Table View ---
  const renderTableView = () => (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Bride Name</strong></TableCell>
              <TableCell><strong>Groom Name</strong></TableCell>
              <TableCell><strong>Wedding Date</strong></TableCell>
              <TableCell><strong>Wedding Time</strong></TableCell>
              <TableCell><strong>Bride Contact</strong></TableCell>
              <TableCell><strong>Groom Contact</strong></TableCell>
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
                onClick={() => navigate(`/admin/massWeddingDetails/${item._id}`)}
              >
                <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>{item.brideName ?? "Unknown Bride"}</TableCell>
                <TableCell>{item.groomName ?? "Unknown Groom"}</TableCell>
                <TableCell>
                  {item.weddingDateTime?.date
                    ? format(new Date(item.weddingDateTime.date), "MMMM dd, yyyy")
                    : "N/A"}
                </TableCell>
                <TableCell>{item.weddingDateTime?.time || "N/A"}</TableCell>
                <TableCell>{item.bridePhone || "N/A"}</TableCell>
                <TableCell>{item.groomPhone || "N/A"}</TableCell>
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
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            Mass Wedding Records
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mb: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
                No mass wedding records found.
              </Typography>
            </Paper>
          ) : (
            <>
              {viewMode === "cards" ? renderCardsView() : renderTableView()}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      startIcon={<ChevronLeftIcon />}
                    >
                      Previous
                    </Button>
                    <Typography variant="body1" color="text.secondary">
                      Page {currentPage} of {totalPages}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      endIcon={<ChevronRightIcon />}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MassWeddingList;