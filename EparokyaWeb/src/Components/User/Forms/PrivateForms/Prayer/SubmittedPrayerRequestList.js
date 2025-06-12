import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "../../../../GuestSideBar";
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
    borderLeft: `6px solid ${status === 'Confirmed' ? theme.palette.success.main :
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
        const date = new Date(form.createdAt || form.prayerRequestDate || new Date());
        const monthYear = format(date, 'MMMM yyyy');
        if (!grouped[monthYear]) {
            grouped[monthYear] = [];
        }
        grouped[monthYear].push(form);
    });
    return grouped;
};

const SubmittedPrayerRequestList = () => {
    const [prayerRequests, setPrayerRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('latest');
    const theme = useTheme();

    useEffect(() => {
        fetchPrayerRequests();
    }, []);

    const fetchPrayerRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/getMySubmittedPrayerRequestList`,
                { withCredentials: true }
            );
            if (response.data && Array.isArray(response.data.forms)) {
                setPrayerRequests(response.data.forms);
            } else {
                setPrayerRequests([]);
            }

        } catch (error) {
            setError("No Prayer Requests have been submitted yet.");
        } finally {
            setLoading(false);
        }
    };

    const sortRequestsByDate = (requests) => {
        return [...requests].sort((a, b) => {
            const dateA = new Date(a.createdAt || a.prayerRequestDate || 0);
            const dateB = new Date(b.createdAt || b.prayerRequestDate || 0);
            return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
        });
    };

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        My Submitted Prayer Requests
                    </Typography>
                    <Chip
                        label={`Sort: ${sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}`}
                        onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
                        clickable
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                ) : prayerRequests.length === 0 ? (
                    <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            No submitted prayer requests found.
                        </Typography>
                    </Paper>
                ) : (
                    <Stack spacing={4}>
                        {Object.entries(groupByMonthYear(sortRequestsByDate(prayerRequests))).map(([monthYear, requests]) => (
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
                                    {requests.map((item, index) => {

                                        const status = item.status || 'Pending';
                                        return (
                                            <StyledCard
                                                key={item._id}
                                                elevation={3}
                                                status={status}
                                            >
                                                <CardActionArea>
                                                    <CardContent>
                                                        <StatusChip
                                                            label={status}
                                                            size="small"
                                                            status={status}
                                                        />
                                                        <Typography variant="h6" component="h2" gutterBottom>
                                                            Record #{index + 1}: {item.offerrorsName || "Unknown Offerror"}
                                                        </Typography>
                                                        <Divider sx={{ my: 1 }} />
                                                        <Stack
                                                            direction={{ xs: 'column', sm: 'row' }}
                                                            spacing={2}
                                                            sx={{ mt: 2 }}
                                                            flexWrap="wrap"
                                                        >
                                                            <Box sx={{ minWidth: 120 }}>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    Prayer Type
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {item.prayerType || "N/A"}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ minWidth: 120 }}>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    Prayer Request Date
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {item.prayerRequestDate ?
                                                                        format(new Date(item.prayerRequestDate), 'MMMM dd, yyyy') :
                                                                        "N/A"}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ minWidth: 120 }}>
                                                                <Typography variant="body2" color="textSecondary">
                                                                    Intentions
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {item.Intentions && item.Intentions.length > 0
                                                                        ? item.Intentions.map((i, idx) => (
                                                                            <span key={idx}>
                                                                                {i.name}
                                                                                {idx < item.Intentions.length - 1 ? ", " : ""}
                                                                            </span>
                                                                        ))
                                                                        : "N/A"}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
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

export default SubmittedPrayerRequestList;