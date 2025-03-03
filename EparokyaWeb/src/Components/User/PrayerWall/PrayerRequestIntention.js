import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import GuestSidebar from "../../GuestSideBar";
import "./PrayerStyles/prayerIntention.css";
import { socket } from "../../../socket/index.js"; 

const PrayerRequestIntention = () => {
  const [formData, setFormData] = useState({
    offerrorsName: "",
    prayerType: "",
    addPrayer: "",
    prayerDescription: "",
    prayerRequestDate: "",
    prayerRequestTime: "",
    intentions: [],
  });

  const config = {
    withCredentials: true,
  };

  const prayerTypes = [
    "For the sick and suffering (Para sa mga may sakit at nagdurusa)",
    "For those who have died (Para sa mga namatay na)",
    "Special Intentions(Natatanging Kahilingan)",
    "For family and friends (Para sa pamilya at mga kaibigan)",
    "For those who are struggling (Para sa mga nahihirapan/naghihirap)",
    "For peace and justice (Para sa kapayapaan at katarungan)",
    "For the Church (Para sa Simbahan)",
    "For vocations (Para sa mga bokasyon)",
    "For forgiveness of sins (Para sa kapatawaran ng mga kasalanan)",
    "For guidance and wisdom (Para sa gabay at karunungan)",
    "For strength and courage (Para sa lakas at tapang)",
    "For deeper faith and love (Para sa mas malalim na pananampalataya at pag-ibig)",
    "For perseverance (Para sa pagtitiyaga/pagtitiis)",
    "Others (Iba pa)",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIntentionChange = (index, value) => {
    setFormData((prev) => {
      const newIntentions = [...prev.intentions];
      newIntentions[index].name = value; 
      return { ...prev, intentions: newIntentions };
    });
  };
  
  const handleAddIntention = () => {
    setFormData((prev) => ({
      ...prev,
      intentions: [...prev.intentions, { name: "" }], 
    }));
  };
  
  const handleRemoveIntention = (index) => {
    setFormData((prev) => ({
      ...prev,
      intentions: prev.intentions.filter((_, i) => i !== index), 
    }));
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (formData.prayerType === "Others (Iba pa)" && !formData.addPrayer) {
  //     toast.error("Please specify your prayer when selecting Others.");
  //     return;
  //   }
  
  //   try {
  //     const payload = {
  //       ...formData,
  //       Intentions: formData.intentions.map((intention) => ({ name: intention.name })), 
  //     };
  
  //     console.log("Submitting payload:", payload); 
  
  //     await axios.post(
  //       `${process.env.REACT_APP_API}/api/v1/prayerRequestIntention/submit`,
  //       payload,
  //       config
  //     );
  
  //     toast.success("Prayer submitted. This will be reviewed shortly.");
  //     setFormData({
  //       offerorsName: "",
  //       prayerType: "",
  //       addPrayer: "",
  //       prayerDescription: "",
  //       prayerRequestDate: "",
  //       prayerRequestTime: "",
  //       intentions: [], 
  //     });
  //   } catch (error) {
  //     console.error("Submission error:", error.response?.data); 
  //     toast.error(error.response?.data?.message || "Something went wrong");
  //   }
  // };
  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.prayerType === "Others (Iba pa)" && !formData.addPrayer) {
    toast.error("Please specify your prayer when selecting Others.");
    return;
  }

  try {
    const payload = {
      ...formData,
      Intentions: formData.intentions.map((intention) => ({ name: intention.name })),
    };

    console.log("Submitting payload:", payload);

    await axios.post(
      `${process.env.REACT_APP_API}/api/v1/prayerRequestIntention/submit`,
      payload,
      config
    );

    // Emit WebSocket notification for admins
    socket.emit("prayerRequestSubmitted", {
      message: `New prayer request submitted by ${formData.offerrorsName || "a user"}.`,
      timestamp: new Date(),
    });

    toast.success("Prayer submitted. This will be reviewed shortly.");
    setFormData({
      offerrorsName: "",
      prayerType: "",
      addPrayer: "",
      prayerDescription: "",
      prayerRequestDate: "",
      prayerRequestTime: "",
      intentions: [],
    });
  } catch (error) {
    console.error("Submission error:", error.response?.data);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  

  const handleClear = () => {
    setFormData({
      offerrorsName: "",
      prayerType: "",
      addPrayer: "",
      prayerDescription: "",
      prayerRequestDate: "",
      prayerRequestTime: "",
      intentions: [],
    });
  };

  return (
    <div className="prayerRequestIntention-container">
      <GuestSidebar className="prayerRequestIntention-sidebar" />
      <div className="prayerRequestIntention-box">
        <h2 className="prayerRequestIntention-title">Prayer Request</h2>
        <p className="prayerRequestIntention-subtext">
          Kung nais magpadasal, fill-upan lamang ang nasa baba. Ang inyong mga
          dasal ay mababasa ni padre.
        </p>
        <div className="mt-4">
          <select
            name="prayerType"
            value={formData.prayerType}
            onChange={handleChange}
            required
          >
            <option value="">Select Prayer Type</option>
            {prayerTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {formData.prayerType === "Others (Iba pa)" && (
            <input
              type="text"
              name="addPrayer"
              value={formData.addPrayer}
              onChange={handleChange}
              placeholder="Specify your prayer"
              required
            />
          )}

          <textarea
            name="offerrorsName"
            value={formData.offerrorsName}
            onChange={handleChange}
            placeholder="Name"
          />
          <textarea
            name="prayerDescription"
            value={formData.prayerDescription}
            onChange={handleChange}
            placeholder="Prayer Description (Optional)"
          />
          <input
            type="date"
            name="prayerRequestDate"
            value={formData.prayerRequestDate}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="prayerRequestTime"
            value={formData.prayerRequestTime}
            onChange={handleChange}
            required
          />

          {/* Intentions Section */}
          <div className="intentions-container">
            <h3 className="text-lg font-semibold mt-4">Intentions</h3>
            {formData.intentions.map((intention, index) => (
              <div
                key={index}
                className="intention-item flex items-center gap-2"
              >
                <input
                  type="text"
                  value={intention.name}
                  onChange={(e) => handleIntentionChange(index, e.target.value)}
                  placeholder="Enter name to include in your intentions"
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={() => handleRemoveIntention(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddIntention}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Intention
            </button>
          </div>

          <div className="prayerRequestIntention-buttons">
            <button onClick={handleClear} className="clear-button">
              Clear All Fields
            </button>
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequestIntention;
