import { useState, useEffect } from "react";
import axios from "axios";
import SideBar from "./SideBar";
import { Button, TextField, Typography, Stack, Paper, Box, Alert } from "@mui/material";
import MetaData from "../Layout/MetaData";
import { toast } from "react-toastify"

const AdminLive = () => {
    const [embedCode, setEmbedCode] = useState("");
    const [liveUrl, setLiveUrl] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [currentLive, setCurrentLive] = useState(null);
    const [error, setError] = useState("");

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
                setEmbedCode(response.data.embedCode || "");
                setTitle(response.data.title);
                setDescription(response.data.description);
            }
        } catch (error) {
            console.error("Error fetching live video", error);
        }
    };

    // Extract URL from embed code
    const extractUrlFromEmbed = (code) => {
        try {
            const urlMatch = code.match(/src="([^"]*)"/);
            if (!urlMatch || !urlMatch[1]) {
                setError("Invalid embed code format");
                return null;
            }

            const src = urlMatch[1];
            const urlMatchInSrc = src.match(/href=([^&]*)/);
            if (!urlMatchInSrc || !urlMatchInSrc[1]) {
                setError("Could not extract video URL from embed code");
                return null;
            }

            const decodedUrl = decodeURIComponent(urlMatchInSrc[1]);
            setError("");
            return decodedUrl;
        } catch (err) {
            setError("Error processing embed code");
            return null;
        }
    };

    const handleEmbedCodeChange = (e) => {
        const code = e.target.value;
        setEmbedCode(code);

        if (code.includes("facebook.com/plugins/video")) {
            const extractedUrl = extractUrlFromEmbed(code);
            if (extractedUrl) {
                setLiveUrl(extractedUrl);
            }
        }
    };

    // Set or update the live video
    const handleSubmit = async () => {
        if (!liveUrl) {
            setError("Please provide a valid Facebook video URL");
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API}/api/v1/live`, {
                url: liveUrl,
                embedCode,
                description,
                title
            });
            toast.success("Live link updated!");
            fetchLiveVideo();
        } catch (error) {
            console.error("Error updating live link", error);
            setError(error.response?.data?.message || "Error updating live link");
        }
    };

    // Stop the live stream
    const handleStopLive = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/live`);
            toast.warn("Live stream stopped!");
            setCurrentLive(null);
            setLiveUrl("");
            setEmbedCode("");
            setDescription("");
            setTitle("");
        } catch (error) {
            console.error("Error stopping live stream", error);
            setError(error.response?.data?.message || "Error stopping live stream");
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <SideBar />
            <MetaData title="Admin Live" />
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 3 }}>
                <Paper elevation={3} sx={{ padding: 3, width: "100%", maxWidth: 900 }}>
                    <Typography variant="h5" gutterBottom>
                        Admin: Manage Live Video
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                            label="Facebook Embed Code"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={embedCode}
                            onChange={handleEmbedCodeChange}
                            placeholder="Paste Facebook embed code here"
                        />
                        <TextField
                            label="Extracted Video URL"
                            variant="outlined"
                            fullWidth
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            disabled
                        />
                    </Stack>

                    <Stack direction="row" spacing={2} mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            sx={{ fontSize: "1rem", padding: "8px 16px" }}
                        >
                            {currentLive ? "Update Live" : "Go Live"}
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
                        <Box mt={3}>
                            <Typography variant="h6">Live Preview</Typography>
                            <Typography variant="body2">{currentLive.description}</Typography>
                            <div
                                dangerouslySetInnerHTML={{ __html: currentLive.embedCode }}
                                style={{ marginTop: "10px" }}
                            />
                            <iframe
                                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(currentLive.url)}&width=900&show_text=false&autoplay=1`}
                                width="100%"
                                height="415"
                                allowFullScreen
                                title="Live Video Preview"
                                style={{ marginTop: "10px" }}
                            ></iframe>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default AdminLive;