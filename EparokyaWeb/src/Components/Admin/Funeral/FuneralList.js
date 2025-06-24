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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
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
    const date = new Date(form.createdAt || form.funeralDate || new Date());
    const monthYear = format(date, "MMMM yyyy");
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(form);
  });
  return grouped;
};

const formatFuneralTime = (rawTime) => {
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
      console.warn("Invalid funeralTime:", rawTime);
      return "N/A";
    }

    return format(date, 'h:mm a');
  } catch (e) {
    console.error("Error parsing funeralTime:", rawTime, e);
    return "N/A";
  }
};

const FuneralList = () => {
  const [funeralForms, setFuneralForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const navigate = useNavigate();

  useEffect(() => {
    fetchFunerals();
  }, []);

  const fetchFunerals = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllFunerals`,
        { withCredentials: true }
      );
      if (response.data && Array.isArray(response.data)) {
        setFuneralForms(response.data);
        console.log(response.data)
      } else {
        setFuneralForms([]);
      }
    } catch (error) {
      console.error("Error fetching funeral forms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort
  const filteredForms = funeralForms.filter((funeral) => {
    return (
      (filteredStatus === "All" || funeral.funeralStatus === filteredStatus) &&
      (searchTerm === "" ||
        funeral.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        funeral.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Sort from latest to oldest
  const sortedForms = [...filteredForms].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.funeralDate || 0);
    const dateB = new Date(b.createdAt || b.funeralDate || 0);
    return dateB - dateA;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedForms.length / itemsPerPage);
  const paginatedForms = sortedForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const groupedPaginated = groupByMonthYear(paginatedForms);

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
                  status={item.funeralStatus}
                  onClick={() => navigate(`/admin/funeralDetails/${item._id}`)}
                  sx={{ cursor: "pointer", height: "100%" }}
                >
                  <Box sx={{ position: "absolute", right: 16, top: 16 }}>
                    <StatusChip
                      label={item.funeralStatus ?? "Unknown"}
                      size="small"
                      status={item.funeralStatus}
                    />
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Funeral #{index + 1 + (currentPage - 1) * itemsPerPage}: {item.name ?? "Unknown"}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Funeral Date:</strong>{" "}
                    {item.funeralDate
                      ? format(new Date(item.funeralDate), 'MMMM dd, yyyy')
                      : "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Funeral Time:</strong> {formatFuneralTime(item?.funeraltime)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Contact Person:</strong> {item.contactPerson || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Phone:</strong> {item.phone || "N/A"}
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
              <TableCell><strong>Deceased Name</strong></TableCell>
              <TableCell><strong>Funeral Date</strong></TableCell>
              <TableCell><strong>Funeral Time</strong></TableCell>
              <TableCell><strong>Contact Person</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
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
                onClick={() => navigate(`/admin/funeralDetails/${item._id}`)}
              >
                <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>{item.name ?? "Unknown"}</TableCell>
                <TableCell>
                  {item.funeralDate ? format(new Date(item.funeralDate), 'MMMM dd, yyyy') : "N/A"}
                </TableCell>
                <TableCell>{formatFuneralTime(item?.funeraltime)}</TableCell>
                <TableCell>{item.contactPerson || "N/A"}</TableCell>
                <TableCell>{item.phone || "N/A"}</TableCell>
                <TableCell>{item.userId?.name || "Unknown"}</TableCell>
                <TableCell>
                  <StatusChip
                    label={item.funeralStatus ?? "Unknown"}
                    size="small"
                    status={item.funeralStatus}
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
            Funeral Records
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
              label="Search by Name or Contact Person"
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
                No funeral records found.
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

export default FuneralList;