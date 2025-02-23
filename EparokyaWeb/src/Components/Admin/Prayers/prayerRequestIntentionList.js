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

    const prayerTypeColors = {
        'For the sick and suffering (Para sa mga may sakit at nagdurusa)': '#FF6B6B',
        'For those who have died (Para sa mga namatay na)': '#4ECDC4',
        'Special Intentions(Natatanging Kahilingan)': '#FFD93D',
        'For family and friends (Para sa pamilya at mga kaibigan)': '#1A535C',
        'For those who are struggling (Para sa mga nahihirapan/naghihirap)': '#FF9F1C',
        'For peace and justice (Para sa kapayapaan at katarungan)': '#2EC4B6',
        'For the Church (Para sa Simbahan)': '#5D5FEF',
        'For vocations (Para sa mga bokasyon)': '#9D4EDD',
        'For forgiveness of sins (Para sa kapatawaran ng mga kasalanan)': '#F25F5C',
        'For guidance and wisdom (Para sa gabay at karunungan)': '#247BA0',
        'For strength and courage (Para sa lakas at tapang)': '#70C1B3',
        'For deeper faith and love (Para sa mas malalim na pananampalataya at pag-ibig)': '#B5838D',
        'For perseverance (Para sa pagtitiyaga/pagtitiis)': '#6D597A',
        'Others (Iba pa)': '#F28482'
    };


    const getPrayerTypeColor = (prayerType) => {
        return prayerTypeColors[prayerType] || '#CCCCCC';
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
                        {Object.keys(prayerTypeColors).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>


                </div>

                <div className="prayer-intention-grid">
                    {filteredRequests.map((request, index) => (
                        <div
                            key={request._id}
                            className="prayer-intention-card"
                            style={{ borderLeft: `8px solid ${getPrayerTypeColor(request.prayerType)}` }}
                            onClick={() => handleCardClick(request._id)}
                        >
                            <h3>Prayer Intention #{index + 1}</h3>
                            <p><strong>Offeror's Name:</strong> {request.offerrorsName}</p>
                            <p><strong>Prayer Type:</strong> {request.prayerType === 'Others (Iba pa)' ? request.addPrayer : request.prayerType}</p>
                            <p><strong>Date:</strong> {new Date(request.prayerRequestDate).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {new Date(`1970-01-01T${request.prayerRequestTime}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                            <p><strong>Is Done:</strong> {request.isDone ? 'Yes' : 'No'}</p>
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
