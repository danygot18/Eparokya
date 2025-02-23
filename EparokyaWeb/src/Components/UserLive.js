import { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";

const UserLive = () => {
    const [liveData, setLiveData] = useState(null);

    useEffect(() => {
        const fetchLiveVideo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/live`);
                setLiveData(response.data);
            } catch (error) {
                console.error("Error fetching live video", error);
            }
        };
        fetchLiveVideo();
    }, []);

    return (
        <div style={styles.liveContainer}>
            <MetaData title="Live" />

            {/* Sidebar */}
            <div style={styles.sidebarContainer}>
                <GuestSideBar />
            </div>

            {/* Live Video Section */}
            <div style={styles.liveContent}>
                <h2 style={styles.title}>Live Video</h2>
                {liveData ? (
                    <div style={styles.videoWrapper}>
                        <h3 style={styles.description}>{liveData.description}</h3>
                        <div style={styles.videoContainer}>
                            <iframe
                                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(liveData.url)}&show_text=false`}
                                width="600"
                                height="400"
                                allowFullScreen
                                style={styles.iframe}
                            ></iframe>
                        </div>
                    </div>
                ) : (
                    <p style={styles.noVideoText}>No live video available</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    liveContainer: {
        display: "flex",
        height: "100vh",
        backgroundColor: "#f9f9f9",
    },
    sidebarContainer: {
        width: "10%",
    },
    liveContent: {
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "16px",
    },
    videoWrapper: {
        textAlign: "center",
        
    },
    description: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "12px",
    },
    videoContainer: {
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    },
    iframe: {
        borderRadius: "8px",
        border: "none",
    },
    noVideoText: {
        color: "gray",
    },
};

export default UserLive;
