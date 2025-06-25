import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from "@mui/material";
import { format, parse } from "date-fns";
import SideBar from "../SideBar";

const PrayerRequestFullList = () => {
    const [prayerRequestForms, setPrayerRequestForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const perPage = 15;

    // Fetch all prayer requests
    useEffect(() => {
        const fetchPrayerRequestForms = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/api/v1/admin/getAllPrayerRequest`,
                    { withCredentials: true }
                );
                const forms = response.data.prayerRequests || [];

                // First in, last out (oldest first)
                const sortedForms = forms.sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );

                setPrayerRequestForms(sortedForms);
            } catch (err) {
                setPrayerRequestForms([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPrayerRequestForms();
    }, []);

    // Group by prayer type
    const categorized = {};
    prayerRequestForms.forEach((form) => {
        const type = form.prayerType || "Other";
        if (!categorized[type]) categorized[type] = [];
        categorized[type].push(form);
    });

    // Pagination helpers
    const getPage = (type) => pagination[type] || 1;
    const setPage = (type, value) =>
        setPagination((prev) => ({ ...prev, [type]: value }));

    // Prioritized order for display
    const prioritizedOrder = [
        "Eternal Repose(Patay)",
        "Thanks Giving(Pasasalamat)",
        "Special Intentions(Natatanging Kahilingan)",
    ];

    const sortedEntries = Object.entries(categorized).sort(
        ([a], [b]) => prioritizedOrder.indexOf(a) - prioritizedOrder.indexOf(b)
    );

    return (
        <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", py: 4 }}>
            <SideBar />
            <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", textAlign: "center" }}
            >
                Prayer Request Full List
            </Typography>
            {loading ? (
                <Typography align="center" sx={{ mt: 4 }}>
                    Loading...
                </Typography>
            ) : (
                <Box sx={{ width: "100%" }}>
                    {Object.keys(categorized).length === 0 && (
                        <Typography align="center" color="text.secondary">
                            No prayer requests found.
                        </Typography>
                    )}
                    {sortedEntries.map(([type, list]) => (
                        <Paper
                            key={type}
                            sx={{
                                mb: 4,
                                p: 2,
                                boxShadow: 3,
                                borderRadius: 2,
                                position: "relative",
                            }}
                        >
                            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                {type}
                            </Typography>
                            <TableContainer component={Paper} sx={{ mb: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <strong>Prayer Type</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Offeror's Name</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Date</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Time</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Intentions</strong>
                                            </TableCell>
                                            <TableCell>
                                                <strong>Submitted By</strong>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {list.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    No prayer requests for this type.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            list
                                                .slice(
                                                    (getPage(type) - 1) * perPage,
                                                    getPage(type) * perPage
                                                )
                                                .map((item) => (
                                                    <TableRow key={item._id}>
                                                        <TableCell>{item.prayerType}</TableCell>
                                                        <TableCell>{item.offerrorsName || "N/A"}</TableCell>
                                                        <TableCell>
                                                            {item.prayerRequestDate
                                                                ? format(
                                                                    new Date(item.prayerRequestDate),
                                                                    "MMMM dd, yyyy"
                                                                )
                                                                : "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.prayerRequestTime
                                                                ? format(
                                                                    parse(
                                                                        item.prayerRequestTime,
                                                                        "HH:mm",
                                                                        new Date()
                                                                    ),
                                                                    "h:mm a"
                                                                )
                                                                : "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {Array.isArray(item.Intentions) &&
                                                                item.Intentions.length > 0
                                                                ? item.Intentions.map((intention, i) => (
                                                                    <span key={intention._id || i}>
                                                                        {intention.name || "Unnamed"}
                                                                        {i !== item.Intentions.length - 1
                                                                            ? ", "
                                                                            : ""}
                                                                    </span>
                                                                ))
                                                                : "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {item.userId?.name || "Unknown"}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* Pagination */}
                            {list.length > perPage && (
                                <Box display="flex" justifyContent="center" mb={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            setPage(type, Math.max(getPage(type) - 1, 1))
                                        }
                                        disabled={getPage(type) === 1}
                                        sx={{ mr: 1 }}
                                    >
                                        Previous
                                    </Button>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mx: 2 }}
                                    >
                                        Page {getPage(type)} of {Math.ceil(list.length / perPage)}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            setPage(
                                                type,
                                                Math.min(
                                                    getPage(type) + 1,
                                                    Math.ceil(list.length / perPage)
                                                )
                                            )
                                        }
                                        disabled={getPage(type) === Math.ceil(list.length / perPage)}
                                    >
                                        Next
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default PrayerRequestFullList;