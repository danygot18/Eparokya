import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "../../../../GuestSideBar";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Modal,
  Button,
} from "@mui/material";
import MassWeddingChecklist from "./MassWeddingChecklist";

const MassWeddingDetails = () => {
  const { massWeddingId } = useParams();
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/massWedding/getUserMassWeddingForm/${massWeddingId}`,
          { withCredentials: true }
        );
        setWeddingDetails(response.data);
        
      } catch (err) {
        setError("Failed to fetch wedding details.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeddingDetails();
  }, [massWeddingId]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/massWedding/declineMassWedding/${massWeddingId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );
      setShowCancelModal(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to cancel the wedding.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Helper for date formatting
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

  return (
    <div className="wedding-details-page" style={{ display: "flex" }}>
      <GuestSideBar />
      <div className="wedding-details-container" style={{ flex: 1, padding: 24 }}>
        <h1>Wedding Details</h1>
        <div className="Wedding-three-container-layout">
          <div className="Wedding-left-container">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="h5" gutterBottom>
                Wedding Information
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Wedding Date and Time
                  </Typography>
                  <Typography>
                    <strong>Wedding Date and Time:</strong>{" "}
                    {weddingDetails?.weddingDateTime?.date
                      ? `${format(
                          new Date(weddingDetails.weddingDateTime.date),
                          "MMMM dd, yyyy"
                        )} at ${weddingDetails.weddingDateTime.time || "N/A"}`
                      : "N/A"}
                  </Typography>
                </CardContent>
              </Card>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Bride Details</Typography>
                    <Typography>
                      <strong>Name:</strong> {weddingDetails?.brideName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Birth Date:</strong>{" "}
                      {formatDate(weddingDetails?.brideBirthDate)}
                    </Typography>
                    <Typography>
                      <strong>Occupation:</strong>{" "}
                      {weddingDetails?.brideOccupation || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Religion:</strong>{" "}
                      {weddingDetails?.brideReligion || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Phone:</strong>{" "}
                      {weddingDetails?.bridePhone || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography variant="h6">Groom Details</Typography>
                    <Typography>
                      <strong>Name:</strong> {weddingDetails?.groomName || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Birth Date:</strong>{" "}
                      {formatDate(weddingDetails?.groomBirthDate)}
                    </Typography>
                    <Typography>
                      <strong>Occupation:</strong>{" "}
                      {weddingDetails?.groomOccupation || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Religion:</strong>{" "}
                      {weddingDetails?.groomReligion || "N/A"}
                    </Typography>
                    <Typography>
                      <strong>Phone:</strong>{" "}
                      {weddingDetails?.groomPhone || "N/A"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              <Card>
                <CardContent>
                  <Typography variant="h6">Parents</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Bride Father:</strong>{" "}
                      {weddingDetails?.brideFather || "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Bride Mother:</strong>{" "}
                      {weddingDetails?.brideMother || "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Groom Father:</strong>{" "}
                      {weddingDetails?.groomFather || "N/A"}
                    </Typography>
                    <Typography sx={{ flex: "1 1 200px" }}>
                      <strong>Groom Mother:</strong>{" "}
                      {weddingDetails?.groomMother || "N/A"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              {["Ninong", "Ninang"].map((role) => (
                <Card key={role}>
                  <CardContent>
                    <Typography variant="h6">{role}</Typography>
                    {weddingDetails?.[role]?.length > 0 ? (
                      weddingDetails[role].map((person, index) => (
                        <Typography key={index}>
                          <strong>{person.name}:</strong>{" "}
                          {person.address.street}, {person.address.city},{" "}
                          {person.address.zip}
                        </Typography>
                      ))
                    ) : (
                      <Typography>No {role} details available.</Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </div>
          <div className="Wedding-right-container">
            {/* Admin Comments */}
             <MassWeddingChecklist massWeddingId={massWeddingId} />

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admin Comments
                </Typography>
                {weddingDetails?.comments?.length > 0 ? (
                  weddingDetails.comments.map((comment, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {comment?.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString()
                          : ""}
                      </Typography>
                      <Typography>
                        <strong>Comment:</strong> {comment?.selectedComment || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Additional Comment:</strong>{" "}
                        {comment?.additionalComment || "N/A"}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))
                ) : (
                  <Typography>No admin comments yet.</Typography>
                )}
              </CardContent>
            </Card>
            {/* Cancellation Details */}
            {weddingDetails?.weddingStatus === "Cancelled" &&
            weddingDetails?.cancellingReason ? (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" color="error" gutterBottom>
                    Cancellation Details
                  </Typography>
                  <Typography>
                    <strong>Cancelled By:</strong>{" "}
                    {weddingDetails.cancellingReason.user}
                  </Typography>
                  <Typography>
                    <strong>Reason:</strong>{" "}
                    {weddingDetails.cancellingReason.reason ||
                      "No reason provided."}
                  </Typography>
                </CardContent>
              </Card>
            ) : null}
            {/* Cancel Button */}
            <div style={{ marginTop: 24 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowCancelModal(true)}
                disabled={
                  weddingDetails?.weddingStatus === "Confirmed" ||
                  weddingDetails?.weddingStatus === "Cancelled"
                }
              >
                Cancel Wedding
              </Button>
            </div>
            {/* Cancellation Modal */}
            <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 3,
                  borderRadius: 2,
                  minWidth: 320,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Cancel Wedding
                </Typography>
                <Typography gutterBottom>
                  Please provide a reason for cancellation:
                </Typography>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason..."
                  style={{
                    width: "100%",
                    minHeight: 80,
                    marginBottom: 16,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    padding: 8,
                  }}
                />
                <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancel}
                  >
                    Confirm Cancel
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Back
                  </Button>
                </Box>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MassWeddingDetails;