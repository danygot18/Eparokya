import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBar from '../SideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './memberYear.css';

const MemberBatchYear = () => {
    const [yearRanges, setYearRanges] = useState([]);
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');

    useEffect(() => {
        fetchYearRanges();
    }, []);

    const fetchYearRanges = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllMemberYear`,{
                withCredentials: true,
            });

            // setYearRanges(Array.isArray(response.data) ? response.data : []);
            setYearRanges(response.data.data);
        } catch (error) {
            console.error('Error fetching year ranges:', error);
        }
    };

    const handleCreate = async () => {
        if (!startYear || !endYear) {
            toast.error('Both start year and end year are required.');
            return;
        }
    
        const yearRange = { startYear, endYear };
    
        try {
            await axios.post(
                `${process.env.REACT_APP_API}/api/v1/createMemberYear`,
                { yearRange },
                { withCredentials: true }
            );
            toast.success('Year range successfully added.');
            fetchYearRanges();
            setStartYear('');
            setEndYear('');
        } catch (error) {
            console.error('Error creating year range:', error);
            toast.error(
                error.response?.data?.message || 'There was an error adding the year range.'
            );
        }
    };
    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/deleteMemberYear/${id}`);
            fetchYearRanges();
        } catch (error) {
            console.error('Error deleting year range:', error);
        }
    };

    return (
        <div className="memberYear-wrapper">
            <SideBar />
            <div className="memberYear-content">
                <div className="memberYear-leftPane">
                    <h2 className="memberYear-title">Add Year Range</h2>
                    <div className="memberYear-form">
                        <div className="memberYear-formGroup">
                            <label className="memberYear-label">Start Year</label>
                            <input
                                type="number"
                                className="memberYear-input"
                                value={startYear}
                                onChange={(e) => setStartYear(e.target.value)}
                            />
                        </div>
                        <div className="memberYear-formGroup">
                            <label className="memberYear-label">End Year</label>
                            <input
                                type="number"
                                className="memberYear-input"
                                value={endYear}
                                onChange={(e) => setEndYear(e.target.value)}
                            />
                        </div>
                        <button className="memberYear-submitButton" onClick={handleCreate}>Add Year Range</button>
                    </div>
                </div>

                <div className="memberYear-rightPane">
                    <h2 className="memberYear-title">Year Ranges</h2>
                    <ul className="memberYear-list">
                        {yearRanges.map((year) => (
                            <li key={year._id} className="memberYear-listItem">
                                <span className="memberYear-categoryText">{year.yearRange.startYear} - {year.yearRange.endYear}</span>
                                <div className="memberYear-buttonContainer">
                                    <button className="memberYear-deleteButton" onClick={() => handleDelete(year._id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MemberBatchYear;
