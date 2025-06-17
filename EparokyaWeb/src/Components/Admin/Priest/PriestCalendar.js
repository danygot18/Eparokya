import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Calendar,
    dateFnsLocalizer
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Endpoints and their respective title resolvers
const endpoints = [
    {
        label: 'Wedding',
        url: '/api/v1/confirmedWedding',
        dateField: 'weddingDate',
        getTitle: (item) => `${item.groomName} & ${item.brideName}`,
    },
    {
        label: 'Baptism',
        url: '/api/v1/confirmedBaptism',
        dateField: 'baptismDate',
        getTitle: (item) => item.child?.fullName || 'Baptism',
    },
    {
        label: 'Funeral',
        url: '/api/v1/confirmedFuneral',
        dateField: 'funeralDate',
        getTitle: (item) => item.name || 'Funeral',
    },
    {
        label: 'Counseling',
        url: '/api/v1/getConfirmedCounseling',
        dateField: 'counselingDate',
        getTitle: (item) => item.person?.fullName || 'Counseling',
    },
    {
        label: 'House Blessing',
        url: '/api/v1/houseBlessing/getConfirmedHouseBlessing',
        dateField: 'blessingDate',
        getTitle: (item) => item.fullName || 'House Blessing',
    },
    {
        label: 'Prayer Request',
        url: '/api/v1/getAllPrayerRequestIntention',
        dateField: 'date',
        getTitle: (item) => item.offerrorsName || 'Prayer Request',
    },
];

const PriestCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const config = { withCredentials: true };

        const fetchData = async () => {
            try {
                const responses = await Promise.all(
                    endpoints.map(ep =>
                        axios.get(`${process.env.REACT_APP_API}${ep.url}`, config)
                    )
                );

                const allEvents = responses.flatMap((res, i) => {
                    const ep = endpoints[i];
                    return (res.data || []).map(item => ({
                        title: ep.getTitle(item),
                        start: new Date(item[ep.dateField]),
                        end: new Date(item[ep.dateField]),
                        allDay: true,
                    }));
                });

                setEvents(allEvents);
            } catch (error) {
                console.error("Error fetching priest calendar data:", error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const eventPropGetter = () => ({
        style: {
            backgroundColor: '#aed581',
            color: '#000',
            borderRadius: '4px',
            width: '100%',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            padding: isMobile ? '1px 3px' : '2px 5px',
        },
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                maxWidth: '100%',
                p: isMobile ? 2 : 3,
                overflow: 'auto',
                bgcolor: '#f5f5f5',
            }}
        >

            <Typography
                variant="h4"
                sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    color: 'primary.main',
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    textAlign: 'center',
                }}
            >
                Priest Calendar
            </Typography>

            <Typography sx={{ mb: 2, textAlign: 'center' }}>
                View all scheduled sacraments and appointments assigned to you.
            </Typography>

            {loading ? (
                <CircularProgress sx={{ alignSelf: 'center', mt: 5 }} />
            ) : (
                <Paper
                    elevation={3}
                    sx={{
                        height: isMobile ? '500px' : '700px',
                        p: isMobile ? 1 : 2,
                        borderRadius: 2,
                        width: '100%',
                    }}
                >
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView={isMobile ? 'agenda' : 'month'}
                        views={['month', 'agenda']}
                        eventPropGetter={eventPropGetter}
                        style={{
                            height: '100%',
                            width: '100%',
                            borderRadius: 8,
                        }}
                    />
                </Paper>
            )}
        </Box>
    );
};

export default PriestCalendar;
