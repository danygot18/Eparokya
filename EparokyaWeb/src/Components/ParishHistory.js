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
  Paper
} from '@mui/material';

const historyData = {
  '1982 Nov': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'Foundation of the Parish - November 1982',
    text: 'Nagkaroon ng pagpupulong sa pangunguna ni Kagawad Dionisio Castillo na magkaroon ng Bahay Dalanginan o Kapilya. Sinang-ayunan ng Punong Barangay na magkaroon ng lupa ang kapilya gayundin ng Kura Paroko St. Martin de Porres Parish sa United, Paranaque na nakasakop sa buong barangay. Ang kapilya ay itinayo sa pamamagitan ng Bayanihan ng mga mamamayanan, ng mga madre at kura paroko na si Msgr. Bienvenido Mercado'
  },
  '1982 Dec': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'First Mass - December 1982',
    text: 'By the 1980s, the parish experienced major growth, with the construction of a permanent church building, the launch of various ministries, and the start of outreach missions to nearby areas.'
  },
  '1983': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'Coming of Religious Congregations',
    text: 'Entering the new millennium, digital tools, youth programs, and new pastoral initiatives were introduced. The parish became a beacon of modern evangelization.'
  },
  '1984': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'Built Community',
    text: 'Our parish continues to grow in numbers and faith. With a strong community and modern programs, we remain committed to serving with love and mission.'
  },
  '1986': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'Parish Challenge',
    text: 'Our parish continues to grow in numbers and faith. With a strong community and modern programs, we remain committed to serving with love and mission.'
  },
  '1988': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'Strengthening the Parish and Faith',
    text: 'Our parish continues to grow in numbers and faith. With a strong community and modern programs, we remain committed to serving with love and mission.'
  },
  '1996': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'The Convent',
    text: 'Our parish continues to grow in numbers and faith. With a strong community and modern programs, we remain committed to serving with love and mission.'
  },
  '2000s': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'The Parish',
    text: 'Our parish continues to grow in numbers and faith. With a strong community and modern programs, we remain committed to serving with love and mission.'
  },
  'Today': {
    image: '/assets/EPAROKYA-SYST.png',
    title: 'Today\'s Parish',
    text: 'Our parish continues to grow in numbers and faith. With a strong community and modern programs, we remain committed to serving with love and mission.'
  },
};

function ParishHistory() {
  const [selectedTab, setSelectedTab] = useState(Object.keys(historyData)[0]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const { image, title, text } = historyData[selectedTab] || {};

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Parish History
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          mt: 4,
          alignItems: 'flex-start',
          justifyContent: 'center',
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
            borderRight: isMobile ? 'none' : '1px solid #ddd',
            mb: isMobile ? 2 : 0,
            minWidth: 120,
            maxHeight: isMobile ? 'auto' : 400
          }}
        >
          {Object.keys(historyData).map((year) => (
            <Tab
              key={year}
              label={year}
              value={year}
              sx={{
                alignItems: 'flex-start',
                textAlign: 'left'
              }}
            />
          ))}
        </Tabs>

        {/* Content Display */}
        {image && (
          <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Paper
              elevation={4}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                gap: 4,
                p: 4,
                backgroundColor: '#fff',
                borderRadius: 3,
                ml: isMobile ? 0 : 4,
                mt: isMobile ? 2 : 0,
                flexGrow: 1
              }}
            >
              <Fade in={true}>
                <Box
                  component="img"
                  src={image}
                  alt={title}
                  sx={{
                    width: isMobile ? '100%' : '50%',
                    height: 'auto',
                    borderRadius: 2,
                    objectFit: 'cover'
                  }}
                />
              </Fade>

              <Box>
                <Typography variant="h5" gutterBottom>{title}</Typography>
                <Typography variant="body1" color="text.secondary">{text}</Typography>
              </Box>
            </Paper>
          </Slide>
        )}
      </Box>
    </Box>
  );
}

export default ParishHistory;
