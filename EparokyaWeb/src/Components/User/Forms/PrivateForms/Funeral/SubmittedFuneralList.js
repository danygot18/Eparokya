import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestSideBar from "../../../../GuestSideBar";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Divider,
  useTheme,
  Paper,
  Alert
} from "@mui/material";
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  position: 'absolute',
  right: theme.spacing(2),
  top: theme.spacing(2),
  fontWeight: 'bold',
  backgroundColor:
    status === 'Confirmed' ? theme.palette.success.light :
    status === 'Cancelled' ? theme.palette.error.light :
    theme.palette.warning.light,
  color: theme.palette.getContrastText(
    status === 'Confirmed' ? theme.palette.success.light :
    status === 'Cancelled' ? theme.palette.error.light :
    theme.palette.warning.light
  )
}));

const StyledCard = styled(Card)(({ theme, status }) => ({
  position: 'relative',
  borderLeft: `6px solid ${
    status === 'Confirmed' ? theme.palette.success.main :
    status === 'Cancelled' ? theme.palette.error.main :
    theme.palette.warning.main
  }`,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6]
  }
}));

const groupByMonthYear = (forms) => {
  const grouped = {};
  
  forms.forEach(form => {
    const date = new Date(form.createdAt || form.funeralDate || new Date());
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(form);
  });
  
  return grouped;
};

const SubmittedFuneralList = () => {
  const [funeralForms, setFuneralForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchMySubmittedForms();
  }, []);

  const fetchMySubmittedForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedFuneral`,
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data.forms)) {
        setFuneralForms(response.data.forms);
      } else {
        setFuneralForms([]);
      }
    } catch (error) {
      console.error("Error fetching funeral forms:", error);
      setError("No Funeral forms have been submitted yet.");
    } finally {
      setLoading(false);
    }
  };

  const sortFormsByDate = (forms) => {
    return [...forms].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.funeralDate || 0);
      const dateB = new Date(b.createdAt || b.funeralDate || 0);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleCardClick = (funeralId) => {
    navigate(`/user/mySubmittedFuneralForm/${funeralId}`);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <GuestSideBar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          backgroundColor: theme.palette.grey[50]
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            My Submitted Funeral Forms
          </Typography>
          <Chip
            label={`Sort: ${sortOrder === 'latest' ? 'Latest First' : 'Oldest First'}`}
            onClick={() => setSortOrder(sortOrder === 'latest' ? 'oldest' : 'latest')}
            clickable
            color="primary"
            variant="outlined"
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : funeralForms.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No submitted funeral forms found.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={4}>
            {Object.entries(groupByMonthYear(sortFormsByDate(funeralForms))).map(([monthYear, forms]) => (
              <Box key={monthYear}>
                <Divider sx={{ mb: 2 }}>
                  <Chip 
                    label={monthYear} 
                    color="primary" 
                    variant="outlined"
                    sx={{ px: 2, fontSize: '0.875rem' }}
                  />
                </Divider>
                <Stack spacing={3}>
                  {forms.map((item, index) => {
                    const status = item.funeralStatus || 'Pending';
                    return (
                      <StyledCard
                        key={item._id}
                        elevation={3}
                        status={status}
                      >
                        <CardActionArea onClick={() => handleCardClick(item._id)}>
                          <CardContent>
                            <StatusChip
                              label={status}
                              size="small"
                              status={status}
                            />
                            <Typography variant="h6" component="h2" gutterBottom>
                              Record #{index + 1}: {item.name || "Unknown Name"}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={2}
                              sx={{ mt: 2 }}
                              flexWrap="wrap"
                            >
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Place of Death
                                </Typography>
                                <Typography variant="body1">
                                  {item.placeOfDeath || "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Reason of Death
                                </Typography>
                                <Typography variant="body1">
                                  {item.reasonOfDeath || "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Funeral Date
                                </Typography>
                                <Typography variant="body1">
                                  {item.funeralDate ?
                                    format(new Date(item.funeralDate), 'MMMM dd, yyyy') :
                                    "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Funeral Time
                                </Typography>
                                <Typography variant="body1">
                                  {item.funeraltime || "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Funeral Mass Date
                                </Typography>
                                <Typography variant="body1">
                                  {item.funeralMassDate ?
                                    format(new Date(item.funeralMassDate), 'MMMM dd, yyyy') :
                                    "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Funeral Mass Time
                                </Typography>
                                <Typography variant="body1">
                                  {item.funeralMasstime || "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Service Type
                                </Typography>
                                <Typography variant="body1">
                                  {item.serviceType || "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Contact Person
                                </Typography>
                                <Typography variant="body1">
                                  {item.contactPerson || "N/A"}
                                </Typography>
                              </Box>
                              <Box sx={{ minWidth: 120 }}>
                                <Typography variant="body2" color="textSecondary">
                                  Phone
                                </Typography>
                                <Typography variant="body1">
                                  {item.phone || "N/A"}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </StyledCard>
                    );
                  })}
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default SubmittedFuneralList;