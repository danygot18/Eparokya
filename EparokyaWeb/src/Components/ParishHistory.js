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
    image: '../../assets/1982.png',
    title: 'Foundation of the Parish - November 1982',
    text: 'Nagkaroon ng pagpupulong sa pangunguna ni Kagawad Dionisio Castillo na magkaroon ng Bahay Dalanginan o Kapilya. Sinang-ayunan ng Punong Barangay na magkaroon ng lupa ang kapilya gayundin ng Kura Paroko St. Martin de Porres Parish sa United, Paranaque na nakasakop sa buong barangay. Ang kapilya ay itinayo sa pamamagitan ng Bayanihan ng mga mamamayanan, ng mga madre at kura paroko na si Msgr. Bienvenido Mercado.',
    keyPeople: [
      { name: 'Kagawad Dionisio Castillo', role: 'Initiator' },
      { name: 'Msgr. Bienvenido Mercado', role: 'Kura Paroko' }
    ],
    location: 'Original Kapilya Site'
  },
  '1982 Dec': {
    image: '/assets/december_1982.png',
    title: 'First Mass - December 1982',
    text: 'Ginanap ang kauna-unahang Misa sa pagunguna ni Monsignor Bienvenido Mercado kura paroko ng St. Martin de Porres, United Hills Parish. Ang sumisigang ito nabuo ang pangarap ng lahat na sa takdang panahon, ito ay ganap na pangarap ng parokya sa tulong ng Panginoon.',
    keyPeople: [
      { name: 'Msgr. Bienvenido Mercado', role: 'Celebrant' },
      { name: 'Lay Ministers Group', role: 'Assistants' }
    ],
    location: 'Kapilya'
  },
  '1983': {
    image: '/assets/images/1983.png',
    title: 'Coming of Religious Congregations',
    text: 'Ang mga Salesiano ni Don Bosco ang nagmimisa sa Kapilya na ito sa pangunguna ni Fr. Rene Gagayna, Fr. Andy Wong, Fr. Broderick Pahillo (ngayon, Katawan ng Obispo, Arkidiyosesis ng Maynila). Nagsimula nang lumago ang pananampalataya ng unang komunidad sa tulong ng pagdating ng ibat-ibang religious congregations tulad ng mga Jesuits, CI CM, I.C.M. mga Seminarista mula sa San Carlos Seminary, Holy Apostles Senior Seminary at Don Bosco Seminary.',
    keyPeople: [
      { name: 'Sisters of the Holy Family', role: 'Religious Congregation' }
    ],
    location: 'Parish Center'
  },
  '1984': {
    image: '/assets/images/1984.png',
    title: 'Built Community',
    text: ' Lumago ang bilang ng partisipasyon at pakikipam ng mga mamamayan. Ito na ang kabuuang ng pananampalataya ng lahat ng kapilya na muling dumalo sa pamahalaan ng simbahan sa pamamagitan ng ang upang nababalitaan ng kapilya.',
    keyPeople: [
      { name: 'Tessie Ilave', role: 'Contributors' },
      { name: 'Salvador Trinidad', role: 'Contributors' },
      { name: 'Conchita Gonzales', role: 'Contributors' },
    ],
    location: 'Saint Joseph'
  },
  '1986': {
    image: '/assets/images/1986.png',
    title: 'Parish Challenge',
    text: 'Dumating ang malaking pagsubok sa komunidad nang isabatas ang Proc. No. 172 na isinasalin ang lupain ng Upper Bicutan sa pagmamay-ari ng mga naninirahan dito. Nagkaroon ng pagkakahati-hati at pagbabaha-bahagi ang dating isang komunidad. Ang pagsubok na ito ay hindi naging hadlang upang ang lahat ay magpatuloy sa paglilingkod.',
    keyPeople: [
      { name: 'Holy Apostles', role: 'Katekista' },
      { name: 'San Carlos Seminary', role: 'Katekista' }
    ],
    location: 'Parish and Surrounding Areas'
  },
  '1988': {
    image: '/assets/images/1988.png',
    title: 'Strengthening the Parish and Faith',
    text: 'Lalo pang pinag-ibayo ni Fr. Rene Lagaya ang mga pormaayon ng ibat-ibang organisasyon at mamamayan. Sa panahon ding ito dumating ang tulong buhat sa komunidad upang ang isang malakas na bagyo na sumira sa kapilya ngunit naitayong muli at pinagkasunduang gawing mas matatag na istraktura.',
    keyPeople: [
      { name: 'Fr. Rene Lagaya', role: 'Parish Priest' }
    ],
    location: 'Saint Joseph Parish'
  },
  '1996': {
    image: '/assets/images/1996.png',
    title: 'The Convent',
    text: ' Sa panahong ito nabuo ang kumbento at napagkasunduan ng mga mamamayan ng Upper Bicutan na magkaroon ng pagpupulong. Dino napagkasunduan na magkaroon ng sariling patron at kapistahan ang kapilya. Ito ay pinagtibay ng Barangay Council at ng Kura Paroko sa katauhan ni Fr. Dennis Salise. Ang kapilya ay pinangalanang Saint Joseph Chapel.',
    keyPeople: [
      { name: 'Barangay Council', role: 'Nagpatibay' },
      { name: 'Fr. Dennis Salise', role: 'Nagpatibay' }
    ],
    location: 'Saint Joseph Chapel'
  },
  '2000s': {
    image: '/assets/images/2000.png',
    title: 'The Parish in the New Millennium',
    text: 'Sa pamamagitan ni Fr. Rev Evangelista, ipinadala sa ating kapilya si Fr. Ben Claveria, isang Pransiskanong pari upang ihanda ang pamayanan na maging isang ganap na parokya. Pinag-ibayo ni Fr. Ben ang karagdagahan ng pamayanan sa pamamagitan ng paglulunsad ng mga gawain lalo na ang pagpapaganda ng simbahan.',
    keyPeople: [
      { name: 'Fr. Rev Evangelista', role: 'Nagtuloy' },
      { name: 'Fr. Ben Claveria', role: 'Nagtuloy' }
    ],
    location: 'Saint Joseph Parish'
  },
  '2002 ': {
    image: '/assets/images/2002.png',
    title: 'Holy',
    text: 'Binasbasan ang bagong simbahan sa pamumuno ni Bishop Nestor Carino, Obispo ng Distrito ng Pasig.',
    keyPeople: [
      { name: 'Bishop Nestor Carino', role: 'Nagbasbas' },

    ],
    location: 'Saint Joseph Parish'
  },
  'Today': {
    image: '../assets/images/today1.png',
    title: 'Today\'s Parish',
    text: 'Kasalukuyan patuloy ang pagpapatuloy ng sambayanan, gayundin ang pagtupad ng mga leaders upang tumulong sa parokya. Mahirap man at napakatagal na maraming dahlil para na maging Parish Pledgers sa paglalagay ng pagkakaisa ang Dios ay pagtupad ng mariin at magpupala sa lahat ng mga tumupad ng kanilang mga tungkulin at mga pangako.',
    keyPeople: [
      { name: 'Fr. Errol Mananquil', role: 'Current Parish Priest' },
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
            mb: 2
          }}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: 'bold',
                color: '#2e7d32',
                mx: 2
              }}
            >
              {title}
            </Typography>
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

                  {/* <Button
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
                  </Button> */}
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