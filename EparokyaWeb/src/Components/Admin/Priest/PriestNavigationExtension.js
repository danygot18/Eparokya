import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Divider,
  Alert,
  Card,
  CardContent
} from "@mui/material";
import PriestCalendar from './PriestCalendar';
import React from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const formatDate = (dateString) => {
  if (!dateString) return '—';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (timeString) => {
  if (!timeString) return '—';
  const date = new Date(`1970-01-01T${timeString}`);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatHeader = (type) => {
  const labelMap = {
    prayerIntentions: ['Offeror\'s Name', 'Prayer Type', 'Date', 'Time', 'Intentions'],
    prayerRequests: ['Offeror\'s Name', 'Prayer Type', 'Date', 'Time', 'Intentions / Description'],
    weddings: ['Bride & Groom', 'Theme', 'Wedding Date', 'Time'],
    baptisms: ['Child\'s Name', 'Baptism', 'Date', 'Time'],
    funerals: ['Deceased Name', 'Funeral Mass', 'Funeral Date', 'Funeral Time'],
    houseBlessings: ['Requestor', 'Purpose / Property', 'Blessing Date', 'Blessing Time'],
    counseling: ['Person', 'Purpose', 'Date', 'Time'],
    default: ['Name', 'Details', 'Date', 'Time']
  };

  const headers = labelMap[type] || labelMap['default'];
  const colSize = Math.floor(12 / headers.length);

  return (
    <Grid container sx={{ backgroundColor: '#f0f0f0', py: 1, px: 2 }} spacing={2}>
      {headers.map((label, i) => (
        <Grid key={i} item xs={colSize}>
          <Typography variant="subtitle2">{label}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};



const formatRow = (item, type) => {
  const renderCols = (values) => {
    const colSize = Math.floor(12 / values.length);
    return values.map((val, i) => (
      <Grid key={i} item xs={colSize}>
        {val}
      </Grid>
    ));
  };

  switch (type) {
    case 'prayerIntentions':
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            item.offerrorsName || '—',
            item.prayerType || '—',
            formatDate(item.prayerRequestDate),
            formatTime(item.prayerRequestTime), // ✅ This now shows the correct time
            Array.isArray(item.Intentions)
              ? item.Intentions.map(i => i.name).filter(Boolean).join(', ')
              : '—'
          ])}
        </Grid>
      );


    case 'prayerRequests':
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            item.offerrorsName || '—',
            item.prayerType || '—',
            formatDate(item.prayerRequestDate),
            formatTime(item.prayerRequestTime),
            Array.isArray(item.Intentions) && item.Intentions.length > 0
              ? item.Intentions.map(i => i.name).filter(Boolean).join(', ')
              : (item.prayerDescription || '—')
          ])}
        </Grid>
      );

    case 'weddings':
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            `${item.groomName || '—'} & ${item.brideName || '—'}`,
            item.weddingTheme || '—',
            formatDate(item.weddingDate),
            formatTime(item.weddingTime)
          ])}
        </Grid>
      );

    case 'baptisms':
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            item?.child?.fullName || '—',
            'Baptism',
            formatDate(item.baptismDate),
            formatTime(item.baptismTime)
          ])}
        </Grid>
      );

    case 'funerals':
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            item.name || '—',
            item.funeralMass || '—',
            formatDate(item.funeralMassDate),
            formatTime(item.funeralMasstime)
          ])}
        </Grid>
      );

    case 'houseBlessings':
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            item?.person?.fullName || item.fullName || '—',
            item.purpose || item.propertyType || '—',
            formatDate(item.blessingDate),
            formatTime(item.blessingTime)
          ])}
        </Grid>
      );

    case 'counseling':
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            item?.person?.fullName || '—',
            item.purpose || 'Counseling',
            formatDate(item.counselingDate),
            formatTime(item.counselingTime)
          ])}
        </Grid>
      );

    default:
      return (
        <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
          {renderCols([
            item.fullName || '—',
            item.details || '—',
            formatDate(item.date),
            formatTime(item.time)
          ])}
        </Grid>
      );
  }
};


const PER_PAGE = 5;

