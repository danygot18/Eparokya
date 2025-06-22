import React, { useEffect, useState } from "react";
import "./WeddingWall.css";
import GuestSideBar from "../GuestSideBar";
import Loader from "../Layout/Loader";

const WeddingWall = () => {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/api/v1/confirmedWedding`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched weddings data:", data);
        setWeddings(data);
      })
      .catch((error) => console.error("Error fetching weddings:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="weddingWall-container">
      {/* Left Sidebar */}
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

          const groomFullAddress = [
            wedding.groomAddress?.BldgNameTower,
            wedding.groomAddress?.LotBlockPhaseHouseNo,
            wedding.groomAddress?.SubdivisionVillageZone,
            wedding.groomAddress?.Street,
            wedding.groomAddress?.District,
            wedding.groomAddress?.barangay === 'Others' ? wedding.groomAddress?.customBarangay : wedding.groomAddress?.barangay,
            wedding.groomAddress?.city === 'Others' ? wedding.groomAddress?.customCity : wedding.groomAddress?.city
          ].filter(Boolean).join(', ');

          const brideFullAddress = [
            wedding.brideAddress?.BldgNameTower,
            wedding.brideAddress?.LotBlockPhaseHouseNo,
            wedding.brideAddress?.SubdivisionVillageZone,
            wedding.brideAddress?.Street,
            wedding.brideAddress?.District,
            wedding.brideAddress?.barangay === 'Others' ? wedding.brideAddress?.customBarangay : wedding.brideAddress?.barangay,
            wedding.brideAddress?.city === 'Others' ? wedding.brideAddress?.customCity : wedding.brideAddress?.city
          ].filter(Boolean).join(', ');

          return (
            <div key={index} className="weddingWall-box">
              {/* Images */}
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

              {/* Church Info */}
              <h3>Saint Joseph Parish - Taguig</h3>

              {/* Main Details */}
              <div className="weddingWall-body">
                <p className="weddingWall-names">{wedding.groomName} & {wedding.brideName}</p>
                <p><strong>Wedding Date:</strong> {formattedWeddingDate}</p>
                <p><strong>Wedding Time:</strong> {formattedWeddingTime}</p>
                <p><strong>Confirmed Date:</strong> {formattedConfirmedAt}</p>

                <p><strong>Groom's Address:</strong><br />{groomFullAddress}</p>
                <p><strong>Bride's Address:</strong><br />{brideFullAddress}</p>

                <p><strong>Groom's Parents:</strong> {wedding.groomFather} & {wedding.groomMother}</p>
                <p><strong>Bride's Parents:</strong> {wedding.brideFather} & {wedding.brideMother}</p>
              </div>

              {/* Footer Notice */}
              <div className="weddingWall-footer">
                <p>
                  Kung may tutol man po sa mga ikakasal, maari lamang na makipag-ugnayan
                  sa parokya o sa ating opisina. Maraming Salamat po.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Sidebar */}
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
