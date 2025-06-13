import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import GuestSideBar from '../../GuestSideBar';
import {
  Favorite as WeddingIcon,
  ChildFriendly as BaptismIcon,
  SentimentVeryDissatisfied as FuneralIcon,
  Spa as CounselingIcon,
  Home as HouseIcon,
  AllInclusive as MassIcon,
  MenuBook as PrayerIcon,
  Checklist as SubmittedIcon
} from '@mui/icons-material';

const formIcons = {
  'Private Wedding': <WeddingIcon />,
  'Private Baptism': <BaptismIcon />,
  'Private Funeral': <FuneralIcon />,
  'Mass Intentions': <PrayerIcon />,
  'Counseling': <CounselingIcon />,
  'House Blessing': <HouseIcon />,
  'Kasalang Bayan': <WeddingIcon />,
  'Binyagang Bayan': <BaptismIcon />
};

const formColors = {
  'Private Wedding': '#FF9A9E',
  'Private Baptism': '#A1C4FD',
  'Private Funeral': '#B7B7B7',
  'Mass Intentions': '#FFD3B6',
  'Counseling': '#D4FC79',
  'House Blessing': '#FDCBF1',
  'Kasalang Bayan': '#FF758C',
  'Binyagang Bayan': '#74EBD5'
};

const SubmittedFormsNavigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formCategories = [
    {
      title: 'Private Forms',
      description: 'View your submitted private ceremony forms',
      forms: [
        { name: 'Private Wedding', path: '/user/SubmittedWeddingList' },
        { name: 'Private Baptism', path: '/user/SubmittedBaptismList' },
        { name: 'Private Funeral', path: '/user/SubmittedFuneralList' },
        { name: 'Mass Intentions', path: '/user/SubmittedPrayerRequestList' },
        { name: 'Counseling', path: '/user/SubmittedCounselingList' },
        { name: 'House Blessing', path: '/user/SubmittedHouseBlessingList' },
      ],
    },
    {
      title: 'Mass Forms',
      description: 'View your submitted mass ceremony forms',
      forms: [
        { name: 'Kasalang Bayan', path: '/user/MassSubmittedWeddingList' },
        { name: 'Binyagang Bayan', path: '/user/MassSubmittedBaptismList' },
      ],
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <GuestSideBar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 5, flexGrow: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)'
          }}
        >

          {formCategories.map((category, index) => (
            <Box key={index} sx={{ mb: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{
                  bgcolor: theme.palette.mode === 'dark' ? '#3aef73' : '#2C3E50',
                  color: '#fff',
                  mr: 2
                }}>
                  {category.title.startsWith('Private') ? <HouseIcon /> : <MassIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
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
                  ? 'linear-gradient(90deg, transparent 0%, #3aef73 50%, transparent 100%)'
                  : 'linear-gradient(90deg, transparent 0%, #2C3E50 50%, transparent 100%)',
                height: '2px'
              }} />

              <Grid container spacing={3}>
                {category.forms.map((form, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        borderLeft: `4px solid ${formColors[form.name]}`,
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: theme.shadows[6]
                        }
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        to={form.path}
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          justifyContent: 'flex-start',
                          p: 2
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: theme.palette.mode === 'dark'
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(44, 62, 80, 0.1)',
                            mr: 2,
                            color: formColors[form.name]
                          }}>
                            {formIcons[form.name]}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {form.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          View submitted {form.name.toLowerCase()} forms
                        </Typography>
                        <Box sx={{ 
                          mt: 'auto',
                          pt: 2,
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: theme.palette.mode === 'dark' ? '#3aef73' : '#2C3E50',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            View Details
                            <Box component="span" sx={{ ml: 1 }}>→</Box>
                          </Typography>
                        </Box>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default SubmittedFormsNavigation;