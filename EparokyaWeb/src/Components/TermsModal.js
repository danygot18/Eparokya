import React from "react";

const TermsModal = ({ isOpen, onClose, onAccept, termsText }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Terms and Conditions</h2>
                <p>{termsText}</p>
                <div className="modal-buttons">
                    <button onClick={onAccept}>I Agree</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
