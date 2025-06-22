import React, { useEffect, useState } from "react";
import { ScrollView, View, TextInput, ActivityIndicator, Image } from "react-native";
import { YStack, XStack, Text, Card, Avatar } from "tamagui";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";

const MemberDirectory = () => {
  const [ministries, setMinistries] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMemberStatuses = async () => {
      try {
        const response = await axios.get(`${baseURL}/getMemberStatuses`);
        if (response.status === 200) {
          const memberStatuses = response.data;
          const grouped = {};
          memberStatuses.forEach((user) => {
            user.ministries.forEach((ministryRole) => {
              const ministryName = ministryRole.ministry || "Unknown Ministry";
              if (!grouped[ministryName]) {
                grouped[ministryName] = [];
              }
              grouped[ministryName].push({
                userId: user.userId,
                name: user.name,
                role: ministryRole.role,
                yearsActive: ministryRole.endYear
                  ? `${ministryRole.startYear} - ${ministryRole.endYear}`
                  : `${ministryRole.startYear} - Ongoing`,
                isActive: user.isActive,
                avatar: user.avatar || "",
                birthDate: user.birthDate || "N/A",
                civilStatus: user.civilStatus || "N/A",
                preference: user.preference || "N/A",
              });
            });
          });
          setMinistries(grouped);
        }
      } catch (error) {
        console.error("Error fetching member statuses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemberStatuses();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const dateObj = new Date(dateString);
    return isNaN(dateObj.getTime())
      ? "Invalid Date"
      : dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  // Filter ministries by search
  const filteredMinistries = {};
  Object.keys(ministries).forEach((ministryName) => {
    filteredMinistries[ministryName] = ministries[ministryName].filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <YStack space="$3" p="$4">
        <Text fontSize={24} fontWeight="bold" mb="$2">
          Parish Members
        </Text>
        <TextInput
          placeholder="Search Member"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
            marginBottom: 16,
          }}
          onChangeText={setSearch}
          value={search}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#26572E" style={{ marginTop: 20 }} />
        ) : (
          Object.keys(filteredMinistries).map((ministryName) => (
            <YStack key={ministryName} mb="$4">
              <Text fontSize={20} fontWeight="600" mb="$2">
                {ministryName}
              </Text>
              {filteredMinistries[ministryName].map((member) => (
                <Card
                  key={member.userId}
                  mb="$2"
                  p="$3"
                  borderRadius={10}
                  backgroundColor="#f7f7f7"
                  borderWidth={1}
                  borderColor="#e0e0e0"
                >
                  <XStack alignItems="center" space="$3">
                    <Avatar circular size="$4">
                      <Avatar.Image
                        source={{
                          uri: member.avatar?.url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name),
                        }}
                        style={{ width: 50, height: 50, borderRadius: 10 }}
                      />
                    </Avatar>
                    <YStack flex={1}>
                      <Text fontWeight="bold">{member.name}</Text>
                      <Text color="#666" fontSize={12}>
                        Birthday: {formatDate(member.birthDate)}
                      </Text>
                      <Text color="#666" fontSize={12}>
                        Civil Status: {member.civilStatus}
                      </Text>
                      <Text color="#666" fontSize={12}>
                        Preference: {member.preference}
                      </Text>
                      <Text color="#666" fontSize={12}>
                        Role: {member.role}
                      </Text>
                      <Text color="#666" fontSize={12}>
                        Years Active: {member.yearsActive}
                      </Text>
                      <Text color={member.isActive ? "green" : "red"} fontWeight="bold">
                        {member.isActive ? "Active" : "Inactive"}
                      </Text>
                    </YStack>
                  </XStack>
                </Card>
              ))}
            </YStack>
          ))
        )}
      </YStack>
    </ScrollView>
  );
};

export default MemberDirectory;