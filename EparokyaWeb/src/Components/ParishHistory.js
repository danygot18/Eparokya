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
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem

} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Place,
  Group
} from '@mui/icons-material';
import today1 from '../assets/images/today1.jpg';
import y2002 from '../assets/images/2002.jpg'
import y2000 from '../assets/images/2000.jpg'
import y1996 from '../assets/images/1996.jpg'
import y1988 from '../assets/images/1988.jpg'
import y1984 from '../assets/images/1984.jpg'
import y1983 from '../assets/images/1983.jpg'
import y1982 from '../assets/images/1982.jpg'
import december_1982 from '../assets/images/december_1982.jpg'


const historyData = {
  '1982 Nov': {
    image: y1982,
    title: 'Foundation of the Parish - November 1982',
    text: 'Nagkaroon ng pagpupulong sa pangunguna ni Kagawad Dionisio Castillo na magkaroon ng Bahay Dalanginan o Kapilya. Sinang-ayunan ng Punong Barangay na magkaroon ng lupa ang kapilya gayundin ng Kura Paroko St. Martin de Porres Parish sa United, Paranaque na nakasakop sa buong barangay. Ang kapilya ay itinayo sa pamamagitan ng Bayanihan ng mga mamamayanan, ng mga madre at kura paroko na si Msgr. Bienvenido Mercado.',
    keyPeople: [
      { name: 'Kagawad Dionisio Castillo', role: 'Initiator' },
      { name: 'Msgr. Bienvenido Mercado', role: 'Kura Paroko' }
    ],
    location: 'Original Kapilya Site'
  },
  '1982 Dec': {
    image: december_1982,
    title: 'First Mass - December 1982',
    text: 'Ginanap ang kauna-unahang Misa sa pagunguna ni Monsignor Bienvenido Mercado kura paroko ng St. Martin de Porres, United Hills Parish. Ang sumisigang ito nabuo ang pangarap ng lahat na sa takdang panahon, ito ay ganap na pangarap ng parokya sa tulong ng Panginoon.',
    keyPeople: [
      { name: 'Msgr. Bienvenido Mercado', role: 'Celebrant' },
      { name: 'Lay Ministers Group', role: 'Assistants' }
    ],
    location: 'Kapilya'
  },
  '1983': {
    image: y1983,
    title: 'Coming of Religious Congregations',
    text: 'Ang mga Salesiano ni Don Bosco ang nagmimisa sa Kapilya na ito sa pangunguna ni Fr. Rene Gagayna, Fr. Andy Wong, Fr. Broderick Pahillo (ngayon, Katawan ng Obispo, Arkidiyosesis ng Maynila). Nagsimula nang lumago ang pananampalataya ng unang komunidad sa tulong ng pagdating ng ibat-ibang religious congregations tulad ng mga Jesuits, CI CM, I.C.M. mga Seminarista mula sa San Carlos Seminary, Holy Apostles Senior Seminary at Don Bosco Seminary.',
    keyPeople: [
      { name: 'Sisters of the Holy Family', role: 'Religious Congregation' }
    ],
    location: 'Parish Center'
  },
  '1984': {
    image: y1984,
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
    image: y1988,
    title: 'Strengthening the Parish and Faith',
    text: 'Lalo pang pinag-ibayo ni Fr. Rene Lagaya ang mga pormaayon ng ibat-ibang organisasyon at mamamayan. Sa panahon ding ito dumating ang tulong buhat sa komunidad upang ang isang malakas na bagyo na sumira sa kapilya ngunit naitayong muli at pinagkasunduang gawing mas matatag na istraktura.',
    keyPeople: [
      { name: 'Fr. Rene Lagaya', role: 'Parish Priest' }
    ],
    location: 'Saint Joseph Parish'
  },
  '1996': {
    image: y1996,
    title: 'The Convent',
    text: ' Sa panahong ito nabuo ang kumbento at napagkasunduan ng mga mamamayan ng Upper Bicutan na magkaroon ng pagpupulong. Dino napagkasunduan na magkaroon ng sariling patron at kapistahan ang kapilya. Ito ay pinagtibay ng Barangay Council at ng Kura Paroko sa katauhan ni Fr. Dennis Salise. Ang kapilya ay pinangalanang Saint Joseph Chapel.',
    keyPeople: [
      { name: 'Barangay Council', role: 'Nagpatibay' },
      { name: 'Fr. Dennis Salise', role: 'Nagpatibay' }
    ],
    location: 'Saint Joseph Chapel'
  },
  '2000s': {
    image: y2000,
    title: 'The Parish in the New Millennium',
    text: 'Sa pamamagitan ni Fr. Rev Evangelista, ipinadala sa ating kapilya si Fr. Ben Claveria, isang Pransiskanong pari upang ihanda ang pamayanan na maging isang ganap na parokya. Pinag-ibayo ni Fr. Ben ang karagdagahan ng pamayanan sa pamamagitan ng paglulunsad ng mga gawain lalo na ang pagpapaganda ng simbahan.',
    keyPeople: [
      { name: 'Fr. Rev Evangelista', role: 'Nagtuloy' },
      { name: 'Fr. Ben Claveria', role: 'Nagtuloy' }
    ],
    location: 'Saint Joseph Parish'
  },
  '2002': {
    image: y2002,
    title: 'Holy',
    text: 'Binasbasan ang bagong simbahan sa pamumuno ni Bishop Nestor Carino, Obispo ng Distrito ng Pasig.',
    keyPeople: [
      { name: 'Bishop Nestor Carino', role: 'Nagbasbas' },

    ],
    location: 'Saint Joseph Parish'
  },
  'Today': {
    image: today1,
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

  const handleChange = (event, newValue) => setSelectedTab(newValue);

  const { image, title, text, keyPeople, location } = historyData[selectedTab] || {};
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      className="min-h-screen bg-gray-100 bg-fixed bg-cover bg-center"
      sx={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(/assets/background-pattern.png)',
        padding: '2rem',
      }}
    >
      {/* HEADER */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className="font-bold text-green-800 text-2xl sm:text-4xl mb-8"
      >
        Our Parish History
      </Typography>

      {/* MAIN CONTAINER */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
        {/* Tabs (Responsive: horizontal on mobile, vertical on large) */}
        {isMobile && (
          <div className="w-full mb-4">
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="history-year-select-label">Select Year</InputLabel>
                <Select
                  labelId="history-year-select-label"
                  value={selectedTab}
                  label="Select Year"
                  onChange={(e) => handleChange(null, e.target.value)}
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 1,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#97cf8a',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#7db86e',
                    },
                  }}
                >
                  {Object.keys(historyData).map((year) => (
                    <MenuItem key={year} value={year}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {year}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#97cf8a' }}>
                          {historyData[year].title.split('-')[0].trim()}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        )}


        {!isMobile && (
          < div className="w-full lg:w-1/5">
            <Tabs
              orientation="vertical"
              value={selectedTab}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderRight: { lg: '1px solid #e0e0e0' },
                '& .MuiTabs-indicator': { backgroundColor: '#97cf8a', width: 3 },
              }}
            >
              {Object.keys(historyData).map((year) => (
                <Tab
                  key={year}
                  label={
                    <Box sx={{ textAlign: 'left', p: 1 }}>
                      <Typography variant="body1" fontWeight="bold">
                        {year}
                      </Typography>
                      {selectedTab === year && (
                        <Typography variant="caption" sx={{ color: '#97cf8a' }}>
                          {historyData[year].title.split('-')[0].trim()}
                        </Typography>
                      )}
                    </Box>
                  }
                  value={year}
                  sx={{
                    '&.Mui-selected': { backgroundColor: 'rgba(151,207,138,0.08)' },
                  }}
                />
              ))}
            </Tabs>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 w-full">
          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            className="font-bold text-green-800 mb-4 text-xl sm:text-3xl"
          >
            {title}
          </Typography>

          {/* Main card */}
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Paper
              elevation={4}
              className="p-4 sm:p-6 rounded-3xl bg-white shadow-lg mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Image */}
                <Fade in={true}>
                  <div className="rounded-2xl overflow-hidden shadow-md h-[250px] sm:h-[300px] md:h-full">
                    <img
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Fade>

                {/* Details */}
                <div>
                  <Typography variant="body1" paragraph className="text-[1rem] leading-7">
                    {text}
                  </Typography>

                  <Divider className="my-4" />

                  <div className="flex items-center mb-2">
                    <Place sx={{ mr: 1, color: '#97cf8a' }} />
                    <Typography variant="subtitle1">
                      <strong>Location:</strong> {location}
                    </Typography>
                  </div>

                  <div className="flex items-center mb-2">
                    <Group sx={{ mr: 1, color: '#97cf8a' }} />
                    <Typography variant="subtitle1">
                      <strong>Key People:</strong>
                    </Typography>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {keyPeople.map((person, index) => (
                      <Chip
                        key={index}
                        avatar={<Avatar sx={{ bgcolor: '#97cf8a' }}>{person.name.charAt(0)}</Avatar>}
                        label={`${person.name} (${person.role})`}
                        variant="outlined"
                        sx={{ borderColor: '#97cf8a', color: '#2e7d32' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Paper>
          </Slide>

          {/* Related Events */}
          <Typography
            variant="h5"
            className="mb-4 font-bold text-green-800 text-lg sm:text-2xl"
          >
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
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                      },
                    }}
                    onClick={() => setSelectedTab(year)}
                  >
                    <CardMedia component="img" height="160" image={data.image} alt={data.title} />
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
        </div>
      </div>
    </Box >
  );
}

export default ParishHistory;