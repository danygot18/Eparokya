import React from "react";

const AwitAtPapuriEmbed = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Awit at Papuri - Tagalog Mass Readings</h2>
      <div
        style={{
          width: "100%",
          height: "550px", // visible container
          overflow: "hidden",
          position: "relative",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <iframe
          src="https://www.awitatpapuri.com/"
          width="100%"
          height="1000px" // Large enough to push footer out of view
          style={{
            border: "none",
            position: "relative",
            top: "-120px", // Shift content up more to hide footer
          }}
          title="Awit at Papuri"
        ></iframe>
      </div>
    </div>
  );
};

export default AwitAtPapuriEmbed;
