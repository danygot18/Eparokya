import React, { useEffect, useState } from 'react';
import GuestSideBar from "../GuestSideBar";
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
  Star as StarIcon
} from '@mui/icons-material';

const StatusChip = ({ label, value }) => (
  <Chip
    sx={{ m: 0.5 }}
    label={`${label}: ${value}`}
    color={value === 'Active' || value === 'Available' || value === 'Not Retired' || value === 'In Parish' ?  'success' : 'default'}
    icon={value === 'Active' || value === 'Available' || value === 'Not Retired' || value === 'In Parish' ?  <CheckCircleIcon /> : <CancelIcon />}
    variant="outlined"
  />
);

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

const ParishPriest = () => {
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriest`);
        setPriests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching priests:', error);
        setLoading(false);
      }
    };

    fetchPriests();
  }, []);

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
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <PersonIcon fontSize="large" /> Parish Priests
        </Typography>

        {priests.length === 0 && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">No priests found</Typography>
          </Paper>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {priests.map((priest) => (
            <PriestCard key={priest._id}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <PriestAvatar
                  alt={priest.fullName}
                  src={priest.image.url}
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
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
                  {priest.parishDurationYear}
                </Typography>
                <Divider sx={{ my: 2 }} />

                <DetailRow>
                  <DetailItem>
                    <WorkIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Nickname:</strong> {priest.nickName}
                    </Typography>
                  </DetailItem>
                  <DetailItem>
                    <CalendarIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Birth Date:</strong> {new Date(priest.birthDate).toLocaleDateString()}
                    </Typography>
                  </DetailItem>
                </DetailRow>

                <DetailRow>
                  <DetailItem>
                    <SchoolIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Seminary:</strong> {priest.Seminary}
                    </Typography>
                  </DetailItem>
                  <DetailItem>
                    <CalendarIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Ordination Date:</strong> {new Date(priest.ordinationDate).toLocaleDateString()}
                    </Typography>
                  </DetailItem>
                </DetailRow>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <StatusChip label="Active" value={priest.isActive ? 'Active' : 'Inactive'} />
                  <StatusChip label="Available" value={priest.isAvailable ? 'Available' : 'Not Available'} />
                  <StatusChip label="Retired" value={priest.isRetired ? 'Retired' : 'Not Retired'} />
                  <StatusChip label="Transfered" value={priest.isTransfered ? 'Transfered' : 'In Parish'} />
                </Box>
              </CardContent>
            </PriestCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ParishPriest;