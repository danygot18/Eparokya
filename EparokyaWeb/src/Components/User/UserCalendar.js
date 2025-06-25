import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import GuestSideBar from '../GuestSideBar';
import Metadata from '../Layout/MetaData';
import { useTheme, useMediaQuery } from '@mui/material';
import { CircularProgress, Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Loader from '../Layout/Loader';
import UserLocalCalendarList from '../../Components/UserLocalCalendarList';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from '@mui/material';

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      justifyContent: 'space-between',
      alignItems: isMobile ? 'flex-start' : 'center',
      mb: 2,
      p: 2,
      backgroundColor: 'background.paper',
      borderRadius: 1,
      boxShadow: 1,
      gap: isMobile ? 1 : 2
    }}>
      <Typography variant="h6" sx={{
        fontWeight: 'bold',
        color: 'success.main',
        minWidth: isMobile ? '100%' : '200px',
        mb: isMobile ? 1 : 0,
        textAlign: isMobile ? 'center' : 'left'
      }}>{label}</Typography>

      <Box sx={{ display: 'flex', order: isMobile ? 2 : 1, width: isMobile ? '100%' : 'auto', justifyContent: 'center', gap: 1 }}>
        <IconButton onClick={() => onNavigate("PREV")} color="success" size="small"><ChevronLeft /></IconButton>
        <Button onClick={() => onNavigate('TODAY')} color='success' variant='outlined'>Today</Button>
        <IconButton onClick={() => onNavigate("NEXT")} color="success" size="small"><ChevronRight /></IconButton>
      </Box>

      <Box sx={{ display: 'flex', order: isMobile ? 1 : 2, width: isMobile ? '100%' : 'auto', justifyContent: 'center', gap: 1 }}>
        {['month', 'week', 'day', 'agenda'].map(v => (
          <Button key={v} onClick={() => onView(v)} variant={view === v ? 'contained' : 'outlined'} color="success" size="small">{v}</Button>
        ))}
      </Box>
    </Box>
  );
};

const UserCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('month');
  const [liturgical, setLiturgical] = useState([]);
  const [liturgicalPage, setLiturgicalPage] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const itemsPerPage = 10;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchAllEvents = useCallback(async () => {
    try {
      const [wedding, baptism, funeral, custom, liturgicalData] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedBaptism`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/confirmedFuneral`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/getAllCustomEvents`),
        axios.get(`${process.env.REACT_APP_API}/api/v1/liturgical/year/${year}`)
      ]);

      const formatted = [
        ...wedding.data.map(e => ({ id: `wedding-${e._id}`, title: `${e.brideName} & ${e.groomName} Wedding`, start: new Date(e.weddingDate), end: new Date(e.weddingDate), type: 'Wedding' })),
        ...baptism.data.map(e => ({ id: `baptism-${e._id}`, title: `Baptism of ${e.child.fullName}`, start: new Date(e.baptismDate), end: new Date(e.baptismDate), type: 'Baptism' })),
        ...funeral.data.map(e => ({ id: `funeral-${e._id}`, title: `Funeral for ${e.name}`, start: new Date(e.funeralDate), end: new Date(e.funeralDate), type: 'Funeral' })),
        ...custom.data.map(e => ({ id: `custom-${e._id}`, title: e.title, start: new Date(e.customeventDate), end: new Date(e.customeventDate), type: 'Custom' })),
        ...liturgicalData.data.map((e, i) => ({ id: `liturgical-${i}`, title: e.name, start: new Date(e.date * 1000), end: new Date(e.date * 1000), type: 'Liturgical' }))
      ];

      setEvents(formatted);
    } catch (error) {
      setErrorMessage("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => { fetchAllEvents(); }, [fetchAllEvents]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/api/v1/liturgical/year/${year}`)
      .then(res => setLiturgical(res.data))
      .catch(() => setLiturgical([]));
  }, [year]);

  const allLiturgicalItems = liturgical.map(item => ({ ...item }));
  const totalPages = Math.ceil(allLiturgicalItems.length / itemsPerPage);
  const paginatedItems = allLiturgicalItems.slice((liturgicalPage - 1) * itemsPerPage, liturgicalPage * itemsPerPage);

  const handleEventClick = (event) => setSelectedEvent(event);

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor:
        event.type === 'Wedding' ? '#FFD700' :
        event.type === 'Baptism' ? '#4CAF50' :
        event.type === 'Funeral' ? '#F44336' :
        event.type === 'Liturgical' ? '#1976d2' : '#9C27B0',
      color: 'white',
      borderRadius: '4px',
      fontSize: isMobile ? '0.7rem' : '0.8rem',
      padding: isMobile ? '1px 3px' : '2px 5px'
    },
  });

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: 'flex', flex: 1, flexDirection: isMobile ? 'column' : 'row', gap: 2, overflow: 'auto' }}>
      <GuestSideBar />

      <Box sx={{ flex: 2, p: isMobile ? 1 : 2, overflowY: 'auto' }}>
        <Metadata title="User Calendar" />
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'success.main', fontSize: isMobile ? '1.5rem' : '2rem' }}>Church Events Calendar</Typography>

        {errorMessage && <Typography color="error" sx={{ mb: 2 }}>{errorMessage}</Typography>}

        <Paper elevation={3} sx={{ height: isMobile ? '500px' : '700px', p: isMobile ? 1 : 2, borderRadius: 2 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView={isMobile ? 'agenda' : 'month'}
            view={view}
            onView={setView}
            views={['month', 'week', 'day', 'agenda']}
            eventPropGetter={eventPropGetter}
            onSelectEvent={handleEventClick}
            components={{ toolbar: CustomToolbar }}
            style={{ height: '100%', minHeight: isMobile ? '400px' : '600px' }}
          />
        </Paper>

        <Box sx={{ mt: 4 }}>
          <UserLocalCalendarList />

          <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Liturgical Calendar ({year})</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Day</strong></TableCell>
                    <TableCell><strong>Event</strong></TableCell>
                    <TableCell><strong>Month</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item, idx) => {
                    const isToday = new Date().toDateString() === new Date(item.date * 1000).toDateString();
                    let bgColor = idx % 2 === 0 ? '#fafafa' : 'white';
                    if (isToday) bgColor = '#fffae6';

                    let nameColor = 'default';
                    const nameLower = item.name.toLowerCase();
                    if (nameLower.includes('sunday')) nameColor = '#1976d2';
                    else if (nameLower.includes('solemnity')) nameColor = '#9c27b0';
                    else if (nameLower.includes('memorial')) nameColor = '#2e7d32';
                    else if (nameLower.includes('feast')) nameColor = '#ed6c02';
                    else if (nameLower.includes('lent') || nameLower.includes('advent')) nameColor = '#d32f2f';

                    return (
                      <TableRow key={`${item.date}-${idx}`} sx={{ backgroundColor: bgColor }}>
                        <TableCell>{new Date(item.date * 1000).toLocaleDateString()}</TableCell>
                        <TableCell>{item.day_of_the_week_long}</TableCell>
                        <TableCell sx={{ color: nameColor, fontWeight: 500 }}>{item.name}</TableCell>
                        <TableCell>{new Date(item.date * 1000).toLocaleString('default', { month: 'long' })}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Pagination
              count={totalPages}
              page={liturgicalPage}
              onChange={(_, value) => setLiturgicalPage(value)}
              color="primary"
              sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption">
                <span style={{ color: '#1976d2', fontWeight: 'bold' }}>● Sunday</span> &nbsp;
                <span style={{ color: '#9c27b0', fontWeight: 'bold' }}>● Solemnity</span> &nbsp;
                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>● Memorial</span> &nbsp;
                <span style={{ color: '#ed6c02', fontWeight: 'bold' }}>● Feast</span> &nbsp;
                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>● Lent/Advent</span>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default UserCalendar;
