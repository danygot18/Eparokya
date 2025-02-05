import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeddingChecklist = ({ weddingId }) => {
  // Initialize state for all checklist fields
  const [checklist, setChecklist] = useState({
    // Groom Fields
    GroomNewBaptismalCertificate: false,
    GroomNewConfirmationCertificate: false,
    GroomMarriageLicense: false,
    GroomMarriageBans: false,
    GroomOrigCeNoMar: false,
    GroomOrigPSA: false,
    GroomOnebyOne: false,
    GroomTwobyTwo: false,

    // Bride Fields
    BrideNewBaptismalCertificate: false,
    BrideNewConfirmationCertificate: false,
    BrideMarriageLicense: false,
    BrideMarriageBans: false,
    BrideOrigCeNoMar: false,
    BrideOrigPSA: false,
    BrideOnebyOne: false,
    BrideTwobyTwo: false,

    // Other Checklist Fields
    PermitFromtheParishOftheBride: false,
    ChildBirthCertificate: false,

    // Seminar / Additional
    PreMarriageSeminar: false,
    CanonicalInterview: false,
    Confession: false,
  });

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

  // Handle checkbox toggle
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setChecklist((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // Save updated checklist data
  const handleSave = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/api/v1/updateWeddingChecklist/${weddingId}`,
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
    <div className="wedding-checklist">
      <h2>Wedding Checklist</h2>

      {/* Groom Checklist */}
      <h3>Groom Checklist</h3>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomNewBaptismalCertificate"
            checked={checklist.GroomNewBaptismalCertificate}
            onChange={handleCheckboxChange}
          />
          Groom New Baptismal Certificate
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomNewConfirmationCertificate"
            checked={checklist.GroomNewConfirmationCertificate}
            onChange={handleCheckboxChange}
          />
          Groom New Confirmation Certificate
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomMarriageLicense"
            checked={checklist.GroomMarriageLicense}
            onChange={handleCheckboxChange}
          />
          Groom Marriage License
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomMarriageBans"
            checked={checklist.GroomMarriageBans}
            onChange={handleCheckboxChange}
          />
          Groom Marriage Bans
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomOrigCeNoMar"
            checked={checklist.GroomOrigCeNoMar}
            onChange={handleCheckboxChange}
          />
          Groom Original CENoMar
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomOrigPSA"
            checked={checklist.GroomOrigPSA}
            onChange={handleCheckboxChange}
          />
          Groom Original PSA
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomOnebyOne"
            checked={checklist.GroomOnebyOne}
            onChange={handleCheckboxChange}
          />
          Groom One-by-One
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="GroomTwobyTwo"
            checked={checklist.GroomTwobyTwo}
            onChange={handleCheckboxChange}
          />
          Groom Two-by-Two
        </label>
      </div>

      {/* Bride Checklist */}
      <h3>Bride Checklist</h3>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideNewBaptismalCertificate"
            checked={checklist.BrideNewBaptismalCertificate}
            onChange={handleCheckboxChange}
          />
          Bride New Baptismal Certificate
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideNewConfirmationCertificate"
            checked={checklist.BrideNewConfirmationCertificate}
            onChange={handleCheckboxChange}
          />
          Bride New Confirmation Certificate
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideMarriageLicense"
            checked={checklist.BrideMarriageLicense}
            onChange={handleCheckboxChange}
          />
          Bride Marriage License
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideMarriageBans"
            checked={checklist.BrideMarriageBans}
            onChange={handleCheckboxChange}
          />
          Bride Marriage Bans
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideOrigCeNoMar"
            checked={checklist.BrideOrigCeNoMar}
            onChange={handleCheckboxChange}
          />
          Bride Original CENoMar
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideOrigPSA"
            checked={checklist.BrideOrigPSA}
            onChange={handleCheckboxChange}
          />
          Bride Original PSA
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideOnebyOne"
            checked={checklist.BrideOnebyOne}
            onChange={handleCheckboxChange}
          />
          Bride One-by-One
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="BrideTwobyTwo"
            checked={checklist.BrideTwobyTwo}
            onChange={handleCheckboxChange}
          />
          Bride Two-by-Two
        </label>
      </div>

      {/* Other Checklist Fields */}
      <h3>Other Documents</h3>
      <div>
        <label>
          <input
            type="checkbox"
            name="PermitFromtheParishOftheBride"
            checked={checklist.PermitFromtheParishOftheBride}
            onChange={handleCheckboxChange}
          />
          Permit From the Parish Of the Bride
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="ChildBirthCertificate"
            checked={checklist.ChildBirthCertificate}
            onChange={handleCheckboxChange}
          />
          Child Birth Certificate
        </label>
      </div>

      {/* Seminar / Additional */}
      <h3>Seminar / Additional</h3>
      <div>
        <label>
          <input
            type="checkbox"
            name="PreMarriageSeminar1"
            checked={checklist.PreMarriageSeminar1}
            onChange={handleCheckboxChange}
          />
          Pre Marriage Seminar 
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="CanonicalInterview"
            checked={checklist.CanonicalInterview}
            onChange={handleCheckboxChange}
          />
          Canonical Interview
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="Confession"
            checked={checklist.Confession}
            onChange={handleCheckboxChange}
          />
          Confession
        </label>
      </div>

      <button onClick={handleSave}>Save Checklist</button>
    </div>
  );
};

export default WeddingChecklist;
