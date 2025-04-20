import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  ContactSupport as ContactIcon,
  Lock as LockIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const FormsModal = ({ open, onClose, onContinue, language = 'tl' }) => {
  const isTagalog = language === 'tl';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          <Typography variant="h6">{isTagalog ? 'MAHALAGA' : 'IMPORTANT'}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <CalendarIcon color="primary" />
          <Typography>
            <strong>1.</strong>{' '}
            {isTagalog
              ? 'Bago mag-fill up ng form, tiyaking nabisita na ang "Calendar" page upang masigurong available ang nais na petsa.'
              : 'Before filling out the form, please visit the "Calendar" page to ensure your desired date is available.'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <InfoIcon color="primary" />
          <Typography>
            <strong>2.</strong>{' '}
            {isTagalog
              ? 'Maaaring magkaroon ng pagbabago tulad ng rescheduling o cancellation mula sa admin. Subaybayan ang status ng iyong request sa Profile >> Submitted Forms.'
              : 'There may still be changes such as rescheduling or cancellation from the admin. Please monitor your request status in Profile >> Submitted Forms.'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <CheckIcon color="primary" />
          <Typography>
            <strong>3.</strong>{' '}
            {isTagalog
              ? 'Siguraduhing tama at kumpleto ang mga detalye at files na isusumite bago pindutin ang "Submit".'
              : 'Please double check the accuracy and completeness of your inputs and uploaded files before clicking "Submit".'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <ErrorIcon color="error" />
          <Typography>
            <strong>4.</strong>{' '}
            {isTagalog
              ? 'Ang impormasyong ibibigay ay kailangang tama at kumpleto. Ang pagkukulang o maling detalye ay maaaring magdulot ng pagka-antala o hindi pag-apruba ng request.'
              : 'Information provided must be CORRECT and COMPLETE. Failure to do so may result in delay or rejection of your request.'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <ContactIcon color="primary" />
          <Typography>
            <strong>5.</strong>{' '}
            {isTagalog
              ? 'Para sa mga katanungan o concerns, mangyaring pumunta sa Contact Page.'
              : 'For any concerns or questions, please visit the Contact Page.'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <LockIcon color="success" />
          <Typography>
            <strong>6.</strong>{' '}
            {isTagalog
              ? 'Ang iyong impormasyon ay ligtas at confidential – ibig sabihin, ito ay ginagamit lamang para sa layunin ng serbisyong ito at hindi ibinabahagi sa iba.'
              : 'Your information is safe and confidential – meaning it is used solely for the purpose of this service and will not be shared with others.'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
          <WarningIcon color="warning" />
          <Typography>
            <strong>7.</strong>{' '}
            {isTagalog
              ? 'Tandaan: Ang paglabas sa form na ito ay maaaring hindi mag-save ng iyong kasalukuyang sagot. Mangyaring mag-ingat.'
              : 'Note: Exiting this form might not save your current inputs. Please proceed with caution.'}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography align="center" variant="subtitle1">
            <strong>Saint Joseph Parish - Taguig</strong>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          {isTagalog ? 'Close Form' : 'Close Form'}
        </Button>
        <Button onClick={onContinue} color="primary" variant="contained">
          {isTagalog ? 'Magpatuloy' : 'Continue'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormsModal;
