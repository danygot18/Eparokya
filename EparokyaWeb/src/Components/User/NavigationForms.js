import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import GuestSideBar from "../GuestSideBar";

const NavigationForm = () => {
  const [loading, setLoading] = useState(true);

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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a 2-second loading delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" }}
    >
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

            <Stack
              direction="row"
              spacing={3}
              useFlexGap
              flexWrap="wrap"
              justifyContent="flex-start"
            >
              {category.forms.map((form, idx) => (
                <Card
                  key={idx}
                  sx={{
                    width: 280,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{form.name}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      component={Link}
                      to={form.path}
                      variant="contained"
                      fullWidth
                      color="success"
                    >
                      Go to {form.name}
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Stack>
          </Box>
        ))}
      </Container>
    </Box>
  );
};

export default NavigationForm;