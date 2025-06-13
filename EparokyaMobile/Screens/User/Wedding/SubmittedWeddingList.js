import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { YStack, XStack, Text, Input, Card, Button, Spinner } from "tamagui";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";

const statusColors = {
  Confirmed: "#4caf50",
  Declined: "#ff5722",
  Pending: "#ffd700",
  All: "#e0e0e0",
};

const SubmittedWeddingList = () => {
  const [weddingForms, setWeddingForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchMySubmittedForms();
  }, []);

  const fetchMySubmittedForms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/getAllUserSubmittedWedding`,
        { withCredentials: true }
      );
      if (response.data && Array.isArray(response.data.forms)) {
        const sortedForms = response.data.forms.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setWeddingForms(sortedForms);
        setFilteredForms(sortedForms);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch wedding forms.");
    } finally {
      setLoading(false);
    }
  };

  const filterForms = (status) => {
    setActiveFilter(status);
    let filtered = weddingForms;

    if (status !== "All") {
      filtered = filtered.filter((form) => form.weddingStatus === status);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (form) =>
          form.brideName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.groomName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredForms(filtered);
  };

  useEffect(() => {
    filterForms(activeFilter);
    // eslint-disable-next-line
  }, [activeFilter, searchTerm, weddingForms]);

  const handleCardClick = (weddingId) => {
    navigation.navigate("SubmittedWeddingDetails", { weddingId });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="#fff">
        <Spinner size="large" color="#154314" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="#fff">
        <Text color="#d32f2f" fontSize={16}>
          {error}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} bg="#f4f4f4" p="$4" space="$3">
      <Text fontSize={24} fontWeight="bold" textAlign="center" mb="$2">
        My Submitted Wedding Forms
      </Text>

      {/* Filter Buttons */}
      <XStack space="$2" justifyContent="center" mb="$2">
        {["All", "Pending", "Confirmed", "Declined"].map((status) => (
          <Button
            key={status}
            size="$3"
            backgroundColor={
              activeFilter === status ? statusColors[status] : "#e0e0e0"
            }
            color={activeFilter === status ? "#fff" : "#333"}
            fontWeight="bold"
            onPress={() => filterForms(status)}
            borderRadius={8}
          >
            {status}
          </Button>
        ))}
      </XStack>

      {/* Search Input */}
      <Input
        placeholder="Search by Bride or Groom Name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        backgroundColor="#fff"
        borderRadius={8}
        mb="$2"
      />

      {filteredForms.length === 0 ? (
        <Text textAlign="center" color="#888" mt="$4">
          No submitted wedding forms found.
        </Text>
      ) : (
        <FlatList
          data={filteredForms}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const statusColor =
              item.weddingStatus === "Confirmed"
                ? "#4caf50"
                : item.weddingStatus === "Declined"
                ? "#ff5722"
                : "#ffd700";
            return (
              <Card
                key={item._id}
                p="$3"
                mb="$3"
                borderRadius={12}
                backgroundColor="#fff"
                borderWidth={2}
                borderColor={statusColor}
                onPress={() => handleCardClick(item._id)} // <-- updated navigation
                pressStyle={{ opacity: 0.9 }}
              >
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  mb="$2"
                >
                  <Text
                    backgroundColor={statusColor}
                    color="#fff"
                    px="$2"
                    py={4}
                    borderRadius={6}
                    fontWeight="bold"
                    fontSize={13}
                  >
                    {item.weddingStatus ?? "Unknown"}
                  </Text>
                  <Text fontSize={18} fontWeight="bold" ml="$2" flex={1}>
                    Record #{index + 1}: {item.brideName ?? "Unknown Bride"} &{" "}
                    {item.groomName ?? "Unknown Groom"}
                  </Text>
                </XStack>
                <YStack space="$1" ml="$2">
                  <Text>
                    <Text fontWeight="bold">Wedding Date:</Text>{" "}
                    {formatDate(item.weddingDate)}
                  </Text>
                  <Text>
                    <Text fontWeight="bold">Wedding Time:</Text>{" "}
                    {formatTime(item.weddingTime)}
                  </Text>
                  <Text>
                    <Text fontWeight="bold">Bride Contact:</Text>{" "}
                    {item.bridePhone ?? "N/A"} |{" "}
                    <Text fontWeight="bold">Groom Contact:</Text>{" "}
                    {item.groomPhone ?? "N/A"}
                  </Text>
                </YStack>
              </Card>
            );
          }}
        />
      )}
    </YStack>
  );
};

export default SubmittedWeddingList;
