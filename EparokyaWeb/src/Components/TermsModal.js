import React from "react";
import "./TermsModal.css"; 

const TermsModal = ({ isOpen, onClose, onAccept, termsText }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Terms and Conditions</h2>
        <div className="modal-body">
          <div className="terms-text">{termsText}</div>
        </div>
        <div className="modal-buttons">
          <button className="accept-button" onClick={onAccept}>I Agree</button>
          <button className="close-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
