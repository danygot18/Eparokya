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
  Modal,
  Button,
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
  People as CounselingIcon,

} from "@mui/icons-material";
import HouseIcon from '@mui/icons-material/House';
import { History as HistoryIcon } from "@mui/icons-material";
import SideBar from "../SideBar";
import MetaData from "../../Layout/MetaData";
import PriestCalendar from './PriestCalendar';
import PriestNavigationExtension from './PriestNavigationExtension';

const PriestNavigation = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dateFilter, setDateFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const config = {
    withCredentials: true,
  }

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [weddings, baptisms, funerals, counseling, houseBlessing, prayers] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedFuneral`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/getConfirmedCounseling`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/houseBlessing/getConfirmedHouseBlessing`, config),
        axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPrayerRequestIntention`),

      ]);

      setData([
        ...weddings.data.map((item) => ({
          type: "wedding",
          id: item._id,
          ...item,
        })),
        ...baptisms.data.map((item) => ({
          type: "baptism",
          id: item._id,
          ...item,
        })),
        ...funerals.data.map((item) => ({
          type: "funeral",
          id: item._id,
          ...item,
        })),
        ...counseling.data.map((item) => ({
          type: "counseling",
          id: item._id,
          ...item,
        })),
        ...houseBlessing.data.map((item) => ({
          type: "houseBlessing",
          id: item._id,
          ...item,
        })),
        ...prayers.data.map((item) => ({
          type: "prayer",
          id: item._id,
          ...item,
        })),
      ]);
      setLastUpdated(new Date());
      console.log(houseBlessing.data);
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

  const getEventDate = (item) => {
    switch (item.type) {
      case "wedding":
        return item.weddingDate;
      case "baptism":
        return item.baptismDate;
      case "funeral":
        return item.dateOfDeath;
      case "counseling":
        return item.counselingDate;
      case "houseBlessing":
        return item.blessingDate;
      case "prayer":
        return item.prayerRequestDate;
      default:
        return null;
    }
  };

  const getTodaysEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return data.filter((item) => {
      const eventDate = new Date(getEventDate(item));
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return data
      .filter((item) => {
        const eventDate = new Date(getEventDate(item));
        return eventDate > today && eventDate <= endOfMonth;
      })
      .sort((a, b) => new Date(getEventDate(a)) - new Date(getEventDate(b)));
  };

  const filterByDate = (items) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "today":
        return items.filter((item) => {
          const date = new Date(getEventDate(item));
          date.setHours(0, 0, 0, 0);
          return date.getTime() === today.getTime();
        });
      case "upcoming":
        return items.filter((item) => {
          const date = new Date(getEventDate(item));
          return date > today;
        });
      case "done":
        return items.filter((item) => {
          const date = new Date(getEventDate(item));
          return date < today;
        });
      default:
        return items;
    }
  };

  const filteredData = filterByDate(
    filter === "all" ? data : data.filter((item) => item.type === filter)
  );

  const handleCardClick = (item) => {
    const paths = {
      wedding: `/admin/weddingDetails/${item.id}`,
      baptism: `/admin/baptismDetails/${item.id}`,
      funeral: `/admin/funeralDetails/${item.id}`,
      counseling: `/admin/counselingDetails/${item.id}`,
      houseBlessing: `/admin/houseBlessingDetails/${item.id}`,
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
    counseling: {
      color: "#FF9800",
      icon: <CounselingIcon />,
      label: "Counseling",
    },
    counseling: {
      color: "#FF9800",
      icon: <CounselingIcon />,
      label: "Counseling",
    },
    houseBlessing: {
      color: "#FF9800",
      icon: <HouseIcon />,
      label: "House Blessing",
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
              <strong>Date:</strong> {formatDate(item.weddingDate)} at{" "}
              {formatTime(item.weddingTime)}
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
              <strong>Date:</strong> {formatDate(item.baptismDate)} at{" "}
              {formatTime(item.baptismTime)}
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
      case "counseling":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>Client:</strong> {item.person.fullName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Contact:</strong> {item.contactNumber}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong> {formatDate(item.counselingDate)} at{" "}
              {formatTime(item.counselingTime)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Purpose:</strong> {item.purpose}
            </Typography>
          </>
        );
      case "houseBlessing":
        return (
          <>
            <Typography variant="body2" gutterBottom>
              <strong>Client:</strong> {item.fullName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Contact:</strong> {item.contactNumber}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Date:</strong> {formatDate(item.blessingDate)} at{" "}
              {formatTime(item.counselingTime)}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Time:</strong> {item.blessingTime}
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
              <strong>Date:</strong> {formatDate(item.prayerRequestDate)} at{" "}
              {formatTime(item.prayerRequestTime)}
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

    return data
      .filter((item) => {
        const eventDate = new Date(getEventDate(item));
        return eventDate < today;
      })
      .sort((a, b) => new Date(getEventDate(b)) - new Date(getEventDate(a)))
      .slice(0, 5);
  };

  const pastEvents = getPastEvents();

return (
  <Box sx={{ display: "flex", minHeight: "100vh" }}>
    <SideBar />
    {/* <MetaData title="Priest Navigation" /> */}

    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Grid container spacing={3}>
  {/* LEFT SIDE: Priest Navigation */}
  <Grid item xs={12} md={8}>
    <PriestNavigationExtension
      prayerIntentions={data.filter(d => d.type === 'prayer')}
      prayerRequests={data.filter(d => d.type === 'prayer')}
      counseling={data.filter(d => d.type === 'counseling')}
      houseBlessings={data.filter(d => d.type === 'houseBlessing')}
      weddings={data.filter(d => d.type === 'wedding')}
      baptisms={data.filter(d => d.type === 'baptism')}
    />
  </Grid> 
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              <TodayIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Today's Schedule
            </Typography>

            {/* Today Events */}
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
                          backgroundColor:
                            typeConfig[item.type]?.color || "#757575",
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
                      primary={
                        item.type === "wedding"
                          ? `${item.groomName} & ${item.brideName}`
                          : item.type === "baptism"
                          ? item.child?.fullName
                          : item.type === "funeral"
                          ? item.name
                          : item.type === "counseling"
                          ? item.person?.fullName
                          : item.contactPerson
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {typeConfig[item.type]?.label}
                          </Typography>
                          {" — "}
                          {formatTime(
                            item.type === "wedding"
                              ? item.weddingTime
                              : item.type === "baptism"
                              ? item.baptismTime
                              : item.type === "counseling"
                              ? item.counselingTime
                              : item.type === "prayer"
                              ? item.prayerRequestTime
                              : ""
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

            {/* Upcoming Events */}
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
                          backgroundColor:
                            typeConfig[item.type]?.color || "#757575",
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
                      primary={
                        item.type === "wedding"
                          ? `${item.groomName} & ${item.brideName}`
                          : item.type === "baptism"
                          ? item.child?.fullName
                          : item.type === "funeral"
                          ? item.name
                          : item.type === "counseling"
                          ? item.person?.fullName
                          : item.contactPerson
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
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

            <Typography variant="h5" component="h2" gutterBottom>
              <HistoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Recent Past Events
            </Typography>

            {/* Past Events */}
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
                          backgroundColor:
                            typeConfig[item.type]?.color || "#757575",
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
                      primary={
                        item.type === "wedding"
                          ? `${item.groomName} & ${item.brideName}`
                          : item.type === "baptism"
                          ? item.child?.fullName
                          : item.type === "funeral"
                          ? item.name
                          : item.type === "counseling"
                          ? item.person?.fullName
                          : item.contactPerson
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
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
    </Box>
  </Box>
);

};

export default PriestNavigation;