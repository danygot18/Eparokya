import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../Layout/styles/style.css";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    CardActionArea,
    Chip,
    Stack,
    Divider,
    useTheme,
    Paper,
    Alert
} from "@mui/material";
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme, status }) => ({
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    fontWeight: 'bold',
    backgroundColor:
        status === 'Confirmed' ? theme.palette.success.light :
        status === 'Cancelled' ? theme.palette.error.light :
        theme.palette.warning.light,
    color: theme.palette.getContrastText(
        status === 'Confirmed' ? theme.palette.success.light :
        status === 'Cancelled' ? theme.palette.error.light :
        theme.palette.warning.light
    )
}));

const StyledCard = styled(Card)(({ theme, status }) => ({
    position: 'relative',
    borderLeft: `6px solid ${
        status === 'Confirmed' ? theme.palette.success.main :
        status === 'Cancelled' ? theme.palette.error.main :
        theme.palette.warning.main
    }`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[6]
    }
}));

const groupByMonthYear = (forms) => {
    const grouped = {};
    forms.forEach(form => {
        const date = new Date(form.createdAt || form.blessingDate || new Date());
        const monthYear = format(date, 'MMMM yyyy');
        if (!grouped[monthYear]) {
            grouped[monthYear] = [];
        }
        grouped[monthYear].push(form);
    });
    return grouped;
};

const SubmittedHouseBlessingList = () => {
    const [houseBlessingForms, setHouseBlessingForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        fetchMySubmittedForms();
    }, []);

    const fetchMySubmittedForms = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/houseBlessing/getAllUserSubmittedHouseBlessing`,
                { withCredentials: true }
            );
            if (response.data && Array.isArray(response.data.forms)) {
                setHouseBlessingForms(response.data.forms);
                setFilteredForms(response.data.forms);
            } else {
                setHouseBlessingForms([]);
                setFilteredForms([]);
            }
        } catch (error) {
            setError("Unable to fetch house blessing forms.");
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (houseBlessingId) => {
        navigate(`/user/mySubmittedHouseBlessingForm/${houseBlessingId}`);
    };

    const filterForms = () => {
        let filtered = houseBlessingForms;
        if (activeFilter !== "All") {
            filtered = filtered.filter((form) => form.blessingStatus === activeFilter);
        }
        if (searchTerm) {
            filtered = filtered.filter((form) =>
                form.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredForms(filtered);
    };

    useEffect(() => {
        filterForms();
    }, [activeFilter, searchTerm, houseBlessingForms]);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <GuestSideBar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: theme.palette.grey[50]
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    My Submitted House Blessing Records
                </Typography>
                <div className="houseBlessing-filters" style={{ marginBottom: 16 }}>
                    {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                        <button
                            key={status}
                            className={`houseBlessing-filter-button ${activeFilter === status ? "active" : ""}`}
                            onClick={() => setActiveFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by Full Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
                    />
                </div>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                ) : filteredForms.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            No house blessings forms submitted by you.
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={4}>
                        {Object.entries(groupByMonthYear(filteredForms)).map(([monthYear, forms]) => (
                            <Box key={monthYear}>
                                <Divider sx={{ mb: 2 }}>
                                    <Chip
                                        label={monthYear}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ px: 2, fontSize: '0.875rem' }}
                                    />
                                </Divider>
                                <Stack spacing={3}>
                                    {forms.map((item, index) => {
                                        const status = item.blessingStatus || 'Pending';
                                        return (
                                            <StyledCard
                                                key={item._id}
                                                elevation={3}
                                                status={status}
                                            >
                                                <CardActionArea onClick={() => handleCardClick(item._id)}>
                                                    <CardContent>
                                                        <StatusChip
                                                            label={status}
                                                            size="small"
                                                            status={status}
                                                        />
                                                        <Typography variant="h6" component="h2" gutterBottom>
                                                            Record #{index + 1}: {item.fullName || "N/A"}
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
                                                        <Stack
                                                            direction={{ xs: 'column', sm: 'row' }}
                                                            spacing={2}
                                                            sx={{ mt: 2 }}
                                                        >
                                                            <Box>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    Contact Number
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {item.contactNumber || "N/A"}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    House Blessing Date
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {item.blessingDate
                                                                        ? new Date(item.blessingDate).toLocaleDateString()
                                                                        : "N/A"}
                                                                </Typography>
                                                            </Box>
                                                            <Box>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    House Blessing Time
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {item.blessingTime || "N/A"}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                        <Divider sx={{ my: 1 }} />
                                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                            Address
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {item.address?.BldgNameTower ? `${item.address.BldgNameTower}, ` : ""}
                                                            {item.address?.LotBlockPhaseHouseNo ? `${item.address.LotBlockPhaseHouseNo}, ` : ""}
                                                            {item.address?.SubdivisionVillageZone ? `${item.address.SubdivisionVillageZone}, ` : ""}
                                                            {item.address?.Street ? `${item.address.Street}, ` : ""}
                                                            {item.address?.district ? `${item.address.district}, ` : ""}
                                                            {item.address?.barangay === "Others"
                                                                ? `${item.address.customBarangay || "N/A"}, `
                                                                : item.address?.barangay
                                                                    ? `${item.address.barangay}, `
                                                                    : ""}
                                                            {item.address?.city === "Others"
                                                                ? `${item.address.customCity || "N/A"}`
                                                                : item.address?.city || ""}
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                            </StyledCard>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default SubmittedHouseBlessingList;