import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard1 = () => {
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [weddingData, setWeddingData] = useState([]);
  const [baptismData, setBaptismData] = useState([]);
  const [funeralData, setFuneralData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCountRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/registeredUsersCount`, config);
        setRegisteredUsersCount(usersCountRes.data.count);

        const weddingRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/weddingsPerMonth`, config);
        setWeddingData(weddingRes.data);

        const baptismRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/baptsimsPerMonth`, config);
        setBaptismData(baptismRes.data);

        const funeralRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/funeralsPerMonth`, config);
        setFuneralData(funeralRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const generateChartData = (label, data, color) => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label,
        data,
        backgroundColor: color,
      },
    ],
  });

  const options = {
    scales: {
      x: {
        type: "category",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

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

  return (
    <div style={chartContainerStyle}>
      <div style={chartCardStyle}>
        <h5>Total Registered Users</h5>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{loading ? "Loading..." : registeredUsersCount}</p>
      </div>

      <div style={chartCardStyle}>
        <h5>Confirmed Weddings Per Month</h5>
        <Bar data={generateChartData("Weddings", weddingData, "rgba(75, 192, 192, 0.6)")} options={options} />
      </div>

      <div style={chartCardStyle}>
        <h5>Confirmed Baptisms Per Month</h5>
        <Bar data={generateChartData("Baptisms", baptismData, "rgba(153, 102, 255, 0.6)")} options={options} />
      </div>

      <div style={chartCardStyle}>
        <h5>Confirmed Funerals Per Month</h5>
        <Bar data={generateChartData("Funerals", funeralData, "rgba(255, 99, 132, 0.6)")} options={options} />
      </div>
    </div>
  );
};

export default Dashboard1;