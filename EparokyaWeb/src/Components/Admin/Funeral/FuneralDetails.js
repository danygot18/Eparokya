import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import "../../Layout/styles/style.css";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import 'react-datetime-picker/dist/DateTimePicker.css';

Modal.setAppElement("#root");

const FuneralDetails = () => {
    const { funeralId } = useParams();
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [priest, setPriest] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedComment, setSelectedComment] = useState("");
    const [rescheduledDate, setRescheduledDate] = useState("");
    const [rescheduledReason, setRescheduledReason] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deathCertificateImage, setDeathCertificateImage] = useState("");
    const [imageUrl, setImageUrl] = useState(null);


    const predefinedComments = [
        "Confirmed",
        "Pending Confirmation",
        "Rescheduled",
        "Cancelled",
    ];

    useEffect(() => {
        const fetchFuneralDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getFuneral/${funeralId}`,
                    { withCredentials: true }
                );
                setFuneralDetails(response.data);
                setComments(response.data.comments || []);
                setDeathCertificateImage(response.data.deathCertificate || "");  // Assume `deathCertificate` field contains image URL
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch funeral details.");
            } finally {
                setLoading(false);
            }
        };
        fetchFuneralDetails();
    }, [funeralId]);

    const handleSubmitComment = () => {
        console.log({
            priest,
            selectedDate,
            selectedComment,
            rescheduledDate,
            rescheduledReason,
            additionalComment,
        });
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="funeral-details-container">
            <SideBar />
            <div className="funeral-details-content">
                <h1>Funeral Details</h1>
                <div className="details">
                    <p>Name: {funeralDetails?.name || "N/A"}</p>
                    <p>Age: {funeralDetails?.age || "N/A"}</p>
                    <p>Contact Person: {funeralDetails?.contactPerson || "N/A"}</p>
                    <p>Relationship: {funeralDetails?.relationship || "N/A"}</p>
                    <p>Phone: {funeralDetails?.phone || "N/A"}</p>
                    <p>Address: {funeralDetails?.address?.state || "N/A"}, {funeralDetails?.address?.country || "N/A"}, {funeralDetails?.address?.zip || "N/A"}</p>
                    <p>Place of Death: {funeralDetails?.placeOfDeath || "N/A"}</p>
                    <p>Funeral Date: {funeralDetails?.funeralDate ? new Date(funeralDetails.funeralDate).toLocaleDateString() : "N/A"}</p>
                    <p>Time: {funeralDetails?.funeraltime || "N/A"}</p>
                    <p>Service Type: {funeralDetails?.serviceType || "N/A"}</p>
                    <p>Priest Visit: {funeralDetails?.priestVisit || "N/A"}</p>
                    <p>Reason of Death: {funeralDetails?.reasonOfDeath || "N/A"}</p>
                    <p>Funeral Mass Date: {funeralDetails?.funeralMassDate ? new Date(funeralDetails.funeralMassDate).toLocaleDateString() : "N/A"}</p>
                    <p>Funeral Mass Time: {funeralDetails?.funeralMasstime || "N/A"}</p>
                    <p>Funeral Mass: {funeralDetails?.funeralMass || "N/A"}</p>
                    <p>Funeral Status: {funeralDetails?.funeralStatus || "N/A"}</p>
                    <p>Confirmed At: {funeralDetails?.confirmedAt ? new Date(funeralDetails.confirmedAt).toLocaleDateString() : "N/A"}</p>
                    {funeralDetails?.placingOfPall?.by && (
                        <p>Placing of Pall by: {funeralDetails.placingOfPall.by}</p>
                    )}
                    {funeralDetails?.placingOfPall?.familyMembers?.length > 0 && (
                        <p>Family Members Placing Pall: {funeralDetails.placingOfPall.familyMembers.join(", ")}</p>
                    )}
                </div>

                {funeralDetails?.deathCertificate && (
                    <div className="death-certificate-container">
                        <img
                            src={funeralDetails.deathCertificate}
                            alt="Death Certificate"
                            onClick={() => {
                                setImageUrl(funeralDetails.deathCertificate);
                                setIsModalOpen(true);
                            }}
                            className="death-certificate-thumbnail"
                        />
                    </div>
                )}

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Death Certificate Preview"
                    className="modal"
                    overlayClassName="overlay"
                >
                    <button onClick={() => setIsModalOpen(false)} className="close-modal-button">Close</button>
                    <div className="modal-content">
                        <img
                            src={imageUrl}
                            alt="Death Certificate"
                            className="death-certificate-modal-image"
                        />
                    </div>
                </Modal>


                <div className="admin-comments-section">
                    <h2>Admin Comments</h2>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="admin-comment">
                                <p><strong>Priest:</strong> {comment?.priest || "N/A"}</p>
                                <p><strong>Scheduled Date:</strong> {comment?.scheduledDate ? new Date(comment.scheduledDate).toLocaleDateString() : "Not set"}</p>
                                <p><strong>Selected Comment:</strong> {comment?.selectedComment || "N/A"}</p>
                                <p><strong>Additional Comment:</strong> {comment?.additionalComment || "N/A"}</p>
                                {comment?.adminRescheduled?.date && (
                                    <p><strong>Rescheduled Date:</strong> {new Date(comment.adminRescheduled.date).toLocaleDateString()}</p>
                                )}
                                {comment?.adminRescheduled?.reason && (
                                    <p><strong>Reason for Rescheduling:</strong> {comment.adminRescheduled.reason}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No admin comments yet.</p>
                    )}
                </div>

                <div className="admin-section">
                    <h2>Submit Admin Comment</h2>
                    <input
                        type="text"
                        placeholder="Priest Name"
                        value={priest}
                        onChange={(e) => setPriest(e.target.value)}
                    />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <select
                        value={selectedComment}
                        onChange={(e) => setSelectedComment(e.target.value)}
                    >
                        <option value="" disabled>Select a comment</option>
                        {predefinedComments.map((comment, index) => (
                            <option key={index} value={comment}>{comment}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        placeholder="Rescheduled Date (optional)"
                        value={rescheduledDate}
                        onChange={(e) => setRescheduledDate(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Reason for Rescheduling"
                        value={rescheduledReason}
                        onChange={(e) => setRescheduledReason(e.target.value)}
                    />
                    <textarea
                        placeholder="Additional Comments"
                        value={additionalComment}
                        onChange={(e) => setAdditionalComment(e.target.value)}
                    />
                    <button onClick={handleSubmitComment}>Submit Comment</button>
                </div>
            </div>
        </div>
    );
};

export default FuneralDetails;
