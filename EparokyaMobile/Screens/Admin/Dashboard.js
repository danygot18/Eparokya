import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";

const Dashboard = () => {
  const [weddingData, setWeddingData] = useState([]);
  const [confirmedWeddingData, setConfirmedWeddingData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  useEffect(() => {
    fetchWeddingForms();
    fetchConfirmedWeddings();
    fetchMemberCountByBatch();
  }, []);

  const processWeddingData = (data) => {
    return data.map((item) => (isNaN(item) ? 0 : item));
  };

  const fetchWeddingForms = async () => {
    try {
      const response = await axios.get(`${baseURL}/wedding/`);
      const monthlyData = new Array(12).fill(0);
      response.data.forEach((wedding) => {
        const month = new Date(wedding.weddingDate).getMonth();
        if (!isNaN(month)) monthlyData[month]++;
      });
      setWeddingData(processWeddingData(monthlyData));
    } catch (error) {
      console.error("Error fetching wedding forms:", error.message);
    }
  };

  const fetchConfirmedWeddings = async () => {
    try {
      const response = await axios.get(`${baseURL}/wedding/confirmed`);
      const monthlyData = new Array(12).fill(0);
      response.data.forEach((wedding) => {
        const month = new Date(wedding.weddingDate).getMonth();
        if (!isNaN(month)) monthlyData[month]++;
      });
      setConfirmedWeddingData(processWeddingData(monthlyData));
    } catch (error) {
      console.error("Error fetching confirmed weddings:", error.message);
    }
  };

  const fetchMemberCountByBatch = async () => {
    try {
      const response = await axios.get(`${baseURL}/member/count-by-batch`);
      setBatchData(response.data);
    } catch (error) {
      console.error("Error fetching member count by batch:", error.message);
    }
  };

  const barChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        data: weddingData,
        color: () => "#FEFAE0",
        strokeWidth: 2,
      },
    ],
  };

  const confirmedWeddingBarChartData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        data: confirmedWeddingData,
        color: () => "#B99470",
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Cards")}
          style={styles.navigationButton}
        >
          <Text style={styles.navigationButtonText}>Navigations</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.chartTitle}>Wedding Forms Submitted Per Month</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={barChartData}
          width={screenWidth * 1.5}
          height={250}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
        />
      </ScrollView>

      <Text style={styles.chartTitle}>Confirmed Weddings Per Month</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={confirmedWeddingBarChartData}
          width={screenWidth * 1.5}
          height={250}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
        />
      </ScrollView>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#E5E5E5",
  backgroundGradientTo: "#F5F5F5",
  color: () => "#1AFF92",
  barPercentage: 0.5,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  navigationButton: {
    width: 380,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#1C5739",
    marginVertical: 10,
    alignSelf: "center",
    elevation: 3,
  },
  navigationButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Dashboard;
