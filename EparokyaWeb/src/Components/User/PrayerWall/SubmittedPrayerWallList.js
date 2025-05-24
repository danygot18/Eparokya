import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Typography,
  TextField,
  Button,
  ButtonGroup,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
  Pagination,
  Stack,
} from "@mui/material";
import GuestSideBar from "../../GuestSideBar";
import { toast } from "react-toastify";

const SubmittedPrayerWallList = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const prayersPerPage = 10;
  const [totalPrayers, setTotalPrayers] = useState(0);
  const [filteredForms, setFilteredForms] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const filterOptions = [
    { label: "All", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Posted", value: "Confirmed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const config = { withCredentials: true };

  useEffect(() => {
    const fetchUserPrayers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedPrayerWall?page=${currentPage}&limit=${prayersPerPage}`,
          config
        );
        const activePrayers = response.data.prayers.filter(
          (prayer) => !prayer.isDeletedByUser
        );
        setPrayers(activePrayers || []);
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

    fetchUserPrayers();
  }, [currentPage]);

  useEffect(() => {
    let filtered = prayers.filter(
      (form) => !form.hidden && !form.isDeletedByUser
    );

    if (activeFilter !== "All") {
  filtered = filtered.filter(
    (form) =>
      form.prayerWallStatus?.toLowerCase() === activeFilter.toLowerCase()
  );
}


    if (searchTerm) {
      filtered = filtered.filter((form) =>
        form.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredForms(filtered);
  }, [prayers, activeFilter, searchTerm]);

  const handleSoftDelete = async (prayerId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/hidePrayer/${prayerId}`,
        {},
        config
      );

      setPrayers((prev) =>
        prev.map((prayer) =>
          prayer._id === prayerId
            ? { ...prayer, isDeletedByUser: true }
            : prayer
        )
      );

      setFilteredForms((prev) =>
        prev.filter((prayer) => prayer._id !== prayerId)
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting prayer:", error);
      toast.error(error.response?.data?.message || "Failed to delete prayer");
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <GuestSideBar />
      <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 2 }}>
          My Submitted Prayers
        </Typography>

        {/* Filters */}
        <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ maxWidth: 400 }}
          />
          <ButtonGroup
            variant="outlined"
            size="small"
            aria-label="filter buttons"
          >
            {filterOptions.map((filter) => (
              <Button
                key={filter.label}
                color={activeFilter === filter.value ? "primary" : "inherit"}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </ButtonGroup>
        </Stack>

        {/* Prayer List */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : filteredForms.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 1 }}>
            No prayers found.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {filteredForms.map((prayer) => (
              <Card
                key={prayer._id}
                sx={{
                  position: "relative",
                  borderLeft: `4px solid ${
                    prayer.prayerWallStatus === "Confirmed"
                      ? "#4caf50"
                      : prayer.prayerWallStatus === "Pending"
                      ? "#ff9800"
                      : "#f44336"
                  }`,
                  "&:hover": {
                    boxShadow: 1,
                  },
                }}
              >
                <CardContent sx={{ py: 1, px: 2, "&:last-child": { pb: 1 } }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                    }}
                  >
                    <Chip
                      label={
                        prayer.prayerWallStatus === "Confirmed"
                          ? "Posted"
                          : prayer.prayerWallStatus
                      }
                      color={getStatusColor(prayer.prayerWallStatus)}
                      size="small"
                      sx={{ height: 24, fontSize: "0.75rem" }}
                    />
                  </Box>
                  <Typography
                    variant="subtitle2"
                    component="h3"
                    sx={{ fontWeight: 600, pr: 6 }}
                  >
                    {prayer.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, fontSize: "0.875rem" }}
                  >
                    {prayer.prayerRequest}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      aria-label="delete"
                      onClick={() => handleSoftDelete(prayer._id)}
                      sx={{
                        color: "error.main",
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "rgba(244, 67, 54, 0.1)",
                          borderRadius: 1,
                        },
                        padding: "6px 8px",
                      }}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {totalPrayers > prayersPerPage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={Math.ceil(totalPrayers / prayersPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SubmittedPrayerWallList;
