import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import Modal from 'react-modal';

Modal.setAppElement('#root');


const BaptismDetails = () => {
    const { baptismId } = useParams();
    const navigate = useNavigate();
    const [baptismDetails, setBaptismDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priest, setPriest] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedComment, setSelectedComment] = useState("");
    const [additionalComment, setAdditionalComment] = useState("");
    const [comments, setComments] = useState([]);

    const [zoom, setZoom] = useState(1);
      const [offset, setOffset] = useState({ x: 0, y: 0 });
      const [isDragging, setIsDragging] = useState(false);
      const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [selectedImage, setSelectedImage] = useState("");

    const predefinedComments = [
        "Confirmed and on schedule",
        "Rescheduled - awaiting response",
        "Pending final confirmation",
        "Cancelled by user",
    ];

    useEffect(() => {
        const fetchBaptismDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getBaptism/${baptismId}`,
                    { withCredentials: true });

                setBaptismDetails(response.data);
                setSelectedDate(response.data.baptismDate || "");
                setComments(response.data.comments || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch baptism details");
            } finally {
                setLoading(false);
            }
        };
        fetchBaptismDetails();
    }, [baptismId]);

    const openModal = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setSelectedImage("");
        setIsModalOpen(false);
      };
    
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;
    
    
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

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
        const newComment = {
            priest,
            scheduledDate: selectedDate,
            selectedComment,
            additionalComment,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/binyag/${baptismId}/admin/addComment`,
                newComment,
            );
            setComments([...comments, response.data]);
            setPriest("");
            setSelectedDate("");
            setSelectedComment("");
            setAdditionalComment("");
            alert("Comment submitted.");
        } catch (error) {
            console.error("Error submitting comment:", error.response || error);
            alert("Failed to submit the comment.");
        }
    };

    const handleConfirm = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/binyag/${baptismId}/confirm`,
                
                {withCredentials: true},
            );
            alert(response.data.message);
            navigate("/baptism-list");
        } catch (error) {
            console.error("Error confirming baptism:", error.response || error);
            alert("Failed to confirm the baptism.");
        }
    };

    const handleDecline = async () => {
        const token = localStorage.getItem("jwt");
        try {
        await axios.post(`${process.env.REACT_APP_API}/binyag/decline/${baptismId}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Baptism declined.");
            navigate("/baptism-list");
        } catch (error) {
            alert("Failed to decline the baptism.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="baptism-details-page">
            <SideBar />
            <div className="baptism-details">
                <h2>Baptism Details</h2>
                <div>
                    <p>User: {baptismDetails?.userId?.name || "N/A"}</p>
                    <p>Child Name: {baptismDetails?.child?.fullName || "N/A"}</p>
                    <p>
                        Birthdate:{" "}
                        {baptismDetails?.child?.dateOfBirth
                            ? new Date(baptismDetails.child.dateOfBirth).toLocaleDateString()
                            : "N/A"}
                    </p>
                    <p>Gender: {baptismDetails?.child?.gender || "N/A"}</p>
                    <p>Father: {baptismDetails?.parents?.fatherFullName || "N/A"}</p>
                    <p>Mother: {baptismDetails?.parents?.motherFullName || "N/A"}</p>
                    <p>
                        Godparents:{" "}
                        {baptismDetails?.godparents?.map((gp) => gp.name).join(", ") || "N/A"}
                    </p>
                    <p>
                        Baptism Date:{" "}
                        {baptismDetails?.baptismDate
                            ? new Date(baptismDetails.baptismDate).toLocaleDateString()
                            : "N/A"}
                    </p>
                    <p>Status: {baptismDetails?.binyagStatus || "Pending"}</p>
                </div>

                <form onSubmit={handleSubmitComment}>
                    <h3>Add Comment</h3>
                    <label>
                        Priest Name:
                        <input
                            type="text"
                            value={priest}
                            onChange={(e) => setPriest(e.target.value)}
                        />
                    </label>
                    <label>
                        Scheduled Date:
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </label>
                    <label>
                        Predefined Comment:
                        <select
                            value={selectedComment}
                            onChange={(e) => setSelectedComment(e.target.value)}
                        >
                            <option value="">Select a comment</option>
                            {predefinedComments.map((comment, index) => (
                                <option key={index} value={comment}>
                                    {comment}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Additional Comment:
                        <textarea
                            value={additionalComment}
                            onChange={(e) => setAdditionalComment(e.target.value)}
                        />
                    </label>
                    <button type="submit">Submit Comment</button>
                </form>

                <h3>Comments</h3>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>
                            <p>Priest: {comment.priest}</p>
                            <p>
                                Scheduled Date:{" "}
                                {comment.scheduledDate
                                    ? new Date(comment.scheduledDate).toLocaleDateString()
                                    : "Not set"}
                            </p>
                            <p>Selected Comment: {comment.selectedComment}</p>
                            <p>Additional Comment: {comment.additionalComment}</p>
                        </li>
                    ))}
                </ul>

                <div className="actions">
                    <button onClick={handleConfirm}>Confirm</button>
                    <button onClick={handleDecline}>Decline</button>
                </div>
            </div>
        </div>
    );
};

export default BaptismDetails;
