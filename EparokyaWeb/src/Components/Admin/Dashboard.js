import React, { useEffect, useState } from "react";
import axios from "axios";
import MetaData from "../Layout/MetaData";
import SideBar from "./SideBar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PieController,
  ArcElement,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PieController, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [weddingData, setWeddingData] = useState([]);
  const [baptismData, setBaptismData] = useState([]);
  const [funeralData, setFuneralData] = useState([]);
  const [weddingStatus, setWeddingStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [baptismStatus, setBaptismStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [funeralStatus, setFuneralStatus] = useState({ pending: 0, confirmed: 0, cancelled: 0 });
  const [ministryCategoryData, setMinistryCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    withCredentials: true,

  };


  const convertToStatusObject = (data) => {
    const statusObj = { pending: 0, confirmed: 0, cancelled: 0 };
    data.forEach((item) => {
      if (item._id) {
        statusObj[item._id.toLowerCase()] = item.count;
      }
    });
    return statusObj;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCountRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/registeredUsersCount`, config);
        setRegisteredUsersCount(usersCountRes.data.count);

        // Confirmed per month
        const weddingRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/weddingsPerMonth`, config);
        setWeddingData(weddingRes.data);

        const baptismRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/baptsimsPerMonth`, config);
        setBaptismData(baptismRes.data);

        const funeralRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/funeralsPerMonth`, config);
        setFuneralData(funeralRes.data);

        // Status counts
        const weddingStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/weddingStatusCount`, config);
        const baptismStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/baptismStatusCount`, config);
        const funeralStatusRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/stats/funeralStatusCount`, config);

        setWeddingStatus(convertToStatusObject(weddingStatusRes.data));
        setBaptismStatus(convertToStatusObject(baptismStatusRes.data));
        setFuneralStatus(convertToStatusObject(funeralStatusRes.data));

        // Ministry category data
        const ministryCategoryRes = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/getUsersGroupedByMinistryCategory`, config);
        setMinistryCategoryData(ministryCategoryRes.data.data);


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

  const pieChartContainerStyle = {
    maxWidth: "100%",
    height: "200px",
    margin: "0 auto",
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <div style={{ flex: 1, padding: "20px" }}>
        <MetaData title={"Dashboard"} />
        <h1>Statistics Dashboard</h1>

        {loading ? (
          <p>Loading charts...</p>
        ) : (
          <div style={chartContainerStyle}>
            <div style={chartCardStyle}>
              <h5>Total Registered Users</h5>
              <p style={{ fontSize: "24px", fontWeight: "bold" }}>{loading ? "Loading..." : registeredUsersCount}</p>
            </div>

            {/* Bar */}
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

            {/* Ministry Category Bar */}
            <div style={chartCardStyle}>
              <h5>Users Grouped by Ministry Category</h5>
              <Bar data={generateMinistryCategoryChartData(ministryCategoryData)} options={options} />
            </div>

            {/* Pie */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
