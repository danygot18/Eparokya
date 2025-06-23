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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
  Select,
  Alert
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Comment as CommentIcon,
  Info as InfoIcon,
  Cancel as CancelIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Chat as ChatIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import SideBar from "../SideBar";
// Removed DatePicker, LocalizationProvider, AdapterDateFns
import CounselingPDFDownloadForm from "./CounselingPDFDownloadForm";

const CounselingDetails = () => {
  const { counselingId } = useParams();
  const [counselingDetails, setCounselingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  // Form states
  const [priestsList, setPriestsList] = useState([]);
  const [selectedPriestId, setSelectedPriestId] = useState("");
  const [selectedComment, setSelectedComment] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");
  const [comments, setComments] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const predefinedComments = [
    "Confirmed",
    "Pending Confirmation",
    "Rescheduled",
    "Cancelled",
  ];

  useEffect(() => {
    const fetchCounselingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getCounseling/${counselingId}`,
          { withCredentials: true }
        );
        setCounselingDetails(response.data.counseling);
        setComments(response.data.counseling.comments || []);
        setSelectedPriestId(response.data.counseling?.priest?._id || "");
        console.log("Counseling Details:", response.data.counseling);
      } catch (err) {
        setError("Failed to fetch counseling details.");
        toast.error("Failed to load counseling details", {
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
        const formattedPriests = Array.isArray(fetchedPriests)
          ? fetchedPriests
          : [fetchedPriests];
        setPriestsList(formattedPriests);
      } catch (err) {
        console.error("Failed to fetch priests:", err);
        setPriestsList([]);
      }
    };

    fetchCounselingDetails();
    fetchPriests();
  }, [counselingId]);

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
    const address = counselingDetails?.address || {};
    const parts = [
      address.BldgNameTower,
      address.LotBlockPhaseHouseNo,
      address.SubdivisionVillageZone,
      address.Street,
      address.District,
      address.barangay === "Others" ? address.customBarangay : address.barangay,
      address.city === "Others" ? address.customCity : address.city
    ].filter(Boolean);

    return parts.join(", ");
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${counselingId}/confirmCounseling`,
        {},
        { withCredentials: true }
      );
      toast.success("Counseling confirmed successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setCounselingDetails(prev => ({ ...prev, counselingStatus: "Confirmed" }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to confirm the counseling.",
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
        `${process.env.REACT_APP_API}/api/v1/declineCounseling/${counselingId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );

      toast.success("Counseling cancelled successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setShowCancelModal(false);
      setCounselingDetails(prev => ({ ...prev, counselingStatus: "Cancelled" }));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel the counseling.",
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

    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/updateCounselingDate/${counselingId}`,
        { newDate, reason },
        { withCredentials: true }
      );

      setCounselingDetails(prev => ({
        ...prev,
        counselingDate: newDate,
        counselingStatus: 'Rescheduled',
        adminRescheduled: {
          date: newDate,
          reason: reason
        }
      }));

      toast.success("Counseling date updated successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Error updating counseling date:", error);
      toast.error("Failed to update counseling date.", {
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
        `${process.env.REACT_APP_API}/api/v1/${counselingId}/commentCounseling`,
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
        `${process.env.REACT_APP_API}/api/v1/counselingAddPriest/${counselingId}`,
        { priestId: selectedPriestId },
        { withCredentials: true }
      );
      toast.success("Priest assigned successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setCounselingDetails(prev => ({
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
              Counseling Details
            </Typography>
            <Chip
              label={counselingDetails?.counselingStatus || "N/A"}
              color={getStatusColor(counselingDetails?.counselingStatus)}
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
                      <Typography>{counselingDetails?.person?.fullName || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Date of Birth
                      </Typography>
                      <Typography>
                        {counselingDetails?.person?.dateOfBirth
                          ? new Date(counselingDetails.person.dateOfBirth).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Purpose
                      </Typography>
                      <Typography>{counselingDetails?.purpose || "N/A"}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Contact Person */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                      <PersonIcon />
                    </Avatar>
                  }
                  title="Contact Person"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Full Name
                      </Typography>
                      <Typography>{counselingDetails?.contactPerson?.fullName || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Contact Number
                      </Typography>
                      <Typography>{counselingDetails?.contactPerson?.contactNumber || "N/A"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Relationship
                      </Typography>
                      <Typography>{counselingDetails?.contactPerson?.relationship || "N/A"}</Typography>
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
                  title="Address"
                />
                <CardContent>
                  <Typography>{formatAddress() || "N/A"}</Typography>
                </CardContent>
              </Card>

              {/* Counseling Details */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <CalendarIcon />
                    </Avatar>
                  }
                  title="Counseling Details"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Original Counseling Date
                      </Typography>
                      <Typography>
                        {counselingDetails?.counselingDate
                          ? new Date(counselingDetails.counselingDate).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Counseling Time
                      </Typography>
                      <Typography>{counselingDetails?.counselingTime || "N/A"}</Typography>
                    </Box>
                    {counselingDetails?.adminRescheduled?.date && (
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary">
                          Rescheduled Date
                        </Typography>
                        <Typography>
                          {new Date(counselingDetails.adminRescheduled.date).toLocaleDateString()}
                        </Typography>
                        {counselingDetails.adminRescheduled.reason && (
                          <>
                            <Typography variant="subtitle2" color="textSecondary" mt={1}>
                              Rescheduling Reason
                            </Typography>
                            <Typography>{counselingDetails.adminRescheduled.reason}</Typography>
                          </>
                        )}
                      </Box>
                    )}
                    <Box>
                      <Typography variant="subtitle2" color="textSecondary">
                        Confirmed At
                      </Typography>
                      <Typography>
                        {counselingDetails?.confirmedAt
                          ? new Date(counselingDetails.confirmedAt).toLocaleDateString()
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
                    {counselingDetails?.Priest ? (
                      <Typography>
                        <strong>{counselingDetails.Priest.title} {counselingDetails.Priest.fullName}</strong>
                      </Typography>
                    ) : (
                      <Typography>No priest assigned.</Typography>
                    )}
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
                                {priest.title} {priest.fullName}
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

              {/* Reschedule Counseling */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <CalendarIcon />
                    </Avatar>
                  }
                  title="Reschedule Counseling"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      label="New Counseling Date"
                      type="date"
                      value={newDate}
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
                      {loading ? <CircularProgress size={24} /> : "Update Counseling Date"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckIcon />}
                  onClick={handleConfirm}
                  fullWidth
                  disabled={counselingDetails?.counselingStatus === "Confirmed" || counselingDetails?.counselingStatus === "Cancelled"}
                >
                  Confirm Counseling
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => setShowCancelModal(true)}
                  fullWidth
                  disabled={counselingDetails?.counselingStatus === "Cancelled" || counselingDetails?.counselingStatus === "Confirmed"}
                >
                  Cancel Counseling
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  onClick={() => navigate(`/adminChat/${counselingDetails?.userId?._id}/${counselingDetails?.userId?.email}`)}
                  fullWidth
                >
                  Go to Admin Chat
                </Button>
                <CounselingPDFDownloadForm
                  counselingDetails={counselingDetails}
                  comments={comments}
                />
              </Stack>
            </Stack>
          </Stack>

          {/* Cancellation Details */}
          {counselingDetails?.counselingStatus === "Cancelled" && counselingDetails?.cancellingReason && (
            <Card elevation={3}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                    <CancelIcon />
                  </Avatar>
                }
                title="Cancellation Details"
              />
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cancelled By
                  </Typography>
                  <Typography>
                    {counselingDetails.cancellingReason.user === "Admin"
                      ? "Admin"
                      : counselingDetails.cancellingReason.user}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary" mt={1}>
                    Reason
                  </Typography>
                  <Typography>
                    {counselingDetails.cancellingReason.reason || "No reason provided."}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      >
        <DialogTitle>Cancel Counseling</DialogTitle>
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

export default CounselingDetails;