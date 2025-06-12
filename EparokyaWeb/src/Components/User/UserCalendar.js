import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import moment from "moment";
import { useSelector } from "react-redux";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterType, setFilterType] = useState("all");

  // If you use Redux for auth, otherwise get token from context or props
  const { token } = useSelector((state) => state.auth) || {};

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [weddingRes, baptismRes, funeralRes, customRes] = await Promise.all([
        axios.get(`${baseURL}/confirmedWedding`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/confirmedBaptism`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/confirmedFuneral`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/getAllCustomEvents`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const weddings = weddingRes.data || [];
      const baptisms = baptismRes.data || [];
      const funerals = funeralRes.data || [];
      const customs = customRes.data || [];

      // Format events for calendar
      const formattedEvents = [
        ...weddings.map((event) => ({
          id: `wedding-${event._id}`,
          title: `${event.brideName} & ${event.groomName} Wedding`,
          date: moment(event.weddingDate).format("YYYY-MM-DD"),
          type: "Wedding",
          ...event,
        })),
        ...baptisms.map((event) => ({
          id: `baptism-${event._id}`,
          title: `Baptism of ${event.child?.fullName || "Unknown"}`,
          date: moment(event.baptismDate).format("YYYY-MM-DD"),
          type: "Baptism",
          ...event,
        })),
        ...funerals.map((event) => ({
          id: `funeral-${event._id}`,
          title: `Funeral for ${event.name ? (event.name.firstName || "") + " " + (event.name.lastName || "") : ""}`,
          date: moment(event.funeralDate).format("YYYY-MM-DD"),
          type: "Funeral",
          ...event,
        })),
        ...customs.map((event) => ({
          id: `custom-${event._id}`,
          title: event.title,
          date: moment(event.customeventDate).format("YYYY-MM-DD"),
          type: "Custom",
          ...event,
        })),
      ];

      // Mark dates for calendar
      const dates = {};
      formattedEvents.forEach((event) => {
        if (!dates[event.date]) dates[event.date] = { dots: [] };
        let color =
          event.type === "Wedding"
            ? "#FFD700"
            : event.type === "Baptism"
            ? "#4CAF50"
            : event.type === "Funeral"
            ? "#F44336"
            : "#9C27B0";
        dates[event.date].dots.push({ color });
      });

      setMarkedDates(dates);
      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch calendar events.");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleDayPress = (day) => {
    const selectedDay = day.dateString;
    setSelectedDate(selectedDay);

    const eventsOnDate = events.filter((event) => event.date === selectedDay);
    setFilteredEvents(eventsOnDate);
  };

  const handleFilter = (type) => {
    setFilterType(type);
    if (type === "Wedding" || type === "Baptism" || type === "Funeral" || type === "Custom") {
      setFilteredEvents(events.filter((e) => e.type === type));
    } else {
      setFilteredEvents(events);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Church Events Calendar</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#154314" style={{ marginTop: 40 }} />
      ) : (
        <>
          <RNCalendar
            markedDates={markedDates}
            markingType="multi-dot"
            onDayPress={handleDayPress}
          />
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "all" && styles.activeFilter,
              ]}
              onPress={() => handleFilter("all")}
            >
              <Text style={styles.filterText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "Wedding" && styles.activeFilter,
              ]}
              onPress={() => handleFilter("Wedding")}
            >
              <Text style={styles.filterText}>Weddings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "Baptism" && styles.activeFilter,
              ]}
              onPress={() => handleFilter("Baptism")}
            >
              <Text style={styles.filterText}>Baptisms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "Funeral" && styles.activeFilter,
              ]}
              onPress={() => handleFilter("Funeral")}
            >
              <Text style={styles.filterText}>Funerals</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filterType === "Custom" && styles.activeFilter,
              ]}
              onPress={() => handleFilter("Custom")}
            >
              <Text style={styles.filterText}>Custom</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
                No events found.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={{ color: "#555" }}>
                  {moment(item.date).format("MMMM Do YYYY")}
                </Text>
                <Text style={{ color: "#888" }}>
                  Type: {item.type}
                </Text>
                {item.type === "Wedding" && (
                  <>
                    <Text>Bride: {item.brideName}</Text>
                    <Text>Groom: {item.groomName}</Text>
                  </>
                )}
                {item.type === "Baptism" && (
                  <Text>Child: {item.child?.fullName || "N/A"}</Text>
                )}
                {item.type === "Funeral" && (
                  <Text>
                    Name: {item.name ? `${item.name.firstName || ""} ${item.name.lastName || ""}` : "N/A"}
                  </Text>
                )}
                {item.type === "Custom" && (
                  <Text>Title: {item.title}</Text>
                )}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b3cf99",
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  filterButton: {
    marginHorizontal: 5,
    marginVertical: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  activeFilter: {
    backgroundColor: "#ff6347",
  },
  filterText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CalendarComponent;