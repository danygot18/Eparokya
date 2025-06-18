import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Paper,
  Button,
  IconButton,
  Avatar,
  Divider,
  Chip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Place,
  Group
} from '@mui/icons-material';

const historyData = {
  '1982 Nov': {
    image: '/assets/church-construction.jpg',
    title: 'Foundation of the Parish - November 1982',
    text: 'Nagkaroon ng pagpupulong sa pangunguna ni Kagawad Dionisio Castillo na magkaroon ng Bahay Dalanginan o Kapilya. Sinang-ayunan ng Punong Barangay na magkaroon ng lupa ang kapilya gayundin ng Kura Paroko St. Martin de Porres Parish sa United, Paranaque na nakasakop sa buong barangay. Ang kapilya ay itinayo sa pamamagitan ng Bayanihan ng mga mamamayanan, ng mga madre at kura paroko na si Msgr. Bienvenido Mercado.',
    keyPeople: [
      { name: 'Kagawad Dionisio Castillo', role: 'Initiator' },
      { name: 'Msgr. Bienvenido Mercado', role: 'Kura Paroko' }
    ],
    location: 'Original Kapilya Site'
  },
  '1982 Dec': {
    image: '/assets/first-mass.jpg',
    title: 'First Mass - December 1982',
    text: 'The first mass was celebrated in the newly constructed kapilya, marking the beginning of regular worship services in the community. Over 200 parishioners attended this historic event, which was presided by Msgr. Mercado with assistance from local lay ministers.',
    keyPeople: [
      { name: 'Msgr. Bienvenido Mercado', role: 'Celebrant' },
      { name: 'Lay Ministers Group', role: 'Assistants' }
    ],
    location: 'Kapilya'
  },
  '1983': {
    image: '/assets/religious-arrival.jpg',
    title: 'Coming of Religious Congregations',
    text: 'The Sisters of the Holy Family arrived to assist with catechesis and community programs. Their presence strengthened the spiritual formation programs and initiated the parish\'s first organized charity works.',
    keyPeople: [
      { name: 'Sisters of the Holy Family', role: 'Religious Congregation' }
    ],
    location: 'Parish Center'
  },
  '1984': {
    image: '/assets/community-building.jpg',
    title: 'Built Community',
    text: 'The parish established its first Basic Ecclesial Communities (BECs), organizing the faithful into smaller neighborhood groups for prayer, scripture sharing, and mutual support. This became the foundation for the parish\'s strong community spirit.',
    keyPeople: [
      { name: 'BEC Coordinators', role: 'Community Leaders' }
    ],
    location: 'Various Sitios'
  },
  '1986': {
    image: '/assets/challenges.jpg',
    title: 'Parish Challenge',
    text: 'The parish faced significant challenges during the EDSA Revolution period, with divided loyalties among parishioners. The clergy worked tirelessly to promote peace and reconciliation within the community.',
    keyPeople: [
      { name: 'Parish Pastoral Council', role: 'Leadership' }
    ],
    location: 'Parish and Surrounding Areas'
  },
  '1988': {
    image: '/assets/strengthening.jpg',
    title: 'Strengthening the Parish and Faith',
    text: 'Major renovations were completed on the church building, and the parish launched its first comprehensive catechetical program for all ages. The parish also began its annual pilgrimage tradition.',
    keyPeople: [
      { name: 'Renovation Committee', role: 'Project Leaders' }
    ],
    location: 'Church Building'
  },
  '1996': {
    image: '/assets/convent.jpg',
    title: 'The Convent',
    text: 'A dedicated convent was built to house the religious sisters serving the parish, allowing for expanded ministries and more consistent presence of religious in the community.',
    keyPeople: [
      { name: 'Construction Team', role: 'Builders' },
      { name: 'Donors', role: 'Benefactors' }
    ],
    location: 'Church Compound'
  },
  '2000s': {
    image: '/assets/millenium.jpg',
    title: 'The Parish in the New Millennium',
    text: 'The parish embraced digital technology for evangelization, launched youth programs, and established partnerships with international Catholic organizations. The parish center was expanded to accommodate growing ministries.',
    keyPeople: [
      { name: 'Youth Ministry', role: 'Tech Integration' },
      { name: 'Parish Staff', role: 'Administration' }
    ],
    location: 'Expanded Facilities'
  },
  'Today': {
    image: '/assets/today.jpg',
    title: 'Today\'s Parish',
    text: 'Our parish continues to grow in numbers and faith. With a strong community and modern programs, we remain committed to serving with love and mission. The parish now serves over 5,000 families with diverse ministries and outreach programs.',
    keyPeople: [
      { name: 'Current Parish Priest', role: 'Spiritual Leader' },
      { name: 'Parishioners', role: 'Community' }
    ],
    location: 'Present Church'
  },
};

