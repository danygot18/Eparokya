import React from "react";
import { Card, CardContent, CardActions, Button, Grid, Typography, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import GuestSideBar from "../GuestSideBar";

const NavigationForm = () => {
    const formCategories = [
        {
            title: "Private Forms",
            forms: [
                { name: "Private Wedding", path: "/user/weddingForm" },
                { name: "Private Baptism", path: "/user/baptismForm" },
                { name: "Private Funeral", path: "/user/funeralForm" },
                { name: "Mass Intentions", path: "/user/prayerRequest" },
                { name: "Counseling", path: "/user/counselingForm" },
                { name: "House Blessing", path: "/user/houseBlessingForm" },
            ],
        },
        {
            title: "Mass Forms",
            forms: [
                { name: "Kasalang Bayan", path: "/user/massWedding" },
                { name: "Binyagang Bayan", path: "/user/massBaptism" },
            ],
        },
    ];

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
            {/* Sidebar */}
            <GuestSideBar />

            {/* Main Content */}
            <Container sx={{ mt: 5, flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                    Forms Navigation
                </Typography>

                {formCategories.map((category, index) => (
                    <Box key={index} sx={{ mt: 3 }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            {category.title}
                        </Typography>
                        <Grid container spacing={3}>
                            {category.forms.map((form, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6">{form.name}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button
                                                component={Link}
                                                to={form.path}
                                                variant="contained"
                                                fullWidth
                                            >
                                                Go to {form.name}
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))}
            </Container>
        </Box>
    );
};

export default NavigationForm;
