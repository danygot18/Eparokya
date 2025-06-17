import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme
} from "@mui/material";
import {
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import SideBar from "../SideBar";
import { toast, ToastContainer } from "react-toastify";
import dayjs from "dayjs";

const HouseBlessingsDetails = () => {
  const { blessingId } = useParams();
  const [blessingDetails, setBlessingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Form states
  const [priestsList, setPriestsList] = useState([]);
  const [selectedPriestId, setSelectedPriestId] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");
  const [comments, setComments] = useState([]);
  const [newDate, setNewDate] = useState(null);
  const [reason, setReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [updatedHouseBlessingDate, setUpdatedHouseBlessingDate] = useState(
    blessingDetails?.blessingDate || ""
  );

  const predefinedComments = [
    "Confirmed",
    "Pending Confirmation",
    "Rescheduled",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchBlessingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/houseBlessing/getHouseBlessing/${blessingId}`,
          { withCredentials: true }
        );
        setBlessingDetails(response.data.houseBlessing);
        console.log(response.data.houseBlessing)
        setComments(response.data.houseBlessing.comments || []);
        setSelectedPriestId(response.data.houseBlessing?.priest?._id || "");
      } catch (err) {
        setError("Failed to fetch house blessing details.");
        toast.error("Failed to load house blessing details", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchPriests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getAvailablePriest`,
          { withCredentials: true }
        );
        const fetchedPriests = response.data.priests;
        console.log("Fetched priests:", fetchedPriests);
        const formattedPriests = Array.isArray(fetchedPriests)
          ? fetchedPriests
          : [fetchedPriests];
        setPriestsList(formattedPriests);

      } catch (err) {
        console.error("Failed to fetch priests:", err);
        setPriestsList([]);
      }
    };

    fetchBlessingDetails();
    fetchPriests();
  }, [blessingId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "approved":
      case "confirmed":
        return "success";
      case "rejected":
      case "cancelled":
        return "error";
      case "rescheduled":
        return "info";
      default:
        return "default";
    }
  };

  const formatAddress = () => {
    const address = blessingDetails?.address || {};
    const parts = [
      address.houseDetails,
      address.block,
      address.phase,
      address.street,
      address.district,
      address.baranggay === "Others" ? address.customBarangay : address.baranggay,
      address.city === "Others" ? address.customCity : address.city
    ].filter(Boolean);

    return parts.join(", ");
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/houseBlessing/${blessingId}/confirmBlessing`,
        {},
        { withCredentials: true }
      );
      toast.success("House blessing confirmed successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setBlessingDetails(prev => ({ ...prev, blessingStatus: "Confirmed" }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to confirm the house blessing.",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/houseBlessing/declineBlessing/${blessingId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );

      toast.success("House Blessing cancelled successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowCancelModal(false);
      setBlessingDetails(prev => ({ ...prev, blessingStatus: "Cancelled" }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel the house blessing.",
        {
          position: toast.POSITION.TOP_RIGHT,
        }
      );
    }
  };

  const handleUpdate = async () => {
    if (!newDate || !reason) {
      toast.error("Please select a date and provide a reason.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    console.log("Updating blessing date:", newDate, reason);

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/houseBlessing/updateHouseBlessingDate/${blessingId}`,
        { newDate, reason },
        { withCredentials: true }
      );
      console.log("Response from update:", response.data);
      setBlessingDetails(prev => ({
        ...prev,
        blessingDate: newDate,
        blessingStatus: 'Rescheduled',
        adminRescheduled: {
          date: newDate,
          reason: reason
        }
      }));
      toast.success("Blessing date updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error updating blessing date:", error);
      toast.error("Failed to update blessing date.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!selectedComment && !additionalComment) {
      toast.error("Please select or enter a comment.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const commentData = {
      selectedComment: selectedComment || "",
      additionalComment: additionalComment || "",
    };
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/houseBlessing/${blessingId}/commentBlessing`,
        commentData,
        { withCredentials: true }
      );

      setComments(prev => [...prev, response.data.comment]);
      toast.success("Comment submitted successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setSelectedComment("");
      setAdditionalComment("");
    } catch (error) {
      toast.error("Failed to submit comment.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const handleAddPriest = async () => {
    if (!selectedPriestId) {
      toast.error("Please select a priest.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/houseBlessing/addPriestBlessing/${blessingId}`,
        { priestId: selectedPriestId },
        { withCredentials: true }
      );
      toast.success("Priest assigned successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setBlessingDetails(prev => ({
        ...prev,
        priest: priestsList.find(priest => priest._id === selectedPriestId)
      }));
    } catch (error) {
      console.error("Error assigning priest:", error);
      toast.error("Failed to assign priest.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Container maxWidth="lg" sx={{ py: 4, ml: { sm: '240px' } }}>
        <Stack spacing={3}>
          {/* Header with status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">
               Blessing Details
            </Typography>
            <Chip
              label={blessingDetails?.blessingStatus || "N/A"}
              color={getStatusColor(blessingDetails?.blessingStatus)}
              size="medium"
            />
          </Box>

          {/* Main content grid */}
          <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} alignItems="flex-start">
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
            </Stack>

            {/* Right column */}
            <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
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
                  <Stack spacing={2}>
                    <Typography>
                      {blessingDetails?.priest?.name || "Not assigned yet"}
                    </Typography>
                    {priestsList.length > 0 && (
                      <>
                        <FormControl fullWidth size="small">
                          <InputLabel>Select Priest</InputLabel>
                          <Select
                            value={selectedPriestId}
                            onChange={(e) => setSelectedPriestId(e.target.value)}
                            label="Select Priest"
                          >
                            {priestsList.map((priest) => (
                              <MenuItem key={priest._id} value={priest._id}>
                                {priest.fullName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          startIcon={<PersonIcon />}
                          onClick={handleAddPriest}
                          fullWidth
                        >
                          Assign Priest
                        </Button>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>

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
                  {comments.length > 0 ? (
                    <Stack spacing={2}>
                      {comments.map((comment, index) => (
                        <Box key={index}>
                          {comment.selectedComment && (
                            <Box>
                              <Typography variant="subtitle2" color="textSecondary">
                                Selected Comment
                              </Typography>
                              <Typography>{comment.selectedComment}</Typography>
                            </Box>
                          )}
                          {comment.additionalComment && (
                            <Box mt={1}>
                              <Typography variant="subtitle2" color="textSecondary">
                                Additional Comment
                              </Typography>
                              <Typography>{comment.additionalComment}</Typography>
                            </Box>
                          )}
                          {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography>No admin comments yet.</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Add Comment */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                      <EditIcon />
                    </Avatar>
                  }
                  title="Add Comment"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Predefined Comments</InputLabel>
                      <Select
                        value={selectedComment}
                        onChange={(e) => setSelectedComment(e.target.value)}
                        label="Predefined Comments"
                      >
                        <MenuItem value="">
                          <em>Select a comment</em>
                        </MenuItem>
                        {predefinedComments.map((comment, index) => (
                          <MenuItem key={index} value={comment}>
                            {comment}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Additional Comments"
                      multiline
                      rows={3}
                      value={additionalComment}
                      onChange={(e) => setAdditionalComment(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      startIcon={<CommentIcon />}
                      onClick={handleSubmitComment}
                      fullWidth
                    >
                      Submit Comment
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Reschedule Blessing */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <CalendarIcon />
                    </Avatar>
                  }
                  title="Reschedule Blessing"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="New Blessing Date"
                      type="date"
                      value={newDate ? dayjs(newDate).format("YYYY-MM-DD") : ""}
                      onChange={(e) => setNewDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="Reason for Rescheduling"
                      multiline
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={handleUpdate}
                      disabled={loading}
                      fullWidth
                    >
                      {loading ? <CircularProgress size={24} /> : "Update Blessing Date"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={handleConfirm}
                  fullWidth
                  disabled={
                    blessingDetails?.blessingStatus === "Confirmed" ||
                    blessingDetails?.blessingStatus === "Cancelled"
                  }
                >
                  Confirm Blessing
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setShowCancelModal(true)}
                  fullWidth
                  disabled={blessingDetails?.blessingStatus === "Cancelled"}
                >
                  Cancel Blessing
                </Button>
              </Stack>

            </Stack>
          </Stack>
        </Stack>
      </Container>


      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      >
        <DialogTitle>Cancel House Blessing</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Please provide a reason for cancellation:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Cancellation Reason"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelModal(false)}>Back</Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={!cancelReason.trim()}
          >
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
};

export default HouseBlessingsDetails;