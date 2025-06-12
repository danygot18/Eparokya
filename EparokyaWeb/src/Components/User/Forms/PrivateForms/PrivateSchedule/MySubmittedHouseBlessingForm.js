import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  Chip,
  Button,
  Container,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  useTheme
} from "@mui/material";
import {
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import GuestSideBar from "../../../../GuestSideBar";
import Loader from "../../../../Layout/Loader";

const MySubmittedHouseBlessingForm = () => {
  const { formId } = useParams();
  const [blessingDetails, setBlessingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchBlessingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/houseBlessing/getHouseBlessingForm/${formId}`,
          { withCredentials: true }
        );
        setBlessingDetails(response.data);
        console.log(response.data)
      } catch (err) {
        setError("Failed to fetch house blessing details.");
        toast.error("Failed to load house blessing details", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlessingDetails();
  }, [formId]);

  const handleCancel = async () => {
    try {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this house blessing request?"
      );
      if (!confirmCancel) return;

      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/houseBlessing/cancelHouseBlessing/${formId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("House blessing request cancelled successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        navigate("/user/SubmittedHouseBlessingList");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error cancelling the house blessing request.",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        }
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  const formatAddress = () => {
    const address = blessingDetails?.address || {};
    const parts = [
      address.BldgNameTower,
      address.LotBlockPhaseHouseNo,
      address.SubdivisionVillageZone,
      address.Street,
      address.district,
      address.barangay === "Others" ? address.customBarangay : address.barangay,
      address.city === "Others" ? address.customCity : address.city
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <GuestSideBar />
      <Container maxWidth="lg" sx={{ py: 4, ml: { sm: "240px" } }}>
        <Stack spacing={3}>
          {/* Header with status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Typography variant="h4" component="h1">
              House Blessing Request
            </Typography>
            <Chip
              label={blessingDetails?.blessingStatus || "N/A"}
              color={getStatusColor(blessingDetails?.blessingStatus)}
              size="medium"
            />
          </Box>

          {/* Main content grid */}
          <Stack spacing={3} direction={{ xs: "column", md: "row" }} alignItems="flex-start">
            {/* Left column */}
            <Stack spacing={3} sx={{ flex: 2, minWidth: 0 }}>
              {/* Applicant Information */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <PersonIcon />
                    </Avatar>
                  }
                  title="Applicant Information"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                      </Typography>
                      <Typography>{blessingDetails?.fullName || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Contact Number
                      </Typography>
                      <Typography>{blessingDetails?.contactNumber || "N/A"}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      <HomeIcon />
                    </Avatar>
                  }
                  title="Property Details"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Property Type
                      </Typography>
                      <Typography>
                        {blessingDetails?.propertyType === "Others"
                          ? blessingDetails?.customPropertyType
                          : blessingDetails?.propertyType || "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Floors
                      </Typography>
                      <Typography>{blessingDetails?.floors || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Rooms
                      </Typography>
                      <Typography>{blessingDetails?.rooms || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Property Size
                      </Typography>
                      <Typography>{blessingDetails?.propertySize || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        New Construction
                      </Typography>
                      <Typography>
                        {blessingDetails?.isNewConstruction ? "Yes" : "No"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Address */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                      <LocationIcon />
                    </Avatar>
                  }
                  title="Property Address"
                />
                <CardContent>
                  <Typography>{formatAddress() || "N/A"}</Typography>
                </CardContent>
              </Card>
            </Stack>

            {/* Right column */}
            <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
              {/* Blessing Details */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <CalendarIcon />
                    </Avatar>
                  }
                  title="Blessing Details"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Original Blessing Date
                      </Typography>
                      <Typography>
                        {blessingDetails?.blessingDate
                          ? new Date(blessingDetails.blessingDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Blessing Time
                      </Typography>
                      <Typography>{blessingDetails?.blessingTime || "N/A"}</Typography>
                    </Box>
                    {blessingDetails?.adminRescheduled?.date && (
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Rescheduled Date
                        </Typography>
                        <Typography>
                          {new Date(blessingDetails.adminRescheduled.date).toLocaleDateString()}
                        </Typography>
                        {blessingDetails.adminRescheduled.reason && (
                          <>
                            <Typography variant="subtitle2" color="textSecondary" mt={1}>
                              Rescheduling Reason
                            </Typography>
                            <Typography>{blessingDetails.adminRescheduled.reason}</Typography>
                          </>
                        )}
                      </Box>
                    )}
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Confirmed At
                      </Typography>
                      <Typography>
                        {blessingDetails?.confirmedAt
                          ? new Date(blessingDetails.confirmedAt).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Priest Information */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                      <PersonIcon />
                    </Avatar>
                  }
                  title="Assigned Priest"
                />
                <CardContent>
                  <Typography>{blessingDetails?.priest?.fullName || "Not assigned yet"}</Typography>
                </CardContent>
              </Card>

              {/* Special Requests */}
              {blessingDetails?.specialRequests && (
                <Card elevation={3}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                        <InfoIcon />
                      </Avatar>
                    }
                    title="Special Requests"
                  />
                  <CardContent>
                    <Typography>{blessingDetails.specialRequests}</Typography>
                  </CardContent>
                </Card>
              )}

              {/* Admin Comments */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <CommentIcon />
                    </Avatar>
                  }
                  title="Admin Comments"
                />
                <CardContent>
                  {blessingDetails?.comments && blessingDetails.comments.length > 0 ? (
                    blessingDetails.comments.map((comment, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Selected Comment
                        </Typography>
                        <Typography>{comment?.selectedComment || "N/A"}</Typography>
                        <Typography variant="subtitle2" color="textSecondary" mt={1}>
                          Additional Comment
                        </Typography>
                        <Typography>{comment?.additionalComment || "N/A"}</Typography>
                        {index < blessingDetails.comments.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))
                  ) : (
                    <Typography>No admin comments yet.</Typography>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Stack>

          {/* Cancel Button (only for Pending status) */}
          {blessingDetails?.blessingStatus === "Pending" && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{ px: 4 }}
              >
                Cancel Request
              </Button>
            </Box>
          )}
        </Stack>
      </Container>
      <ToastContainer />
    </Box>
  );
};

export default MySubmittedHouseBlessingForm;