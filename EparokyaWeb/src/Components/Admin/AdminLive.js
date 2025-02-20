import { useState, useEffect } from "react";
import axios from "axios";

const AdminLive = () => {
    const [liveUrl, setLiveUrl] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [currentLive, setCurrentLive] = useState(null);

    useEffect(() => {
        fetchLiveVideo();
    }, []);

    // Fetch the current live video details
    const fetchLiveVideo = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/live`);
            if (response.data) {
                setCurrentLive(response.data);
                setLiveUrl(response.data.url);
                setTitle(response.data.title)
                setDescription(response.data.description);
            }
        } catch (error) {
            console.error("Error fetching live video", error);
        }
    };

    // Set or update the live video
    const handleSubmit = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/live`, { url: liveUrl, description, title });
            alert("Live link updated!");
            fetchLiveVideo();
        } catch (error) {
            console.error("Error updating live link", error);
        }
    };

    // Stop the live stream
    const handleStopLive = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/live`);
            alert("Live stream stopped!");
            setCurrentLive(null);
            setLiveUrl("");
            setDescription("");
        } catch (error) {
            console.error("Error stopping live stream", error);
        }
    };

    return (
        <div>
            <h2>Admin: Manage Live Video</h2>
            <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video Title"
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description"
            />
            <input
                type="text"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="Paste Facebook Live link here"
            />


            <button onClick={handleSubmit}>Go Live</button>
            {currentLive && <button onClick={handleStopLive} style={{ marginLeft: "10px" }}>Stop Live</button>}

            {/* Show live video preview */}
            {currentLive && (
                <div>
                    <h3>Live Preview</h3>
                    <p>{currentLive.description}</p>
                    <iframe
                        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(currentLive.url)}&show_text=false`}
                        width="600"
                        height="400"
                        allowFullScreen
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default AdminLive;
