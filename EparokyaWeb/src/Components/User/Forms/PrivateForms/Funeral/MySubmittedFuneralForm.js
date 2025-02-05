import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from "react-router-dom";

const MySubmittedFuneralForm = () => {
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { formId } = useParams();

    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const [comments, setComments] = useState([]);
    const [updatedFuneralDate, setUpdatedFuneralDate] = useState(funeralDetails?.funeralDate || "");
    const [priest, setPriest] = useState("");

    useEffect(() => {
        const fetchFuneralDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/getFuneralForm/${formId}`,
                    { withCredentials: true }
                );
                console.log("API Response:", response.data);
    
                if (response.data) {
                    setFuneralDetails(response.data);
                    setComments(response.data.comments || []);
                    setPriest(response.data.priest || "N/A");
    
                    if (response.data.funeralDate) {
                        setUpdatedFuneralDate(response.data.funeralDate);
                    }
                }
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to fetch funeral details.");
            } finally {
                setLoading(false);
            }
        };
    
        if (formId) fetchFuneralDetails(); // Only fetch if formId exists
    }, [formId]);
    


    const handleCancel = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/${funeralDetails._id}/declineFuneral`, null, {
                withCredentials: true,
            });
            alert("Funeral request cancelled.");
            navigate("/user/profile");
        } catch (error) {
            console.error("Error cancelling funeral:", error);
            alert("Failed to cancel the funeral request.");
        }
    };

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="wedding-details-page">
            <GuestSideBar />
            <div className="house-details-content">
                <div className="house-details-grid">
                    {/* Funeral Details Box */}
                    <div className="house-details-box">
                        <h3>Funeral Details</h3>
                        <div className="house-details-item">
                            <p><strong>Name:</strong> {funeralDetails?.name || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Age:</strong> {funeralDetails?.age || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Contact Person:</strong> {funeralDetails?.contactPerson || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Relationship:</strong> {funeralDetails?.relationship || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Phone:</strong> {funeralDetails?.phone || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Address:</strong> {funeralDetails?.address?.state || "N/A"}, {funeralDetails?.address?.country || "N/A"}, {funeralDetails?.address?.zip || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Place of Death:</strong> {funeralDetails?.placeOfDeath || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Date:</strong> {funeralDetails?.funeralDate ? new Date(funeralDetails.funeralDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Time:</strong> {funeralDetails?.funeraltime || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Service Type:</strong> {funeralDetails?.serviceType || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Priest Visit:</strong> {funeralDetails?.priestVisit || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Reason of Death:</strong> {funeralDetails?.reasonOfDeath || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Mass Date:</strong> {funeralDetails?.funeralMassDate ? new Date(funeralDetails.funeralMassDate).toLocaleDateString() : "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Mass Time:</strong> {funeralDetails?.funeralMasstime || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Mass:</strong> {funeralDetails?.funeralMass || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Funeral Status:</strong> {funeralDetails?.funeralStatus || "N/A"}</p>
                        </div>
                        <div className="house-details-item">
                            <p><strong>Confirmed At:</strong> {funeralDetails?.confirmedAt ? new Date(funeralDetails.confirmedAt).toLocaleDateString() : "N/A"}</p>
                        </div>
                        {funeralDetails?.placingOfPall?.by && (
                            <div className="house-details-item">
                                <p><strong>Placing of Pall by:</strong> {funeralDetails.placingOfPall.by}</p>
                            </div>
                        )}
                        {funeralDetails?.placingOfPall?.familyMembers?.length > 0 && (
                            <div className="house-details-item">
                                <p><strong>Family Members Placing Pall:</strong> {funeralDetails.placingOfPall.familyMembers.join(", ")}</p>
                            </div>
                        )}
                    </div>

                    {/* Death Certificate Section */}
                    <div className="house-details-box">
                        <h3>Death Certificate</h3>
                        {['deathCertificate'].map((doc, index) => (
                            <div key={index} className="house-details-item">
                                <p>{doc.replace(/([A-Z])/g, ' $1').trim()}:</p>
                                {funeralDetails?.[doc]?.url ? (
                                    <img
                                        src={funeralDetails[doc].url}
                                        alt={doc}
                                        style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "contain", cursor: "pointer" }}
                                        onClick={() => openModal(funeralDetails[doc].url)}
                                    />
                                ) : (
                                    "N/A"
                                )}
                            </div>
                        ))}
                    </div>


                    <div className="admin-comments-section">
                        <h3>Admin Comments</h3>
                        {comments && Array.isArray(comments) && comments.length > 0 ? (
                            comments.map((comment, index) => (

                                <div key={index} className="admin-comment">
                                    <p className="comment-date">
                                        {new Date(comment?.createdAt).toLocaleDateString()}
                                    </p>
                                    <p><strong>Comment:</strong> {comment?.selectedComment || "N/A"}</p>
                                    <p><strong>Additional Comment:</strong> {comment?.additionalComment || "N/A"}</p>
                                </div>
                            ))
                        ) : (
                            <p>No admin comments yet.</p>
                        )}
                    </div>

                    {/* Updated Funeral Date Section */}
                    <div className="blessing-date-box">
                        <h3>Updated Funeral Date</h3>
                        <p className="date">
                            {funeralDetails?.updatedFuneralDate ? new Date(funeralDetails.updatedFuneralDate).toLocaleDateString() : "N/A"}
                        </p>
                        {funeralDetails?.adminRescheduled?.reason && (
                            <div className="reschedule-reason">
                                <h3>Reason for Rescheduling</h3>
                                <p>{funeralDetails.adminRescheduled.reason}</p>
                            </div>
                        )}
                    </div>

                    {/* Priest Section */}
                    <div className="house-comments-section">
                        <h2>Priest</h2>
                        {funeralDetails?.Priest?.name ? (
                            <div className="admin-comment">
                                <p><strong>Priest:</strong> {funeralDetails.Priest.name}</p>
                            </div>
                        ) : (
                            <p>No priest.</p>
                        )}
                    </div>

                    {/* Cancel Button */}
                    <div className="button-container">
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default MySubmittedFuneralForm;