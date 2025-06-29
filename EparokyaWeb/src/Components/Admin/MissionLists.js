import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Typography,
    CircularProgress,
    Stack,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MissionList = () => {
    const [missions, setMissions] = useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [missionToDelete, setMissionToDelete] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllMissions`,
                { withCredentials: true });
            setMissions(response.data || []);
        } catch (error) {
            toast.error("Error fetching missions.");
            setMissions([]);
        }
    };

    const handleOpenDeleteDialog = (id) => {
        setMissionToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setMissionToDelete(null);
    };

    const handleDeleteMission = async () => {
        if (!missionToDelete) return;
        try {
            setDeleteLoading(true);
            await axios.delete(`${process.env.REACT_APP_API}/api/deleteMission/${missionToDelete}`);
            setMissions(missions.filter((m) => m._id !== missionToDelete));
            toast.success("Mission deleted successfully!");
        } catch (error) {
            toast.error("Error deleting mission.");
        } finally {
            setDeleteLoading(false);
            handleCloseDeleteDialog();
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            <ToastContainer position="top-right" autoClose={2000} />
            <SideBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        textAlign: "center",
                        mb: 3,
                        fontWeight: "bold",
                        color: "text.primary",
                    }}
                >
                    Missions
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr",
                            md: "1fr 1fr",
                        },
                        gap: 3,
                        width: "100%",
                        maxWidth: "1200px",
                        mx: "auto",
                    }}
                >
                    {missions.map((mission) => (
                        <Card
                            key={mission._id}
                            sx={{
                                borderRadius: 2,
                                boxShadow: 3,
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                },
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar
                                        src="/EPAROKYA-SYST.png"
                                        alt="Saint Joseph Parish"
                                        sx={{ width: 56, height: 56 }}
                                    />
                                }
                                action={
                                    <Box>
                                        <IconButton
                                            onClick={() => navigate(`/admin/updateMission/${mission._id}`)}
                                        >
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDeleteDialog(mission._id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Box>
                                }
                                title={mission.Title}
                                subheader={
                                    <Typography variant="caption" color="text.secondary">
                                        {mission.Date
                                            ? new Date(mission.Date).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : ""}
                                        {mission.Time ? ` • ${mission.Time}` : ""}
                                    </Typography>
                                }
                                sx={{
                                    alignItems: "flex-start",
                                    "& .MuiCardHeader-content": {
                                        overflow: "hidden",
                                    },
                                }}
                            />

                            <CardContent sx={{ flexGrow: 1, py: 1 }}>
                                <Typography variant="body1" paragraph>
                                    {mission.Description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    <b>Location:</b> {mission.Location}
                                </Typography>
                                {mission.Image?.single && (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2">Main Image:</Typography>
                                        <img
                                            src={mission.Image.single}
                                            alt="Main"
                                            style={{
                                                height: 120,
                                                width: "auto",
                                                borderRadius: 8,
                                                cursor: "pointer",
                                                marginBottom: 8,
                                            }}
                                            onClick={() => setPreviewImage(mission.Image.single)}
                                        />
                                    </Box>
                                )}
                                {mission.Image?.multiple?.length > 0 && (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography variant="subtitle2">Gallery:</Typography>
                                        <Stack direction="row" spacing={1} sx={{ overflowX: "auto" }}>
                                            {mission.Image.multiple.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Gallery ${idx + 1}`}
                                                    style={{
                                                        height: 80,
                                                        width: "auto",
                                                        borderRadius: 6,
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() => setPreviewImage(img)}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    <b>Facilitators:</b>{" "}
                                    {mission.Facilitators && mission.Facilitators.length > 0
                                        ? mission.Facilitators.join(", ")
                                        : "None"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    <b>Volunteers:</b>{" "}
                                    {mission.Volunteers && mission.Volunteers.length > 0
                                        ? mission.Volunteers.join(", ")
                                        : "None"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    <b>Ministries:</b>{" "}
                                    {mission.Ministry && mission.Ministry.length > 0
                                        ? mission.Ministry.map((min, idx) =>
                                            typeof min === "object" && min.name
                                                ? min.name
                                                : min
                                        ).join(", ")
                                        : "None"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <b>Budget:</b> {mission.Budget || "N/A"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    <b>Budget From:</b> {mission.BudgetFrom || "N/A"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    <b>Author:</b>{" "}
                                    <span style={{ fontStyle: "italic" }}>{mission.Author}</span>
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this mission?
                            <br />
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseDeleteDialog}
                            disabled={deleteLoading}
                            color="primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteMission}
                            color="error"
                            autoFocus
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Image Preview Modal */}
                {previewImage && (
                    <Box
                        onClick={() => setPreviewImage(null)}
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1300,
                            cursor: "zoom-out",
                        }}
                    >
                        <Box
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                                overflow: "hidden",
                                maxWidth: "90%",
                                maxHeight: "90%",
                            }}
                        >
                            <img
                                src={previewImage}
                                alt="Zoomed Preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    userSelect: "none",
                                }}
                                draggable={false}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MissionList;