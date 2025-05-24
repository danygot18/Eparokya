import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResourceDetails = () => {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    if (!resourceId) return; 
    const fetchResource = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getResourceById/${resourceId}`
        );
        setResource(res.data.data); 
      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [resourceId]);


  if (loading) return <div>Loading resource...</div>;
  if (!resource) return <div>Resource not found.</div>;

  const {
    title,
    description,
    link,
    file,
    image,
    images,
    videos,
    resourceCategory,
    createdAt,
    updatedAt,
  } = resource;

  return (
    <div
      className="resource-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="resource-modal-content"
        style={{
          background: "#fff",
          borderRadius: "12px",
          maxWidth: "500px",
          width: "100%",
          padding: "32px 24px 24px 24px",
          position: "relative",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Title */}
        <h2>{title}</h2>
        <p>{description}</p>

        {link && (
          <div>
            <strong>Link: </strong>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </div>
        )}

        {file?.url && (
          <div>
            <strong>File: </strong>
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              Download File
            </a>
          </div>
        )}

        {image?.url && (
          <img
            src={image.url}
            alt="Resource"
            style={{ maxWidth: "100%", borderRadius: 8, marginBottom: 10 }}
          />
        )}

        {images?.length > 0 &&
          images.some((img) => img.url) && (
            <div>
              <strong>Images:</strong>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {images.map(
                  (img, idx) =>
                    img.url && (
                      <img
                        key={img.public_id || idx}
                        src={img.url}
                        alt={`Resource ${idx + 1}`}
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
                      />
                    )
                )}
              </div>
            </div>
          )}

        {videos?.length > 0 &&
          videos.some((v) => v.url) && (
            <div>
              <strong>Videos:</strong>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {videos.map(
                  (video, idx) =>
                    video.url && (
                      <video
                        key={video.public_id || idx}
                        controls
                        style={{ width: "100%", borderRadius: 6 }}
                      >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )
                )}
              </div>
            </div>
          )}

        {resourceCategory && (
          <div>
            <strong>Category: </strong>
            {resourceCategory.name || resourceCategory}
          </div>
        )}

        <div style={{ fontSize: "12px", color: "#888" }}>
          <div>Created: {createdAt && new Date(createdAt).toLocaleString()}</div>
          <div>Updated: {updatedAt && new Date(updatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;
