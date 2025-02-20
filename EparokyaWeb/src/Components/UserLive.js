import { useEffect, useState } from "react";
import axios from "axios";

const UserLive = () => {
    const [liveData, setLiveData] = useState(null);

    useEffect(() => {
        const fetchLiveVideo = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/live`);
                setLiveData(response.data);
            } catch (error) {
                console.error("Error fetching live video", error);
            }
        };
        fetchLiveVideo();
    }, []);

    return (
        <div>
            <h2>Live Video</h2>
            {liveData ? (
                <>
                    <h3>{liveData.description}</h3>
                    <iframe
                        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(liveData.url)}&show_text=false`}
                        width="600"
                        height="400"
                        allowFullScreen
                    ></iframe>
                </>
            ) : (
                <p>No live video available</p>
            )}
        </div>
    );
};

export default UserLive;
