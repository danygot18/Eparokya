import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Select, CheckIcon } from "native-base";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const WeddingDetails = ({ route, navigation }) => {
  const { weddingId } = route.params;
  const [weddingDetails, setWeddingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priest, setPriest] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const [additionalComment, setAdditionalComment] = useState('');
  const [rescheduledDate, setRescheduledDate] = useState('');
  const [rescheduledReason, setRescheduledReason] = useState('');

  const [comments, setComments] = useState([]);

  const { user, token } = useSelector(state => state.auth);

  const predefinedComments = [
    "Confirmed and on schedule",
    "Rescheduled - awaiting response",
    "Pending final confirmation",
    "Cancelled by user",
  ];

  useEffect(() => {
    const fetchWeddingDetails = async () => {
      
      try {
        const response = await axios.get(`${baseURL}/wedding/${weddingId}`, {
          headers: { Authorization: `${token}` },
        });

        setWeddingDetails(response.data);
        setSelectedDate(new Date(response.data.weddingDate));

        const parsedComments = Array.isArray(response.data.comments)
          ? response.data.comments.map(comment => ({
            ...comment,
            scheduledDate: comment.scheduledDate ? new Date(comment.scheduledDate) : null,
          }))
          : [];

        setComments(parsedComments);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch wedding details');
        Alert.alert("Error", "Could not retrieve wedding details.");
      } finally {
        setLoading(false);
      }
    };
    fetchWeddingDetails();
  }, [weddingId]);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const handleSubmitComment = async () => {
    
    const newComment = {
      priest,
      scheduledDate: selectedDate ? selectedDate.toISOString() : null,
      selectedComment,
      additionalComment,
      adminRescheduled: {
        date: rescheduledDate ? new Date(rescheduledDate).toISOString() : null,
        reason: rescheduledReason,
      },
    };

    try {
      const response = await axios.post(`${baseURL}/wedding/${weddingId}/admin/addComment`, newComment, {
        headers: { Authorization: `${token}` },
      });
      const commentToDisplay = {
        ...response.data,
        scheduledDate: response.data.scheduledDate ? new Date(response.data.scheduledDate) : null,
      };

      setComments([...comments, commentToDisplay]);
      setPriest('');
      setSelectedDate(null);
      setSelectedComment('');
      setAdditionalComment('');
      setRescheduledDate('');
      setRescheduledReason('');
      Alert.alert("Success", "Comment submitted.");
    } catch (error) {
      console.error("Error submitting comment:", error.response ? error.response.data : error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to submit the comment.");
    }
  };



  // const handleSubmitComment = async () => {
  //   const token = await AsyncStorage.getItem("jwt");
  //   const newComment = {
  //     priest,
  //     scheduledDate: selectedDate,
  //     selectedComment,
  //     additionalComment,
  //   };

  //   try {
  //     const response = await axios.post(`${baseURL}/wedding/${weddingId}/admin/addComment`, newComment, {
  //       headers: { Authorization: `${token}` },
  //     });
  //     const commentToDisplay = {
  //       ...response.data,
  //       scheduledDate: response.data.scheduledDate ? new Date(response.data.scheduledDate) : null,
  //     };

  //     setComments([...comments, commentToDisplay]);
  //     setPriest('');
  //     setSelectedDate(null);
  //     setSelectedComment('');
  //     setAdditionalComment('');
  //     Alert.alert("Success", "Comment submitted.");
  //   } catch (error) {
  //     console.error("Error submitting comment:", error.response ? error.response.data : error.message);
  //     Alert.alert("Error", error.response?.data?.message || "Failed to submit the comment.");
  //   }
  // };


  const handleConfirm = async () => {
    // const token = await AsyncStorage.getItem("jwt");
    // if (!token) {
    //   Alert.alert("Error", "User token is missing. Please log in again.");
    //   return;
    // }

    try {
      const response = await axios.post(
        `${baseURL}/wedding/${weddingId}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Confirmation response:", response.data);
      Alert.alert("Success", response.data.message);
    } catch (error) {
      console.error("Error confirming wedding:", error.response || error.message);

      if (error.response) {
        Alert.alert("Error", error.response.data?.message || "Failed to confirm the wedding.");
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };


  const handleDecline = async () => {
    // const token = await AsyncStorage.getItem("jwt");
    try {
      await axios.patch(`${baseURL}/wedding/${weddingId}/decline`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Success", "Wedding declined.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to decline the wedding.");
    }
  };


  if (loading) return <ActivityIndicator size="large" color="#1C5739" />;

  if (error) return <View style={styles.container}><Text style={styles.error}>{error}</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Bride and Groom Information */}
        <Text style={styles.label}>User submitted: {weddingDetails.userId.name || 'N/A'}</Text>
        <Text style={styles.label}>Bride: {weddingDetails.bride || 'N/A'}</Text>
        <Text style={styles.label}>State: {weddingDetails.brideAddress && weddingDetails.brideAddress.state ? weddingDetails.brideAddress.state : 'N/A'}</Text>
        <Text style={styles.label}>Age: {weddingDetails.brideAge || 'N/A'}</Text>
        <Text style={styles.label}>Gender: {weddingDetails.brideGender || 'N/A'}</Text>
        <Text style={styles.label}>Phone Number: {weddingDetails.bridePhone || 'N/A'}</Text>
        

        <Text style={styles.label}>Groom: {weddingDetails.groom || 'N/A'}</Text>
        <Text style={styles.label}>State: {weddingDetails.groomAddress && weddingDetails.groomAddress.state ? weddingDetails.groomAddress.state : 'N/A'}</Text>
        <Text style={styles.label}>Age: {weddingDetails.groomAge || 'N/A'}</Text>
        <Text style={styles.label}>Gender: {weddingDetails.groomGender || 'N/A'}</Text>
        <Text style={styles.label}>Phone Number: {weddingDetails.groomPhone || 'N/A'}</Text>

        {/* Wedding Information */}
        <Text style={styles.label}>Wedding Date: {new Date(weddingDetails.weddingDate).toLocaleDateString() || 'N/A'}</Text>
        <Text style={styles.label}>Status: {weddingDetails.weddingStatus || 'Pending'}</Text>

        {/* Admin Comment Section */}

        <View style={styles.adminSection}>
          <TextInput
            style={styles.input}
            placeholder="Priest Name"
            value={priest}
            onChangeText={(text) => setPriest(text)}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {selectedDate ? selectedDate.toLocaleDateString() : "Set Scheduled Date"}
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
            placeholder="Rescheduled Date (optional)"
            value={rescheduledDate} 
            onChangeText={(text) => setRescheduledDate(text)} 
          />

          <TextInput
            style={styles.input}
            placeholder="Reason for Rescheduling"
            value={rescheduledReason}
            onChangeText={(text) => setRescheduledReason(text)}
          />


          <TextInput
            style={styles.input}
            placeholder="Additional Comment (optional)"
            value={additionalComment}
            onChangeText={(text) => setAdditionalComment(text)}
          />

          <Button title="Submit Comment" onPress={handleSubmitComment} color="#1C5739" />
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments:</Text>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentContainer}>
                <Text style={styles.commentText}>Priest: {comment.priest}</Text>
                <Text style={styles.commentText}>
                  Scheduled Date: {comment.scheduledDate ? comment.scheduledDate.toLocaleDateString() : 'Not set'}
                </Text>
                <Text style={styles.commentText}>Selected Comment: {comment.selectedComment}</Text>
                {comment.adminRescheduled?.date && (
                  <Text style={styles.commentText}>
                    Rescheduled Date: {new Date(comment.adminRescheduled.date).toLocaleDateString()}
                  </Text>
                )}
                {comment.adminRescheduled?.reason && (
                  <Text style={styles.commentText}>Reason: {comment.adminRescheduled.reason}</Text>
                )}

                <Text style={styles.commentText}>Additional Comment: {comment.additionalComment}</Text>
              </View>
            ))
          ) : (
            <Text>No comments yet.</Text>
          )}
        </View>
        <View>
          <Button title="Message" color="#1C5739" onPress={() => navigation.navigate("Chat",{ userId: weddingDetails.userId })} />
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
  adminSection: {
    marginVertical: 20,
  },
  dateButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#1C5739',
    borderRadius: 5,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
  },
  commentsSection: {
    marginVertical: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  commentText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WeddingDetails;
