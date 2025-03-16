import React from "react";

const AwitAtPapuriEmbed = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Awit at Papuri - Tagalog Mass Readings</h2>
      <div style={{ 
        width: "100%", 
        height: "500px",  // Adjust height to crop
        overflow: "hidden", 
        position: "relative"
      }}>
        <iframe 
          src="https://www.awitatpapuri.com/" 
          width="100%" 
          height="800px" // Larger height to push unwanted content out of view
          style={{ 
            border: "none", 
            position: "relative", 
            top: "-100px" // Adjust this to shift content upwards
          }}
          title="Awit at Papuri"
        ></iframe>
      </div>
    </div>
  );
};

export default AwitAtPapuriEmbed;
