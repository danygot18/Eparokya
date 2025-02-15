import React, { useEffect, useState } from 'react';
import SideBar from '../SideBar'; // Adjust the import path as necessary
import axios from "axios";

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
        <div className="priest-list-page">
            <SideBar />
            <div className="priest-list-container">
                {priests.map(priest => (
                    <div key={priest._id} className="priest-item">
                        <div className="priest-image-container">
                            <img src={priest.image.url} alt={priest.fullName} className="priest-image" />
                        </div>
                        <div className="priest-details">
                            <h2>{priest.fullName}</h2>
                            <p>{priest.parishDurationYear}</p>
                            <p>Title: {priest.title}</p>
                            <p>Position: {priest.position}</p>
                            <p>Nickname: {priest.nickName}</p>
                            <p>Birth Date: {new Date(priest.birthDate).toLocaleDateString()}</p>
                            <p>Seminary: {priest.Seminary}</p>
                            <p>Ordination Date: {new Date(priest.ordinationDate).toLocaleDateString()}</p>
                            <p>
                                Active: 
                                <button onClick={() => toggleStatus(priest._id, 'isActive')}>
                                    {priest.isActive ? 'Yes' : 'No'}
                                </button>
                            </p>
                            <p>
                                Available: 
                                <button onClick={() => toggleStatus(priest._id, 'isAvailable')}>
                                    {priest.isAvailable ? 'Yes' : 'No'}
                                </button>
                            </p>
                            <p>
                                Retired: 
                                <button onClick={() => toggleStatus(priest._id, 'isRetired')}>
                                    {priest.isRetired ? 'Yes' : 'No'}
                                </button>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriestList;