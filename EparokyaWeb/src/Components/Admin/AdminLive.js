import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "./SideBar";
import { Button, TextField, Typography, Stack, Paper, Box } from "@mui/material";

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
                setTitle(response.data.title);
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
            setTitle("");
        } catch (error) {
            console.error("Error stopping live stream", error);
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <SideBar />

            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
                <Paper elevation={3} sx={{ padding: 3, width: "100%", maxWidth: 900 }}>
                    <Typography variant="h5" gutterBottom>
                        Admin: Manage Live Video
                    </Typography>

                    <Stack spacing={2}>
                        <TextField
                            label="Video Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Video Description"
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            label="Facebook Live Link"
                            variant="outlined"
                            fullWidth
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                        />
                    </Stack>

                    <Stack direction="row" spacing={2} mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ fontSize: "1rem", padding: "8px 16px" }}
                        >
                            Go Live
                        </Button>
                        {currentLive && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleStopLive}
                                sx={{ fontSize: "1rem", padding: "8px 16px" }}
                            >
                                Stop Live
                            </Button>
                        )}
                    </Stack>

                    {/* Show live video preview */}
                    {currentLive && (
                        <Box
                            mt={3}
                            sx={{ width: "100%",  justifyContent: "center", overflow: "hidden" }}
                        >
                            <Typography variant="h6">Live Preview</Typography>
                            <Typography variant="body2">{currentLive.description}</Typography>
                            <iframe
                                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(currentLive.url)}&width=900&show_text=false&autoplay=1`}
                                width="100%"
                                height="400"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{ border: "none", marginTop: "10px", display: "block" }}
                            ></iframe>

                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminLive;
