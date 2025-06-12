import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideBar from '../SideBar';
import { socket } from '../../../socket';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  Backdrop,
  Fade,
  Divider,
  Chip,
  CircularProgress,
  Paper,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const PrayerRequestIntentionDetails = () => {
  const { prayerIntentionId } = useParams();
  const [prayerRequest, setPrayerRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrayerRequest();
  }, []);

  const fetchPrayerRequest = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getPrayerRequestIntentionById/${prayerIntentionId}`);
      setPrayerRequest(response.data);
    } catch (error) {
      console.error('Error fetching prayer request:', error);
    }
  };

  const markAsPrayed = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/markPrayerRequestIntentionAsDone/${prayerIntentionId}`);
      socket.emit('send-notification-user', { userId: prayerRequest.userId._id, message: `Your prayer request for ${prayerRequest.offerrorsName} has been prayed.` });

      setPrayerRequest({ ...prayerRequest, isDone: true });
      setShowModal(false);
      toast.success("Successfully Mark as Prayed")
    } catch (error) {
      console.error('Error marking as prayed:', error);
    }
  };

  const DetailItem = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
        {label}:
      </Typography>
      <Typography variant="body1" component="span" sx={{ ml: 1 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  if (!prayerRequest) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>

      <SideBar />

      <div style={{ flex: 1, padding: '20px' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
          Prayer Request Details
        </Typography>

        <Card elevation={3} sx={{ maxWidth: 800, mx: 'auto' }}>
          <CardContent>
            <Stack spacing={2}>
              <DetailItem label="Name" value={prayerRequest.offerrorsName} />
              <DetailItem label="Prayer Type" value={prayerRequest.prayerType} />

              {prayerRequest.prayerType === 'Others (Iba pa)' && (
                <DetailItem label="Additional Prayer" value={prayerRequest.addPrayer} />
              )}

              <DetailItem
                label="Description"
                value={prayerRequest.prayerDescription}
              />

              <DetailItem
                label="Date"
                value={new Date(prayerRequest.prayerRequestDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              />

              <DetailItem
                label="Time"
                value={new Date(`1970-01-01T${prayerRequest.prayerRequestTime}`).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
                  Intentions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {prayerRequest.Intentions.map((intention, index) => (
                    <Chip
                      key={index}
                      label={intention.name}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <DetailItem
                label="Submitted By"
                value={prayerRequest.userId?.name}
              />

              <DetailItem
                label="Created At"
                value={new Date(prayerRequest.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowModal(true)}
                  disabled={prayerRequest.isDone}
                  fullWidth
                  size="large"
                >
                  {prayerRequest.isDone ? 'Already Prayed' : 'Mark as Prayed'}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={showModal}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 1
            }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Confirm Prayer
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {`${prayerRequest.prayerType} for ${prayerRequest.offerrorsName}`}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowModal(false)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={markAsPrayed}
                >
                  Confirm Prayed
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </div>
    </div>
  );
};

export default PrayerRequestIntentionDetails;