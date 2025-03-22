import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import SideBar from './SideBar';

const AdminDates = () => {
    const [dates, setDates] = useState([]);
    const [form, setForm] = useState({
        category: '',
        date: '',
        time: '',
        maxParticipants: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');
    const [editingDate, setEditingDate] = useState(null);

    const location = useLocation();

    const fetchDates = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getAllDates`);
            console.log('Fetched Dates:', response.data);
            setDates(response.data);
        } catch (error) {
            console.error('Failed to fetch dates', error);
        }
    };

    useEffect(() => {
        fetchDates();
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleCreateDate = async () => {
        try {
            setIsLoading(true);
            await axios.post(`${process.env.REACT_APP_API}/api/v1/createDate`, form);
            fetchDates();
            setForm({ category: '', date: '', time: '', maxParticipants: 0 });
        } catch (error) {
            console.error('Failed to create date', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleDate = async (adminDateId) => {
        try {
            const toggleUrl = `${process.env.REACT_APP_API}/api/v1/${adminDateId}/toggle`;
            const response = await axios.patch(toggleUrl);
            if (response.status === 200) {
                const updatedDates = dates.map(date =>
                    date._id === adminDateId ? { ...date, isEnabled: !date.isEnabled } : date
                );
                setDates(updatedDates);
            }
        } catch (error) {
            console.error('Failed to toggle date', error);
        }
    };

    const handleDeleteDate = async (adminDateId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API}/api/v1/delete/${adminDateId}`);
            fetchDates();
        } catch (error) {
            console.error('Failed to delete date', error);
        }
    };

    const handleEditDate = async (id, newMaxParticipants) => {
        try {
            await axios.put(`${process.env.REACT_APP_API}/api/v1/editDate/${id}`, { maxParticipants: newMaxParticipants });
            setEditingDate(null);
            fetchDates();
        } catch (error) {
            console.error('Failed to edit date', error);
        }
    };

    const filteredDates = dates.filter(
        (date) =>
            (!search || date.category.toLowerCase().includes(search.toLowerCase())) &&
            (!filter || date.category === filter)
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <SideBar />
            <div style={{ flex: 1, padding: '20px' }}>
                <h2>Manage Dates</h2>
                <form style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <label style={{ flexBasis: 'calc(50% - 10px)' }}>
                        Category:
                        <select name="category" value={form.category} onChange={handleInputChange} style={{ width: '100%' }}>
                            <option value="">Select Category</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Baptism">Baptism</option>
                        </select>
                    </label>
                    <label style={{ flexBasis: 'calc(50% - 10px)' }}>
                        Date:
                        <input type="date" name="date" value={form.date} onChange={handleInputChange} style={{ width: '100%' }} />
                    </label>
                    <label style={{ flexBasis: 'calc(50% - 10px)' }}>
                        Time:
                        <input type="time" name="time" value={form.time} onChange={handleInputChange} style={{ width: '100%' }} />
                    </label>
                    <label style={{ flexBasis: 'calc(50% - 10px)' }}>
                        Max Participants:
                        <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleInputChange} style={{ width: '100%' }} />
                    </label>
                    <button
                        type="button"
                        onClick={handleCreateDate}
                        disabled={isLoading}
                        style={{
                            flexBasis: '100%',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                        }}
                    >
                        {isLoading ? 'Creating...' : 'Create Date'}
                    </button>
                </form>

                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search by category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="">Filter by Category</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Funeral">Funeral</option>
                        <option value="Christening">Christening</option>
                        <option value="Counseling">Counseling</option>
                    </select>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Time</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Max Participants</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Confirmed</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Submitted</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Available</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDates.map((date) => (
                            <tr key={date._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{date.category}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(date.date).toLocaleDateString()}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{date.time}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {editingDate === date._id ? (
                                        <input
                                            type="number"
                                            value={date.maxParticipants}
                                            onChange={(e) => handleEditDate(date._id, e.target.value)}
                                            style={{ width: '50px' }}
                                        />
                                    ) : (
                                        date.maxParticipants
                                    )}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{date.confirmedParticipants}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{date.submittedParticipants || 0}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    {date.maxParticipants - (date.confirmedParticipants || 0) - (date.submittedParticipants || 0)}
                                </td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{date.isEnabled ? 'Enabled' : 'Disabled'}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleToggleDate(date._id)}
                                        style={{
                                            backgroundColor: date.isEnabled ? '#4CAF50' : '#ff4d4d',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            marginRight: '5px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {date.isEnabled ? 'Disable' : 'Enable'}
                                    </button>

                                    <button
                                        onClick={() => handleDeleteDate(date._id)}
                                        style={{
                                            backgroundColor: '#d9534f',
                                            color: 'white',
                                            border: 'none',
                                            padding: '5px 10px',
                                            marginRight: '5px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDates;
