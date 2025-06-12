import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import baseURL from "../../../assets/common/baseUrl";


const groomItems = [
  "GroomNewBaptismalCertificate",
  "GroomNewConfirmationCertificate",
  "GroomMarriageLicense",
  "GroomMarriageBans",
  "GroomOrigCeNoMar",
  "GroomOrigPSA",
  "GroomOnebyOne",
  "GroomTwobyTwo",
];

const brideItems = [
  "BrideNewBaptismalCertificate",
  "BrideNewConfirmationCertificate",
  "BrideMarriageLicense",
  "BrideMarriageBans",
  "BrideOrigCeNoMar",
  "BrideOrigPSA",
  "BrideOnebyOne",
  "BrideTwobyTwo",
];

const otherDocs = [
  "PermitFromtheParishOftheBride",
  "ChildBirthCertificate",
];

const seminars = [
  "PreMarriageSeminar1",
  "PreMarriageSeminar2",
  "PreMarriageSeminar3",
  "CanonicalInterview",
  "Confession",
];

const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/(\d+)/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const UserWeddingChecklist = ({ weddingId }) => {
  const [checklist, setChecklist] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (weddingId) {
      axios
        .get(`${baseURL}/getWeddingChecklist/${weddingId}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.checklist) {
            setChecklist(res.data.checklist);
            
          }
          console.log("Wedding Checklist:", res.data);
        })
        .catch((err) => {
          // handle error
        })
        .finally(() => setLoading(false));
    }
  }, [weddingId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#154314" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Wedding Checklist</Text>

      {/* Groom Checklist */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Groom Documents</Text>
        {groomItems.map((item) => (
          <View key={item} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{formatLabel(item)}</Text>
            {checklist[item] ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <Ionicons name="close-circle" size={24} color="#aaa" />
            )}
          </View>
        ))}
      </View>

      {/* Bride Checklist */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bride Documents</Text>
        {brideItems.map((item) => (
          <View key={item} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{formatLabel(item)}</Text>
            {checklist[item] ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <Ionicons name="close-circle" size={24} color="#aaa" />
            )}
          </View>
        ))}
      </View>

      {/* Other Documents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Documents</Text>
        {otherDocs.map((item) => (
          <View key={item} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{formatLabel(item)}</Text>
            {checklist[item] ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <Ionicons name="close-circle" size={24} color="#aaa" />
            )}
          </View>
        ))}
      </View>

      {/* Seminars */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seminars</Text>
        {seminars.map((item) => (
          <View key={item} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{formatLabel(item)}</Text>
            {checklist[item] ? (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            ) : (
              <Ionicons name="close-circle" size={24} color="#aaa" />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    color: "#154314",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#154314",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    justifyContent: "space-between",
  },
  itemLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
});

export default UserWeddingChecklist;