const PriestNavigationExtension = ({
  prayerIntentions = [],
  prayerRequests = [],
  counseling = [],
  houseBlessings = [],
  weddings = [],
  baptisms = [],
  funerals = []
}) => {
  const navigate = useNavigate();

  // --- Date categorization ---
  const categorizeByDate = (items = [], getDateFn) => {
    if (!Array.isArray(items)) items = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

    const todayList = [];
    const tomorrowList = [];
    const nextMonthList = [];
    const othersList = [];

    items.forEach(item => {
      const rawDate = getDateFn ? getDateFn(item) : null;
      if (!rawDate) return;

      const eventDate = new Date(rawDate);
      if (isNaN(eventDate.getTime())) return;

      eventDate.setHours(0, 0, 0, 0);

      if (isSameDay(eventDate, today)) {
        todayList.push(item);
      } else if (isSameDay(eventDate, tomorrow)) {
        tomorrowList.push(item);
      } else if (
        eventDate > tomorrow // Only future dates
      ) {
        if (
          eventDate.getMonth() === nextMonth.getMonth() &&
          eventDate.getFullYear() === nextMonth.getFullYear()
        ) {
          nextMonthList.push(item);
        } else {
          othersList.push(item);
        }
      }

    });

    return { todayList, tomorrowList, nextMonthList, othersList };
  };

  // --- Pagination state ---
  const [pagination, setPagination] = React.useState({});

  const getPage = (type, section) =>
    pagination[type]?.[section] ? pagination[type][section] : 1;

  const setPage = (type, section, value) => {
    setPagination((prev) => ({
      ...prev,
      [type]: { ...prev[type], [section]: value },
    }));
  };

  const getPaginated = (list, type, section) => {
    const page = getPage(type, section);
    return list.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  };

  // --- Navigation and PDF helpers ---
  const getNavPath = (type, item) => {
    switch (type) {
      case "prayerIntentions":
        return `/admin/prayer-intention/${item._id}`;
      case "prayerRequests":
        return `/admin/prayer-request/${item._id}`;
      case "counseling":
        return `/admin/counseling/${item._id}`;
      case "houseBlessings":
        return `/admin/house-blessing/${item._id}`;
      case "weddings":
        return `/admin/wedding/${item._id}`;
      case "baptisms":
        return `/admin/baptism/${item._id}`;
      case "funerals":
        return `/admin/funeral/${item._id}`;
      default:
        return "/";
    }
  };

  const getId = (item) => item._id;

  const handleDownloadPDF = async (type) => {
    const input = document.getElementById(`card-${type}`);
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${type}_schedule.pdf`);
  };


  // --- Categorize all data ---
  const { todayList: prayerToday, tomorrowList: prayerTomorrow, othersList: prayerOthers } =
    categorizeByDate(prayerIntentions, item => item.prayerRequestDate);

  const { todayList: requestToday, tomorrowList: requestTomorrow, othersList: requestOthers } =
    categorizeByDate(prayerRequests, item => item.prayerRequestDate);

  const { todayList: counselingToday, tomorrowList: counselingTomorrow, othersList: counselingOthers } =
    categorizeByDate(counseling, item => item.counselingDate);

  const { todayList: houseToday, tomorrowList: houseTomorrow, othersList: houseOthers } =
    categorizeByDate(houseBlessings, item => item.blessingDate);

  const { todayList: weddingToday, nextMonthList: weddingNextMonth, othersList: weddingOthers } =
    categorizeByDate(weddings, item => item.weddingDate);

  const { todayList: baptismToday, nextMonthList: baptismNextMonth, othersList: baptismOthers } =
    categorizeByDate(baptisms, item => item.baptismDate);

  const { todayList: funeralToday, nextMonthList: funeralNextMonth, othersList: funeralOthers } =
    categorizeByDate(funerals, item => item.funeralMassDate);

  // --- Section rendering with pagination and clickable rows ---
  const renderSection = (label, list, type, section) => (
    <Box sx={{ mb: 4 }}>

      <Box
        sx={{
          mt: 4,
          mb: 2,
          backgroundColor: '#f9f9f9',
          px: 2,
          py: 1,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {label}
        </Typography>
      </Box>

      {/* Header and rows */}
      {list.length === 0 ? (
        <Alert severity="info">No events for {label.toLowerCase()}.</Alert>
      ) : (
        <>
          {formatHeader(type)}

          {getPaginated(list, type, section).map((item, idx) => (
            <Box
              key={getId(item) || idx}
              sx={{
                borderBottom: '1px solid #e0e0e0',
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
              onClick={() => navigate(getNavPath(type, item))}
            >
              {formatRow(item, type)}
            </Box>
          ))}
          {list.length > PER_PAGE && (
            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            </Box>
          )}
        </>
      )}
    </Box>
  );


  return (
    <Box>
      <Typography variant="h4" gutterBottom>Priest Navigation</Typography>
      {/* CALENDAR AT THE VERY TOP */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h5">Calendar</Typography>
        <Divider sx={{ my: 1 }} />
        <PriestCalendar />
      </Paper>
      <Grid container spacing={3}>
        {/* INDIVIDUAL SCHEDULE CARDS BELOW CALENDAR */}
        <Grid item xs={12} md={12}>
          <Grid container spacing={3}>
            {/* Prayer Intentions */}
            <Grid item xs={12}>
              <Card id="card-prayerIntentions">
                <CardContent>
                  <Typography variant="h6">Prayer Intentions</Typography>
                  <Divider sx={{ my: 1 }} />
                  {renderSection("Today", prayerToday, 'prayerIntentions', 'today')}
                  {renderSection("Tomorrow", prayerTomorrow, 'prayerIntentions', 'tomorrow')}
                  {renderSection("Upcoming", prayerOthers, 'prayerIntentions', 'others')}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleDownloadPDF('prayerIntentions')}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Prayer Request Intentions */}
            <Grid item xs={12}>
              <Card id="card-prayerRequests">
                <CardContent>
                  <Typography variant="h6">Prayer Request Intentions</Typography>
                  <Divider sx={{ my: 1 }} />
                  {renderSection("Today", requestToday, 'prayerRequests', 'today')}
                  {renderSection("Tomorrow", requestTomorrow, 'prayerRequests', 'tomorrow')}
                  {renderSection("Upcoming", requestOthers, 'prayerRequests', 'others')}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleDownloadPDF('prayerRequests')}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Confirmed Counseling */}
            <Grid item xs={12}>
              <Card id="card-counseling">
                <CardContent>
                  <Typography variant="h6">Confirmed Counseling</Typography>
                  <Divider sx={{ my: 1 }} />
                  {renderSection("Today", counselingToday, 'counseling', 'today')}
                  {renderSection("Tomorrow", counselingTomorrow, 'counseling', 'tomorrow')}
                  {renderSection("Upcoming", counselingOthers, 'counseling', 'others')}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleDownloadPDF('counseling')}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Confirmed House Blessings */}
            <Grid item xs={12}>
              <Card id="card-houseBlessings">
                <CardContent>
                  <Typography variant="h6">Confirmed House Blessings</Typography>
                  <Divider sx={{ my: 1 }} />
                  {renderSection("Today", houseToday, 'houseBlessings', 'today')}
                  {renderSection("Tomorrow", houseTomorrow, 'houseBlessings', 'tomorrow')}
                  {renderSection("Upcoming", houseOthers, 'houseBlessings', 'others')}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleDownloadPDF('houseBlessings')}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Confirmed Weddings */}
            <Grid item xs={12}>
              <Card id="card-weddings">
                <CardContent>
                  <Typography variant="h6">Confirmed Weddings</Typography>
                  <Divider sx={{ my: 1 }} />
                  {renderSection("Today", weddingToday, 'weddings', 'today')}
                  {renderSection("Tomorrow", [], 'weddings', 'tomorrow')}
                  {renderSection("Upcoming", weddingNextMonth.concat(weddingOthers), 'weddings', 'others')}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleDownloadPDF('weddings')}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Confirmed Baptisms */}
            <Grid item xs={12}>
              <Card id="card-baptisms">
                <CardContent>
                  <Typography variant="h6">Confirmed Baptisms</Typography>
                  <Divider sx={{ my: 1 }} />
                  {renderSection("Today", baptismToday, 'baptisms', 'today')}
                  {renderSection("Tomorrow", [], 'baptisms', 'tomorrow')}
                  {renderSection("Upcoming", baptismNextMonth.concat(baptismOthers), 'baptisms', 'others')}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleDownloadPDF('baptisms')}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {/* Confirmed Funerals */}
            <Grid item xs={12}>
              <Card id="card-funerals">
                <CardContent>
                  <Typography variant="h6">Confirmed Funerals</Typography>
                  <Divider sx={{ my: 1 }} />
                  {renderSection("Today", funeralToday, 'funerals', 'today')}
                  {renderSection("Tomorrow", [], 'funerals', 'tomorrow')}
                  {renderSection("Upcoming", funeralNextMonth.concat(funeralOthers), 'funerals', 'others')}
                  <Box textAlign="right" mt={2}>
                    <Button variant="contained" color="primary" onClick={() => handleDownloadPDF('funerals')}>
                      Download PDF
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PriestNavigationExtension;