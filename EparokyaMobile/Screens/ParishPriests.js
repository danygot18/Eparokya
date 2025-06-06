import React, { useEffect, useState } from "react";
import { ScrollView, ActivityIndicator, Image } from "react-native";
import { YStack, XStack, Text, Card, Avatar } from "tamagui";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";

const StatusChip = ({ label, value }) => (
  <XStack
    alignItems="center"
    borderRadius={12}
    px={8}
    py={4}
    mr={8}
    mb={8}
    backgroundColor={
      value === "Active" || value === "Available" || value === "Not Retired"
        ? "#d1fae5"
        : "#e5e7eb"
    }
  >
    <Text
      color={
        value === "Active" || value === "Available" || value === "Not Retired"
          ? "#065f46"
          : "#374151"
      }
      fontWeight="bold"
      fontSize={12}
    >
      {label}: {value}
    </Text>
  </XStack>
);

const ParishPriest = () => {
  const [priests, setPriests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriests = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/getAllPriest`
        );
        setPriests(response.data);
      } catch (error) {
        console.error("Error fetching priests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPriests();
  }, []);

  if (loading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" bg="#fff">
        <ActivityIndicator size="large" color="#26572E" />
      </YStack>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack space="$4" p="$4">
        <Text fontSize={28} fontWeight="bold" mb="$2">
          Parish Priests
        </Text>
        {priests.length === 0 ? (
          <Card p="$4" alignItems="center">
            <Text fontSize={18}>No priests found</Text>
          </Card>
        ) : (
          priests.map((priest) => (
            <Card
              key={priest._id}
              mb="$4"
              p="$4"
              borderRadius={12}
              backgroundColor="#f7f7f7"
              borderWidth={1}
              borderColor="#e0e0e0"
            >
              <YStack alignItems="center" mb="$3">
                <Avatar circular size="$8" mb="$2">
                  <Avatar.Image
                    source={{
                      uri:
                        priest.image?.url ||
                        "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(priest.fullName),
                    }}
                    style={{ width: 120, height: 120, borderRadius: 60 }}
                  />
                </Avatar>
                <Text fontSize={22} fontWeight="bold" mb="$1">
                  {priest.fullName}
                </Text>
                <Text fontSize={16} color="#666" mb="$1">
                  {priest.title} • {priest.position}
                </Text>
                <Text fontSize={14} color="#888" fontStyle="italic">
                  {priest.parishDurationYear}
                </Text>
              </YStack>

              <XStack space="$4" mb="$2" flexWrap="wrap">
                <YStack flex={1} mb="$2">
                  <Text fontWeight="bold">Nickname:</Text>
                  <Text>{priest.nickName}</Text>
                </YStack>
                <YStack flex={1} mb="$2">
                  <Text fontWeight="bold">Birth Date:</Text>
                  <Text>
                    {priest.birthDate
                      ? new Date(priest.birthDate).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </YStack>
              </XStack>

              <XStack space="$4" mb="$2" flexWrap="wrap">
                <YStack flex={1} mb="$2">
                  <Text fontWeight="bold">Seminary:</Text>
                  <Text>{priest.Seminary}</Text>
                </YStack>
                <YStack flex={1} mb="$2">
                  <Text fontWeight="bold">Ordination Date:</Text>
                  <Text>
                    {priest.ordinationDate
                      ? new Date(priest.ordinationDate).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </YStack>
              </XStack>

              <XStack flexWrap="wrap" mt="$2">
                <StatusChip
                  label="Active"
                  value={priest.isActive ? "Active" : "Inactive"}
                />
                <StatusChip
                  label="Available"
                  value={priest.isAvailable ? "Available" : "Not Available"}
                />
                <StatusChip
                  label="Retired"
                  value={priest.isRetired ? "Retired" : "Not Retired"}
                />
              </XStack>
            </Card>
          ))
        )}
      </YStack>
    </ScrollView>
  );
};

export default ParishPriest;