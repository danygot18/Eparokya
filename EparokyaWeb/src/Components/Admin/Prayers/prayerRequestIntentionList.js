import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideBar from "../SideBar";
import {
    Box,
    Typography,
    Chip,
    Stack,
    Divider,
    Paper,
    Button,
    useTheme,
    Select,
    MenuItem,
    InputBase,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: "bold",
    backgroundColor: status
        ? theme.palette.success.light
        : theme.palette.error.light,
    color: status
        ? theme.palette.getContrastText(theme.palette.success.light)
        : theme.palette.getContrastText(theme.palette.error.light),
}));

const StyledCard = styled(Paper)(({ theme, status }) => ({
    position: "relative",
    borderLeft: `6px solid ${status ? theme.palette.success.main : theme.palette.error.main
        }`,
    padding: theme.spacing(2),
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: theme.shadows[6],
    },
}));

const groupByMonthYear = (forms) => {
    const grouped = {};
    forms.forEach((form) => {
        const date = new Date(form.createdAt || form.prayerRequestDate || new Date());
        const monthYear = format(date, "MMMM yyyy");
        if (!grouped[monthYear]) {
            grouped[monthYear] = [];
        }
        grouped[monthYear].push(form);
    });
    return grouped;
};

const PrayerRequestIntentionList = () => {
    const [prayerRequests, setPrayerRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        fetchPrayerRequests();
        // eslint-disable-next-line
    }, []);



    const config = { withCredentials: true };
    const fetchPrayerRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/getAllPrayerRequestIntention`,
                config
            );
            setPrayerRequests(response.data || []);
        } catch (error) {
            console.error("Error fetching prayer requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = prayerRequests.filter((request) => {
        const matchesSearch = request.prayerType
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesFilter = filterType ? request.prayerType === filterType : true;
        return matchesSearch && matchesFilter;
    });
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.prayerRequestDate || 0);
        const dateB = new Date(b.createdAt || b.prayerRequestDate || 0);
        return dateB - dateA; // latest first
    });


    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
            <SideBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: theme.palette.grey[50],
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 900,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                        Prayer Intention List
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2, width: "100%", justifyContent: "center" }}>
                        <InputBase
                            placeholder="Search by prayer type"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                px: 2,
                                py: 1,
                                border: "1px solid #ccc",
                                borderRadius: 1,
                                width: 250,
                                background: "#fff"
                            }}
                        />
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            displayEmpty
                            sx={{ minWidth: 180, background: "#fff" }}
                            size="small"
                        >
                            <MenuItem value="">All Prayer Types</MenuItem>
                            {[...new Set(prayerRequests.map((req) => req.prayerType))].map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>
                    {loading ? (
                        <Typography variant="body1" sx={{ mt: 4 }}>
                            Loading prayer intentions...
                        </Typography>
                    ) : filteredRequests.length === 0 ? (
                        <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
                            <Typography variant="body1" color="textSecondary">
                                No prayer intentions found.
                            </Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={4} sx={{ width: "100%" }}>
                            {Object.entries(groupByMonthYear(sortedRequests)).map(
                                ([monthYear, forms]) => (
                                    <Box key={monthYear}>
                                        <Divider sx={{ mb: 2 }}>
                                            <Chip
                                                label={monthYear}
                                                color="primary"
                                                variant="outlined"
                                                sx={{ px: 2, fontSize: "0.875rem" }}
                                            />
                                        </Divider>
                                        <Stack spacing={3}>
                                            {forms.map((request, index) => (
                                                <StyledCard
                                                    key={request._id}
                                                    elevation={3}
                                                    status={request.isDone}
                                                    onClick={() => navigate(`/admin/prayerIntention/details/${request._id}`)}
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    <Box sx={{ position: "absolute", right: 16, top: 16 }}>
                                                        <StatusChip
                                                            label={request.isDone ? "Done" : "Not Done"}
                                                            size="small"
                                                            status={request.isDone}
                                                        />
                                                    </Box>
                                                    <Typography variant="h6" component="h2" gutterBottom>
                                                        Prayer Intention #{index + 1}
                                                    </Typography>
                                                    <Divider sx={{ my: 1 }} />
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Offeror's Name:</strong> {request.offerrorsName}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Prayer Type:</strong>{" "}
                                                        {request.prayerType === "Others (Iba pa)" ? request.addPrayer : request.prayerType}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Date:</strong>{" "}
                                                        {request.prayerRequestDate
                                                            ? new Date(request.prayerRequestDate).toLocaleDateString()
                                                            : "N/A"}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Time:</strong>{" "}
                                                        {request.prayerRequestTime
                                                            ? new Date(`1970-01-01T${request.prayerRequestTime}`).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })
                                                            : "N/A"}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Is Done:</strong>{" "}
                                                        <span style={{ color: request.isDone ? theme.palette.success.main : theme.palette.error.main }}>
                                                            {request.isDone ? "Yes" : "No"}
                                                        </span>
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Submitted By:</strong> {request.userId?.name || "N/A"}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Created At:</strong>{" "}
                                                        {request.createdAt
                                                            ? new Date(request.createdAt).toLocaleDateString()
                                                            : "N/A"}
                                                    </Typography>
                                                </StyledCard>
                                            ))}
                                        </Stack>
                                    </Box>
                                )
                            )}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PrayerRequestIntentionList;