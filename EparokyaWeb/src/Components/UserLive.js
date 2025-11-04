import { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "./GuestSideBar";
import MetaData from "./Layout/MetaData";
import { Box, Typography, CircularProgress, Paper, Drawer } from "@mui/material";
import { useMediaQuery } from "@mui/material";

const UserLive = () => {
    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSidePanel, setShowSidePanel] = useState(false);

    const isMobile = useMediaQuery("(max-width: 768px)");
    useEffect(() => {
        const fetchLiveVideo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/live`);
                setLiveData(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error("Error fetching live video", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLiveVideo();
    }, []);

    return (
        <Box >
            {isMobile && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "10px",
                    }}
                >
                    {/* Left-side button (existing) */}
                    <button
                        onClick={() => setShowSidePanel(!showSidePanel)}
                        style={{
                            background: "none",
                            border: "none",
                            fontSize: "14px",
                            cursor: "pointer",
                        }}
                    >
                        ☰
                    </button>


                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {isMobile && showSidePanel && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowSidePanel(false)} // close when clicking outside
                >
                    <div>

                        <div>
                            <GuestSideBar />
                        </div>
                    </div>
                </div>
            )}

            <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f9f9f9" }}>
                <MetaData title="Live" />

                {/* Sidebar */}
                {!isMobile && (
                    <div>
                        <GuestSideBar />
                    </div>
                )}
                {/* Main Content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                    >
                        Live Mass
                    </Typography>

                    {loading ? (
                        <CircularProgress />
                    ) : liveData ? (
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                textAlign: "center",
                                borderRadius: 2,
                                width: "100%",
                                maxWidth: 1200,
                                height: { xs: "auto", md: 830 },
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight="600"
                                gutterBottom
                                sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                            >
                                {liveData.description}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                    wordBreak: "break-word",
                                }}
                            >
                                For better experience, watch on Facebook:{" "}
                                <a
                                    href={liveData.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#1976d2", wordBreak: "break-all" }}
                                >
                                    {liveData.url}
                                </a>
                            </Typography>

                            <Box
                                mt={3}
                                sx={{
                                    width: "100%",
                                    height: { xs: 250, sm: 400, md: 700 },
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <iframe
                                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
                                        liveData.url
                                    )}&show_text=false`}
                                    width="100%"
                                    height="100%"
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    style={{
                                        border: "none",
                                        marginTop: "10px",
                                        display: "block",
                                        borderRadius: "8px",
                                    }}
                                ></iframe>
                            </Box>
                        </Paper>
                    ) : (
                        <Typography color="gray">No live video available</Typography>
                    )}
                </Box>

            </Box>
        </Box>
    );
};

export default UserLive;
