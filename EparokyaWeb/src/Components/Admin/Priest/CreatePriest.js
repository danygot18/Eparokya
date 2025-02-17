import React, { useState, useEffect } from "react";
import SideBar from "../SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./priest.css";
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
    axios
      .get(`${process.env.REACT_APP_API}/api/v1/getAllPriest`)
      .then((response) => {
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
      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/createPriest`,
        formData
      );
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
    <div className="ministry-category-details">
      <SideBar />

      {/* Create Priest Form (Centered) */}
      <div className="priest-main-content">
        <div className="form-container">
          <h2 className="form-title">Create Priest</h2>
          <form onSubmit={handleSubmit} className="priest-form">
            <select
              name="title"
              value={priestData.title}
              onChange={handleChange}
              placeholder="Title"
            >
              <option value="">Select a Title</option>{" "}
              {[
                "Reverend Father",
                "Father",
                "Archbishop",
                "Archdeacons",
                "Archpriest",
                "Bishop",
                "Cardinal",
                "Chaplain",
                "Coadjutor",
                "Deacon",
                "Diocesan Bishop",
                "Metropolitan",
                "Metropolitan Bishop",
                "Monsignor",
                "Patriarch",
                "Pastor",
                "Pope",
                "Primate",
              ].map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="position"
              placeholder="Position"
              value={priestData.position}
              onChange={handleChange}
            />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={priestData.fullName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="nickName"
              placeholder="Nick Name"
              value={priestData.nickName}
              onChange={handleChange}
            />

            <label>Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={priestData.birthDate}
              onChange={handleChange}
            />

            <input
              type="text"
              name="Seminary"
              placeholder="Seminary"
              value={priestData.Seminary}
              onChange={handleChange}
            />

            <label>Ordination Date</label>
            <input
              type="date"
              name="ordinationDate"
              value={priestData.ordinationDate}
              onChange={handleChange}
            />

            <input
              type="text"
              name="parishDurationYear"
              placeholder="Parish Duration Year"
              value={priestData.parishDurationYear}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() =>
                setPriestData({ ...priestData, isActive: !priestData.isActive })
              }
              className={`toggle-button ${priestData.isActive ? "active" : ""}`}
            >
              {priestData.isActive ? "Active" : "Inactive"}
            </button>

            <button
              type="button"
              onClick={() =>
                setPriestData({
                  ...priestData,
                  isRetired: !priestData.isRetired,
                })
              }
              className={`toggle-button ${
                priestData.isRetired ? "retired" : ""
              }`}
            >
              {priestData.isRetired ? "Retired" : "Not Retired"}
            </button>

            <input type="file" name="image" onChange={handleFileChange} />

            <button type="submit" className="submit-button">
              Save Priest
            </button>
          </form>
        </div>

        {/* Priest List (Fixed Right Side) */}
        <div className="priest-list-container">
          <h2 className="list-title">Priest List</h2>
          <div className="priest-list">
            {priests.map((priest) => (
              <div key={priest._id} className="priest-item">
                <p className="priest-name">
                  {priest.title} {priest.fullName}
                </p>
                <p
                  className={`active-status ${
                    priest.isActive ? "active" : "inactive"
                  }`}
                >
                  {priest.isActive ? "Active" : "Inactive"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePriest;
