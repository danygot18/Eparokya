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
import SyncStorage from "sync-storage";
import baseURL from "../../assets/common/baseUrl";
import { useSelector } from "react-redux";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const CalendarComponent = () => {
  const [confirmedWeddings, setConfirmedWeddings] = useState([]);
  const [confirmedFunerals, setConfirmedFunerals] = useState([]);
  const [confirmedBaptisms, setConfirmedBaptisms] = useState([]); // 1. Add state
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState("all");

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendarId = await createCalendar();
        fetchConfirmedWeddingDates(calendarId);
        fetchConfirmedFuneralDates(calendarId);
        fetchConfirmedBaptismDates(calendarId); // 3. Call fetch
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

  const fetchConfirmedWeddingDates = async (calendarId) => {
    try {
      const response = await axios.get(`${baseURL}/confirmedWedding`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log("Confirmed Weddings:", response.data);

      const weddings = response.data;
      setConfirmedWeddings(weddings);

      const dates = { ...markedDates };
      for (const wedding of weddings) {
        const date = wedding.weddingDate
          ? new Date(wedding.weddingDate).toISOString().split("T")[0]
          : null;
        if (date) {
          if (!dates[date]) {
            dates[date] = { dots: [{ color: "red" }] };
          } else {
            dates[date].dots = [...(dates[date].dots || []), { color: "red" }];
          }
        }
      }
      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching confirmed weddings:", error);
    }
  };

  const fetchConfirmedFuneralDates = async (calendarId) => {
    try {
      const response = await axios.get(`${baseURL}/confirmedFuneral`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Confirmed Funerals:", response.data);

      const funerals = response.data;
      setConfirmedFunerals(funerals);

      const dates = { ...markedDates };
      for (const funeral of funerals) {
        const date = funeral.funeralDate
          ? new Date(funeral.funeralDate).toISOString().split("T")[0]
          : null;

        if (date) {
          if (!dates[date]) {
            dates[date] = { dots: [{ color: "blue" }] };
          } else {
            dates[date].dots = [...(dates[date].dots || []), { color: "blue" }];
          }
        }
      }
      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching confirmed funerals:", error);
    }
  };

  // 2. Fetch confirmed baptisms
  const fetchConfirmedBaptismDates = async (calendarId) => {
    try {
      const response = await axios.get(`${baseURL}/confirmedBaptism`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const baptisms = response.data;
      setConfirmedBaptisms(baptisms);

      const dates = { ...markedDates };
      for (const baptism of baptisms) {
        const date = baptism.baptismDate
          ? new Date(baptism.baptismDate).toISOString().split("T")[0]
          : null;
        if (date) {
          if (!dates[date]) {
            dates[date] = { dots: [{ color: "green" }] };
          } else {
            dates[date].dots = [
              ...(dates[date].dots || []),
              { color: "green" },
            ];
          }
        }
      }
      setMarkedDates(dates);
    } catch (error) {
      console.error("Error fetching confirmed baptisms:", error);
    }
  };

  // 4. Update filter to include baptisms
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

  // 4. Update day press to include baptisms
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
            filterType === "wedding" && styles.activeFilter,
          ]}
          onPress={() => handleFilter("wedding")}
        >
          <Text style={styles.filterText}>Weddings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === "funeral" && styles.activeFilter,
          ]}
          onPress={() => handleFilter("funeral")}
        >
          <Text style={styles.filterText}>Funerals</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === "baptism" && styles.activeFilter,
          ]}
          onPress={() => handleFilter("baptism")}
        >
          <Text style={styles.filterText}>Baptisms</Text>
        </TouchableOpacity>
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
                <Text>Date: {formatDate(item.weddingDate) || "N/a"}</Text>
                {/* <Text>Religion - Groom: {item.groomReligion || "N/A"}</Text>
                <Text>Religion - Bride: {item.brideReligion || "N/A"}</Text> */}
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
                  Funeral Date:{" "}
                  {item?.funeralDate ? formatDate(item.funeralDate) : "N/A"}
                </Text>

                <Text>
                  Status: {item.baptismStatus || item.binyagStatus || "Pending"}
                </Text>
              </>
            ) : (
              <>
                <Text>Name: {item.name}</Text>
                <Text>Age: {item.age || "N/A"}</Text>
                <Text>Contact Person: {item.contactPerson || "N/A"}</Text>
                <Text>Status: {item.funeralStatus || "Pending"}</Text>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const calendarTheme = {
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#b6c1cd",
  selectedDayBackgroundColor: "#ff6347",
  todayTextColor: "#ff6347",
  dayTextColor: "#2d4150",
  dotColor: "#ff6347",
  selectedDotColor: "#ffffff",
  arrowColor: "orange",
  monthTextColor: "black",
  indicatorColor: "blue",
  textDayFontWeight: "300",
  textMonthFontWeight: "bold",
  textDayHeaderFontWeight: "500",
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
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
  dateText: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
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
  },
  filterButton: {
    marginHorizontal: 5,
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
  filterText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default CalendarComponent;
