import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminSelection = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [data, setData] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selections, setSelections] = useState([]); 

    const fetchData = async (category) => {
        let endpoint = "";
        if (category === "event") {
            endpoint = "/api/v1/getAllEventType";
        } else if (category === "activities") {
            endpoint = "/api/v1/getAllActivityTypes";
        } else if (category === "priest") {
            endpoint = "/api/v1/getAllPriest";
        }

        if (endpoint) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}${endpoint}`, { withCredentials: true });
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        } else {
            setData([]); 
        }
    };

    const fetchSelections = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getSelections`, { withCredentials: true });
            setSelections(response.data);
        } catch (error) {
            console.error("Error fetching selections:", error);
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            fetchData(selectedCategory);
            setSelectedType(""); 
            setSelectedDate(""); 
            setSelectedTime(""); 
        }
        fetchSelections(); 
    }, [selectedCategory]);

    const getTypeModel = (category) => {
        if (category === "event") return "EventType";
        if (category === "activities") return "ActivityType";
        if (category === "priest") return "Priest";
        return "";
    };

    const handleAddSelection = async () => {
        if (!selectedCategory || !selectedType || !selectedDate || !selectedTime) {
            alert("Please complete all selections.");
            return;
        }
      
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/addSelection`,
                { 
                    category: selectedCategory, 
                    typeModel: getTypeModel(selectedCategory), // ✅ Ensure correct model is sent
                    typeId: selectedType, 
                    date: selectedDate, 
                    time: selectedTime 
                },
                { withCredentials: true }
            );
      
            alert(response.data.message);
            fetchSelections(); // Refresh the list of added selections
        } catch (error) {
            console.error("Error adding selection:", error);
        }
    };

    const handleDeactivateSelection = async (id) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/api/v1/deactivateSelection/${id}`, // Ensure `id` is correct
                {},
                { withCredentials: true }
            );
            alert(response.data.message);
            fetchSelections(); // Refresh list
        } catch (error) {
            console.error("Error deactivating selection:", error.response?.data || error.message);
        }
    };
    

    return (
        <div>
            <h2>Admin Selection</h2>

            {/* Category Dropdown */}
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="event">Event</option>
                <option value="activities">Activities</option>
                <option value="priest">Priest</option>
            </select>

            {/* Type Dropdown */}
            {selectedCategory && (
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="">Select {selectedCategory} Type</option>
                    {data.map((item) => (
                        <option key={item._id} value={item._id}>{item.name || item.fullName}</option>
                    ))}
                </select>
            )}

            {/* Date Picker */}
            {selectedType && (
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            )}

            {/* Time Picker */}
            {selectedType && (
                <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                />
            )}

            {/* Add Button */}
            {selectedType && selectedDate && selectedTime && (
                <button onClick={handleAddSelection}>Add</button>
            )}

            {/* List of Selections */}
            <h3>Added Selections</h3>
            <ul>
                {selections.map((selection) => (
                    <li key={selection._id}>
                        {selection.category} - {selection.typeId?.name || selection.typeId?.fullName} - 
                        {selection.date} at {selection.time} - 
                        {selection.isActive ? "Active" : "Inactive"} 
                        {selection.isActive && (
                            <button onClick={() => handleDeactivateSelection(selection._id)}>Deactivate</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminSelection;
