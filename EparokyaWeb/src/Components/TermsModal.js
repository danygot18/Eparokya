// import React from "react";
// import "./TermsModal.css"; 

// const TermsModal = ({ isOpen, onClose, onAccept, termsText }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2 className="modal-title">Terms and Conditions</h2>
//         <div className="modal-body">
//           <div className="terms-text">{termsText}</div>
//         </div>
//         <div className="modal-buttons">
//           <button className="accept-button" onClick={onAccept}>I Agree</button>
//           <button className="close-button" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TermsModal;

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography
} from "@mui/material";
import "./TermsModal.css"; 
import termsAndConditionsText from "./TermsAndConditionText";

const TermsModal = ({ show, onHide, onAgree }) => {
  return (
    <Dialog open={show} onClose={onHide} maxWidth="md" fullWidth>
      <DialogTitle>Terms and Conditions</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
            {/* Your terms content here */}
            <div className="terms-text">
              {termsAndConditionsText}
            </div>
            {/* Add more terms as needed */}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onHide}>Close</Button>
        <Button
          onClick={onAgree}
          variant="contained"
          color="primary"
        >
          I Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsModal;

