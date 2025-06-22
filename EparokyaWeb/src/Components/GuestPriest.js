import React, { useEffect, useState } from 'react';
import GuestSideBar from "./GuestSideBar";
import axios from 'axios';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Divider,
  Chip,
  CircularProgress,
  Avatar,
  Paper,
  styled
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Work as WorkIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const StatusChip = ({ value }) => {
  const isPositive = value === 'Serving' || value === 'In Parish' || value === 'Active' || value === 'Available';
  return (
    <Chip
      sx={{ m: 0.5 }}
      label={value}
      color={isPositive ? 'success' : 'default'}
      icon={isPositive ? <CheckCircleIcon /> : <CancelIcon />}
      variant="outlined"
    />
  );
};

const PriestCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6]
  },
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row'
  }
}));

const PriestAvatar = styled(Avatar)(({ theme }) => ({
  width: 150,
  height: 150,
  margin: theme.spacing(2, 'auto'),
  [theme.breakpoints.up('md')]: {
    width: 200,
    height: 200,
    margin: theme.spacing(4)
  }
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    '& > *': {
      width: '50%'
    }
  }
}));

const DetailItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  paddingRight: theme.spacing(2),
  width: '100%'
}));

const GuestPriest = () => {
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriest`);
        const guestPriests = response.data.filter(priest => priest.GuestPriest);
        setPriests(guestPriests);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching guest priests:', error);
        setLoading(false);
      }
    };

    fetchPriests();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

const formatTime = (timeStr) => {
  if (!timeStr) return '—';
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(+hour);
  date.setMinutes(+minute);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
};


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <GuestSideBar />
      <Container maxWidth="lg" sx={{ py: 4, ml: { xs: 0, md: '240px' } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontWeight: 'bold',
          mb: 4,
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          Guest Priests
        </Typography>

        {priests.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">No guest priests found</Typography>
          </Paper>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {priests.map((priest) => (
            <PriestCard key={priest._id}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PriestAvatar
                  alt={priest.fullName}
                  src={priest.image?.url}
                  variant="rounded"
                />
              </Box>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {priest.fullName}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  <StarIcon color="primary" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {priest.title} • {priest.position}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <DetailRow>
                  <DetailItem>
                    <WorkIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Nickname:</strong> {priest.nickName || '—'}
                    </Typography>
                  </DetailItem>
                  <DetailItem>
                    <CalendarIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Birth Date:</strong> {formatDate(priest.birthDate)}
                    </Typography>
                  </DetailItem>
                </DetailRow>

                <DetailRow>
                  <DetailItem>
                    <SchoolIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Seminary:</strong> {priest.Seminary || '—'}
                    </Typography>
                  </DetailItem>
                  <DetailItem>
                    <CalendarIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Ordination Date:</strong> {formatDate(priest.ordinationDate)}
                    </Typography>
                  </DetailItem>
                </DetailRow>

                <Divider sx={{ my: 2 }} />

              <DetailRow>
  <DetailItem>
    <PersonIcon color="action" sx={{ mr: 1 }} />
    <Typography variant="body1">
      <strong>Attended:</strong> {priest.guestDetails?.attended || '—'}
    </Typography>
  </DetailItem>
  <DetailItem>
    <CalendarIcon color="action" sx={{ mr: 1 }} />
    <Typography variant="body1">
      <strong>Date:</strong> {formatDate(priest.guestDetails?.date)}
    </Typography>
  </DetailItem>
</DetailRow>

<DetailRow>
  <DetailItem>
    <AccessTimeIcon color="action" sx={{ mr: 1 }} />
    <Typography variant="body1">
      <strong>Time:</strong> {formatTime(priest.guestDetails?.time)}
    </Typography>
  </DetailItem>
</DetailRow>


                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <StatusChip value={priest.isActive ? 'Active' : 'Inactive'} />
                  <StatusChip value={priest.isRetired ? 'Retired' : 'Serving'} />
                </Box>
              </CardContent>
            </PriestCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default GuestPriest;
