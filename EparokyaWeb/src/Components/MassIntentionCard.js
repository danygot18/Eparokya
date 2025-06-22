import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box, CircularProgress, Divider } from "@mui/material";
import { format } from "date-fns";

const MassIntentionCard = () => {
    const [intentions, setIntentions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIntentions = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API}/api/v1/mass-intentions`);
                setIntentions(res.data.intentions || []);
            } catch (error) {
                console.error("Error fetching mass intentions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchIntentions();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card sx={{ maxWidth: 700, mx: "auto", mt: 4, borderRadius: 3 }}>
            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                >
                    Mass Intention Announcements (This Week)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {intentions.length === 0 ? (
                    <Typography align="center">
                        No accepted intentions for this week.
                    </Typography>
                ) : (
                    intentions.map((item) => (
                        <Box key={item._id} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {item.offerrorsName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.prayerType}
                            </Typography>
                            <Typography variant="body2">
                                {format(new Date(item.prayerRequestDate), "MMMM dd, yyyy")} at{" "}
                                {item.prayerRequestTime
                                    ? format(new Date(`1970-01-01T${item.prayerRequestTime}`), "h:mm a")
                                    : "N/A"}
                            </Typography>

                            {/* Intentions list */}
                            {Array.isArray(item.Intentions) && item.Intentions.length > 0 && (
                                <Box sx={{ mt: 1, pl: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        Intentions:
                                    </Typography>
                                    <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                                        {item.Intentions.map((i, index) => (
                                            <li key={index}>
                                                <Typography variant="body2">{i.name}</Typography>
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
                            )}

                            <Divider sx={{ my: 1 }} />
                        </Box>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default MassIntentionCard;
