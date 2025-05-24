import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const Dashboard3 = () => {
  const [ministryCategoryData, setMinistryCategoryData] = useState([]);
  const [sentimentData, setSentimentData] = useState({ positive: [], negative: [] });
  const [loading, setLoading] = useState(true);

  const config = {
    withCredentials: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sentimentRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/sentimentPerMonth`, config);
        setSentimentData({ positive: sentimentRes.data.positive, negative: sentimentRes.data.negative });

        const ministryCategoryRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/getUsersGroupedByMinistryCategory`, config);
        setMinistryCategoryData(ministryCategoryRes.data.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, []);

  const generateMinistryCategoryChartData = (data) => ({
    labels: data.map(item => item.ministryCategory),
    datasets: [
      {
        label: "Users",
        data: data.map(item => item.userCount),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  });

  const generateSentimentChartData = () => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Positive Sentiment",
        data: sentimentData.positive,
        borderColor: "green",
        fill: false,
      },
      {
        label: "Negative Sentiment",
        data: sentimentData.negative,
        borderColor: "red",
        fill: false,
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
        <h5>Users Grouped by Ministry Category</h5>
        <Bar data={generateMinistryCategoryChartData(ministryCategoryData)} options={options} />
      </div>

      <div style={chartCardStyle}>
        <h5>Sentiment Analysis Trends</h5>
        <Line data={generateSentimentChartData()} options={options} />
      </div>
    </div>
  );
};

export default Dashboard3;