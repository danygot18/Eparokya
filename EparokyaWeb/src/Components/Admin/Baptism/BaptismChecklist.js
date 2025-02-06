import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BaptismChecklist = ({ baptismId }) => {
  const [checklist, setChecklist] = useState({
  
    PhotocopyOfBirthCertificate: false,
    PhotocopyOfMarriageCertificate: false,
    
    // Other Checklist Fields
    BaptismalPermit: false,
    CertificateOfNoRecordBaptism: false,

    // Seminar
    PreBaptismSeminar1: false,
    PreBaptismSeminar2: false,
   
  });

  useEffect(() => {
    if (baptismId) {
      axios
        .get(`${process.env.REACT_APP_API}/api/v1/getBaptismChecklist/${baptismId}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.checklist) {
            setChecklist(res.data.checklist);
          }
          console.log('Checklist:', res.data.checklist);
        })
        .catch((err) => {
          console.error('Error fetching checklist:', err);
        });
    }
  }, [baptismId]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecklist((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/updateBaptismChecklist/${baptismId}`,
        checklist,
        { withCredentials: true }
      );
      alert('Checklist updated successfully!');
    } catch (err) {
      console.error('Error updating checklist:', err);
      alert('Failed to update checklist.');
    }
  };

  return (
    <div className="baptism-checklist-container">
      <h2>Baptism Checklist</h2>
  
      {/* Baptism Checklist Fields */}
      <div className="baptism-checklist-item">
        <label>
          Photocopy of Birth Certificate
          <input
            type="checkbox"
            name="PhotocopyOfBirthCertificate"
            checked={checklist.PhotocopyOfBirthCertificate}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
  
      <div className="baptism-checklist-item">
        <label>
          Photocopy of Marriage Certificate
          <input
            type="checkbox"
            name="PhotocopyOfMarriageCertificate"
            checked={checklist.PhotocopyOfMarriageCertificate}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
  
      {/* Additional Fields */}
      <h3>Additional Documents</h3>
      <div className="baptism-checklist-item">
        <label>
          Baptismal Permit
          <input
            type="checkbox"
            name="BaptismalPermit"
            checked={checklist.BaptismalPermit}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
  
      <div className="baptism-checklist-item">
        <label>
          Certificate of No Record of Baptism
          <input
            type="checkbox"
            name="CertificateOfNoRecordBaptism"
            checked={checklist.CertificateOfNoRecordBaptism}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
  
      {/* Seminar Fields */}
      <h3>Seminars</h3>
      <div className="baptism-checklist-item">
        <label>
          Pre-Baptism Seminar 1
          <input
            type="checkbox"
            name="PreBaptismSeminar1"
            checked={checklist.PreBaptismSeminar1}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
  
      <div className="baptism-checklist-item">
        <label>
          Pre-Marriage Seminar 2
          <input
            type="checkbox"
            name="PreMarriageSeminar2"
            checked={checklist.PreMarriageSeminar2}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
  
      <button onClick={handleSave}>Save Checklist</button>
    </div>
  );
  
};

export default BaptismChecklist;
