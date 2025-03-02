import React, { useEffect, useState } from 'react';
import GuestSideBar from "../GuestSideBar";
import axios from 'axios';
import './PriestLayout/priest.css';

const ParishPriest = () => {
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriest`);
        setPriests(response.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching priests:', error);
        setLoading(false);
      }
    };

    fetchPriests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="userParishPriest-page">
      <GuestSideBar />
      <div className="userParishPriest-container">
        {priests.map((priest) => (
          <div key={priest._id} className="userParishPriest-item">
            <div className="userParishPriest-image-container">
              <img src={priest.image.url} alt={priest.fullName} className="userParishPriest-image" />
            </div>
            <div className="userParishPriest-details">
              <h2>{priest.fullName}</h2>
              <p className="userParishPriest-year-range">{priest.parishDurationYear}</p>

              <div className="userParishPriest-field">
                <span>Title:</span>
                <input className="userParishPriest-field-value" value={priest.title} readOnly />
              </div>
              <div className="userParishPriest-field">
                <span>Position:</span>
                <input className="userParishPriest-field-value" value={priest.position} readOnly />
              </div>
              <div className="userParishPriest-field">
                <span>Nickname:</span>
                <input className="userParishPriest-field-value" value={priest.nickName} readOnly />
              </div>
              <div className="userParishPriest-field">
                <span>Birth Date:</span>
                <input className="userParishPriest-field-value" value={new Date(priest.birthDate).toLocaleDateString()} readOnly />
              </div>
              <div className="userParishPriest-field">
                <span>Seminary:</span>
                <input className="userParishPriest-field-value" value={priest.Seminary} readOnly />
              </div>
              <div className="userParishPriest-field">
                <span>Ordination Date:</span>
                <input className="userParishPriest-field-value" value={new Date(priest.ordinationDate).toLocaleDateString()} readOnly />
              </div>
              <div className="userParishPriest-status">
                Active: <span>{priest.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="userParishPriest-status">
                Available: <span>{priest.isAvailable ? 'Available' : 'Not Available'}</span>
              </div>
              <div className="userParishPriest-status">
                Retired: <span>{priest.isRetired ? 'Retired' : 'Not Retired'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParishPriest;
