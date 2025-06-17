import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, TextInput } from "react-native";
import { YStack, XStack, Text, Button, Card, Sheet } from "tamagui";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";

const emojiOptions = [
  "😡", "😠", "😞", "😕", "😐", "😊", "😃", "😄", "😍", "👍"
];
const questions = [
  "How was the event's organization?",
  "How did you feel about the speaker(s)?",
  "Was the event engaging?",
  "Would you recommend this event to others?",
  "How likely are you to attend a similar event?",
];

const EventSentiment = ({ navigation }) => {
  const [adminSelection, setAdminSelection] = useState(null);
  const [responses, setResponses] = useState(Array(5).fill(null));
  const [comment, setComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const config = useMemo(() => ({ withCredentials: true }), []);

  useEffect(() => {
    axios
      .get(`${baseURL}/admin-selections/active`, config)
      .then((res) => setAdminSelection(res.data))
      .catch((err) => console.error("Error fetching admin selection:", err));
  }, [config]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/profile`,
          config
        );
        setUserId(response.data.user._id);
      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, [config]);

  const handleSelectEmoji = (index, emoji) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = emoji;
    setResponses(updatedResponses);
  };

  const handleSubmit = async () => {
    if (!adminSelection?.typeId?._id) {
      alert("Event Type ID is missing. Please try again.");
      return;
    }
    if (responses.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    if (!userId) {
      alert("User not found. Please log in again.");
      return;
    }
    const requestData = {
      userId,
      eventTypeId: adminSelection.typeId._id,
      responses: responses.map((emoji, index) => ({
        question: questions[index],
        emoji,
      })),
      comment,
    };
    try {
      await axios.post(
        `${baseURL}/analyzeEventSentiment`,
        requestData,
        config
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Error submitting sentiment:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to submit feedback.");
    }
  };

  const handleCloseModal = () => {
    setResponses(Array(5).fill(null));
    setComment("");
    setModalOpen(false);
    if (navigation && navigation.navigate) {
      navigation.navigate("Home");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack space="$3" p="$4">
        <Text fontSize={24} fontWeight="bold" mb="$2">
          Event Sentiment Feedback
        </Text>
        {adminSelection ? (
          <Card p="$3" mb="$3" backgroundColor="#f7f7f7">
            <Text fontWeight="bold">
              Form Status:{" "}
              <Text color={adminSelection.isActive ? "green" : "red"}>
                {adminSelection.isActive ? "Active" : "Inactive"}
              </Text>
            </Text>
            <Text>
              Date: {adminSelection.date} | Time: {adminSelection.time}
            </Text>
            <Text fontWeight="bold" mt="$2">
              Event Type: {adminSelection.typeId?.name || "N/A"}
            </Text>
          </Card>
        ) : (
          <Text color="red" mb="$2">
            No active event found.
          </Text>
        )}

        <Text fontSize={14} color="#888" mb="$2">
          Ang pagbibigay pahayag po ay para makatulong sa improvement ng ating parokya, anumang suggestion/komento at review ang inyong maibibigay ay lubos naming ipinagpapasalamat.
        </Text>

        {questions.map((q, index) => (
          <YStack key={index} mb="$3">
            <Text fontWeight="bold" mb="$1">{q}</Text>
            <XStack flexWrap="wrap" space="$2">
              {emojiOptions.map((emoji) => (
                <Button
                  key={emoji}
                  size="$3"
                  backgroundColor={responses[index] === emoji ? "#26572E" : "#e0e0e0"}
                  color={responses[index] === emoji ? "#fff" : "#333"}
                  onPress={() => handleSelectEmoji(index, emoji)}
                  mr="$1"
                  mb="$1"
                >
                  {emoji}
                </Button>
              ))}
            </XStack>
          </YStack>
        ))}

        <TextInput
          placeholder="Other Comments/Suggestions"
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={3}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
            minHeight: 60,
            textAlignVertical: "top",
          }}
        />

        <Button
          size="$4"
          backgroundColor="#26572E"
          color="#fff"
          onPress={handleSubmit}
        >
          Submit Feedback
        </Button>
      </YStack>

      {/* Modal for Thank You */}
      <Sheet
        open={modalOpen}
        onOpenChange={setModalOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        zIndex={100}
      >
        <YStack p="$4" alignItems="center" justifyContent="center">
          <Text fontSize={40} mb="$2">😊</Text>
          <Text fontSize={20} fontWeight="bold" mb="$2">
            Thank you for your feedback!
          </Text>
          <Text mb="$2" textAlign="center">
            This will be a great help for the Parish to improve.
          </Text>
          <Button
            backgroundColor="#26572E"
            color="#fff"
            onPress={handleCloseModal}
          >
            Close
          </Button>
        </YStack>
      </Sheet>
    </ScrollView>
  );
};

export default EventSentiment;