import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import PropTypes from 'prop-types';
import Dashboard1 from "./DashboardsAnalythics/Dashboard1";
import Dashboard2 from "./DashboardsAnalythics/Dashboard2";
import Dashboard3 from "./DashboardsAnalythics/Dashboard3";
import SideBar from "./SideBar";
import MetaData from "../Layout/MetaData";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <SideBar />
      <MetaData title="Admin Live" />


      <Box sx={{ flexGrow: 1, p: 3 }}>
        <h1>Statistics Dashboard</h1>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Basic Stats" {...a11yProps(0)} />
            <Tab label="Status Distribution" {...a11yProps(1)} />
            <Tab label="Advanced Analytics" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          <Dashboard1 />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Dashboard2 />
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <Dashboard3 />
        </CustomTabPanel>

      </Box>
    </Box>
  );
};

export default Dashboard;