import { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";
import { Box, Typography, CircularProgress, Paper, Drawer } from "@mui/material";

const UserLive = () => {
    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveVideo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/live`);
                setLiveData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching live video", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveVideo();
    }, []);

    return (
        <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}>
            <MetaData title="Live" />

            {/* Sidebar */}

            <GuestSideBar />


            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Live Mass
                </Typography>

                {loading ? (
                    <CircularProgress />
                ) : liveData ? (
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center", borderRadius: 2, width: "100%", maxWidth: 900 }}>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            {liveData.description}
                        </Typography>
                        <Box mt={3}
                            sx={{ width: "100%", justifyContent: "center", overflow: "hidden" }}
                        >
                            <iframe
                                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(liveData.url)}&show_text=false`}
                                width="100%"
                                height="400"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ border: "none", marginTop: "10px", display: "block" }}
                            ></iframe>
                        </Box>

                        <Typography padding={2}>
                            For better experience, watch on Facebook:
                            <a href={liveData.url} target="_blank" rel="noopener noreferrer">
                                {liveData.url}
                            </a>
                        </Typography>
                    </Paper>
                ) : (
                    <Typography color="gray">No live video available</Typography>
                )}
            </Box>
        </Box>
    );
};

export default UserLive;
