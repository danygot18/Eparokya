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
import jsPDF from "jspdf";

const PrayerRequestFullList = () => {
    const [prayerRequestForms, setPrayerRequestForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const perPage = 15;

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

    const categorized = {};
    prayerRequestForms.forEach((form) => {
        const type = form.prayerType || "Other";
        if (!categorized[type]) categorized[type] = [];
        categorized[type].push(form);
    });

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

    const handleDownloadPDF = (type, list) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Prayer Requests - ${type}`, 14, 16);

        let y = 28;
        doc.setFontSize(11);
        doc.text("Prayer Type", 14, y);
        doc.text("Offeror's Name", 44, y);
        doc.text("Date", 94, y);
        doc.text("Time", 124, y);
        doc.text("Intentions", 144, y);
        

        y += 6;
        doc.setLineWidth(0.1);
        doc.line(14, y, 200, y);
        y += 4;

        list.forEach((item, idx) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            const prayerType = doc.splitTextToSize(item.prayerType || "", 28);
            const offeror = doc.splitTextToSize(item.offerrorsName || "N/A", 44);
            const date = doc.splitTextToSize(
                item.prayerRequestDate
                    ? new Date(item.prayerRequestDate).toLocaleDateString()
                    : "N/A",
                28
            );
            const time = doc.splitTextToSize(item.prayerRequestTime || "N/A", 18);
            const intentions = doc.splitTextToSize(
                Array.isArray(item.Intentions) && item.Intentions.length > 0
                    ? item.Intentions.map((intention) => intention.name || "Unnamed").join(", ")
                    : "N/A",
                50
            );
            const submittedBy = doc.splitTextToSize(item.userId?.name || "Unknown", 28);

            const lines = Math.max(
                prayerType.length,
                offeror.length,
                date.length,
                time.length,
                intentions.length,
               
            );

            for (let i = 0; i < lines; i++) {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(prayerType[i] || "", 14, y);
                doc.text(offeror[i] || "", 44, y);
                doc.text(date[i] || "", 94, y);
                doc.text(time[i] || "", 124, y);
                doc.text(intentions[i] || "", 144, y);
               
                y += 8;
            }
        });

        doc.save(`prayer_requests_${type.replace(/\s+/g, "_")}.pdf`);
    };

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
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
                                    {type}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleDownloadPDF(type, list)}
                                    sx={{ mt: 2, mb: 1 }}
                                >
                                    Download PDF
                                </Button>
                            </Box>
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