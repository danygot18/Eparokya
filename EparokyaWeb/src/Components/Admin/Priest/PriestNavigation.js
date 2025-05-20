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
  Box,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from "@mui/material";
import {
  Favorite as WeddingIcon,
  ChildCare as BaptismIcon,
  AccountTree as FuneralIcon,
  MenuBook as PrayerIcon,
  Event as EventIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { History as HistoryIcon } from "@mui/icons-material";

const PriestNavigation = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
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
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No Date Available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper function to get date field based on event type
  const getEventDate = (item) => {
    switch (item.type) {
      case "wedding": return item.weddingDate;
      case "baptism": return item.baptismDate;
      case "funeral": return item.dateOfDeath; // or funeral date if available
      case "prayer": return item.prayerRequestDate;
      default: return null;
    }
  };

  // Filter events happening today
  const getTodaysEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return data.filter(item => {
      const eventDate = new Date(getEventDate(item));
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  };

  // Filter events happening this month (excluding today)
  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return data.filter(item => {
      const eventDate = new Date(getEventDate(item));
      return eventDate > today && eventDate <= endOfMonth;
    }).sort((a, b) => new Date(getEventDate(a)) - new Date(getEventDate(b)));
  };

  const filteredData = filter === "all" 
    ? data 
    : data.filter((item) => item.type === filter);

  const handleCardClick = (item) => {
    const paths = {
      wedding: `/admin/weddingDetails/${item.id}`,
      baptism: `/admin/baptismDetails/${item.id}`,
      funeral: `/admin/funeralDetails/${item.id}`,
      prayer: `/admin/prayerIntention/details/${item.id}`,
    };
    if (paths[item.type]) navigate(paths[item.type]);
  };

  const typeConfig = {
    wedding: {
      color: "#2196F3",
      icon: <WeddingIcon />,
      label: "Wedding",
    },
    baptism: {
      color: "#4CAF50",
      icon: <BaptismIcon />,
      label: "Baptism",
    },
    funeral: {
      color: "#9C27B0",
      icon: <FuneralIcon />,
      label: "Funeral",
    },
    prayer: {
      color: "#607D8B",
      icon: <PrayerIcon />,
      label: "Prayer",
    },
  };

  const getEventIcon = (type) => {
    return typeConfig[type]?.icon || <EventIcon />;
  };

  const renderEventDetails = (item) => {
    switch (item.type) {
      case "wedding":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>Groom:</strong> {item.groomName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Bride:</strong> {item.brideName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong> {formatDate(item.weddingDate)} at {formatTime(item.weddingTime)}
            </Typography>
          </>
        );
      case "baptism":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>Child:</strong> {item.child?.fullName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Born:</strong> {formatDate(item.child?.dateOfBirth)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong> {formatDate(item.baptismDate)} at {formatTime(item.baptismTime)}
            </Typography>
          </>
        );
      case "funeral":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>Deceased:</strong> {item.name} (Age: {item.age})
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Died:</strong> {formatDate(item.dateOfDeath)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Contact:</strong> {item.contactPerson}
            </Typography>
          </>
        );
      case "prayer":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>Offered by:</strong> {item.offerrorsName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Type:</strong> {item.prayerType}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Request:</strong> {item.prayerDescription}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong> {formatDate(item.prayerRequestDate)} at {formatTime(item.prayerRequestTime)}
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  const todaysEvents = getTodaysEvents();
  const upcomingEvents = getUpcomingEvents();
const getPastEvents = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return data.filter(item => {
    const eventDate = new Date(getEventDate(item));
    return eventDate < today;
  }).sort((a, b) => new Date(getEventDate(b)) - new Date(getEventDate(a))).slice(0, 5); // Show only 5 most recent
};

// Get past events
const pastEvents = getPastEvents();
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Main Content - 8 columns */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1">
                Sacrament Dashboard
              </Typography>
              <Box>
                <Tooltip title="Refresh data">
                  <IconButton onClick={fetchData} color="primary" sx={{ mr: 1 }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <FormControl variant="outlined" sx={{ minWidth: 200 }}>
                  <InputLabel id="filter-label">
                    <Box display="flex" alignItems="center">
                      <FilterIcon sx={{ mr: 1 }} /> Filter
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="filter-label"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    label={
                      <Box display="flex" alignItems="center">
                        <FilterIcon sx={{ mr: 1 }} /> Filter
                      </Box>
                    }
                  >
                    <MenuItem value="all">All Events</MenuItem>
                    <MenuItem value="wedding">Weddings</MenuItem>
                    <MenuItem value="baptism">Baptisms</MenuItem>
                    <MenuItem value="funeral">Funerals</MenuItem>
                    <MenuItem value="prayer">Prayer Requests</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {lastUpdated && (
              <Typography variant="caption" color="textSecondary">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Divider sx={{ my: 2 }} />

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : filteredData.length === 0 ? (
              <Alert severity="info">No {filter === "all" ? "" : filter} events found</Alert>
            ) : (
              <Grid container spacing={3}>
                {filteredData.map((item) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={`${item.type}-${item.id}`}>
                    <Card
                      onClick={() => handleCardClick(item)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Box
                            sx={{
                              backgroundColor: typeConfig[item.type]?.color || "#757575",
                              color: "white",
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                            }}
                          >
                            {getEventIcon(item.type)}
                          </Box>
                          <Typography variant="h6" component="h2">
                            {typeConfig[item.type]?.label || "Event"}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {renderEventDetails(item)}

                        <Box mt={2}>
                          <Chip
                            label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            size="small"
                            sx={{
                              backgroundColor: typeConfig[item.type]?.color || "#757575",
                              color: "white",
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Sidebar - 4 columns */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              <TodayIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Today's Schedule
            </Typography>

            {todaysEvents.length > 0 ? (
              <List dense>
                {todaysEvents.map((item) => (
                  <ListItem 
                    key={`today-${item.id}`}
                    button
                    onClick={() => handleCardClick(item)}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          backgroundColor: typeConfig[item.type]?.color || "#757575",
                          color: "white",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getEventIcon(item.type)}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.type === "wedding" 
                        ? `${item.groomName} & ${item.brideName}`
                        : item.type === "baptism"
                          ? item.child?.fullName
                          : item.type === "funeral"
                            ? item.name
                            : item.offerrorsName}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {typeConfig[item.type]?.label}
                          </Typography>
                          {" — "}
                          {formatTime(
                            item.type === "wedding" ? item.weddingTime :
                            item.type === "baptism" ? item.baptismTime :
                            item.type === "prayer" ? item.prayerRequestTime : ""
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No events scheduled for today
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" component="h2" gutterBottom>
              <CalendarIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Upcoming This Month
            </Typography>

            {upcomingEvents.length > 0 ? (
              <List dense>
                {upcomingEvents.map((item) => (
                  <ListItem 
                    key={`upcoming-${item.id}`}
                    button
                    onClick={() => handleCardClick(item)}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          backgroundColor: typeConfig[item.type]?.color || "#757575",
                          color: "white",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getEventIcon(item.type)}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.type === "wedding" 
                        ? `${item.groomName} & ${item.brideName}`
                        : item.type === "baptism"
                          ? item.child?.fullName
                          : item.type === "funeral"
                            ? item.name
                            : item.offerrorsName}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {formatDate(getEventDate(item))}
                          </Typography>
                          {" — "}
                          {typeConfig[item.type]?.label}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No upcoming events this month
              </Alert>
            )}
              <Divider sx={{ my: 3 }} />

            {/* NEW: Past Events section */}
            <Typography variant="h5" component="h2" gutterBottom>
              <HistoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Recent Past Events
            </Typography>

            {pastEvents.length > 0 ? (
              <List dense>
                {pastEvents.map((item) => (
                  <ListItem 
                    key={`past-${item.id}`}
                    button
                    onClick={() => handleCardClick(item)}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Box
                        sx={{
                          backgroundColor: typeConfig[item.type]?.color || "#757575",
                          color: "white",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.7,
                        }}
                      >
                        {getEventIcon(item.type)}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={item.type === "wedding" 
                        ? `${item.groomName} & ${item.brideName}`
                        : item.type === "baptism"
                          ? item.child?.fullName
                          : item.type === "funeral"
                            ? item.name
                            : item.offerrorsName}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {formatDate(getEventDate(item))}
                          </Typography>
                          {" — "}
                          {typeConfig[item.type]?.label}
                        </>
                      }
                      sx={{ opacity: 0.7 }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No past events found
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PriestNavigation;