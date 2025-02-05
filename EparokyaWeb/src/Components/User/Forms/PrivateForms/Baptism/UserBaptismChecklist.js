import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserBaptismChecklist = ({ baptismId }) => {
  const [checklist, setChecklist] = useState({
    PhotocopyOfBirthCertificate: false,
    PhotocopyOfMarriageCertificate: false,
    BaptismalPermit: false,
    CertificateOfNoRecordBaptism: false,
    PreBaptismSeminar1: false,
    PreBaptismSeminar2: false,
  });

  useEffect(() => {
    if (baptismId) {
      axios
        .get(`${process.env.REACT_APP_API}/api/v1/getBaptismChecklist/${baptismId}`, { withCredentials: true })
        .then((res) => {
          console.log("API Response:", res.data);
        })
        .catch((err) => {
          console.error("Error fetching checklist:", err);
        });
    }
  }, [baptismId]);
  
  return (
    <div className="baptism-checklist-container">
      <h2>Baptism Checklist</h2>

      {/* Baptism Checklist Fields */}
      <div className="baptism-checklist-item">
        <span>Photocopy of Birth Certificate</span>
        <button
          className={checklist.PhotocopyOfBirthCertificate ? "checked-btn" : "unchecked-btn"}
          disabled
        >
          {checklist.PhotocopyOfBirthCertificate ? "Checked" : "Unchecked"}
        </button>
      </div>

      <div className="baptism-checklist-item">
        <span>Photocopy of Marriage Certificate</span>
        <button
          className={checklist.PhotocopyOfMarriageCertificate ? "checked-btn" : "unchecked-btn"}
          disabled
        >
          {checklist.PhotocopyOfMarriageCertificate ? "Checked" : "Unchecked"}
        </button>
      </div>

      {/* Additional Fields */}
      <h3>Additional Documents</h3>
      <div className="baptism-checklist-item">
        <span>Baptismal Permit</span>
        <button
          className={checklist.BaptismalPermit ? "checked-btn" : "unchecked-btn"}
          disabled
        >
          {checklist.BaptismalPermit ? "Checked" : "Unchecked"}
        </button>
      </div>

      <div className="baptism-checklist-item">
        <span>Certificate of No Record of Baptism</span>
        <button
          className={checklist.CertificateOfNoRecordBaptism ? "checked-btn" : "unchecked-btn"}
          disabled
        >
          {checklist.CertificateOfNoRecordBaptism ? "Checked" : "Unchecked"}
        </button>
      </div>

      {/* Seminar Fields */}
      <h3>Seminars</h3>
      <div className="baptism-checklist-item">
        <span>Pre-Baptism Seminar 1</span>
        <button
          className={checklist.PreBaptismSeminar1 ? "checked-btn" : "unchecked-btn"}
          disabled
        >
          {checklist.PreBaptismSeminar1 ? "Checked" : "Unchecked"}
        </button>
      </div>

      <div className="baptism-checklist-item">
        <span>Pre-Baptism Seminar 2</span>
        <button
          className={checklist.PreBaptismSeminar2 ? "checked-btn" : "unchecked-btn"}
          disabled
        >
          {checklist.PreBaptismSeminar2 ? "Checked" : "Unchecked"}
        </button>
      </div>
      
      <style>
        {`
          .checked-btn {
            background-color: green;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: not-allowed;
          }
          .unchecked-btn {
            background-color: gray;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: not-allowed;
          }
          .baptism-checklist-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
};

export default UserBaptismChecklist;
