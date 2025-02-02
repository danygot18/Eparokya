import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Select, CheckIcon } from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SyncStorage from 'sync-storage';
import { useSelector } from "react-redux";

const BaptismDetails = ({ route, navigation }) => {
  const { baptismId } = route.params;
  const [baptismDetails, setBaptismDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priest, setPriest] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const [additionalComment, setAdditionalComment] = useState("");
  const [comments, setComments] = useState([]);

  const { user, token } = useSelector(state => state.auth);
  const predefinedComments = [
    "Confirmed and on schedule",
    "Rescheduled - awaiting response",
    "Pending final confirmation",
    "Cancelled by user",
  ];

  useEffect(() => {
    const fetchBaptismDetails = async () => {
      
      try {
        const response = await axios.get(`${baseURL}/binyag/${baptismId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBaptismDetails(response.data);
        setSelectedDate(new Date(response.data.baptismDate));

        const parsedComments = Array.isArray(response.data.comments)
          ? response.data.comments.map((comment) => ({
              ...comment,
              scheduledDate: comment.scheduledDate
                ? new Date(comment.scheduledDate)
                : null,
            }))
          : [];

        setComments(parsedComments);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch baptism details");
        Alert.alert("Error", "Could not retrieve baptism details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBaptismDetails();
  }, [baptismId]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };
  console.log("Baptism ID:", baptismId);

  const handleSubmitComment = async () => {
    
    const newComment = {
      priest,
      scheduledDate: selectedDate,
      selectedComment,
      additionalComment,
    };

    try {
      const response = await axios.post(
        `${baseURL}/binyag/${baptismId}/admin/addComment`,
        newComment,
        {
          headers: { Authorization: `${token}` },
        }
      );
      const commentToDisplay = {
        ...response.data,
        scheduledDate: response.data.scheduledDate
          ? new Date(response.data.scheduledDate)
          : null,
      };

      setComments([...comments, commentToDisplay]);
      setPriest("");
      setSelectedDate(null);
      setSelectedComment("");
      setAdditionalComment("");
      Alert.alert("Success", "Comment submitted.");
    } catch (error) {
      console.error(
        "Error submitting comment:",
        error.response ? error.response.data : error.message
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit the comment."
      );
    }
  };

  const handleConfirm = async () => {
    
    if (!token) {
      Alert.alert("Error", "User token is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/binyag/${baptismId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => navigation.navigate("BaptismList") },
      ]);
    } catch (error) {
      console.error(
        "Error confirming baptism:",
        error.response || error.message
      );

      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data?.message || "Failed to confirm the baptism."
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };

  const handleDecline = async () => {
    
    try {
      await axios.post(`${baseURL}/binyag/decline/${baptismId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Success", "Baptism declined.", [
        { text: "OK", onPress: () => navigation.navigate("BaptismList") },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to decline the baptism.");
    }
  };


  if (loading) return <ActivityIndicator size="large" color="#1C5739" />;

  if (error)
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Child Information */}
        <Text style={styles.label}>
          User: {baptismDetails.userId.name || "N/A"}
        </Text>
        <Text style={styles.label}>
          Child Name: {baptismDetails.child.fullName || "N/A"}
        </Text>
        <Text style={styles.label}>
          Birthdate:{" "}
          {new Date(baptismDetails.child.dateOfBirth).toLocaleDateString() ||
            "N/A"}
        </Text>
        <Text style={styles.label}>
          Gender: {baptismDetails.child.gender || "N/A"}
        </Text>

        {/* Parents Information */}
        <Text style={styles.label}>
          Father: {baptismDetails.parents.fatherFullName || "N/A"}
        </Text>
        <Text style={styles.label}>
          Mother: {baptismDetails.parents.motherFullName || "N/A"}
        </Text>

        {/* Godparents Information */}
        <Text style={styles.label}>
          Godparents:{" "}
          {baptismDetails.godparents?.map((gp) => gp.name).join(", ") || "N/A"}
        </Text>

        {/* Baptism Information */}
        <Text style={styles.label}>
          Baptism Date:{" "}
          {new Date(baptismDetails.baptismDate).toLocaleDateString() || "N/A"}
        </Text>
        <Text style={styles.label}>
          Status: {baptismDetails.binyagStatus || "Pending"}
        </Text>

        {/* Admin Comment Section */}
        <View style={styles.adminSection}>
          <TextInput
            style={styles.input}
            placeholder="Priest Name"
            value={priest}
            onChangeText={(text) => setPriest(text)}
          />

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              {selectedDate
                ? selectedDate.toLocaleDateString()
                : "Set Scheduled Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <Select
            selectedValue={selectedComment}
            minWidth="200"
            accessibilityLabel="Select a comment"
            placeholder="Select a comment"
            _selectedItem={{
              bg: "cyan.600",
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={(value) => setSelectedComment(value)}
          >
            {predefinedComments.map((comment, index) => (
              <Select.Item label={comment} value={comment} key={index} />
            ))}
          </Select>

          <TextInput
            style={styles.input}
            placeholder="Additional Comment (optional)"
            value={additionalComment}
            onChangeText={(text) => setAdditionalComment(text)}
          />

          <Button
            title="Submit Comment"
            onPress={handleSubmitComment}
            color="#1C5739"
          />
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments:</Text>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <Text style={styles.commentText}>Priest: {comment.priest}</Text>
                <Text style={styles.commentText}>
                  Scheduled Date:{" "}
                  {comment.scheduledDate
                    ? comment.scheduledDate.toLocaleDateString()
                    : "Not set"}
                </Text>
                <Text style={styles.commentText}>
                  Selected Comment: {comment.selectedComment}
                </Text>
                <Text style={styles.commentText}>
                  Additional Comment: {comment.additionalComment}
                </Text>
              </View>
            ))
          ) : (
            <Text>No comments yet.</Text>
          )}
        </View>

        {/* Confirm or Decline Buttons */}
        <View style={styles.buttonContainer}>
          <Button title="Confirm" onPress={handleConfirm} color="#1C5739" />
          <Button title="Decline" onPress={handleDecline} color="#FF6347" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  adminSection: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  dateButton: {
    backgroundColor: "#1C5739",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  dateText: {
    color: "#fff",
    textAlign: "center",
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  commentContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  commentText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
});

export default BaptismDetails;
