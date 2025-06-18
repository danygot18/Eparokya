import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "../../../../GuestSideBar";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Modal,
} from "@mui/material";
import Loader from "../../../../Layout/Loader";
import MassBaptismChecklist from "./MassBaptismChecklist";
import { format } from "date-fns";

const MassBaptismDetails = () => {
  const { massBaptismId } = useParams();
  const [baptismDetails, setBaptismDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBaptismDetails();
    // eslint-disable-next-line
  }, [massBaptismId]);

  const fetchBaptismDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/massBaptism/getUserMassBaptismForm/${massBaptismId}`,
        { withCredentials: true }
      );
      setBaptismDetails(response.data);
      console.log(response.data)
    } catch (err) {
      setError("Failed to fetch baptism details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/massBaptism/declineMassBaptism/${massBaptismId}`,
        { reason: cancelReason },
        { withCredentials: true }
      );
      setShowCancelModal(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to cancel the baptism.");
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "N/A";

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

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
      <Box sx={{ flex: 1, maxWidth: 1200, mx: "auto", p: 2 }}>
        <Typography variant="h4" gutterBottom>
          Mass Baptism Details
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          {/* Left: Main Info */}
          <Box
            sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Baptism Date */}
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Baptism Information
                </Typography>
                <Typography>
                  <strong>Baptism Date and Time:</strong>{" "}
                  {baptismDetails?.baptismDateTime?.date &&
                    baptismDetails?.baptismDateTime?.time
                    ? `${format(
                      new Date(baptismDetails.baptismDateTime.date),
                      "MMMM dd, yyyy"
                    )} at ${baptismDetails.baptismDateTime.time}`
                    : "N/A"}
                </Typography>

                <Typography>
                  <strong>Contact Number:</strong>{" "}
                  {baptismDetails?.phone || "N/A"}
                </Typography>
              </CardContent>
            </Card>

            {/* Child Info */}
            <Card>
              <CardContent>
                <Typography variant="h6">Child Details</Typography>
                <Typography>
                  <strong>Name:</strong>{" "}
                  {baptismDetails?.child?.fullName || "N/A"}
                </Typography>
                <Typography>
                  <strong>Birth Date:</strong>{" "}
                  {formatDate(baptismDetails?.child?.dateOfBirth)}
                </Typography>
                <Typography>
                  <strong>Place of Birth:</strong>{" "}
                  {baptismDetails?.child?.placeOfBirth || "N/A"}
                </Typography>
                <Typography>
                  <strong>Gender:</strong>{" "}
                  {baptismDetails?.child?.gender || "N/A"}
                </Typography>
              </CardContent>
            </Card>

            {/* Parents */}
            <Card>
              <CardContent>
                <Typography variant="h6">Parents</Typography>
                <Typography>
                  <strong>Father:</strong>{" "}
                  {baptismDetails?.parents?.fatherFullName || "N/A"}
                </Typography>
                <Typography>
                  <strong>Place of Father's Birth:</strong>{" "}
                  {baptismDetails?.parents?.placeOfFathersBirth || "N/A"}
                </Typography>
                <Typography>
                  <strong>Mother:</strong>{" "}
                  {baptismDetails?.parents?.motherFullName || "N/A"}
                </Typography>
                <Typography>
                  <strong>Place of Mother's Birth:</strong>{" "}
                  {baptismDetails?.parents?.placeOfMothersBirth || "N/A"}
                </Typography>
                <Typography>
                  <strong>Address:</strong>{" "}
                  {baptismDetails?.parents?.address || "N/A"}
                </Typography>
                <Typography>
                  <strong>Marriage Status:</strong>{" "}
                  {baptismDetails?.parents?.marriageStatus || "N/A"}
                </Typography>
              </CardContent>
            </Card>

            {/* Ninong/Ninang */}
            <Card>
              <CardContent>
                <Typography variant="h6">Ninong & Ninang</Typography>
                <Typography>
                  <strong>Ninong:</strong>{" "}
                  {baptismDetails?.ninong?.name || "N/A"}
                </Typography>
                <Typography>
                  <strong>Address:</strong>{" "}
                  {baptismDetails?.ninong?.address || "N/A"}
                </Typography>
                <Typography>
                  <strong>Religion:</strong>{" "}
                  {baptismDetails?.ninong?.religion || "N/A"}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography>
                  <strong>Ninang:</strong>{" "}
                  {baptismDetails?.ninang?.name || "N/A"}
                </Typography>
                <Typography>
                  <strong>Address:</strong>{" "}
                  {baptismDetails?.ninang?.address || "N/A"}
                </Typography>
                <Typography>
                  <strong>Religion:</strong>{" "}
                  {baptismDetails?.ninang?.religion || "N/A"}
                </Typography>
              </CardContent>
            </Card>

            {/* Additional Godparents */}
            <Card>
              <CardContent>
                <Typography variant="h6">Additional Godparents</Typography>
                {baptismDetails?.NinongGodparents?.length > 0 && (
                  <Box>
                    <Typography>
                      <strong>Other Ninongs:</strong>
                    </Typography>
                    {baptismDetails.NinongGodparents.map((g, i) => (
                      <Typography key={i}>• {g.name}</Typography>
                    ))}
                  </Box>
                )}
                {baptismDetails?.NinangGodparents?.length > 0 && (
                  <Box>
                    <Typography>
                      <strong>Other Ninangs:</strong>
                    </Typography>
                    {baptismDetails.NinangGodparents.map((g, i) => (
                      <Typography key={i}>• {g.name}</Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardContent>
                <Typography variant="h6">Documents</Typography>
                <Typography>
                  <strong>Birth Certificate:</strong>{" "}
                  {baptismDetails?.Docs?.birthCertificate?.url ? (
                    <a
                      href={baptismDetails.Docs.birthCertificate.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Typography>
                <Typography>
                  <strong>Marriage Certificate:</strong>{" "}
                  {baptismDetails?.Docs?.marriageCertificate?.url ? (
                    <a
                      href={baptismDetails.Docs.marriageCertificate.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Right: Checklist, Comments, Cancellation */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <MassBaptismChecklist massBaptismId={massBaptismId} />

            {/* Admin Comments */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admin Comments
                </Typography>
                {baptismDetails?.comments?.length > 0 ? (
                  baptismDetails.comments.map((comment, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {comment?.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString()
                          : ""}
                      </Typography>
                      <Typography>
                        <strong>Comment:</strong>{" "}
                        {comment?.selectedComment || "N/A"}
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

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admin Notes
                </Typography>
                {baptismDetails?.adminNotes?.length > 0 ? (
                  baptismDetails.adminNotes.map((note, index) => {
                    const priest = note.priest;
                    const priestName = priest
                      ? `${priest.title} ${priest.fullName}${priest.nickName ? ` (${priest.nickName})` : ""}`
                      : "Unknown Priest";

                    return (
                      <div key={index} className="admin-comment">
                        <p><strong>Priest:</strong> {priestName}</p>
                        {note.recordedBy && (
                          <p><strong>Recorded By:</strong> {note.recordedBy}</p>
                        )}
                        {note.bookNumber && (
                          <p><strong>Book Number:</strong> {note.bookNumber}</p>
                        )}
                        {note.pageNumber && (
                          <p><strong>Page Number:</strong> {note.pageNumber}</p>
                        )}
                        {note.lineNumber && (
                          <p><strong>Line Number:</strong> {note.lineNumber}</p>
                        )}
                        <hr />
                      </div>
                    );
                  })
                ) : (
                  <p>No additional notes available.</p>
                )}

              </CardContent>
            </Card>

            {/* Cancellation Details */}
            {baptismDetails?.binyagStatus === "Cancelled" &&
              baptismDetails?.cancellingReason && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="error" gutterBottom>
                      Cancellation Details
                    </Typography>
                    <Typography>
                      <strong>Cancelled By:</strong>{" "}
                      {baptismDetails.cancellingReason.user}
                    </Typography>
                    <Typography>
                      <strong>Reason:</strong>{" "}
                      {baptismDetails.cancellingReason.reason ||
                        "No reason provided."}
                    </Typography>
                  </CardContent>
                </Card>
              )}

            {/* Cancel Button */}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowCancelModal(true)}
                disabled={
                  baptismDetails?.binyagStatus === "Confirmed" ||
                  baptismDetails?.binyagStatus === "Cancelled"
                }
                fullWidth
              >
                Cancel Baptism
              </Button>
            </Box>

            {/* Cancellation Modal */}
            <Modal
              open={showCancelModal}
              onClose={() => setShowCancelModal(false)}
            >
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
                  Cancel Baptism
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
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MassBaptismDetails;
