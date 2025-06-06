import React, { useEffect, useState } from "react";
import axios from "axios";
import SideBar from "../SideBar";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Chip,
    Stack,
    Divider,
    Paper,
    Alert,
    Button,
    useTheme
} from "@mui/material";
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import Loader from "../../Layout/Loader";

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: "bold",
    backgroundColor:
        status === "Confirmed"
            ? theme.palette.success.light
            : status === "Cancelled"
                ? theme.palette.error.light
                : theme.palette.warning.light,
    color: theme.palette.getContrastText(
        status === "Confirmed"
            ? theme.palette.success.light
            : status === "Cancelled"
                ? theme.palette.error.light
                : theme.palette.warning.light
    ),
}));

const StyledCard = styled(Paper)(({ theme, status }) => ({
    position: "relative",
    borderLeft: `6px solid ${status === "Confirmed"
        ? theme.palette.success.main
        : status === "Cancelled"
            ? theme.palette.error.main
            : theme.palette.warning.main
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
        const date = new Date(form.createdAt || form.funeralDate || new Date());
        const monthYear = format(date, "MMMM yyyy");
        if (!grouped[monthYear]) {
            grouped[monthYear] = [];
        }
        grouped[monthYear].push(form);
    });
    return grouped;
};

const FuneralList = () => {
    const [funeralForms, setFuneralForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredStatus, setFilteredStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        fetchFunerals();
    }, []);

    const fetchFunerals = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/getAllFunerals`,
                { withCredentials: true }
            );
            if (response.data && Array.isArray(response.data)) {
                setFuneralForms(response.data);
                console.log("Funeral Forms:", response.data);
            } else {
                setFuneralForms([]);
            }
        } catch (error) {
            console.error("Error fetching funeral forms:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort
    const filteredForms = funeralForms.filter((funeral) => {
        return (
            (filteredStatus === "All" || funeral.funeralStatus === filteredStatus) &&
            (searchTerm === "" ||
                funeral.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                funeral.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    // Sort from latest to oldest
    const sortedForms = [...filteredForms].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.funeralDate || 0);
        const dateB = new Date(b.createdAt || b.funeralDate || 0);
        return dateB - dateA;
    });

    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 10;
    const totalPages = Math.ceil(sortedForms.length / cardsPerPage);
    const paginatedForms = sortedForms.slice(
        (currentPage - 1) * cardsPerPage,
        currentPage * cardsPerPage
    );

    const groupedPaginated = groupByMonthYear(paginatedForms);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
            <SideBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: "#f9f9f9",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 1200,
                        mx: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                        Funeral Records
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2, justifyContent: "center" }}>
                        {["All", "Confirmed", "Pending", "Cancelled"].map((status) => (
                            <Button
                                key={status}
                                variant={filteredStatus === status ? "contained" : "outlined"}
                                color={
                                    status === "Confirmed"
                                        ? "success"
                                        : status === "Cancelled"
                                            ? "error"
                                            : status === "Pending"
                                                ? "warning"
                                                : "primary"
                                }
                                onClick={() => setFilteredStatus(status)}
                            >
                                {status}
                            </Button>
                        ))}
                    </Stack>
                    <Box sx={{ width: "100%", mb: 2 }}>
                        <input
                            type="text"
                            placeholder="Search by Name or Contact Person"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: "10px",
                                marginBottom: "20px",
                                width: "100%",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                            }}
                        />
                    </Box>
                    {loading ? (
                        <Loader />
                    ) : paginatedForms.length === 0 ? (
                        <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
                            <Typography variant="body1" color="textSecondary">
                                No funeral records found.
                            </Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={4} sx={{ width: "100%" }}>
                            {Object.entries(groupedPaginated).map(([monthYear, forms]) => (
                                <Box key={monthYear}>
                                    <Divider sx={{ mb: 2 }}>
                                        <Chip
                                            label={monthYear}
                                            color="primary"
                                            variant="outlined"
                                            sx={{ px: 2, fontSize: "0.875rem" }}
                                        />
                                    </Divider>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 2,
                                            width: "100%",
                                        }}
                                    >
                                        {forms.map((item, index) => (
                                            <Box
                                                key={item._id}
                                                sx={{
                                                    flex: "1 1 calc(50% - 16px)",
                                                    minWidth: 0,
                                                    maxWidth: "calc(50% - 16px)",
                                                    boxSizing: "border-box",
                                                }}
                                            >
                                                <StyledCard
                                                    elevation={3}
                                                    status={item.funeralStatus}
                                                    onClick={() => navigate(`/admin/funeralDetails/${item._id}`)}
                                                    sx={{ cursor: "pointer", height: "100%" }}
                                                >
                                                    <Box sx={{ position: "absolute", right: 16, top: 16 }}>
                                                        <StatusChip
                                                            label={item.funeralStatus ?? "Unknown"}
                                                            size="small"
                                                            status={item.funeralStatus}
                                                        />
                                                    </Box>
                                                    <Typography variant="h6" component="h2" gutterBottom>
                                                        Funeral #{index + 1 + (currentPage - 1) * cardsPerPage}: {item.name ?? "Unknown"}
                                                    </Typography>
                                                    <Divider sx={{ my: 1 }} />
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Funeral Date:</strong>{" "}
                                                        {item.funeralDate
                                                            ? format(new Date(item.funeralDate), 'MMMM dd, yyyy')
                                                            : "N/A"}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Funeral Time:</strong>{" "}
                                                        {item?.funeraltime ? (() => {
                                                            try {
                                                                const rawTime = item.funeraltime;

                                                                // If it's just a time string like "12:41", create a full date with today's date
                                                                let date;
                                                                if (/^\d{1,2}:\d{2}$/.test(rawTime)) {
                                                                    const today = new Date();
                                                                    const [hours, minutes] = rawTime.split(':');
                                                                    date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), +hours, +minutes);
                                                                } else {
                                                                    date = new Date(rawTime);
                                                                }

                                                                if (isNaN(date.getTime())) {
                                                                    console.warn("Invalid funeralTime:", rawTime);
                                                                    return "N/A";
                                                                }

                                                                return format(date, 'h:mm a'); // e.g. "1:08 AM"
                                                            } catch (e) {
                                                                console.error("Error parsing funeralTime:", item.funeraltime, e);
                                                                return "N/A";
                                                            }
                                                        })() : "N/A"}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Contact Person:</strong> {item.contactPerson || "N/A"}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Phone:</strong> {item.phone || "N/A"}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        <strong>Submitted By:</strong> {item.userId?.name || "Unknown"}
                                                    </Typography>
                                                </StyledCard>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{ position: "relative", width: "50%", height: "100%", alignItems: "center", margin: "auto" }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: 2,
                                            mt: 3,
                                        }}
                                    >
                                        <div>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                startIcon={<ChevronLeftIcon />}
                                            >
                                                Previous
                                            </Button>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                            <Typography variant="body1" color="text.secondary">
                                                Page {currentPage} of {totalPages}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                endIcon={<ChevronRightIcon />}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </Box>
                                </div>
                            )}
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default FuneralList;