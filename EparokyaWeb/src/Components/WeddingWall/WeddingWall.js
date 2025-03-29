import React, { useEffect, useState } from "react";
import "./WeddingWall.css";
import GuestSideBar from "../GuestSideBar";

const WeddingWall = () => {
  const [weddings, setWeddings] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched weddings data:", data); // Debug log
        setWeddings(data);
      })
      .catch((error) => console.error("Error fetching weddings:", error));
  }, []);

  return (
    <div className="weddingWall-container">
      {/* Left Sidebar - GuestSideBar */}
      <div>
        <GuestSideBar />
      </div>

      {/* Middle Content */}
      <div className="weddingWall-content">
        {weddings.map((wedding, index) => {
          const formattedWeddingDate = new Date(wedding.weddingDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          const formattedWeddingTime = new Date(`1970-01-01T${wedding.weddingTime}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          const formattedConfirmedAt = new Date(wedding.confirmedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          const groomImageUrl = wedding.GroomOneByOne?.url || "/path/to/default-groom-image.jpg";
          const brideImageUrl = wedding.BrideOneByOne?.url || "/path/to/default-bride-image.jpg";

          return (
            <div key={index} className="weddingWall-box">
              {/* Display the groom's and bride's images */}
              <div className="weddingWall-images">
                <img
                  src={groomImageUrl}
                  alt={`${wedding.groomName}'s photo`}
                  className="weddingWall-image"
                />
                <img
                  src={brideImageUrl}
                  alt={`${wedding.brideName}'s photo`}
                  className="weddingWall-image"
                />
              </div>
              <h3>Saint Joseph Parish - Taguig</h3>
              <div className="weddingWall-body">
                <p>{wedding.groomName} & {wedding.brideName}</p>
                <p>Wedding Date: {formattedWeddingDate}</p>
                <p>Wedding Time: {formattedWeddingTime}</p>
                <p>Confirmed Date: {formattedConfirmedAt}</p>
              </div>
              <div className="weddingWall-footer">
                <p>
                  Kung may tutol man po sa mga ikakasal, maari lamang na
                  makipag-ugnayan sa parokya o sa ating opisina. Maraming Salamat po.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Sidebar - Confirmed Weddings List */}
      <div className="weddingWall-summary">
        <h2>Weddings</h2>
        {weddings.map((wedding, index) => (
          <div key={index} className="weddingWall-summary-item">
            {wedding.groomName} and {wedding.brideName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingWall;