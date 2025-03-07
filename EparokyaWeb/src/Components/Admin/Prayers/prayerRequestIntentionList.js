import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PrayerStyles/prayerIntentionList.css';
import SideBar from "../SideBar";

const PrayerRequestIntentionList = () => {
    const [prayerRequests, setPrayerRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPrayerRequests();
    }, []);

    const fetchPrayerRequests = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPrayerRequestIntention`);
            setPrayerRequests(response.data);
        } catch (error) {
            console.error('Error fetching prayer requests:', error);
        }
    };

    const filteredRequests = prayerRequests.filter((request) => {
        const matchesSearch = request.prayerType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType ? request.prayerType === filterType : true;
        return matchesSearch && matchesFilter;
    });

    const getBorderColor = (isDone) => {
        return isDone ? '#28a745' : '#dc3545'; 
    };

    const handleCardClick = (prayerIntentionId) => {
        navigate(`/admin/prayerIntention/details/${prayerIntentionId}`);
    };

    return (
        <div className="prayer-intention-container">
            <SideBar />
            <div className="prayer-intention-content">
                <div className="prayer-intention-controls">
                    <input
                        type="text"
                        placeholder="Search by prayer type"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="">All Prayer Types</option>
                        {[...new Set(prayerRequests.map(req => req.prayerType))].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="prayer-intention-grid">
                    {filteredRequests.map((request, index) => (
                        <div
                            key={request._id}
                            className="prayer-intention-card"
                            style={{ borderLeft: `8px solid ${getBorderColor(request.isDone)}` }}
                            onClick={() => handleCardClick(request._id)}
                        >
                            <h3>Prayer Intention #{index + 1}</h3>
                            <p><strong>Offeror's Name:</strong> {request.offerrorsName}</p>
                            <p><strong>Prayer Type:</strong> {request.prayerType === 'Others (Iba pa)' ? request.addPrayer : request.prayerType}</p>
                            <p><strong>Date:</strong> {new Date(request.prayerRequestDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(`1970-01-01T${request.prayerRequestTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                            <p><strong>Is Done:</strong> <span style={{ color: request.isDone ? 'green' : 'red' }}>{request.isDone ? 'Yes' : 'No'}</span></p>
                            <p><strong>Submitted By:</strong> {request.userId?.name || 'N/A'}</p>
                            <p><strong>Created At:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PrayerRequestIntentionList;
