import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useParams } from "react-router-dom";
import UserBaptismChecklist from "./UserBaptismChecklist";
import "./MySubmittedBaptismForm.css";

Modal.setAppElement("#root");

const MySubmittedBaptismForm = () => {
  const navigate = useNavigate();
  const { baptismId } = useParams();
  const [baptismDetails, setBaptismDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [comments, setComments] = useState([]);
  const [updatedBaptismDate, setUpdatedBaptismDate] = useState(
    baptismDetails?.baptismDate || ""
  );
  const [adminNotes, setAdminNotes] = useState([]);
  const { formId } = useParams();

  const [checklist, setChecklist] = useState({
    PhotocopyOfBirthCertificate: false,
    PhotocopyOfMarriageCertificate: false,
    BaptismalPermit: false,
    CertificateOfNoRecordBaptism: false,
    PreBaptismSeminar1: false,
    PreBaptismSeminar2: false,
  });

  // useEffect(() => {
  //     const fetchChecklist = async () => {
  //         if (baptismId) {
  //             try {
  //                 const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getBaptismChecklist/${formId}`, { withCredentials: true });
  //                 console.log("Checklist:", response.data);

  //                 if (response.data.checklist) {
  //                     setChecklist(response.data.checklist);
  //                     console.log("Updated Checklist State:", response.data.checklist);
  //                 }
  //                 console.log("Checklist:", response.data.checklist);
  //             } catch (err) {
  //                 console.error("Error fetching checklist:", err);
  //             }
  //         }
  //     };

  //     fetchChecklist();

  // }, [baptismId]);
  // console.log("Baptism ID:", formId);

  useEffect(() => {
    const fetchBaptismDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedBaptism`,
          { withCredentials: true }
        );

        if (response.data) {
          setBaptismDetails(response.data);
          setAdminNotes(response.data.adminNotes);
          setComments(response.data.comments || []);

          if (response.data.baptismDate) {
            setUpdatedBaptismDate(response.data.baptismDate);
          }
        } else {
          setBaptismDetails(null);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setBaptismDetails(null);
        } else {
          console.error("API Error:", err);
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (formId) fetchBaptismDetails();
  }, [formId]);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setIsModalOpen(false);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCancel = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/${baptismDetails._id}/declineBaptism`,
        null,
        {
          withCredentials: true,
        }
      );
      alert("Baptism request cancelled.");
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Error cancelling baptism:", error);
      alert("Failed to cancel the baptism request.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!baptismDetails) return <div>No baptism form submitted yet.</div>;

  return (
    <div className="baptism-details-page">
      <GuestSideBar />
      <div className="baptism-details-container">
        <h2>My Submitted Baptism Form</h2>

        {/* Two Containers */}
        <div className="two-container-layout">
          {/* Left Container */}
          <div className="left-container">
            <div className="details-section">
              <h3>User Information</h3>
              <p>
                <strong>User:</strong> {baptismDetails?.userId?.name || "N/A"}
              </p>
              <p>
                <strong>Contact Number:</strong>{" "}
                {baptismDetails?.phone || "N/A"}
              </p>
            </div>
            <div className="details-section">
              <h3>Baptism Information</h3>
              <p>
                <strong>Baptism Date:</strong>{" "}
                {baptismDetails?.baptismDate
                  ? new Date(baptismDetails.baptismDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Baptism Time:</strong>{" "}
                {baptismDetails?.baptismTime || "N/A"}
              </p>
            </div>
            <div className="details-section">
              <h3>Child Information</h3>
              <p>
                <strong>Child Name:</strong>{" "}
                {baptismDetails?.child?.fullName || "N/A"}
              </p>
              <p>
                <strong>Birthdate:</strong>{" "}
                {baptismDetails?.child?.dateOfBirth
                  ? new Date(
                      baptismDetails.child.dateOfBirth
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Sex:</strong> {baptismDetails?.child?.gender || "N/A"}
              </p>
            </div>
          </div>

          {/* Right Container */}
          <div className="right-container">
            <div className="details-section">
              <h3>Parents Information</h3>
              <p>
                <strong>Father:</strong>{" "}
                {baptismDetails?.parents?.fatherFullName || "N/A"}
              </p>
              <p>
                <strong>Father's Place of Birth:</strong>{" "}
                {baptismDetails?.parents?.placeOfFathersBirth || "N/A"}
              </p>
              <p>
                <strong>Mother:</strong>{" "}
                {baptismDetails?.parents?.motherFullName || "N/A"}
              </p>
              <p>
                <strong>Mother's Place of Birth:</strong>{" "}
                {baptismDetails?.parents?.placeOfMothersBirth || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {baptismDetails?.parents?.address || "N/A"}
              </p>
              <p>
                <strong>Marriage Status:</strong>{" "}
                {baptismDetails?.parents?.marriageStatus || "N/A"}
              </p>
            </div>
            <div className="details-section">
              <h3>Godparents Information</h3>
              <p>
                <strong>Primary Ninong:</strong>{" "}
                {baptismDetails?.ninong?.name || "N/A"}
              </p>
              <p>
                <strong>Primary Ninong Address:</strong>{" "}
                {baptismDetails?.ninong?.address || "N/A"}
              </p>
              <p>
                <strong>Primary Ninong Religion:</strong>{" "}
                {baptismDetails?.ninong?.religion || "N/A"}
              </p>
              <p>
                <strong>Primary Ninang:</strong>{" "}
                {baptismDetails?.ninang?.name || "N/A"}
              </p>
              <p>
                <strong>Primary Ninang Address:</strong>{" "}
                {baptismDetails?.ninang?.address || "N/A"}
              </p>
              <p>
                <strong>Primary Ninang Religion:</strong>{" "}
                {baptismDetails?.ninang?.religion || "N/A"}
              </p>
              <p>
                <strong>Ninong:</strong>{" "}
                {baptismDetails?.NinongGodparents?.map((gp) => gp.name).join(
                  ", "
                ) || "N/A"}
              </p>
              <p>
                <strong>Ninang:</strong>{" "}
                {baptismDetails?.NinangGodparents?.map((gp) => gp.name).join(
                  ", "
                ) || "N/A"}
              </p>
            </div>
          </div>
          <div className="third-container ">
            <div className="details-section-container">
              {/* Add other sections here */}
              <div className="details-box">
                <h3>Baptismal Documents</h3>
                {["birthCertificate", "marriageCertificate"].map(
                  (doc, index) => (
                    <div key={index} className="grid-row">
                      <p>{doc.replace(/([A-Z])/g, " $1").trim()}:</p>
                      {baptismDetails?.Docs?.[doc]?.url ? (
                        <img
                          src={baptismDetails.Docs[doc].url}
                          alt={doc}
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "contain",
                            cursor: "pointer",
                          }}
                          onClick={() => openModal(baptismDetails.Docs.url)}
                        />
                      ) : (
                        "N/A"
                      )}
                    </div>
                  )
                )}
              </div>
              <div className="details-box">
                <h2>Additional Notes</h2>
                {baptismDetails?.adminNotes?.length > 0 ? (
                  (() => {
                    const latestAdminNote =
                      baptismDetails.adminNotes[
                        baptismDetails.adminNotes.length - 1
                      ]; // Get the latest entry

                    return (
                      <div className="admin-comment">
                        <p>
                          <strong>Priest:</strong>{" "}
                          {latestAdminNote.priest || "No priest"}
                        </p>
                        <p>
                          <strong>Recorded By:</strong>{" "}
                          {latestAdminNote.recordedBy || "No record"}
                        </p>
                        <p>
                          <strong>Book Number:</strong>{" "}
                          {latestAdminNote.bookNumber || "No book number"}
                        </p>
                        <p>
                          <strong>Page Number:</strong>{" "}
                          {latestAdminNote.pageNumber || "No page number"}
                        </p>
                        <p>
                          <strong>Line Number:</strong>{" "}
                          {latestAdminNote.lineNumber || "No line number"}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <p>No admin notes available.</p>
                )}
              </div>

              {/* for Rescheduling */}
              <div className="wedding-date-box">
                <h3>Updated Baptism Date</h3>
                <p className="date">
                  {baptismDetails?.adminRescheduled
                    ? new Date(
                        baptismDetails.adminRescheduled.date
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

                {baptismDetails?.adminRescheduled?.reason && (
                  <div className="reschedule-reason">
                    <h3>Reason for Rescheduling</h3>
                    <p>{baptismDetails.adminRescheduled.reason}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button onClick={handleCancel} className="cancel-button">
            Cancel Baptism Request
          </button>
        </div>
        <div className="baptism-checklist-container">
          <UserBaptismChecklist baptismId={formId} />
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Image Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
            content: {
              maxWidth: "500px",
              margin: "auto",
              padding: "20px",
              textAlign: "center",
            },
          }}
        >
          <div className="modal-header">
            <button onClick={closeModal} className="modal-close-button">
              Close
            </button>
            <div className="zoom-controls">
              <button
                onClick={() =>
                  setZoom((prevZoom) => Math.min(prevZoom + 0.1, 3))
                }
                className="zoom-button"
              >
                Zoom In
              </button>
              <button
                onClick={() =>
                  setZoom((prevZoom) => Math.max(prevZoom - 0.1, 1))
                }
                className="zoom-button"
              >
                Zoom Out
              </button>
            </div>
          </div>
          <div
            className="modal-image-container"
            onMouseDown={(e) => handleMouseDown(e)}
            onMouseMove={(e) => handleMouseMove(e)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={selectedImage}
              alt="Certificate Preview"
              className="modal-image"
              style={{
                // transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                // transition: isDragging ? "none" : "transform 0.3s ease",
                transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
                transition: isDragging ? "none" : "transform 0.3s ease",
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                cursor: isDragging ? "grabbing" : "grab",
              }}
              draggable={false}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MySubmittedBaptismForm;