function ParishHistory() {
  const [selectedTab, setSelectedTab] = useState(Object.keys(historyData)[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const greenTheme = {
    ...theme,
    palette: {
      ...theme.palette,
      primary: {
        main: '#97cf8a',
        contrastText: '#fff'
      }
    }
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const navigateHistory = (direction) => {
    const years = Object.keys(historyData);
    const currentIndex = years.indexOf(selectedTab);
    
    if (direction === 'next' && currentIndex < years.length - 1) {
      setSelectedTab(years[currentIndex + 1]);
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedTab(years[currentIndex - 1]);
    }
  };

  const { image, title, text, keyPeople, location } = historyData[selectedTab] || {};

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4, 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/assets/background-pattern.png)',
      backgroundAttachment: 'fixed'
    }}>
      {/* <Typography 
        variant="h3" 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold',
          color: '#2e7d32',
          mb: 4,
          textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        Our Parish History
      </Typography> */}

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          mt: 2,
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 3
        }}
      >
        {/* Vertical Tabs */}
        <Tabs
          orientation={isMobile ? 'horizontal' : 'vertical'}
          value={selectedTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
            borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
            mb: isMobile ? 2 : 0,
            minWidth: isMobile ? '100%' : 180,
            maxHeight: isMobile ? 'auto' : '70vh',
            '& .MuiTabs-indicator': {
              backgroundColor: '#97cf8a',
              width: isMobile ? '100%' : 3
            }
          }}
        >
          {Object.keys(historyData).map((year) => (
            <Tab
              key={year}
              label={
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: isMobile ? 'center' : 'flex-start',
                  p: 1
                }}>
                  <Typography variant="body1" fontWeight="bold">{year}</Typography>
                  {selectedTab === year && (
                    <Typography variant="caption" sx={{ color: '#97cf8a' }}>
                      {historyData[year].title.split('-')[0].trim()}
                    </Typography>
                  )}
                </Box>
              }
              value={year}
              sx={{
                alignItems: 'flex-start',
                textAlign: 'left',
                minHeight: 60,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(151, 207, 138, 0.08)'
                }
              }}
            />
          ))}
        </Tabs>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          width: isMobile ? '100%' : '70%',
          position: 'relative'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2,
            gap: 2
          }}>
            <IconButton 
              onClick={() => navigateHistory('prev')}
              disabled={selectedTab === Object.keys(historyData)[0]}
              sx={{ 
                visibility: selectedTab === Object.keys(historyData)[0] ? 'hidden' : 'visible',
                color: '#97cf8a'
              }}
            >
              <ArrowBack fontSize="large" />
            </IconButton>
            
            <Typography variant="h4" align="center" sx={{ 
              fontWeight: 'bold',
              color: '#2e7d32',
              mx: 2,
              flexGrow: 1
            }}>
              {title}
            </Typography>
            
            <IconButton 
              onClick={() => navigateHistory('next')}
              disabled={selectedTab === Object.keys(historyData)[Object.keys(historyData).length - 1]}
              sx={{ 
                visibility: selectedTab === Object.keys(historyData)[Object.keys(historyData).length - 1] ? 'hidden' : 'visible',
                color: '#97cf8a'
              }}
            >
              <ArrowForward fontSize="large" />
            </IconButton>
          </Box>

          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Paper
              elevation={4}
              sx={{
                p: 3,
                backgroundColor: '#fff',
                borderRadius: 3,
                mb: 3,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    height: '100%',
                    minHeight: 300
                  }}>
                    <Fade in={true}>
                      <Box
                        component="img"
                        src={image}
                        alt={title}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    </Fade>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                    {text}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Place sx={{ mr: 1, color: '#97cf8a' }} />
                    <Typography variant="subtitle1">
                      <strong>Location:</strong> {location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Group sx={{ mr: 1, color: '#97cf8a' }} />
                    <Typography variant="subtitle1">
                      <strong>Key People:</strong>
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {keyPeople.map((person, index) => (
                      <Chip
                        key={index}
                        avatar={<Avatar sx={{ bgcolor: '#97cf8a' }}>{person.name.charAt(0)}</Avatar>}
                        label={`${person.name} (${person.role})`}
                        variant="outlined"
                        sx={{ borderColor: '#97cf8a', color: '#2e7d32' }}
                      />
                    ))}
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    sx={{ 
                      mr: 2,
                      backgroundColor: '#97cf8a',
                      '&:hover': {
                        backgroundColor: '#7cb56d'
                      }
                    }}
                    onClick={() => window.open(image, '_blank')}
                  >
                    View Full Image
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Slide>
          
          {/* Related Events */}
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#2e7d32' }}>
            Related Historical Events
          </Typography>
          
          <Grid container spacing={3}>
            {Object.entries(historyData)
              .filter(([year]) => year !== selectedTab)
              .slice(0, 3)
              .map(([year, data]) => (
                <Grid item xs={12} sm={6} md={4} key={year}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                      }
                    }}
                    onClick={() => setSelectedTab(year)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={data.image}
                      alt={data.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {year}: {data.title.split('-')[0].trim()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.text.substring(0, 100)}...
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" sx={{ color: '#97cf8a' }}>
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

export default ParishHistory;