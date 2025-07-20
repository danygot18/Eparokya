import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Chip,
    Stack,
    Avatar,
    Pagination,
    Button,
} from "@mui/material";
import GuestSidebar from "./GuestSideBar";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const CARDS_PER_PAGE = 4;

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

const MissionsPage = () => {
    const [missions, setMissions] = useState([]);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllMissions`, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                // Sort by createdAt descending (LIFO)
                setMissions(
                    (res.data || []).sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                );
                console.log(res.data)
            } catch (err) {
                setMissions([]);
            }
        };
        fetchMissions();
    }, []);

    if (!missions.length) {
        return (
            <Box sx={{ display: "flex", minHeight: "100vh" }}>
                <GuestSidebar />
                <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography variant="h5" color="text.secondary">
                        No missions found.
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Main mission is the latest one
    const mainMission = missions[0];
    // Paginate the rest
    const paginatedMissions = missions.slice(1).slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
    const pageCount = Math.ceil((missions.length - 1) / CARDS_PER_PAGE);

    const handleCardClick = (id) => {
        navigate(`/missionsPageDetail/${id}`);
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
            <GuestSidebar />
            <Box sx={{ flexGrow: 1, p: { xs: 1, md: 4 }, maxWidth: 1200, mx: "auto" }}>
                {/* Main Mission */}
                <Card
                    sx={{
                        mb: 4,
                        boxShadow: 6,
                        borderRadius: 3,
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.01)" },
                    }}
                    onClick={() => handleCardClick(mainMission._id)}
                >
                    {mainMission.Image?.single && (
                        <CardMedia
                            component="img"
                            image={mainMission.Image.single}
                            alt={mainMission.Title}
                            sx={{
                                width: { xs: "100%", md: 400 },
                                height: { xs: 220, md: 320 },
                                objectFit: "cover",
                                borderRadius: { xs: "16px 16px 0 0", md: "16px 0 0 16px" },
                            }}
                        />
                    )}
                    <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {mainMission.Title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {mainMission.Location}
                        </Typography>
                        <Stack direction="row" spacing={1} mb={1}>
                            <Chip
                                label={mainMission.Date ? new Date(mainMission.Date).toLocaleDateString() : ""}
                                color="primary"
                                size="small"                           
                                avatar={< EventAvailableIcon />}
                            />
                            <Chip
                                label={formatMissionTime(mainMission?.Time)}
                                color="secondary"
                                size="small"
                                avatar={<AccessTimeFilledIcon />}
                            />
                            <Chip
                                label={`By: ${mainMission.Author?.replace(/<i>|<\/i>/g, "")}`}
                                size="small"
                                avatar={<Avatar>{mainMission.Author?.replace(/<i>|<\/i>/g, "").charAt(0)}</Avatar>}
                            />
                            <Chip
                                label={`Budget: ${mainMission.Budget?.replace(/<i>|<\/i>/g, "")}`}
                                size="small"
                            // avatar={<Avatar>{mainMission.Budget?.replace(/<i>|<\/i>/g, "").charAt(0)}</Avatar>}
                            />
                        </Stack>
                        <Typography variant="body1" gutterBottom>
                            {mainMission.Description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <b>Facilitators:</b> {mainMission.Facilitators?.join(", ") || "None"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <b>Volunteers:</b> {mainMission.Volunteers?.join(", ") || "None"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <b>Ministries:</b>{" "}
                            {mainMission.Ministry && mainMission.Ministry.length > 0
                                ? mainMission.Ministry.map((min, idx) =>
                                    typeof min === "object" && min.name ? min.name : min
                                ).join(", ")
                                : "None"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <b>Budget:</b> {mainMission.Budget || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <b>Budget From:</b> {mainMission.BudgetFrom || "N/A"}
                        </Typography>
                        {mainMission.Image?.multiple?.length > 0 && (
                            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                                {mainMission.Image.multiple.map((img, idx) => (
                                    <Box
                                        key={idx}
                                        component="img"
                                        src={img}
                                        alt={`Gallery ${idx + 1}`}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: 2,
                                            mr: 1,
                                            mb: 1,
                                            border: "1px solid #eee",
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

                {/* Other Missions */}
                <Grid container spacing={3}>
                    {paginatedMissions.map((mission) => (
                        <Grid item xs={12} sm={6} md={3} key={mission._id}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                    "&:hover": { transform: "scale(1.03)" },
                                    boxShadow: 3,
                                    borderRadius: 2,
                                }}
                                onClick={() => handleCardClick(mission._id)}
                            >
                                {mission.Image?.single && (
                                    <CardMedia
                                        component="img"
                                        image={mission.Image.single}
                                        alt={mission.Title}
                                        sx={{
                                            width: "100%",
                                            height: 120,
                                            objectFit: "cover",
                                            borderRadius: "8px 8px 0 0",
                                        }}
                                    />
                                )}
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {mission.Title}
                                    </Typography>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        {mission.Location}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mb={1}>
                                        <Chip
                                            label={mission.Date ? new Date(mission.Date).toLocaleDateString() : ""}
                                            color="primary"
                                            size="small"
                                            avatar={< EventAvailableIcon />}
                                        />
                                        <Chip

                                            label={formatMissionTime(mission.Time)}
                                            color="secondary"
                                            size="small"
                                            avatar={< AccessTimeFilledIcon />}
                                        />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <b>Facilitators:</b> {mission.Facilitators?.join(", ") || "None"}
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <b>Volunteers:</b> {mission.Volunteers?.join(", ") || "None"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <b>Ministries:</b>{" "}
                                        {mission.Ministry && mission.Ministry.length > 0
                                            ? mission.Ministry.map((min, idx) =>
                                                typeof min === "object" && min.name ? min.name : min
                                            ).join(", ")
                                            : "None"}
                                    </Typography> */}
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <b>Budget:</b>{" "}
                                        <span style={{ fontStyle: "italic" }}>
                                            {mission.Budget?.replace(/<i>|<\/i>/g, "")}
                                        </span>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <b>By:</b>{" "}
                                        <span style={{ fontStyle: "italic" }}>
                                            {mission.Author?.replace(/<i>|<\/i>/g, "")}
                                        </span>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination */}
                {pageCount > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <Pagination
                            count={pageCount}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MissionsPage;