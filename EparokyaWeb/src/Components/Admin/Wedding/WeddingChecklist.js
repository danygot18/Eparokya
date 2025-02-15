import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeddingChecklist = ({ weddingId }) => {
  const [checklist, setChecklist] = useState({
    GroomNewBaptismalCertificate: false,
    GroomNewConfirmationCertificate: false,
    GroomMarriageLicense: false,
    GroomMarriageBans: false,
    GroomOrigCeNoMar: false,
    GroomOrigPSA: false,
    GroomOnebyOne: false,
    GroomTwobyTwo: false,
    BrideNewBaptismalCertificate: false,
    BrideNewConfirmationCertificate: false,
    BrideMarriageLicense: false,
    BrideMarriageBans: false,
    BrideOrigCeNoMar: false,
    BrideOrigPSA: false,
    BrideOnebyOne: false,
    BrideTwobyTwo: false,
    PermitFromtheParishOftheBride: false,
    ChildBirthCertificate: false,
    PreMarriageSeminar: false,
    CanonicalInterview: false,
    Confession: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (weddingId) {
      axios
        .get(`${process.env.REACT_APP_API}/api/v1/getWeddingChecklist/${weddingId}`, {
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
  }, [weddingId]);

  const handleCheckboxChange = (name) => {
    setChecklist((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  // const handleSave = async () => {
  //   try {
  //     await axios.put(
  //       `${process.env.REACT_APP_API}/api/v1/updateWeddingChecklist/${weddingId}`,
  //       checklist,
  //       { withCredentials: true }
  //     );
  //     alert('Checklist updated successfully!');
  //   } catch (err) {
  //     console.error('Error updating checklist:', err);
  //     alert('Failed to update checklist.');
  //   }
  // };

  const handleSave = async () => {
    setIsModalOpen(true);
  };

  const confirmSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/updateWeddingChecklist/${weddingId}`,
        checklist,
        { withCredentials: true }
      );
      alert('Checklist updated successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error updating checklist:', err);
      alert('Failed to update checklist.');
    }
  };


  const verifiedItems = Object.keys(checklist).filter(key => checklist[key]);
  const unverifiedItems = Object.keys(checklist).filter(key => !checklist[key]);

  return (
    <div className="wedding-checklist">
      <h2>Wedding Checklist</h2>

      <h3>Groom Checklist</h3>
      <div className="wedding-checklist-item">
        <span>Groom New Baptismal Certificate</span>
        <button
          className={checklist.GroomNewBaptismalCertificate ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomNewBaptismalCertificate')}
        >
          {checklist.GroomNewBaptismalCertificate ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Groom New Confirmation Certificate</span>
        <button
          className={checklist.GroomNewConfirmationCertificate ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomNewConfirmationCertificate')}
        >
          {checklist.GroomNewConfirmationCertificate ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Groom Marriage License</span>
        <button
          className={checklist.GroomMarriageLicense ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomMarriageLicense')}
        >
          {checklist.GroomMarriageLicense ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Groom Marriage Bans</span>
        <button
          className={checklist.GroomMarriageBans ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomMarriageBans')}
        >
          {checklist.GroomMarriageBans ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Groom Original CENoMar</span>
        <button
          className={checklist.GroomOrigCeNoMar ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomOrigCeNoMar')}
        >
          {checklist.GroomOrigCeNoMar ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Groom Original PSA</span>
        <button
          className={checklist.GroomOrigPSA ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomOrigPSA')}
        >
          {checklist.GroomOrigPSA ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Groom One-by-One</span>
        <button
          className={checklist.GroomOnebyOne ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomOnebyOne')}
        >
          {checklist.GroomOnebyOne ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Groom Two-by-Two</span>
        <button
          className={checklist.GroomTwobyTwo ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('GroomTwobyTwo')}
        >
          {checklist.GroomTwobyTwo ? "Verified" : "Unverified"}
        </button>
      </div>

      <h3>Bride Checklist</h3>
      <div className="wedding-checklist-item">
        <span>Bride New Baptismal Certificate</span>
        <button
          className={checklist.BrideNewBaptismalCertificate ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideNewBaptismalCertificate')}
        >
          {checklist.BrideNewBaptismalCertificate ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Bride New Confirmation Certificate</span>
        <button
          className={checklist.BrideNewConfirmationCertificate ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideNewConfirmationCertificate')}
        >
          {checklist.BrideNewConfirmationCertificate ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Bride Marriage License</span>
        <button
          className={checklist.BrideMarriageLicense ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideMarriageLicense')}
        >
          {checklist.BrideMarriageLicense ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Bride Marriage Bans</span>
        <button
          className={checklist.BrideMarriageBans ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideMarriageBans')}
        >
          {checklist.BrideMarriageBans ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Bride Original CENoMar</span>
        <button
          className={checklist.BrideOrigCeNoMar ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideOrigCeNoMar')}
        >
          {checklist.BrideOrigCeNoMar ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Bride Original PSA</span>
        <button
          className={checklist.BrideOrigPSA ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideOrigPSA')}
        >
          {checklist.BrideOrigPSA ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Bride One-by-One</span>
        <button
          className={checklist.BrideOnebyOne ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideOnebyOne')}
        >
          {checklist.BrideOnebyOne ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Bride Two-by-Two</span>
        <button
          className={checklist.BrideTwobyTwo ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('BrideTwobyTwo')}
        >
          {checklist.BrideTwobyTwo ? "Verified" : "Unverified"}
        </button>
      </div>

      <h3>Other Documents</h3>
      <div className="wedding-checklist-item">
        <span>Permit From the Parish Of the Bride</span>
        <button
          className={checklist.PermitFromtheParishOftheBride ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('PermitFromtheParishOftheBride')}
        >
          {checklist.PermitFromtheParishOftheBride ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Child Birth Certificate</span>
        <button
          className={checklist.ChildBirthCertificate ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('ChildBirthCertificate')}
        >
          {checklist.ChildBirthCertificate ? "Verified" : "Unverified"}
        </button>
      </div>

      <h3>Seminar / Additional</h3>
      <div className="wedding-checklist-item">
        <span>Pre Marriage Seminar</span>
        <button
          className={checklist.PreMarriageSeminar ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('PreMarriageSeminar')}
        >
          {checklist.PreMarriageSeminar ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Canonical Interview</span>
        <button
          className={checklist.CanonicalInterview ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('CanonicalInterview')}
        >
          {checklist.CanonicalInterview ? "Verified" : "Unverified"}
        </button>
      </div>
      <div className="wedding-checklist-item">
        <span>Confession</span>
        <button
          className={checklist.Confession ? "checked-btn" : "unchecked-btn"}
          onClick={() => handleCheckboxChange('Confession')}
        >
          {checklist.Confession ? "Verified" : "Unverified"}
        </button>
      </div>

      <button onClick={handleSave}>Save Checklist</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you have verified these forms?</h3>
            <h4>Verified Forms:</h4>
            <ul>
              {verifiedItems.map((item) => (
                <li key={item}>{item.replace(/([A-Z])/g, ' $1').trim()}</li>
              ))}
            </ul>
            <h4>Unverified Forms:</h4>
            <ul>
              {unverifiedItems.map((item) => (
                <li key={item}>{item.replace(/([A-Z])/g, ' $1').trim()}</li>
              ))}
            </ul>
            <button onClick={confirmSave}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Back</button>
          </div>
        </div>
      )}

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
                    .wedding-checklist-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                    }
                    .modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                   }
                    .modal-content {
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                    }
                `}
      </style>
    </div>
  );
};

export default WeddingChecklist;
