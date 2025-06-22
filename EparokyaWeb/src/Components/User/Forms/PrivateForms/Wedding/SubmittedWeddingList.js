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
    status === 'Declined' ? theme.palette.error.light :
    theme.palette.warning.light,
  color: theme.palette.getContrastText(
    status === 'Confirmed' ? theme.palette.success.light :
    status === 'Declined' ? theme.palette.error.light :
    theme.palette.warning.light
  )
}));

const StyledCard = styled(Card)(({ theme, status }) => ({
  position: 'relative',
  borderLeft: `6px solid ${
    status === 'Confirmed' ? theme.palette.success.main :
    status === 'Declined' ? theme.palette.error.main :
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
    const date = new Date(form.createdAt || form.weddingDate || new Date());
    const monthYear = format(date, 'MMMM yyyy');
    
    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push(form);
  });
  
  return grouped;
};

const SubmittedWeddingList = () => {
  const [weddingForms, setWeddingForms] = useState([]);
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
        `${process.env.REACT_APP_API}/api/v1/getAllUserSubmittedWedding`,
        { withCredentials: true }
      );

      if (response.data && Array.isArray(response.data.forms)) {
        setWeddingForms(response.data.forms);
      } else {
        setWeddingForms([]);
      }
    } catch (error) {
      console.error("Error fetching wedding forms:", error);
      setError("Unable to fetch wedding forms.");
    } finally {
      setLoading(false);
    }
  };

  const sortFormsByDate = (forms) => {
    return [...forms].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.weddingDate || 0);
      const dateB = new Date(b.createdAt || b.weddingDate || 0);
      return sortOrder === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  const handleCardClick = (weddingId) => {
    navigate(`/user/mySubmittedWeddingForm/${weddingId}`);
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
            Submitted Wedding Application
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
        ) : weddingForms.length === 0 ? (
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No submitted wedding forms found.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={4}>
            {Object.entries(groupByMonthYear(sortFormsByDate(weddingForms))).map(([monthYear, forms]) => (
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
                    const status = item.weddingStatus || 'Pending';
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
                              Record #{index + 1}: {item.brideName || "Unknown Bride"} & {item.groomName || "Unknown Groom"}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={2}
                              sx={{ mt: 2 }}
                            >
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  Wedding Date
                                </Typography>
                                <Typography variant="body1">
                                  {item.weddingDate ?
                                    format(new Date(item.weddingDate), 'MMMM dd, yyyy') :
                                    "N/A"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  Wedding Time
                                </Typography>
                                <Typography variant="body1">
                                  {item.weddingTime || "N/A"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  Bride Contact
                                </Typography>
                                <Typography variant="body1">
                                  {item.bridePhone || "N/A"}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" color="textSecondary">
                                  Groom Contact
                                </Typography>
                                <Typography variant="body1">
                                  {item.groomPhone || "N/A"}
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

export default SubmittedWeddingList;