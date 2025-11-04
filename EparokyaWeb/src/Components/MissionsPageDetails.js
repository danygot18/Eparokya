import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Stack,
    Avatar,
    Grid,
    Pagination,
    Divider,
    useMediaQuery
} from "@mui/material";
import GuestSidebar from "./GuestSideBar";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MISSIONS_PER_PAGE = 6;

const formatMissionTime = (rawTime) => {
    if (!rawTime) return "N/A";

    try {
        let date;
        if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
            const today = new Date();
            const [hours, minutes] = rawTime.split(':');
            date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), +hours, +minutes);
        } else {
            date = new Date(rawTime);
        }

        if (isNaN(date.getTime())) {
            console.warn("Invalid baptismTime:", rawTime);
            return "N/A";
        }

        return format(date, 'h:mm a');
    } catch (e) {
        console.error("Error parsing baptismTime:", rawTime, e);
        return "N/A";
    }
};

const MissionsPageDetails = () => {
    const { id } = useParams();
    const [mission, setMission] = useState(null);
    const [otherMissions, setOtherMissions] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const [showSidePanel, setShowSidePanel] = useState(false);

    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const fetchMission = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/getMissionById/${id}`);
                setMission(res.data);
                console.log(res.data)
            } catch (err) {
                setMission(null);
            }
        };
        fetchMission();
    }, [id]);

    useEffect(() => {
        const fetchOtherMissions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllMissions`);
                // Exclude the current mission and sort by createdAt descending
                const filtered = (res.data || [])
                    .filter((m) => m._id !== id)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setOtherMissions(filtered);
            } catch (err) {
                setOtherMissions([]);
            }
        };
        fetchOtherMissions();
    }, [id]);

    // Pagination for other missions
    const paginatedMissions = otherMissions.slice(
        (page - 1) * MISSIONS_PER_PAGE,
        page * MISSIONS_PER_PAGE
    );
    const pageCount = Math.ceil(otherMissions.length / MISSIONS_PER_PAGE);

    if (!mission) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                {!isMobile && (
                    <div>
                        <GuestSidebar />
                    </div>
                )}
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h5" color="text.secondary">
                        Loading ...
                    </Typography>
                </Box>
            </Box>
        );
    }

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
                            <GuestSidebar />
                        </div>
                    </div>
                </div>
            )}
            <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
                {!isMobile && (
                    <div>
                        <GuestSidebar />
                    </div>
                )}
                <Box sx={{ flexGrow: 1, p: { xs: 1, md: 4 }, maxWidth: 1000, mx: "auto" }}>
                    {/* Mission Details */}
                    <Card sx={{ mb: 4, boxShadow: 6, borderRadius: 3 }}>
                        {mission.Image?.single && (
                            <CardMedia
                                component="img"
                                image={mission.Image.single}
                                alt={mission.Title}
                                sx={{
                                    width: "100%",
                                    height: { xs: 220, md: 340 },
                                    objectFit: "cover",
                                    borderRadius: "16px 16px 0 0",
                                }}
                            />
                        )}
                        <CardContent>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                {mission.Title}
                            </Typography>
                            <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                                <Chip
                                    label={mission.Date ? new Date(mission.Date).toLocaleDateString() : ""}
                                    color="primary"
                                    size="small"
                                    avatar={<EventAvailableIcon />}
                                />
                                <Chip
                                    label={formatMissionTime(mission?.Time)}
                                    color="secondary"
                                    size="small"
                                    avatar={<AccessTimeFilledIcon />}
                                />
                                <Chip
                                    label={mission.Location}
                                    color="default"
                                    size="small"
                                    avatar={<LocationOnIcon />}
                                />
                                <Chip
                                    label={`By: ${mission.Author?.replace(/<i>|<\/i>/g, "")}`}
                                    size="small"
                                    avatar={<Avatar>{mission.Author?.replace(/<i>|<\/i>/g, "").charAt(0)}</Avatar>}
                                />
                            </Stack>
                            <Typography variant="body1" gutterBottom>
                                {mission.Description}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <b>Facilitators:</b> {mission.Facilitators?.join(", ") || "None"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <b>Volunteers:</b> {mission.Volunteers?.join(", ") || "None"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <b>Ministries:</b>{" "}
                                {mission.Ministry && mission.Ministry.length > 0
                                    ? mission.Ministry.map((min, idx) =>
                                        typeof min === "object" && min.name ? min.name : min
                                    ).join(", ")
                                    : "None"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <b>Budget: ₱</b> {mission.Budget || "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                <b>Budget From:</b> {mission.BudgetFrom || "N/A"}
                            </Typography>
                            {mission.Image?.multiple?.length > 0 && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Gallery:
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {mission.Image.multiple.map((img, idx) => (
                                            <Box
                                                key={idx}
                                                component="img"
                                                src={img}
                                                alt={`Gallery ${idx + 1}`}
                                                sx={{
                                                    width: 90,
                                                    height: 90,
                                                    objectFit: "cover",
                                                    borderRadius: 2,
                                                    mr: 1,
                                                    mb: 1,
                                                    border: "1px solid #eee",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Other Missions */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Other Missions
                        </Typography>
                        <Grid container spacing={2}>
                            {paginatedMissions.map((m) => (
                                <Grid item xs={12} sm={6} md={4} key={m._id}>
                                    <Card
                                        sx={{
                                            cursor: "pointer",
                                            borderRadius: 2,
                                            boxShadow: 2,
                                            transition: "transform 0.2s",
                                            "&:hover": { transform: "scale(1.03)" },
                                        }}
                                        onClick={() => navigate(`/missionsPageDetail/${m._id}`)}
                                    >
                                        {m.Image?.single && (
                                            <CardMedia
                                                component="img"
                                                image={m.Image.single}
                                                alt={m.Title}
                                                sx={{
                                                    width: "100%",
                                                    height: 90,
                                                    objectFit: "cover",
                                                    borderRadius: "8px 8px 0 0",
                                                }}
                                            />
                                        )}
                                        <CardContent sx={{ p: 2 }}>
                                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                                {m.Title}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                                                <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                                                    {m.Author?.replace(/<i>|<\/i>/g, "").charAt(0)}
                                                </Avatar>
                                                <Typography variant="caption" color="text.secondary" noWrap>
                                                    {m.Author?.replace(/<i>|<\/i>/g, "")}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        {pageCount > 1 && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                <Pagination
                                    count={pageCount}
                                    page={page}
                                    onChange={(_, value) => setPage(value)}
                                    color="primary"
                                    shape="rounded"
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MissionsPageDetails;