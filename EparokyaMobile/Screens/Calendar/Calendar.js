import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as Calendar from "expo-calendar";
import { Calendar as RNCalendar } from "react-native-calendars";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from "../../assets/common/baseUrl";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("tl-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CalendarComponent = () => {
  const [confirmedWeddings, setConfirmedWeddings] = useState([]);
  const [confirmedFunerals, setConfirmedFunerals] = useState([]);
  const [confirmedBaptisms, setConfirmedBaptisms] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        await createCalendar();
        await fetchAllEventsAndMarkDates();
      } else {
        Alert.alert(
          "Permission Denied",
          "Calendar access is required to create events."
        );
      }
    })();
  }, []);

  const createCalendar = async () => {
    const calendars = await Calendar.getCalendarsAsync();
    const existingCalendar = calendars.find(
      (cal) => cal.title === "Wedding Calendar"
    );
    if (existingCalendar) return existingCalendar.id;

    const defaultCalendar = calendars[0];
    const newCalendarId = await Calendar.createCalendarAsync({
      title: "Wedding Calendar",
      color: "#FF0000",
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendar.source.id,
      source: defaultCalendar.source,
      name: "Wedding Calendar",
      ownerAccount: defaultCalendar.source.name,
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    return newCalendarId;
  };

  const fetchAllEventsAndMarkDates = async () => {
    try {
      const [weddingsRes, funeralsRes, baptismsRes] = await Promise.all([
        axios.get(`${baseURL}/confirmedWedding`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/confirmedFuneral`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/confirmedBaptism`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const weddings = weddingsRes.data;
      const funerals = funeralsRes.data;
      const baptisms = baptismsRes.data;

      setConfirmedWeddings(weddings);
      setConfirmedFunerals(funerals);
      setConfirmedBaptisms(baptisms);

      const newMarkedDates = {};

      for (const wedding of weddings) {
        const date = wedding.weddingDate?.split("T")[0];
        if (date) {
          if (!newMarkedDates[date]) newMarkedDates[date] = { dots: [] };
          newMarkedDates[date].dots.push({ color: "red" });
        }
      }

      for (const funeral of funerals) {
        const date = funeral.funeralDate?.split("T")[0];
        if (date) {
          if (!newMarkedDates[date]) newMarkedDates[date] = { dots: [] };
          newMarkedDates[date].dots.push({ color: "blue" });
        }
      }

      for (const baptism of baptisms) {
        const date = baptism.baptismDate?.split("T")[0];
        if (date) {
          if (!newMarkedDates[date]) newMarkedDates[date] = { dots: [] };
          newMarkedDates[date].dots.push({ color: "green" });
        }
      }

      setMarkedDates(newMarkedDates);
    } catch (err) {
      console.error("Error fetching calendar events:", err);
    }
  };

  const handleFilter = (type) => {
    setFilterType(type);

    if (type === "wedding") {
      setFilteredEvents(confirmedWeddings);
    } else if (type === "funeral") {
      setFilteredEvents(confirmedFunerals);
    } else if (type === "baptism") {
      setFilteredEvents(confirmedBaptisms);
    } else {
      setFilteredEvents([
        ...confirmedWeddings,
        ...confirmedFunerals,
        ...confirmedBaptisms,
      ]);
    }
  };

  const handleDayPress = (day) => {
    const selectedDay = day.dateString;
    setSelectedDate(selectedDay);

    const eventsOnDate = [
      ...confirmedWeddings.filter(
        (wedding) =>
          new Date(wedding.weddingDate).toISOString().split("T")[0] ===
          selectedDay
      ),
      ...confirmedFunerals.filter(
        (funeral) =>
          new Date(funeral.funeralDate).toISOString().split("T")[0] ===
          selectedDay
      ),
      ...confirmedBaptisms.filter(
        (baptism) =>
          new Date(baptism.baptismDate).toISOString().split("T")[0] ===
          selectedDay
      ),
    ];
    setFilteredEvents(eventsOnDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar of Events</Text>
      <RNCalendar
        markedDates={markedDates}
        markingType="multi-dot"
        onDayPress={handleDayPress}
      />
      <View style={styles.filterContainer}>
        {["all", "wedding", "funeral", "baptism"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filterType === type && styles.activeFilter,
            ]}
            onPress={() => handleFilter(type)}
          >
            <Text style={styles.filterText}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.brideName
                ? "Wedding"
                : item.baptismDate
                ? "Baptism"
                : "Funeral"}
            </Text>
            {item.brideName ? (
              <>
                <Text>
                  Bride & Groom: {item.brideName} & {item.groomName}
                </Text>
                <Text>Date: {formatDate(item.weddingDate)}</Text>
                <Text>Status: {item.weddingStatus || "Pending"}</Text>
              </>
            ) : item.baptismDate ? (
              <>
                <Text>
                  Child Name: {item.childName || item.child?.fullName || "N/A"}
                </Text>
                <Text>
                  Father:{" "}
                  {item.fatherName || item.parents?.fatherFullName || "N/A"}
                </Text>
                <Text>
                  Mother:{" "}
                  {item.motherName || item.parents?.motherFullName || "N/A"}
                </Text>
                <Text>
                  Baptism Date: {formatDate(item.baptismDate) || "N/A"}
                </Text>
                <Text>
                  Status:{" "}
                  {item.baptismStatus || item.binyagStatus || "Pending"}
                </Text>
              </>
            ) : (
              <>
                <Text>Name: {item.name}</Text>
                <Text>Age: {item.age || "N/A"}</Text>
                <Text>Contact Person: {item.contactPerson || "N/A"}</Text>
                <Text>Status: {item.funeralStatus || "Pending"}</Text>
                <Text>
                  Funeral Date: {formatDate(item.funeralDate) || "N/A"}
                </Text>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F0EF",
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
    justifyContent: "center",
    marginVertical: 10,
    flexWrap: "wrap",
  },
  filterButton: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  activeFilter: {
    backgroundColor: "#bdbdbd",
  },
  filterText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default CalendarComponent;
