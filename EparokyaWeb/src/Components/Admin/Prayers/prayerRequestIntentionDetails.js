import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideBar from '../SideBar';
import './PrayerStyles/prayerRequestIntentionDetails.css';

const PrayerRequestIntentionDetails = () => {
  const { prayerIntentionId } = useParams();
  const [prayerRequest, setPrayerRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPrayerRequest();
  }, []);

  const fetchPrayerRequest = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getPrayerRequestIntentionById/${prayerIntentionId}`);
      setPrayerRequest(response.data);
    } catch (error) {
      console.error('Error fetching prayer request:', error);
    }
  };

  const markAsPrayed = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/markPrayerRequestIntentionAsDone/${prayerIntentionId}`);
      setPrayerRequest({ ...prayerRequest, isDone: true });
      setShowModal(false);
    } catch (error) {
      console.error('Error marking as prayed:', error);
    }
  };

  if (!prayerRequest) return <div>Loading...</div>;

  return (
    <div className="prayerIntentionDetails-container">
      <SideBar />
      <div className="prayerIntentionDetails-content">
        <h2>Prayer Request Details</h2>
        <div className="prayerIntentionDetails-card">
          <p><strong>Name:</strong> {prayerRequest.offerrorsName}</p>
          <p><strong>Prayer Type:</strong> {prayerRequest.prayerType}</p>
          {prayerRequest.prayerType === 'Others (Iba pa)' && (
            <p><strong>Additional Prayer:</strong> {prayerRequest.addPrayer}</p>
          )}
          <p><strong>Description:</strong> {prayerRequest.prayerDescription || 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(prayerRequest.prayerRequestDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <p><strong>Time:</strong> {new Date(`1970-01-01T${prayerRequest.prayerRequestTime}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
          <p><strong>Intentions:</strong> {prayerRequest.Intentions.map((intention, index) => (<span key={index}>{intention.name}{index < prayerRequest.Intentions.length - 1 ? ', ' : ''}</span>))}</p>
          <p><strong>Submitted By:</strong> {prayerRequest.userId?.name || 'N/A'}</p>
          <p><strong>Created At:</strong> {new Date(prayerRequest.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <button 
            className="prayed-button" 
            onClick={() => setShowModal(true)}
            disabled={prayerRequest.isDone}
          >
            {prayerRequest.isDone ? 'Prayed' : 'Mark as Prayed'}
          </button>
        </div>
  
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>{`${prayerRequest.prayerType} for ${prayerRequest.offerrorsName}`}</p>
              <button className="confirm-button" onClick={markAsPrayed}>Prayed</button>
              <button className="back-button" onClick={() => setShowModal(false)}>Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerRequestIntentionDetails;
