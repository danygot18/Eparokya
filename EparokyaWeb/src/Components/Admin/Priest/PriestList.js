import React, { useEffect, useState } from 'react';
import SideBar from '../SideBar'; 
import axios from "axios";
import "./priest.css";
import MetaData from '../../Layout/MetaData';

const PriestList = () => {
    const [priests, setPriests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPriests = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API}/api/v1/getAllPriest`); 
                const data = await response.json();
                setPriests(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching priests:', error);
                setLoading(false);
            }
        };

        fetchPriests();
    }, []);

    const toggleStatus = async (priestId, field) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API}/api/v1/updatePriestStatus/${priestId}`, {
                field,
                value: !priests.find(priest => priest._id === priestId)[field]
            });
    
            setPriests(prevPriests => prevPriests.map(priest => 
                priest._id === priestId ? { ...priest, [field]: response.data[field] } : priest
            ));
            
            console.log("Updating priest:", priestId, field);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };
    
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="priestList-page">
            <MetaData title="List Parish Priest" />
            <SideBar />
            <div className="priestList-container">
                {priests.map(priest => (
                    <div key={priest._id} className="priestList-item">
                        <div className="priestList-image-container">
                            <img src={priest.image.url} alt={priest.fullName} className="priestList-image" />
                        </div>
                        <div className="priestList-details">
                            <h2>{priest.fullName}</h2>
                            <p className="priestList-year-range">{priest.parishDurationYear}</p>
                            
                            <div className="priestList-field">
                                Title:
                                <input className="priestList-field-value" value={priest.title} readOnly />
                            </div>
                            <div className="priestList-field">
                                Position:
                                <input className="priestList-field-value" value={priest.position} readOnly />
                            </div>
                            <div className="priestList-field">
                                Nickname:
                                <input className="priestList-field-value" value={priest.nickName} readOnly />
                            </div>
                            <div className="priestList-field">
                                Birth Date:
                                <input className="priestList-field-value" value={new Date(priest.birthDate).toLocaleDateString()} readOnly />
                            </div>
                            <div className="priestList-field">
                                Seminary:
                                <input className="priestList-field-value" value={priest.Seminary} readOnly />
                            </div>
                            <div className="priestList-field">
                                Ordination Date:
                                <input className="priestList-field-value" value={new Date(priest.ordinationDate).toLocaleDateString()} readOnly />
                            </div>
                            <div>
                                Active: 
                                <button onClick={() => toggleStatus(priest._id, 'isActive')}>
                                    {priest.isActive ? 'Yes' : 'No'}
                                </button>
                            </div>
                            <div>
                                Available: 
                                <button onClick={() => toggleStatus(priest._id, 'isAvailable')}>
                                    {priest.isAvailable ? 'Yes' : 'No'}
                                </button>
                            </div>
                            <div>
                                Retired: 
                                <button onClick={() => toggleStatus(priest._id, 'isRetired')}>
                                    {priest.isRetired ? 'Yes' : 'No'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    
};

export default PriestList;