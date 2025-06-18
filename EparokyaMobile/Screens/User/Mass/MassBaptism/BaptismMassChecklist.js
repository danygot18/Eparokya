import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import baseURL from "../../../../assets/common/baseUrl";

const BaptismMassChecklist = ({ massBaptismId }) => {
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (massBaptismId) {
      axios
        .get(`${baseURL}/massBaptism/getMassBaptismChecklist/${massBaptismId}`, { withCredentials: true })
        .then((res) => {
          if (res.data && res.data.checklist) {
            setChecklist(res.data.checklist);
          } else {
            setChecklist(null);
          }
        })
        .catch((err) => {
          setChecklist(null);
        })
        .finally(() => setLoading(false));
    }
  }, [massBaptismId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  // If no checklist data, show N/A for all fields
  const getStatus = (val) => val === true ? "Checked" : val === false ? "Unchecked" : "N/A";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Baptism Checklist</Text>

      {/* Baptism Checklist Fields */}
      <View style={styles.item}>
        <Text style={styles.label}>Photocopy of Birth Certificate</Text>
        <View
          style={[
            styles.statusBtn,
            checklist?.PhotocopyOfBirthCertificate ? styles.checked : styles.unchecked,
          ]}
        >
          <Text style={styles.statusText}>
            {getStatus(checklist?.PhotocopyOfBirthCertificate)}
          </Text>
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Photocopy of Marriage Certificate</Text>
        <View
          style={[
            styles.statusBtn,
            checklist?.PhotocopyOfMarriageCertificate ? styles.checked : styles.unchecked,
          ]}
        >
          <Text style={styles.statusText}>
            {getStatus(checklist?.PhotocopyOfMarriageCertificate)}
          </Text>
        </View>
      </View>

      {/* Additional Fields */}
      <Text style={styles.sectionTitle}>Additional Documents</Text>
      <View style={styles.item}>
        <Text style={styles.label}>Baptismal Permit</Text>
        <View
          style={[
            styles.statusBtn,
            checklist?.BaptismalPermit ? styles.checked : styles.unchecked,
          ]}
        >
          <Text style={styles.statusText}>
            {getStatus(checklist?.BaptismalPermit)}
          </Text>
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Certificate of No Record of Baptism</Text>
        <View
          style={[
            styles.statusBtn,
            checklist?.CertificateOfNoRecordBaptism ? styles.checked : styles.unchecked,
          ]}
        >
          <Text style={styles.statusText}>
            {getStatus(checklist?.CertificateOfNoRecordBaptism)}
          </Text>
        </View>
      </View>

      {/* Seminar Fields */}
      <Text style={styles.sectionTitle}>Seminars</Text>
      <View style={styles.item}>
        <Text style={styles.label}>Pre-Baptism Seminar 1</Text>
        <View
          style={[
            styles.statusBtn,
            checklist?.PreBaptismSeminar1 ? styles.checked : styles.unchecked,
          ]}
        >
          <Text style={styles.statusText}>
            {getStatus(checklist?.PreBaptismSeminar1)}
          </Text>
        </View>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Pre-Baptism Seminar 2</Text>
        <View
          style={[
            styles.statusBtn,
            checklist?.PreBaptismSeminar2 ? styles.checked : styles.unchecked,
          ]}
        >
          <Text style={styles.statusText}>
            {getStatus(checklist?.PreBaptismSeminar2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#154314",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
    color: "#154314",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
  },
  statusBtn: {
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  checked: {
    backgroundColor: "green",
  },
  unchecked: {
    backgroundColor: "gray",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BaptismMassChecklist;