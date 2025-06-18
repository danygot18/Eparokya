import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard2 = () => {
  const [weddingStatus, setWeddingStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [baptismStatus, setBaptismStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [funeralStatus, setFuneralStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [counselingStatus, setCounselingStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [houseBlessingStatus, sethouseBlessingStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });


  const [loading, setLoading] = useState(true);

  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weddingStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/weddingStatusCount`, config);
        const baptismStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/baptismStatusCount`, config);
        const funeralStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/funeralStatusCount`, config);
        const counselingStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/counselingStatusCount`, config);
        const houseBlessingStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/houseBlessing/stats/blessingStatusCount`, config);


        setWeddingStatus(convertToStatusObject(weddingStatusRes.data));
        setBaptismStatus(convertToStatusObject(baptismStatusRes.data));
        setFuneralStatus(convertToStatusObject(funeralStatusRes.data));
        setCounselingStatus(convertToStatusObject(counselingStatusRes.data));
        sethouseBlessingStatus(convertToStatusObject(houseBlessingStatusRes.data));


        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const convertToStatusObject = (data) => {
    const statusObj = { pending: 0, confirmed: 0, cancelled: 0 };
    data.forEach((item) => {
      if (item._id) {
        statusObj[item._id.toLowerCase()] = item.count;
      }
    });
    return statusObj;
  };

  const generatePieData = (data) => ({
    labels: ["Pending", "Confirmed", "Cancelled"],
    datasets: [
      {
        data: [data.pending, data.confirmed, data.cancelled],
        backgroundColor: ["#FFCE56", "#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#FFCE56", "#36A2EB", "#FF6384"],
      },
    ],
  });

  const chartCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    margin: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    textAlign: "center",
    flex: "1 1 calc(50% - 20px)",
    maxWidth: "calc(50% - 20px)",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const chartContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  };

  const pieChartContainerStyle = {
    maxWidth: "100%",
    height: "200px",
    margin: "0 auto",
  };

  return (
    <div style={chartContainerStyle}>
      <div style={chartCardStyle}>
        <div style={pieChartContainerStyle}>
          <h5>Wedding Status Distribution</h5>
          <Pie data={generatePieData(weddingStatus)} />
        </div>
      </div>

      <div style={chartCardStyle}>
        <div style={pieChartContainerStyle}>
          <h5>Baptism Status Distribution</h5>
          <Pie data={generatePieData(baptismStatus)} />
        </div>
      </div>

      <div style={chartCardStyle}>
        <div style={pieChartContainerStyle}>
          <h5>Funeral Status Distribution</h5>
          <Pie data={generatePieData(funeralStatus)} />
        </div>
      </div>
      <div style={chartCardStyle}>
        <div style={pieChartContainerStyle}>
          <h5>Counseling Status Distribution</h5>
          <Pie data={generatePieData(counselingStatus)} />
        </div>
      </div>
      <div style={chartCardStyle}>
        <div style={pieChartContainerStyle}>
          <h5>Blessing Status Distribution</h5>
          <Pie data={generatePieData(houseBlessingStatus)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;