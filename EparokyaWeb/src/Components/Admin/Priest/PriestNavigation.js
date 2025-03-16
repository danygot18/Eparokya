import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const PriestNavigation = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [weddings, baptisms, funerals, prayers] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedFuneral`),
          axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPrayerRequestIntention`),
        ]);

        setData([
          ...weddings.data.map((item) => ({ type: "wedding", id: item._id, ...item })),
          ...baptisms.data.map((item) => ({ type: "baptism", id: item._id, ...item })),
          ...funerals.data.map((item) => ({ type: "funeral", id: item._id, ...item })),
          ...prayers.data.map((item) => ({ type: "prayer", id: item._id, ...item })),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to format date properly
  const formatDate = (dateString) => {
    if (!dateString) return "No Date Available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to format time properly
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const filteredData = filter === "all" ? data : data.filter((item) => item.type === filter);

  const handleCardClick = (item) => {
    let path = "";
    switch (item.type) {
      case "wedding":
        path = `/admin/weddingDetails/${item.id}`;
        break;
      case "baptism":
        path = `/admin/baptismDetails/${item.id}`;
        break;
      case "funeral":
        path = `/admin/funeralDetails/${item.id}`;
        break;
      case "prayer":
        path = `/admin/prayerIntention/details/${item.id}`;
        break;
      default:
        return;
    }
    navigate(path);
  };

  // Color mapping for different event types
  const typeColors = {
    wedding: "#2196F3", // Blue
    baptism: "#4CAF50", // Green
    funeral: "#9C27B0", // Purple
    prayer: "#F5F5F5", // White
  };

  return (
    <Container>
      {/* Filter Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Filter</InputLabel>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="wedding">Weddings</MenuItem>
          <MenuItem value="baptism">Baptisms</MenuItem>
          <MenuItem value="funeral">Funerals</MenuItem>
          <MenuItem value="prayer">Prayer Requests</MenuItem>
        </Select>
      </FormControl>

      {/* Event Cards Grid */}
      <Grid container spacing={3}>
        {filteredData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card
              onClick={() => handleCardClick(item)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                backgroundColor: typeColors[item.type] || "#fff",
                color: item.type === "prayer" ? "#000" : "#fff",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Details
                </Typography>

                {/* Event Details */}
                {item.type === "wedding" && (
                  <>
                    <Typography>Groom: {item.groomName} (Born: {formatDate(item.groomBirthDate)})</Typography>
                    <Typography>Bride: {item.brideName} (Born: {formatDate(item.brideBirthDate)})</Typography>
                    <Typography>{formatDate(item.weddingDate)} at {formatTime(item.weddingTime)}</Typography>
                  </>
                )}

                {item.type === "baptism" && (
                  <>
                    <Typography>Child: {item.child.fullName} (Born: {formatDate(item.child.dateOfBirth)})</Typography>
                    <Typography>{formatDate(item.baptismDate)} at {formatTime(item.baptismTime)}</Typography>
                  </>
                )}

                {item.type === "funeral" && (
                  <>
                    <Typography>Deceased: {item.name} (Age: {item.age})</Typography>
                    <Typography>Date of Death: {formatDate(item.dateOfDeath)}</Typography>
                    <Typography>Contact: {item.contactPerson}</Typography>
                  </>
                )}

                {item.type === "prayer" && (
                  <>
                    <Typography>Offered by: {item.offerrorsName}</Typography>
                    <Typography>Type: {item.prayerType}</Typography>
                    <Typography>{item.prayerDescription}</Typography>
                    <Typography>{formatDate(item.prayerRequestDate)} at {formatTime(item.prayerRequestTime)}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PriestNavigation;
