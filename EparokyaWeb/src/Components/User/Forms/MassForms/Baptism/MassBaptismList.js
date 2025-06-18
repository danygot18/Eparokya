import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import Loader from "../../../../Layout/Loader";
import { format, parse } from "date-fns";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const SubmittedBaptismList = () => {
  const [baptismForms, setBaptismForms] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMySubmittedForms();
  }, []);

  const fetchMySubmittedForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/massBaptism/getAllUserMassSubmittedBaptism`,
        { withCredentials: true }
      );

      const forms = response.data?.forms;

      if (Array.isArray(forms)) {
        setBaptismForms(forms);
        console.log("Fetched baptism forms:", forms);
      } else {
        setBaptismForms([]);
      }
    } catch (error) {
      console.error("Error fetching baptism forms:", error);
      const message =
        error.response?.data?.message || "Failed to fetch baptism forms.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = baptismForms.filter((form) => {
    const matchesStatus =
      filteredStatus === "All" || form.baptismStatus === filteredStatus;
    const matchesSearch =
      !searchTerm ||
      form.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.motherName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredForms.length / cardsPerPage);
  const paginatedForms = filteredForms.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const groupedPaginated = paginatedForms.reduce((acc, form) => {
    const date = form.baptismDateTime?.date;
    const groupKey = date ? format(new Date(date), "MMMM yyyy") : "No Date";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(form);
    return acc;
  }, {});

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",

        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <GuestSideBar />
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          marginTop: 10,
          display: "flex",
          flexDirection: "column",

          flex: 1,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", textAlign: "center" }}
        >
          My Mass Baptism Applications
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
              onClick={() => {
                setFilteredStatus(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </Button>
          ))}
        </Stack>
        <Box sx={{ width: "100%", mb: 2 }}>
          <input
            type="text"
            placeholder="Search by Child, Father, or Mother Name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
              No mass baptism records found.
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
                          `/user/MassSubmittedBaptismDetails/${item._id}`
                        )
                      }
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          p: 2,
                          height: "100%",
                          borderLeft: `6px solid ${
                            item.binyagStatus === "Confirmed"
                              ? "#2e7d32"
                              : item.binyagStatus === "Cancelled"
                              ? "#d32f2f"
                              : item.binyagStatus === "Pending"
                              ? "#ed6c02"
                              : "#1976d2"
                          }`,
                        }}
                      >
                        <Typography variant="h6" component="h2" gutterBottom>
                          Mass Baptism #
                          {index + 1 + (currentPage - 1) * cardsPerPage}:{" "}
                          {item.child?.fullName ?? "Unknown Child"}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          <strong>Baptism Date and Time:</strong>{" "}
                          {item.baptismDateTime?.date &&
                          item.baptismDateTime?.time
                            ? (() => {
                                const cleanTime = item.baptismDateTime.time
                                  .trim()
                                  .replace(/\./g, "")
                                  .replace(/\s+/g, " ");

                                try {
                                  return (
                                    <>
                                      {format(
                                        new Date(item.baptismDateTime.date),
                                        "MMMM dd, yyyy"
                                      )}{" "}
                                      at{" "}
                                      {format(
                                        parse(cleanTime, "HH:mm", new Date()),
                                        "h:mm a"
                                      )}
                                    </>
                                  );
                                } catch (error) {
                                  console.error(
                                    "Time parsing failed:",
                                    cleanTime,
                                    error
                                  );
                                  return "Invalid time";
                                }
                              })()
                            : "N/A"}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Father:</strong>{" "}
                          {item.parents?.fatherFullName || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Mother:</strong>{" "}
                          {item.parents?.motherFullName || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Address:</strong>{" "}
                          {item.parents?.address || "N/A"}
                        </Typography>
                         <Typography variant="body2" color="textSecondary">
                          <strong>Status:</strong> {item.baptismStatus || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Binyag Status:</strong> {item.binyagStatus || "N/A"}
                        </Typography>
                        {item.cancellingReason?.reason && (
                          <Typography variant="body2" color="error">
                            <strong>Cancellation Reason:</strong> {item.cancellingReason.reason}
                          </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary">
                          <strong>Godfather:</strong>{" "}
                          {item.ninong?.name ? item.ninong.name : "N/A"}
                        </Typography>

                        <Typography variant="body2" color="textSecondary">
                          <strong>Godmother:</strong>{" "}
                          {item.ninang?.name ? item.ninang.name : "N/A"}
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary">
                          <strong>Submitted At:</strong>{" "}
                          {item.createdAt
                            ? format(new Date(item.createdAt), "MMMM dd, yyyy")
                            : "N/A"}
                        </Typography>
                      </Paper>
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

export default SubmittedBaptismList;
