import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Button,
  Container,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  Person as PersonIcon,
  Comment as CommentIcon,
  CalendarToday as CalendarIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import GuestSideBar from "../../../../GuestSideBar";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../../../Layout/Loader";

const MySubmittedCounselingForms = () => {
  const { formId } = useParams();
  const [counselingDetails, setCounselingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchCounselingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getCounselingForm/${formId}`,
          { withCredentials: true }
        );
        setCounselingDetails(response.data);
        console.log(response.data)
        setComments(response.data.comments || []);
      } catch (err) {
        setError("Failed to fetch counseling details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounselingDetails();
  }, [formId]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason.", { position: toast.POSITION.TOP_RIGHT });
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/declineCounseling/${formId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );
      toast.success("Counseling cancelled successfully!", { position: toast.POSITION.TOP_RIGHT });
      setShowCancelModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel the counseling.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  if (loading) return <Loader />;
  if (error) return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ display: "flex" }}>
      <GuestSideBar />
      <Container maxWidth="md" sx={{ py: 4, ml: { sm: "240px" } }}>
        <Stack spacing={3}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" component="h1">
              Counseling Details
            </Typography>
            <Chip
              label={counselingDetails?.counselingStatus || "N/A"}
              color={
                counselingDetails?.counselingStatus === "Confirmed"
                  ? "success"
                  : counselingDetails?.counselingStatus === "Cancelled"
                  ? "error"
                  : counselingDetails?.counselingStatus === "Rescheduled"
                  ? "info"
                  : "warning"
              }
              size="medium"
            />
          </Box>

          <Stack spacing={3} direction={{ xs: "column", md: "row" }} alignItems="flex-start">
            {/* Left column */}
            <Stack spacing={3} sx={{ flex: 2, minWidth: 0 }}>
              {/* Person Info */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <PersonIcon />
                    </Avatar>
                  }
                  title="Person Information"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Typography>
                      <strong>Full Name:</strong> {counselingDetails?.person?.fullName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Date of Birth:</strong>{" "}
                      {counselingDetails?.person?.dateOfBirth
                        ? new Date(counselingDetails.person.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Purpose:</strong> {counselingDetails?.purpose || "N/A"}
                    </Typography>
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
                    <Typography>
                      <strong>Name:</strong> {counselingDetails?.contactPerson?.fullName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Contact Number:</strong> {counselingDetails?.contactPerson?.contactNumber || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Relationship:</strong> {counselingDetails?.contactPerson?.relationship || "N/A"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              {/* Address */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                      <HomeIcon />
                    </Avatar>
                  }
                  title="Address"
                />
                <CardContent>
                  <Typography>
                    {[
                      counselingDetails?.address?.BldgNameTower,
                      counselingDetails?.address?.LotBlockPhaseHouseNo,
                      counselingDetails?.address?.SubdivisionVillageZone,
                      counselingDetails?.address?.Street,
                      counselingDetails?.address?.district,
                      counselingDetails?.address?.barangay === "Others"
                        ? counselingDetails?.address?.customBarangay
                        : counselingDetails?.address?.barangay,
                      counselingDetails?.address?.city === "Others"
                        ? counselingDetails?.address?.customCity
                        : counselingDetails?.address?.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Typography>
                </CardContent>
              </Card>

              {/* Counseling Schedule */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <CalendarIcon />
                    </Avatar>
                  }
                  title="Counseling Schedule"
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Typography>
                      <strong>Counseling Date:</strong>{" "}
                      {counselingDetails?.counselingDate
                        ? new Date(counselingDetails.counselingDate).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Counseling Time:</strong> {counselingDetails?.counselingTime || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Confirmed At:</strong>{" "}
                      {counselingDetails?.confirmedAt
                        ? new Date(counselingDetails.confirmedAt).toLocaleDateString()
                        : "N/A"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            {/* Right column */}
            <Stack spacing={3} sx={{ flex: 1, minWidth: 0 }}>
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
                          <Typography>
                            <strong>Selected Comment:</strong> {comment.selectedComment || "N/A"}
                          </Typography>
                          <Typography>
                            <strong>Additional Comment:</strong> {comment.additionalComment || "N/A"}
                          </Typography>
                          {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography>No admin comments yet.</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Updated Counseling Date */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                      <EditIcon />
                    </Avatar>
                  }
                  title="Updated Counseling Date"
                />
                <CardContent>
                  <Typography>
                    <strong>Date:</strong>{" "}
                    {counselingDetails?.adminRescheduled?.date
                      ? new Date(counselingDetails.adminRescheduled.date).toLocaleDateString()
                      : counselingDetails?.counselingDate
                      ? new Date(counselingDetails.counselingDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>
                  {counselingDetails?.adminRescheduled?.reason && (
                    <>
                      <Typography sx={{ mt: 1 }}>
                        <strong>Reason for Rescheduling:</strong>
                      </Typography>
                      <Typography>{counselingDetails.adminRescheduled.reason}</Typography>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Priest */}
              <Card elevation={3}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                      <PersonIcon />
                    </Avatar>
                  }
                  title="Priest"
                />
                <CardContent>
                  <Typography>
                    <strong>Priest:</strong>{" "}
                    {counselingDetails?.priest?.name || "No priest."}
                  </Typography>
                </CardContent>
              </Card>

              {/* Cancellation Details */}
              {counselingDetails?.counselingStatus === "Cancelled" &&
                counselingDetails?.cancellingReason && (
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
                      <Typography>
                        <strong>Cancelled By:</strong>{" "}
                        {counselingDetails.cancellingReason.user === "Admin"
                          ? "Admin"
                          : counselingDetails.cancellingReason.user}
                      </Typography>
                      <Typography>
                        <strong>Reason:</strong>{" "}
                        {counselingDetails.cancellingReason.reason || "No reason provided."}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

              {/* Cancel Button */}
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => setShowCancelModal(true)}
                fullWidth
                disabled={counselingDetails?.counselingStatus === "Cancelled"}
              >
                Cancel Counseling
              </Button>
            </Stack>
          </Stack>
        </Stack>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelModal} onClose={() => setShowCancelModal(false)}>
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
      </Container>
    </Box>
  );
};

export default MySubmittedCounselingForms;