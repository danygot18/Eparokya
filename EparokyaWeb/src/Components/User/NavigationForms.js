import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
  Divider,
  Skeleton,
  Paper
} from "@mui/material";
import {
  Favorite as WeddingIcon,
  ChildFriendly as BaptismIcon,
  SentimentVeryDissatisfied as FuneralIcon,
  Spa as CounselingIcon,
  Home as HouseIcon,
  AllInclusive as MassIcon,
  MenuBook as PrayerIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import GuestSideBar from "../GuestSideBar";

const formIcons = {
  "Private Wedding": <WeddingIcon fontSize="large" />,
  "Private Baptism": <BaptismIcon fontSize="large" />,
  "Private Funeral": <FuneralIcon fontSize="large" />,
  "Mass Intentions": <PrayerIcon fontSize="large" />,
  "Counseling": <CounselingIcon fontSize="large" />,
  "House Blessing": <HouseIcon fontSize="large" />,
  "Kasalang Bayan": <WeddingIcon fontSize="large" />,
  "Binyagang Bayan": <BaptismIcon fontSize="large" />
};

const formColors = {
  "Private Wedding": "linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)",
  "Private Baptism": "linear-gradient(135deg, #A1C4FD 0%, #C2E9FB 100%)",
  "Private Funeral": "linear-gradient(135deg, #B7B7B7 0%, #E2E2E2 100%)",
  "Mass Intentions": "linear-gradient(135deg, #FFD3B6 0%, #FFAAA5 100%)",
  "Counseling": "linear-gradient(135deg, #D4FC79 0%, #96E6A1 100%)",
  "House Blessing": "linear-gradient(135deg, #FDCBF1 0%, #E6DEE9 100%)",
  "Kasalang Bayan": "linear-gradient(135deg, #FF758C 0%, #FF7EB3 100%)",
  "Binyagang Bayan": "linear-gradient(135deg, #74EBD5 0%, #9FACE6 100%)"
};

const NavigationForm = () => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formCategories = [
    {
      title: "Private Forms",
      description: "Forms for individual ceremonies and services",
      icon: <HouseIcon />,
      forms: [
        { name: "Solo Wedding", path: "/user/weddingForm" },
        { name: "Solo Baptism", path: "/user/baptismForm" },
        { name: "Private Funeral", path: "/user/funeralForm" },
        { name: "Mass Intentions", path: "/user/prayerRequest" },
        { name: "Counseling", path: "/user/counselingForm" },
        { name: "Property Blessing", path: "/user/houseBlessingForm" },
      ],
    },
    {
      title: "Mass Forms",
      description: "Forms for community ceremonies",
      icon: <MassIcon />,
      forms: [
        { name: "Kasalang Bayan", path: "/user/massWedding" },
        { name: "Binyagang Bayan", path: "/user/massBaptism" },
      ],
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <GuestSideBar />
        <Container sx={{ mt: 5, flexGrow: 1 }}>
          <Skeleton variant="text" width="60%" height={60} />
          {[1, 2].map((category) => (
            <Box key={category} sx={{ mt: 4 }}>
              <Skeleton variant="text" width="40%" height={40} />
              <Grid container spacing={3} sx={{ mt: 2 }}>
                {[1, 2, 3].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item}>
                    <Skeleton variant="rectangular" height={150} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: theme.palette.mode === 'dark' 
          ? 'radial-gradient(circle at top left, #2C3E50 0%, #1A1A1A 100%)' 
          : 'radial-gradient(circle at top left, #f5f7fa 0%, #e4e8ed 100%)'
      }}
    >
      {/* Sidebar */}
      <GuestSideBar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.mode === 'dark' ? '#fff' : '#2C3E50',
            mb: 4,
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #FF7B7B 0%, #FF5252 100%)',
              mt: 1
            }
          }}
        >
          Forms Navigation
        </Typography>

        {formCategories.map((category, index) => (
          <Box key={index} sx={{ mt: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#FF5252' : '#2C3E50',
                color: '#fff',
                mr: 2 
              }}>
                {category.icon}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  color: theme.palette.mode === 'dark' ? '#fff' : '#2C3E50'
                }}>
                  {category.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ 
              mb: 3,
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(90deg, transparent 0%, #FF5252 50%, transparent 100%)' 
                : 'linear-gradient(90deg, transparent 0%, #2C3E50 50%, transparent 100%)',
              height: '1px'
            }} />

            <Grid container spacing={3}>
              {category.forms.map((form, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Paper
                    elevation={3}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: theme.shadows[8]
                      }
                    }}
                  >
                    <Box
                      sx={{
                        height: '6px',
                        width: '100%',
                        background: formColors[form.name]
                      }}
                    />
                    <CardContent sx={{ 
                      flexGrow: 1,
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(44, 62, 80, 0.7)'
                        : 'rgba(255, 255, 255, 0.9)'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2 
                      }}>
                        <Avatar sx={{ 
                          mr: 2,
                          background: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'rgba(44, 62, 80, 0.1)'
                        }}>
                          {formIcons[form.name]}
                        </Avatar>
                        <Typography 
                          variant="h6" 
                          component="div"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.mode === 'dark' ? '#fff' : '#2C3E50'
                          }}
                        >
                          {form.name}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ 
                      p: 2,
                      background: theme.palette.mode === 'dark'
                        ? 'rgba(44, 62, 80, 0.5)'
                        : 'rgba(244, 247, 250, 0.9)'
                    }}>
                      <Button
                        component={Link}
                        to={form.path}
                        variant="contained"
                        fullWidth
                        sx={{
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(90deg, #FF7B7B 0%, #FF5252 100%)'
                            : 'linear-gradient(90deg, #2C3E50 0%, #4A6491 100%)',
                          color: '#fff',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: theme.shadows[4]
                          }
                        }}
                      >
                        Go to Form
                      </Button>
                    </CardActions>
                  </Paper>
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