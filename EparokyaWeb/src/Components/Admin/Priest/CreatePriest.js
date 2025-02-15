import React, { useState, useEffect } from "react";
import SideBar from '../SideBar';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './priest.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePriest = () => {
  const [priestData, setPriestData] = useState({
    title: "",
    position: "",
    fullName: "",
    nickName: "",
    birthDate: new Date(),
    Seminary: "",
    ordinationDate: new Date(),
    parishDurationYear: "",
    isActive: false,
    isRetired: false,
    image: null,
  });
  const [priests, setPriests] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/api/v1/getAllPriest`).then((response) => {
      setPriests(response.data);
    });
  }, []);

  const handleChange = (e) => {
    setPriestData({ ...priestData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPriestData({ ...priestData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(priestData).forEach((key) => {
      formData.append(key, priestData[key]);
    });
    try {
      await axios.post(`${process.env.REACT_APP_API}/api/v1/createPriest`, formData);
      toast.success("Priest created successfully");
      setPriestData({
        title: "",
        position: "",
        fullName: "",
        nickName: "",
        birthDate: new Date(),
        Seminary: "",
        ordinationDate: new Date(),
        parishDurationYear: "",
        isActive: false,
        isRetired: false,
        image: null,
      });
    } catch (error) {
      toast.error("Failed to create priest");
    }
  };

  return (
    <div className="flex font-sans">
      <SideBar />
      <div className="p-6 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Create Priest</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Title" value={priestData.title} onChange={handleChange} className="w-full p-2 border" />
          <input type="text" name="position" placeholder="Position" value={priestData.position} onChange={handleChange} className="w-full p-2 border" />
          <input type="text" name="fullName" placeholder="Full Name" value={priestData.fullName} onChange={handleChange} className="w-full p-2 border" />
          <input type="text" name="nickName" placeholder="Nick Name" value={priestData.nickName} onChange={handleChange} className="w-full p-2 border" />
          
          <label>BirthDate</label>
          <input type="date" name="birthDate" value={priestData.birthDate} onChange={handleChange} className="w-full p-2 border" />
          
          <input type="text" name="Seminary" placeholder="Seminary" value={priestData.Seminary} onChange={handleChange} className="w-full p-2 border" />
          
          <label>Ordination Date</label>
          <input type="date" name="ordinationDate" value={priestData.ordinationDate} onChange={handleChange} className="w-full p-2 border" />
          
          <input type="text" name="parishDurationYear" placeholder="Parish Duration Year" value={priestData.parishDurationYear} onChange={handleChange} className="w-full p-2 border" />
          
          <button type="button" onClick={() => setPriestData({ ...priestData, isActive: !priestData.isActive })} className={`w-full p-2 ${priestData.isActive ? 'bg-green-800' : 'bg-green-300'}`}>{priestData.isActive ? 'Active' : 'Inactive'}</button>
          
          <button type="button" onClick={() => setPriestData({ ...priestData, isRetired: !priestData.isRetired })} className={`w-full p-2 ${priestData.isRetired ? 'bg-green-300' : 'bg-green-800'}`}>{priestData.isRetired ? 'Retired' : 'Not Retired'}</button>
          
          <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border" />
          
          <button type="submit" className="w-full p-2 bg-green-800 text-white">Save Priest</button>
        </form>
      </div>
      <div className="w-1/3 p-6 border-l">
        <h2 className="text-xl font-bold mb-4">Priest List</h2>
        {priests.map((priest) => (
          <div key={priest._id} className="p-2 border-b">
            <p className="font-semibold">{priest.title} {priest.fullName}</p>
            <p className="text-sm text-gray-500">{priest.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePriest;