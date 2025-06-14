import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Typography,
  styled,
  Chip,
} from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3]
}));

const VerificationChip = ({ verified }) => (
  <Chip
    icon={verified ? <CheckCircleOutline /> : <HighlightOff />}
    label={verified ? "Verified" : "Unverified"}
    color={verified ? "success" : "error"}
    variant="outlined"
    sx={{
      minWidth: 120,
      borderWidth: 2,
      borderStyle: 'solid'
    }}
  />
);

const MassBaptismChecklist = ({ massBaptismId }) => {
  const [checklist, setChecklist] = useState({
    PhotocopyOfBirthCertificate: false,
    PhotocopyOfMarriageCertificate: false,
    BaptismalPermit: false,
    CertificateOfNoRecordBaptism: false,
    PreBaptismSeminar1: false,
    PreBaptismSeminar2: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (massBaptismId) {
      axios
        .get(`${process.env.REACT_APP_API}/api/v1/massBaptism/getMassBaptismChecklist/${massBaptismId}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.checklist) {
            setChecklist(res.data.checklist);
          }
        })
        .catch((err) => {
          console.error('Error fetching checklist:', err);
        });
    }
  }, [massBaptismId]);

  const handleCheckboxChange = (name) => {
    setChecklist((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleSave = async () => {
    setIsModalOpen(true);
  };

  const confirmSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/massBaptism/updateMassBaptismChecklist/${massBaptismId}`,
        checklist,
        { withCredentials: true }
      );
      toast.success('Checklist updated successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error updating checklist:', err);
      toast.error('Failed to update checklist.');
    }
  };

  const verifiedItems = Object.keys(checklist).filter(key => checklist[key]);
  const unverifiedItems = Object.keys(checklist).filter(key => !checklist[key]);

  const formatLabel = (str) => {
    return str.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Mass Baptism Checklist
      </Typography>

      <SectionCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Required Documents
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {Object.entries(checklist)
              .filter(([key]) =>
                key === 'PhotocopyOfBirthCertificate' ||
                key === 'PhotocopyOfMarriageCertificate'
              )
              .map(([key, value]) => (
                <ListItem key={key} sx={{ py: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value}
                        onChange={() => handleCheckboxChange(key)}
                        color="primary"
                      />
                    }
                    label={formatLabel(key)}
                    sx={{ flexGrow: 1 }}
                  />
                  <VerificationChip verified={value} />
                </ListItem>
              ))}
          </List>
        </CardContent>
      </SectionCard>

      <SectionCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Additional Documents
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {Object.entries(checklist)
              .filter(([key]) =>
                key === 'BaptismalPermit' ||
                key === 'CertificateOfNoRecordBaptism'
              )
              .map(([key, value]) => (
                <ListItem key={key} sx={{ py: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value}
                        onChange={() => handleCheckboxChange(key)}
                        color="primary"
                      />
                    }
                    label={formatLabel(key)}
                    sx={{ flexGrow: 1 }}
                  />
                  <VerificationChip verified={value} />
                </ListItem>
              ))}
          </List>
        </CardContent>
      </SectionCard>

      <SectionCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Seminars
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {Object.entries(checklist)
              .filter(([key]) =>
                key === 'PreBaptismSeminar1' ||
                key === 'PreBaptismSeminar2'
              )
              .map(([key, value]) => (
                <ListItem key={key} sx={{ py: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value}
                        onChange={() => handleCheckboxChange(key)}
                        color="primary"
                      />
                    }
                    label={formatLabel(key)}
                    sx={{ flexGrow: 1 }}
                  />
                  <VerificationChip verified={value} />
                </ListItem>
              ))}
          </List>
        </CardContent>
      </SectionCard>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          size="large"
          sx={{ minWidth: 200, height: 50 }}
        >
          Save Checklist
        </Button>
      </Box>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="mass-baptism-checklist-confirmation-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          maxHeight: '80vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" component="h2">
              Mass Baptism Checklist Confirmation
            </Typography>
          </Box>

          <Box sx={{ overflow: 'auto', flex: 1, p: 3 }}>
            <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                Verified Documents
                <Chip
                  label={`${verifiedItems.length} items`}
                  size="small"
                  color="success"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                {verifiedItems.map((item) => (
                  <ListItem key={item} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={formatLabel(item)}
                      primaryTypographyProps={{ sx: { display: 'flex', alignItems: 'center' } }}
                    />
                    <CheckCircleOutline color="success" sx={{ ml: 1 }} />
                  </ListItem>
                ))}
                {verifiedItems.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No documents verified yet" />
                  </ListItem>
                )}
              </List>
            </Paper>

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                Pending Documents
                <Chip
                  label={`${unverifiedItems.length} items`}
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                {unverifiedItems.map((item) => (
                  <ListItem key={item} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={formatLabel(item)}
                      primaryTypographyProps={{ sx: { display: 'flex', alignItems: 'center' } }}
                    />
                    <HighlightOff color="error" sx={{ ml: 1 }} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>

          <Box sx={{
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2
          }}>
            <Button
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
              sx={{ minWidth: 100 }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={confirmSave}
              sx={{ minWidth: 150 }}
            >
              Confirm Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MassBaptismChecklist;